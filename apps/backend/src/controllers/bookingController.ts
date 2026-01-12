import { Request, Response } from "express";
import {
    createBookingService,
    BookingConflictError,
    BookingValidationError,
    BookingNotFoundError,
    BookingForbiddenError,
    BookingNotCancellableError,
} from "../services/bookingService";
import { prisma } from "../infra/db/prisma";
import { AuthenticatedRequest } from "../infra/auth-middleware";

const bookingService = createBookingService(prisma);

export async function createBooking(
    req: AuthenticatedRequest,
    res: Response
) {
    const { roomId, startDate, endDate } = req.body;

    const userId = req.user?.userId;
    if (!userId) {
        return res.status(401).json({ error: "Unauthorized" });
    }

    try {
        const booking = await bookingService.createBooking({
            userId,
            roomId,
            startDate: new Date(startDate),
            endDate: new Date(endDate),
        });

        return res.status(201).json(booking);
    } catch (err) {
        if (err instanceof BookingConflictError) {
            return res.status(409).json({ error: err.message });
        }
        if (err instanceof BookingValidationError) {
            return res.status(400).json({ error: err.message });
        }
        throw err;
    }
}
export async function cancelBookingHandler(
    req: AuthenticatedRequest,
    res: Response
) {
    const bookingId = req.params.id;

    const requesterUserId = req.user?.userId;
    const requesterRole = req.user?.role;

    if (!requesterUserId || !requesterRole) {
        return res.status(401).json({ error: "Unauthorized" });
    }

    try {
        const updated = await bookingService.cancelBooking({
            bookingId,
            requesterUserId,
            requesterRole,
        });

        return res.status(200).json(updated);
    } catch (err) {
        if (err instanceof BookingNotFoundError) {
            return res.status(404).json({ error: err.message });
        }
        if (err instanceof BookingForbiddenError) {
            return res.status(403).json({ error: err.message });
        }
        if (err instanceof BookingNotCancellableError) {
            return res.status(409).json({ error: err.message });
        }
        if (err instanceof BookingConflictError) {
            return res.status(409).json({ error: err.message });
        }
        if (err instanceof BookingValidationError) {
            return res.status(400).json({ error: err.message });
        }
        throw err;
    }
}