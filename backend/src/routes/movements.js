import { Router } from "express";
import { authenticateToken, requireRoles } from "../middleware/decorators.js";
import {
  createMovement,
  listMovements,
} from "../controllers/movementsController.js";

const router = Router();

router.get("/", authenticateToken, listMovements);
router.post(
  "/",
  authenticateToken,
  requireRoles("admin", "operador"),
  createMovement,
);

export default router;
