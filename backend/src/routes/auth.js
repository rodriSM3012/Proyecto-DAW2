const express = require("express");
const rateLimit = require("express-rate-limit");
const { register, login, logout } = require("../controllers/authController");
const { authenticateToken } = require("../middleware/decorators");

const router = express.Router();

const loginRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: "Too many login attempts. Please try again later." }
});

router.post("/register", register);
router.post("/login", loginRateLimiter, login);
router.post("/logout", authenticateToken, logout);

module.exports = router;
