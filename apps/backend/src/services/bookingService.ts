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
} from "../repositories/bookingRepo";
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

            // Everything important happens inside ONE transaction.
            return prisma.$transaction(async (tx) => {
                // 1) Serialize per room (prevents race conditions)
                await lockRoomForUpdate(tx, roomId);

                // 2) Validate room is active
                const active = await isRoomActive(tx, roomId);
                if (!active) throw new BookingValidationError("Room is inactive or does not exist");

                // 3) Check admin blocks (optional but professional)
                const blocked = await hasBlockedAvailabilityInRange(tx, roomId, startDate, endDate);
                if (blocked) throw new BookingConflictError("Room is blocked for the requested dates");

                // 4) Check overlap against CONFIRMED bookings
                const overlap = await findOverlappingConfirmedBooking(tx, roomId, startDate, endDate);
                if (overlap) throw new BookingConflictError();

                // 5) Create booking (CONFIRMED directly)
                const booking = await createConfirmedBooking(tx, userId, roomId, startDate, endDate);

                logBookingAudit({
                    event: "booking_created",
                    bookingId: booking.id,
                    userId,
                    roomId,
                    status: booking.status,
                });

                // 6) Audit (nice touch)
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

            // Audit: attempt
            logBookingAudit({
                event: "booking_cancel_attempt",
                bookingId,
                userId: requesterUserId,
                status: "ATTEMPT",
            });

            return prisma.$transaction(async (tx) => {
                // 1) Lock booking row
                await lockBookingForUpdate(tx, bookingId);

                const booking = await findBookingById(tx, bookingId);
                if (!booking) {
                    throw new BookingNotFoundError();
                }

                // 2) Authorization
                const isAdmin = requesterRole === "ADMIN";
                const isOwner = booking.userId === requesterUserId;
                if (!isAdmin && !isOwner) {
                    throw new BookingForbiddenError();
                }

                // 3) Business rules
                if (booking.status !== BookingStatus.CONFIRMED) {
                    throw new BookingNotCancellableError(
                        booking.status === BookingStatus.CANCELLED
                            ? "Booking is already cancelled"
                            : "Only CONFIRMED bookings can be cancelled"
                    );
                }

                // 4) Serialize with createBooking (same room)
                await lockRoomForUpdate(tx, booking.roomId);

                // 5) Update status
                const updatedBooking = await cancelBooking(tx, bookingId);

                // Audit: success
                logBookingAudit({
                    event: "booking_cancelled",
                    bookingId,
                    userId: requesterUserId,
                    roomId: booking.roomId,
                    status: updatedBooking.status,
                });

                // 6) DB audit
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
