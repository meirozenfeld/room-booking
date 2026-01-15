import { Router } from "express";
import {
    blockRoomHandler,
    unblockRoomHandler,
    listRoomBlocksHandler,
} from "../../controllers/admin/admin.availability.controller";

const router = Router();

/**
 * GET /api/admin/rooms/:id/availability
 * List blocked dates for a room
 */
router.get("/:id/availability", listRoomBlocksHandler);

/**
 * POST /api/admin/rooms/:id/block
 * Block room for date range
 */
router.post("/:id/block", blockRoomHandler);

/**
 * DELETE /api/admin/rooms/:id/block
 * Unblock room for date range
 */
router.delete("/:id/block", unblockRoomHandler);

export default router;
