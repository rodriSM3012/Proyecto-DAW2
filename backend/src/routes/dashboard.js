import { Router } from "express";
import { authenticateToken } from "../middleware/decorators.js";
import { getDashboardData } from "../controllers/dashboardController.js";

const router = Router();

router.get("/", authenticateToken, getDashboardData);

export default router;
