import { Router } from "express";
import { getAdminDashboardHandler } from "../../controllers/admin/admin.dashboard.controller";

const router = Router();

/**
 * GET /api/admin/dashboard
 * Admin dashboard aggregated stats
 */
router.get("/", getAdminDashboardHandler);

export default router;
