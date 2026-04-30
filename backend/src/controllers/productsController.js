import { randomUUID } from "crypto";
import { pool } from "../database/db.js";
import {
  validateCreateProductPayload,
  validateUpdateProductPayload,
} from "../utils/validators.js";

export async function listProducts(req, res) {
  try {
    const [rows] = await pool.query(
      `SELECT id, nombre, descripcion, precio_unitario, stock_actual, stock_minimo, categoria_abc, codigo_qr, activo, creado_en, actualizado_en
       FROM producto
       WHERE activo = 1
       ORDER BY id DESC`,
    );
    return res.status(200).json({ products: rows });
  } catch (error) {
    console.error("Error in listProducts:", error);
    return res.status(500).json({ error: "Failed to retrieve products from the database." });
  }
}

export async function getProductById(req, res) {
  try {
    const id = Number(req.params.id);
    if (!Number.isInteger(id) || id <= 0) {
      return res.status(400).json({ error: "Invalid product id." });
    }

    const [rows] = await pool.query(
      `SELECT id, nombre, descripcion, precio_unitario, stock_actual, stock_minimo, categoria_abc, codigo_qr, activo, creado_en, actualizado_en
       FROM producto
       WHERE id = ? AND activo = 1
       LIMIT 1`,
      [id],
    );

    if (rows.length === 0) {
      return res.status(404).json({ error: "Product not found." });
    }

    return res.status(200).json({ product: rows[0] });
  } catch (error) {
    console.error("Error in getProductById:", error);
    return res.status(500).json({ error: "Failed to retrieve the product." });
  }
}

export async function createProduct(req, res) {
  try {
    const validation = validateCreateProductPayload(req.body);
    if (!validation.ok) {
      return res.status(400).json({ error: validation.message });
    }

    const data = validation.data;
    const codigoQr = randomUUID();

    const [result] = await pool.query(
      `INSERT INTO producto
        (nombre, descripcion, precio_unitario, stock_actual, stock_minimo, categoria_abc, codigo_qr, creado_en, actualizado_en, activo)
       VALUES (?, ?, ?, ?, ?, ?, ?, NOW(), NOW(), 1)`,
      [
        data.nombre,
        data.descripcion,
        data.precio_unitario,
        data.stock_actual,
        data.stock_minimo,
        data.categoria_abc,
        codigoQr,
      ],
    );

    return res.status(201).json({
      message: "Product created successfully.",
      product: {
        id: result.insertId,
        ...data,
        codigo_qr: codigoQr,
        activo: 1,
      },
    });
  } catch (error) {
    console.error("Error in createProduct:", error);
    return res.status(500).json({ error: "Failed to create the product." });
  }
}

export async function updateProduct(req, res) {
  try {
    const id = Number(req.params.id);
    if (!Number.isInteger(id) || id <= 0) {
      return res.status(400).json({ error: "Invalid product id." });
    }

    const validation = validateUpdateProductPayload(req.body);
    if (!validation.ok) {
      return res.status(400).json({ error: validation.message });
    }

    const data = validation.data;
    const [result] = await pool.query(
      `UPDATE producto
       SET nombre = ?, descripcion = ?, precio_unitario = ?, stock_actual = ?, stock_minimo = ?, categoria_abc = ?, actualizado_en = NOW()
       WHERE id = ? AND activo = 1`,
      [
        data.nombre,
        data.descripcion,
        data.precio_unitario,
        data.stock_actual,
        data.stock_minimo,
        data.categoria_abc,
        id,
      ],
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Product not found." });
    }

    return res.status(200).json({ message: "Product updated successfully." });
  } catch (error) {
    console.error("Error in updateProduct:", error);
    return res.status(500).json({ error: "Failed to update the product." });
  }
}

export async function deleteProduct(req, res) {
  try {
    const id = Number(req.params.id);
    if (!Number.isInteger(id) || id <= 0) {
      return res.status(400).json({ error: "Invalid product id." });
    }

    const [movementRows] = await pool.query(
      "SELECT id FROM movimiento WHERE producto_id = ? LIMIT 1",
      [id],
    );

    if (movementRows.length > 0) {
      await pool.query(
        "UPDATE producto SET activo = 0, actualizado_en = NOW() WHERE id = ? AND activo = 1",
        [id],
      );
      return res.status(200).json({
        message: "Product has movements. Logical delete applied (activo = 0).",
      });
    }

    const [result] = await pool.query("DELETE FROM producto WHERE id = ?", [id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Product not found." });
    }

    return res.status(200).json({ message: "Product deleted successfully." });
  } catch (error) {
    console.error("Error in deleteProduct:", error);
    return res.status(500).json({ error: "Failed to delete the product." });
  }
}
