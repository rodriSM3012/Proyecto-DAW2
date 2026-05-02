import { Router } from "express";
import { authenticateToken, requireRoles } from "../middleware/decorators.js";
import productsRoutes from "./products.js";
import movementsRoutes from "./movements.js";
import alertsRoutes from "./alerts.js";
import usersRoutes from "./users.js";

const router = Router();

router.get("/me", authenticateToken, (req, res) => {
  res.json({ user: req.user });
});

router.get(
  "/admin-only",
  authenticateToken,
  requireRoles("admin"),
  (req, res) => {
    res.json({ message: "Admin access granted." });
  },
);

router.use("/products", productsRoutes);
router.use("/movimientos", movementsRoutes);
router.use("/alertas", alertsRoutes);
router.use("/users", usersRoutes);

export default router;
