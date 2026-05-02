import { pool } from "../database/db.js";

function getAbcByRank(index, totalProducts) {
  if (totalProducts === 0) return "C";

  const position = index + 1;
  const aLimit = Math.ceil(totalProducts * 0.2);
  const bLimit = aLimit + Math.ceil(totalProducts * 0.3);

  if (position <= aLimit) return "A";
  if (position <= bLimit) return "B";
  return "C";
}

let abcUpdateTimer = null;
let lastForcedAbcTime = Date.now();

export function scheduleAbcRecalculation() {
  const now = Date.now();
  const timeSinceForced = now - lastForcedAbcTime;
  const MAX_DELAY = 24 * 60 * 60 * 1000; // 24 horas

  if (abcUpdateTimer) {
    clearTimeout(abcUpdateTimer);
  }

  // Si ha pasado más del tiempo máximo, ejecuta inmediatamente (delay 0), sino resetea el timer de 1 hora o lo que falte
  const delay = Math.max(0, Math.min(60 * 60 * 1000, MAX_DELAY - timeSinceForced));

  abcUpdateTimer = setTimeout(async () => {
    try {
      console.log("Running scheduled ABC reclassification...");
      await recalculateAbcCategories();
      lastForcedAbcTime = Date.now();
    } catch (err) {
      console.error("Scheduled ABC reclassification failed:", err);
    } finally {
      abcUpdateTimer = null;
    }
  }, delay);
}

export async function recalculateAbcCategories(externalConnection = null) {
  const executor = externalConnection || pool;

  // 1. Comprobar datos insuficientes
  const [anyMovRows] = await executor.query(
    "SELECT COUNT(*) AS cnt FROM movimiento WHERE fecha >= DATE_SUB(NOW(), INTERVAL 30 DAY)"
  );

  if (anyMovRows[0].cnt === 0) {
    return {
      message: "No movements in the last 30 days. Classification unchanged.",
      total: 0,
      updated: 0,
    };
  }

  // 2. Calcular impacto solo con 'salida'
  const [rows] = await executor.query(
    `SELECT p.id,
            COALESCE(SUM(ABS(m.cantidad) * p.precio_unitario), 0) AS impacto_30_dias
     FROM producto p
     LEFT JOIN movimiento m
       ON m.producto_id = p.id
      AND m.fecha >= DATE_SUB(NOW(), INTERVAL 30 DAY)
      AND m.tipo = 'salida'
     WHERE p.activo = 1
     GROUP BY p.id
     ORDER BY impacto_30_dias DESC, p.id ASC`
  );

  if (rows.length === 0) {
    return { total: 0, updated: 0, message: "No active products." };
  }

  const total = rows.length;
  const ids = [];
  const whenClauses = [];
  const params = [];

  for (let index = 0; index < rows.length; index += 1) {
    const productId = rows[index].id;
    const categoriaAbc = getAbcByRank(index, total);
    
    ids.push(productId);
    whenClauses.push("WHEN ? THEN ?");
    params.push(productId, categoriaAbc);
  }

  params.push(...ids);
  const inPlaceholders = ids.map(() => "?").join(",");

  // 3. Sentencia CASE para optimizar rendimiento
  const query = `
    UPDATE producto 
    SET categoria_abc = CASE id 
      ${whenClauses.join(" ")} 
      ELSE categoria_abc 
    END, 
    actualizado_en = NOW() 
    WHERE id IN (${inPlaceholders}) AND activo = 1
  `;

  const [result] = await executor.query(query, params);

  return { total, updated: result.affectedRows, message: "ABC classification recalculated successfully." };
}
