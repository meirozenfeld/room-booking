import { Router } from "express";
import { createBooking, cancelBookingHandler, listMyBookingsHandler, rescheduleBookingHandler } from "../controllers/booking.controller";
import { authMiddleware } from "../infra/auth-middleware";
import { createBookingSchema } from "../infra/validate/booking.schemas";
import { validate } from "../infra/validate";

const router = Router();

router.post(
  "/",
  authMiddleware,
  validate(createBookingSchema),
  createBooking
);
router.get("/my", authMiddleware, listMyBookingsHandler);
router.patch("/:id/reschedule", authMiddleware, rescheduleBookingHandler);
router.patch(
  "/:id/cancel",
  authMiddleware,
  cancelBookingHandler
);

export default router;
