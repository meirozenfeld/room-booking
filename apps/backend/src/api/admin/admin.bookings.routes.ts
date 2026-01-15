import { Router } from "express";
import { listAllBookingsHandler } from "../../controllers/admin/admin.bookings.controller";

const router = Router();

/**
 * GET /api/admin/bookings
 * List all bookings with filters and pagination (admin only)
 */
router.get("/", listAllBookingsHandler);

export default router;
