import { Router } from "express";
import rateLimit from "express-rate-limit";
import { register, login, logout } from "../controllers/authController.js";
import { authenticateToken, requireRoles } from "../middleware/decorators.js";

const router = Router();

const loginRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: "Too many login attempts. Please try again later." },
});

router.post("/register", authenticateToken, requireRoles("admin"), register);
router.post("/login", loginRateLimiter, login);
router.post("/logout", authenticateToken, logout);

export default router;
