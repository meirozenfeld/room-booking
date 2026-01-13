import { BookingStatus, PrismaClient } from "@prisma/client";
import {
    lockRoomForUpdate,
    isRoomActive,
    findOverlappingConfirmedBooking,
    hasBlockedAvailabilityInRange,
    createConfirmedBooking,
    lockBookingForUpdate,
    findBookingById,
    cancelBooking,
} from "../repositories/booking.repo";
import { logBookingAudit } from "../infra/observability/audit-logger";

export class BookingConflictError extends Error {
    constructor(message = "Room is already booked for the requested dates") {
        super(message);
        this.name = "BookingConflictError";
    }
}

export class BookingValidationError extends Error {
    constructor(message: string) {
        super(message);
        this.name = "BookingValidationError";
    }
}

type CreateBookingInput = {
    userId: string;
    roomId: string;
    startDate: Date;
    endDate: Date;
};

type CancelBookingInput = {
    bookingId: string;
    requesterUserId: string;
    requesterRole: string; // "USER" | "ADMIN"
};


export class BookingNotFoundError extends Error {
    constructor(message = "Booking not found") {
        super(message);
        this.name = "BookingNotFoundError";
    }
}

export class BookingForbiddenError extends Error {
    constructor(message = "Not allowed to cancel this booking") {
        super(message);
        this.name = "BookingForbiddenError";
    }
}

export class BookingNotCancellableError extends Error {
    constructor(message = "Booking cannot be cancelled") {
        super(message);
        this.name = "BookingNotCancellableError";
    }
}

export function createBookingService(prisma: PrismaClient) {
    return {
        async createBooking(input: CreateBookingInput) {
            const { userId, roomId, startDate, endDate } = input;

            logBookingAudit({
                event: "booking_attempt",
                userId,
                roomId,
                status: "ATTEMPT",
            });

            // All booking operations run in a single transaction to ensure atomicity
            // and prevent race conditions when multiple users book the same room simultaneously
            return prisma.$transaction(async (tx) => {
                // Acquire row-level lock on room to serialize concurrent booking attempts
                await lockRoomForUpdate(tx, roomId);

                const active = await isRoomActive(tx, roomId);
                if (!active) throw new BookingValidationError("Room is inactive or does not exist");

                // Check for admin-defined availability blocks
                const blocked = await hasBlockedAvailabilityInRange(tx, roomId, startDate, endDate);
                if (blocked) throw new BookingConflictError("Room is blocked for the requested dates");

                // Check for overlapping confirmed bookings (excludes cancelled bookings)
                const overlap = await findOverlappingConfirmedBooking(tx, roomId, startDate, endDate);
                if (overlap) throw new BookingConflictError();

                const booking = await createConfirmedBooking(tx, userId, roomId, startDate, endDate);

                logBookingAudit({
                    event: "booking_created",
                    bookingId: booking.id,
                    userId,
                    roomId,
                    status: booking.status,
                });

                // Persist audit trail for compliance and debugging
                await tx.auditEvent.create({
                    data: {
                        entity: "BOOKING",
                        entityId: booking.id,
                        action: "CREATED",
                        metadata: { roomId, userId, startDate, endDate },
                    },
                });

                return booking;
            });
        },
        async cancelBooking(input: CancelBookingInput) {
            const { bookingId, requesterUserId, requesterRole } = input;

            logBookingAudit({
                event: "booking_cancel_attempt",
                bookingId,
                userId: requesterUserId,
                status: "ATTEMPT",
            });

            return prisma.$transaction(async (tx) => {
                // Lock booking row to prevent concurrent modifications
                await lockBookingForUpdate(tx, bookingId);

                const booking = await findBookingById(tx, bookingId);
                if (!booking) {
                    throw new BookingNotFoundError();
                }

                // Verify authorization: only admin or booking owner can cancel
                const isAdmin = requesterRole === "ADMIN";
                const isOwner = booking.userId === requesterUserId;
                if (!isAdmin && !isOwner) {
                    throw new BookingForbiddenError();
                }

                // Enforce business rule: only confirmed bookings can be cancelled
                if (booking.status !== BookingStatus.CONFIRMED) {
                    throw new BookingNotCancellableError(
                        booking.status === BookingStatus.CANCELLED
                            ? "Booking is already cancelled"
                            : "Only CONFIRMED bookings can be cancelled"
                    );
                }

                // Lock room to serialize with booking creation (prevents race conditions)
                await lockRoomForUpdate(tx, booking.roomId);

                const updatedBooking = await cancelBooking(tx, bookingId);

                logBookingAudit({
                    event: "booking_cancelled",
                    bookingId,
                    userId: requesterUserId,
                    roomId: booking.roomId,
                    status: updatedBooking.status,
                });

                await tx.auditEvent.create({
                    data: {
                        entity: "BOOKING",
                        entityId: bookingId,
                        action: "CANCELLED",
                        metadata: { requesterUserId, requesterRole },
                    },
                });

                return updatedBooking;
            });
        }


    };
}
