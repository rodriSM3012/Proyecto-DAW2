import { Router } from "express";
import { authenticateToken, requireRoles } from "../middleware/decorators.js";
import {
  listUsers,
  updateUser,
  deleteUser,
  changePassword,
} from "../controllers/usersController.js";

const router = Router();

router.get("/", authenticateToken, requireRoles("admin"), listUsers);
router.put("/:id", authenticateToken, requireRoles("admin"), updateUser);
router.delete("/:id", authenticateToken, requireRoles("admin"), deleteUser);
router.post("/change-password", authenticateToken, changePassword);

export default router;
