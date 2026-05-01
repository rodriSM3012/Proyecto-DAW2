import { Router } from "express";
import { authenticateToken, requireRoles } from "../middleware/decorators.js";
import { listAlerts, markAlertAsRead } from "../controllers/alertsController.js";

const router = Router();

router.get("/", authenticateToken, requireRoles("auditor"), listAlerts);
router.patch("/:id/read", authenticateToken, requireRoles("admin"), markAlertAsRead);

export default router;
