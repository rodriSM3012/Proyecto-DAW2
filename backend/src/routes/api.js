const express = require("express");
const { authenticateToken, requireRoles } = require("../middleware/decorators");

const router = express.Router();

router.get("/me", authenticateToken, (req, res) => {
  res.json({ user: req.user });
});

router.get("/admin-only", authenticateToken, requireRoles("admin"), (req, res) => {
  res.json({ message: "Admin access granted." });
});

module.exports = router;
