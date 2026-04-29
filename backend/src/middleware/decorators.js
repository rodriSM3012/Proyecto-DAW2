import pkg from "jsonwebtoken";
const { verify } = pkg;
import env from "../config/env.js";

export function authenticateToken(req, res, next) {
  const authHeader = req.headers.authorization;
  const bearerToken =
    authHeader && authHeader.startsWith("Bearer ")
      ? authHeader.split(" ")[1]
      : null;
  const token = req.cookies?.access_token || bearerToken;

  if (!token) {
    return res.status(401).json({ error: "Authentication required." });
  }

  try {
    const payload = verify(token, env.jwtSecret);
    req.user = payload;
    return next();
  } catch (error) {
    return res.status(401).json({ error: "Invalid or expired token." });
  }
}

export function requireRoles(...allowedRoles) {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ error: "Authentication required." });
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res
        .status(403)
        .json({ error: "Forbidden: insufficient permissions." });
    }

    return next();
  };
}
