import { logger } from "../logger";

type BookingAuditEvent =
    | "booking_attempt"
    | "booking_created"
    | "booking_failed"
    | "booking_cancel_attempt"
    | "booking_cancelled"
    | "booking_cancel_failed";

interface BookingAuditLog {
    event: BookingAuditEvent;
    bookingId?: string;
    roomId?: string;
    userId?: string;
    status?: string;
    requestId?: string;
    reason?: string;
}

export function logBookingAudit(data: BookingAuditLog) {
    logger.info(
        {
            audit: true,
            domain: "booking",
            ...data,
        },
        `Booking audit event: ${data.event}`
    );
}
