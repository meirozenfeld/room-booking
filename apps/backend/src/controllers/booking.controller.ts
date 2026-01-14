import { Request, Response } from "express";
import {
    createBookingService,
    BookingConflictError,
    BookingValidationError,
    BookingNotFoundError,
    BookingForbiddenError,
    BookingNotCancellableError,
} from "../services/bookings.service";
import { prisma } from "../infra/db/prisma";
import { AuthenticatedRequest } from "../infra/auth-middleware";

const bookingService = createBookingService(prisma);

/**
 * Creates a new booking for the authenticated user.
 * Maps service errors to appropriate HTTP status codes.
 */
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

/**
 * Lists the bookings for the authenticated user.
 * Maps service errors to appropriate HTTP status codes.
 */
export async function listMyBookingsHandler(req: AuthenticatedRequest, res: Response) {
    const userId = req.user?.userId;
    if (!userId) return res.status(401).json({ error: "Unauthorized" });

    const { search, startDate, endDate, minCapacity, sortBy, order, page, pageSize, section } = req.query;

    const parsedStart = startDate ? new Date(String(startDate)) : undefined;
    const parsedEnd = endDate ? new Date(String(endDate)) : undefined;

    const parsedMinCap =
        typeof minCapacity === "string" && minCapacity.trim() !== ""
            ? Number(minCapacity)
            : undefined;

    const data = await bookingService.listMyBookings({
        userId,
        section: section as "upcoming" | "past" | "cancelled" | undefined,
        search: search ? String(search) : undefined,
        startDate: parsedStart,
        endDate: parsedEnd,
        minCapacity: Number.isFinite(parsedMinCap) ? parsedMinCap : undefined,
        sortBy: (sortBy as any) ?? "createdAt",
        order: (order as any) ?? "desc",
        page: page ? Number(page) : 1,
        pageSize: pageSize ? Number(pageSize) : 10,
    });


    return res.status(200).json(data);
}

/**
* Reschedules a booking. Only the booking owner or admin can reschedule.
* Maps service errors to appropriate HTTP status codes.
*/
export async function rescheduleBookingHandler(req: AuthenticatedRequest, res: Response) {
    const bookingId = req.params.id;
    const requesterUserId = req.user?.userId;
    const requesterRole = req.user?.role;
    if (!requesterUserId || !requesterRole) return res.status(401).json({ error: "Unauthorized" });

    const { startDate, endDate } = req.body;

    try {
        const updated = await bookingService.rescheduleBooking({
            bookingId,
            requesterUserId,
            requesterRole,
            startDate: new Date(startDate),
            endDate: new Date(endDate),
        });

        return res.status(200).json(updated);
    } catch (err) {
        if (err instanceof BookingNotFoundError) return res.status(404).json({ error: err.message });
        if (err instanceof BookingForbiddenError) return res.status(403).json({ error: err.message });
        if (err instanceof BookingConflictError) return res.status(409).json({ error: err.message });
        if (err instanceof BookingValidationError) return res.status(400).json({ error: err.message });
        throw err;
    }
}

/**
 * Cancels a booking. Only the booking owner or admin can cancel.
 * Maps service errors to appropriate HTTP status codes.
 */
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