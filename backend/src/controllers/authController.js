import { hash, compare } from "bcrypt";
import pkg from "jsonwebtoken";
const { sign } = pkg;
import { pool } from "../database/db.js";
import env from "../config/env.js";
import {
  validateRegisterPayload,
  validateLoginPayload,
} from "../utils/validators.js";

const SALT_ROUNDS = 12;

function buildToken(user) {
  return sign(
    {
      sub: user.id,
      email: user.email,
      role: user.role,
    },
    env.jwtSecret,
    { expiresIn: env.jwtExpiresIn },
  );
}

function setAuthCookie(res, token) {
  res.cookie("access_token", token, {
    httpOnly: true,
    secure: env.cookieSecure,
    sameSite: "lax",
    maxAge: 1000 * 60 * 60 * 8,
  });
}

export async function register(req, res) {
  try {
    const validation = validateRegisterPayload(req.body);
    if (!validation.ok) {
      return res.status(400).json({ error: validation.message });
    }

    const { name, email, password, role } = validation.data;

    const [existing] = await pool.query(
      "SELECT id FROM usuario WHERE email = ?",
      [email],
    );
    if (existing.length > 0) {
      return res.status(409).json({ error: "Email already registered." });
    }

    const passwordHash = await hash(password, SALT_ROUNDS);

    const [result] = await pool.query(
      "INSERT INTO usuario (nombre, email, password_hash, rol, created_at) VALUES (?, ?, ?, ?, NOW())",
      [name, email, passwordHash, role],
    );

    const token = buildToken({ id: result.insertId, email, role });
    setAuthCookie(res, token);

    return res.status(201).json({
      message: "User registered successfully.",
      user: {
        id: result.insertId,
        name,
        email,
        role,
      },
      token,
    });
  } catch (error) {
    console.error("Error in register:", error);
    return res.status(500).json({ error: "Failed to register user." });
  }
}

export async function login(req, res) {
  try {
    const validation = validateLoginPayload(req.body);
    if (!validation.ok) {
      return res.status(400).json({ error: validation.message });
    }

    const { email, password } = validation.data;
    const [rows] = await pool.query(
      "SELECT id, nombre, email, password_hash, rol FROM usuario WHERE email = ? LIMIT 1",
      [email],
    );

    if (rows.length === 0) {
      return res.status(401).json({ error: "Invalid credentials." });
    }

    const user = rows[0];
    const passwordOk = await compare(password, user.password_hash);
    if (!passwordOk) {
      return res.status(401).json({ error: "Invalid credentials." });
    }

    const token = buildToken({ id: user.id, email: user.email, role: user.rol });
    setAuthCookie(res, token);

    return res.status(200).json({
      message: "Login successful.",
      user: {
        id: user.id,
        name: user.nombre,
        email: user.email,
        role: user.rol,
      },
      token,
    });
  } catch (error) {
    console.error("Error in login:", error);
    return res.status(500).json({ error: "Failed to login." });
  }
}

export function logout(req, res) {
  res.clearCookie("access_token");
  return res.status(200).json({ message: "Logout successful." });
}
