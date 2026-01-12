import { Router } from "express";
import { createBooking, cancelBookingHandler } from "../../controllers/bookingController";
import { authMiddleware } from "../../infra/auth-middleware";
import { createBookingSchema } from "../schemas/booking.schemas";
import { validate } from "../../infra/validate";

const router = Router();

router.post(
    "/",
    authMiddleware,
    validate(createBookingSchema),
    createBooking
  );
  
  router.patch(
    "/:id/cancel",
    authMiddleware,
    cancelBookingHandler
);

export default router;
