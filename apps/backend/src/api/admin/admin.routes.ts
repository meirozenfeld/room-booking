import { Router } from "express";
import { authMiddleware } from "../../infra/auth-middleware";
import { requireRole } from "../../infra/role-guard";

import adminDashboardRoutes from "./admin.dashboard.routes";
import adminBookingsRoutes from "./admin.bookings.routes";
import adminRoomsRoutes from "./admin.rooms.routes";

const router = Router();

router.use(authMiddleware);
router.use(requireRole("ADMIN"));

router.use("/dashboard", adminDashboardRoutes);
router.use("/bookings", adminBookingsRoutes);
router.use("/rooms", adminRoomsRoutes);

export default router;
