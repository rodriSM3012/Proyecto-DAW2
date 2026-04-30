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

const roleHierarchy = {
  admin: 3,
  operador: 2,
  auditor: 1
};

export function requireRoles(...allowedRoles) {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ error: "Authentication required." });
    }

    const userRoleLevel = roleHierarchy[req.user.role] || 0;
    
    const hasPermission = allowedRoles.some(role => {
      const requiredLevel = roleHierarchy[role] || 0;
      return userRoleLevel >= requiredLevel;
    });

    if (!hasPermission) {
      return res
        .status(403)
        .json({ error: "Forbidden: insufficient permissions." });
    }

    return next();
  };
}
