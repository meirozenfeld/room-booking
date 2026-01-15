import { Router } from "express";
import {
    listRoomsHandler,
    createRoomHandler,
    updateRoomHandler,
    toggleRoomActiveHandler,
} from "../../controllers/admin/admin.rooms.controller";
import availabilityRoutes from "./admin.availability.routes";

const router = Router();

/**
 * GET /api/admin/rooms
 * List all rooms (including inactive)
 */
router.get("/", listRoomsHandler);

/**
 * POST /api/admin/rooms
 * Create a new room
 */
router.post("/", createRoomHandler);

/**
 * PATCH /api/admin/rooms/:id
 * Update room details
 */
router.patch("/:id", updateRoomHandler);

/**
 * PATCH /api/admin/rooms/:id/toggle
 * Activate / deactivate room
 */
router.patch("/:id/toggle", toggleRoomActiveHandler);

/**
 * Use availability routes
 */
router.use("/", availabilityRoutes);

export default router;
