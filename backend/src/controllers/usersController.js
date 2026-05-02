import bcrypt from "bcrypt";
import { pool } from "../database/db.js";

export async function listUsers(req, res) {
  try {
    const [rows] = await pool.query(
      `SELECT id, nombre AS name, email, rol AS role, activo, creado_en FROM usuario ORDER BY id DESC`
    );
    return res.status(200).json({ users: rows });
  } catch (error) {
    console.error("Error in listUsers:", error);
    return res.status(500).json({ error: "Failed to retrieve users." });
  }
}

export async function updateUser(req, res) {
  try {
    const id = Number(req.params.id);
    const { name, role, activo } = req.body;
    
    const [result] = await pool.query(
      "UPDATE usuario SET nombre = ?, rol = ?, activo = ? WHERE id = ?",
      [name, role, activo ? 1 : 0, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "User not found." });
    }
    return res.status(200).json({ message: "User updated successfully." });
  } catch (error) {
    console.error("Error in updateUser:", error);
    return res.status(500).json({ error: "Failed to update user." });
  }
}

export async function deleteUser(req, res) {
  try {
    const id = Number(req.params.id);
    const [result] = await pool.query("UPDATE usuario SET activo = 0 WHERE id = ?", [id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "User not found." });
    }
    return res.status(200).json({ message: "User deactivated successfully." });
  } catch (error) {
    console.error("Error in deleteUser:", error);
    return res.status(500).json({ error: "Failed to delete user." });
  }
}

export async function changePassword(req, res) {
  try {
    const { currentPassword, newPassword } = req.body;
    const userId = req.user.sub;

    const [rows] = await pool.query("SELECT hash_password FROM usuario WHERE id = ?", [userId]);
    if (rows.length === 0) return res.status(404).json({ error: "User not found." });

    const valid = await bcrypt.compare(currentPassword, rows[0].hash_password);
    if (!valid) return res.status(400).json({ error: "Invalid current password." });

    if (newPassword.length < 8) return res.status(400).json({ error: "Password must be at least 8 characters long." });

    const newHash = await bcrypt.hash(newPassword, 10);
    await pool.query("UPDATE usuario SET hash_password = ? WHERE id = ?", [newHash, userId]);

    return res.status(200).json({ message: "Password updated successfully." });
  } catch (error) {
    console.error("Error in changePassword:", error);
    return res.status(500).json({ error: "Failed to change password." });
  }
}
