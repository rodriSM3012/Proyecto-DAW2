import { pool } from "../database/db.js";
import { validateCreateMovementPayload } from "../utils/validators.js";

function calculateStockChange(tipo, cantidad) {
  if (tipo === "entrada") return cantidad;
  if (tipo === "salida") return -cantidad;
  return cantidad;
}

export async function createMovement(req, res) {
  const validation = validateCreateMovementPayload(req.body);
  if (!validation.ok) {
    return res.status(400).json({ error: validation.message });
  }

  const { producto_id, tipo, cantidad, detalle } = validation.data;
  const usuario_id = Number(req.user?.sub);
  if (!Number.isInteger(usuario_id) || usuario_id <= 0) {
    return res.status(401).json({ error: "Invalid authenticated user." });
  }

  const stockChange = calculateStockChange(tipo, cantidad);
  const signedCantidad = tipo === "salida" ? -Math.abs(cantidad) : cantidad;

  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();

    const [productRows] = await connection.query(
      "SELECT id, stock_actual, stock_minimo FROM producto WHERE id = ? AND activo = 1 LIMIT 1",
      [producto_id],
    );

    if (productRows.length === 0) {
      await connection.rollback();
      return res.status(404).json({ error: "Product not found." });
    }

    const currentStock = Number(productRows[0].stock_actual);
    const newStock = currentStock + stockChange;

    if (newStock < 0) {
      await connection.rollback();
      return res.status(400).json({
        error: "Operation not allowed: stock cannot be negative.",
      });
    }

    await connection.query(
      "UPDATE producto SET stock_actual = ?, actualizado_en = NOW() WHERE id = ?",
      [newStock, producto_id],
    );

    const stockMinimo = Number(productRows[0].stock_minimo);
    if (newStock < stockMinimo) {
      const [existingAlertRows] = await connection.query(
        "SELECT id FROM alerta WHERE producto_id = ? AND leida = FALSE LIMIT 1",
        [producto_id],
      );

      if (existingAlertRows.length === 0) {
        await connection.query(
          "INSERT INTO alerta (producto_id, fecha, leida, email_enviado) VALUES (?, NOW(), FALSE, FALSE)",
          [producto_id],
        );
      }
    }

    const [movementResult] = await connection.query(
      `INSERT INTO movimiento (producto_id, tipo, cantidad, fecha, usuario_id, detalle)
       VALUES (?, ?, ?, NOW(), ?, ?)`,
      [producto_id, tipo, signedCantidad, usuario_id, detalle || null],
    );

    await connection.commit();

    return res.status(201).json({
      message: "Movement created successfully.",
      movement: {
        id: movementResult.insertId,
        producto_id,
        tipo,
        cantidad: signedCantidad,
        usuario_id,
      },
      stock_actual: newStock,
    });
  } catch (error) {
    await connection.rollback();
    console.error("Error in createMovement:", error);
    return res.status(500).json({ error: "Failed to create movement." });
  } finally {
    connection.release();
  }
}

export async function listMovements(req, res) {
  try {
    const [rows] = await pool.query(
      `SELECT id, producto_id, tipo, cantidad, fecha, usuario_id, detalle
       FROM movimiento
       ORDER BY fecha DESC, id DESC`,
    );
    return res.status(200).json({ movements: rows });
  } catch (error) {
    console.error("Error in listMovements:", error);
    return res.status(500).json({ error: "Failed to retrieve movements." });
  }
}
