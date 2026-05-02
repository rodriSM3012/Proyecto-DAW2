import { pool } from "../database/db.js";

export async function getDashboardData(req, res) {
  try {
    const [productsRows] = await pool.query(
      `SELECT id, stock_actual, stock_minimo, categoria_abc, precio_unitario, nombre 
       FROM producto WHERE activo = 1`
    );
    
    const [alertsRows] = await pool.query(
      `SELECT a.id, a.producto_id, p.nombre AS producto_nombre, a.fecha, a.leida 
       FROM alerta a 
       INNER JOIN producto p ON p.id = a.producto_id 
       ORDER BY a.leida ASC, a.fecha DESC LIMIT 10`
    );
    
    const [movementsRows] = await pool.query(
      `SELECT m.id, m.producto_id, p.nombre AS producto_nombre, m.tipo, m.cantidad, m.fecha, m.usuario_id 
       FROM movimiento m 
       LEFT JOIN producto p ON p.id = m.producto_id 
       ORDER BY m.fecha DESC LIMIT 10`
    );

    return res.status(200).json({
      products: productsRows,
      alerts: alertsRows,
      movements: movementsRows
    });
  } catch (error) {
    console.error("Error in getDashboardData:", error);
    return res.status(500).json({ error: "Failed to retrieve dashboard data." });
  }
}
