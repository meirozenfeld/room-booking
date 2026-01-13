import { PrismaClient, BookingStatus } from "@prisma/client";

type Tx = Omit<
    PrismaClient,
    "$connect" | "$disconnect" | "$on" | "$transaction" | "$use" | "$extends"
>;
/**
 * Acquires a row-level lock on the room to prevent concurrent booking conflicts.
 * Must be called within a database transaction to be effective.
 */
export async function lockRoomForUpdate(tx: Tx, roomId: string) {
    await tx.$queryRaw`SELECT id FROM "Room" WHERE id = ${roomId} FOR UPDATE`;
}

/**
 * Finds any confirmed booking that overlaps with the given date range.
 * Uses exclusive end date comparison to detect overlaps.
 */
export async function findOverlappingConfirmedBooking(
    tx: Tx,
    roomId: string,
    startDate: Date,
    endDate: Date
) {
    return tx.booking.findFirst({
        where: {
            roomId,
            status: BookingStatus.CONFIRMED,
            startDate: { lt: endDate },
            endDate: { gt: startDate },
        },
        select: { id: true },
    });
}

export async function isRoomActive(tx: Tx, roomId: string) {
    const room = await tx.room.findUnique({
        where: { id: roomId },
        select: { id: true, isActive: true },
    });
    return room?.isActive === true;
}

/**
 * Checks if admin has blocked room availability for any date in the given range.
 * Assumes date represents a day-block starting at 00:00.
 */
export async function hasBlockedAvailabilityInRange(
    tx: Tx,
    roomId: string,
    startDate: Date,
    endDate: Date
) {
    return tx.roomAvailability.findFirst({
        where: {
            roomId,
            isBlocked: true,
            date: {
                gte: startDate,
                lt: endDate,
            },
        },
        select: { id: true },
    });
}

export async function createConfirmedBooking(
    tx: Tx,
    userId: string,
    roomId: string,
    startDate: Date,
    endDate: Date
) {
    return tx.booking.create({
        data: {
            userId,
            roomId,
            startDate,
            endDate,
            status: BookingStatus.CONFIRMED,
        },
    });
}

/**
 * Acquires a row-level lock on the booking to prevent concurrent modifications.
 * Must be called within a database transaction.
 */
export async function lockBookingForUpdate(tx: Tx, bookingId: string) {
    await tx.$queryRaw`SELECT id FROM "Booking" WHERE id = ${bookingId} FOR UPDATE`;
}

export async function findBookingById(tx: Tx, bookingId: string) {
    return tx.booking.findUnique({
        where: { id: bookingId },
        select: {
            id: true,
            userId: true,
            roomId: true,
            status: true,
            startDate: true,
            endDate: true,
            createdAt: true,
            updatedAt: true,
        },
    });
}

export async function cancelBooking(tx: Tx, bookingId: string) {
    return tx.booking.update({
        where: { id: bookingId },
        data: { status: BookingStatus.CANCELLED },
    });
}
