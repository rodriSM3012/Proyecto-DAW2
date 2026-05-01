import { pool } from "../database/db.js";

export async function listAlerts(req, res) {
  try {
    const [rows] = await pool.query(
      `SELECT a.id, a.producto_id, p.nombre AS producto_nombre, a.fecha, a.leida, a.email_enviado
       FROM alerta a
       INNER JOIN producto p ON p.id = a.producto_id
       ORDER BY a.leida ASC, a.fecha DESC, a.id DESC`,
    );

    return res.status(200).json({ alerts: rows });
  } catch (error) {
    console.error("Error in listAlerts:", error);
    return res.status(500).json({ error: "Failed to retrieve alerts." });
  }
}

export async function markAlertAsRead(req, res) {
  try {
    const id = Number(req.params.id);
    if (!Number.isInteger(id) || id <= 0) {
      return res.status(400).json({ error: "Invalid alert id." });
    }

    const [result] = await pool.query(
      "UPDATE alerta SET leida = TRUE WHERE id = ?",
      [id],
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Alert not found." });
    }

    return res.status(200).json({ message: "Alert marked as read." });
  } catch (error) {
    console.error("Error in markAlertAsRead:", error);
    return res.status(500).json({ error: "Failed to update alert." });
  }
}
