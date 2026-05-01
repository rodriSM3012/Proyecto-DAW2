import { Router } from "express";
import { authenticateToken, requireRoles } from "../middleware/decorators.js";
import {
  listProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  reclassifyProductsAbc,
} from "../controllers/productsController.js";

const router = Router();

router.get("/", authenticateToken, listProducts);
router.get("/:id", authenticateToken, getProductById);

router.post("/", authenticateToken, requireRoles("admin"), createProduct);
router.post(
  "/reclassify-abc",
  authenticateToken,
  requireRoles("admin"),
  reclassifyProductsAbc,
);
router.put("/:id", authenticateToken, requireRoles("admin"), updateProduct);
router.delete("/:id", authenticateToken, requireRoles("admin"), deleteProduct);

export default router;
