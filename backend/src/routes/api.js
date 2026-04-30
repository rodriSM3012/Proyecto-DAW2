import { Router } from "express";
import { authenticateToken, requireRoles } from "../middleware/decorators.js";
import productsRoutes from "./products.js";

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

export default router;
