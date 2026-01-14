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

export async function listMyBookings(
    tx: Tx,
    userId: string,
    opts: {
        section?: "upcoming" | "past" | "cancelled";
        search?: string;
        startDate?: Date;
        endDate?: Date;
        minCapacity?: number;
        sortBy?: "roomName" | "startDate" | "createdAt";
        order?: "asc" | "desc";
        page?: number;
        pageSize?: number;
    }
) {
    const {
        search,
        startDate,
        endDate,
        minCapacity,
        sortBy = "createdAt",
        order = "desc",
        page = 1,
        pageSize = 10,
    } = opts;

    const skip = (page - 1) * pageSize;

    const where: any = { userId };


    if (search || typeof minCapacity === "number") {
        where.room = {};
        if (search) where.room.name = { contains: search, mode: "insensitive" };
        if (typeof minCapacity === "number") {
            where.room.capacity = { gte: minCapacity };
        }
    }

    if (startDate || endDate) {
        where.AND = [];
        if (endDate) where.AND.push({ startDate: { lt: endDate } });
        if (startDate) where.AND.push({ endDate: { gt: startDate } });
    }

    const orderBy =
        sortBy === "roomName"
            ? { room: { name: order } }
            : sortBy === "startDate"
                ? { startDate: order }
                : { createdAt: order };
    const now = new Date();

    if (opts.section === "upcoming") {
        where.status = BookingStatus.CONFIRMED;
        where.startDate = { gte: now };
    }

    if (opts.section === "past") {
        where.status = BookingStatus.CONFIRMED;
        where.endDate = { lt: now };
    }

    if (opts.section === "cancelled") {
        where.status = BookingStatus.CANCELLED;
    }
    const [upcomingCount, pastCount, cancelledCount] =
        await Promise.all([
            tx.booking.count({
                where: {
                    userId,
                    status: BookingStatus.CONFIRMED,
                    startDate: { gte: now },
                },
            }),
            tx.booking.count({
                where: {
                    userId,
                    status: BookingStatus.CONFIRMED,
                    endDate: { lt: now },
                },
            }),
            tx.booking.count({
                where: {
                    userId,
                    status: BookingStatus.CANCELLED,
                },
            }),
        ]);

    const items = await tx.booking.findMany({
        where,
        orderBy,
        skip,
        take: pageSize + 1,
        select: {
            id: true,
            startDate: true,
            endDate: true,
            status: true,
            createdAt: true,
            room: { select: { id: true, name: true, capacity: true } },
        },
    });

    const hasMore = items.length > pageSize;

    return {
        items: hasMore ? items.slice(0, pageSize) : items,
        page,
        pageSize,
        hasMore,
        counts: {
            upcoming: upcomingCount,
            past: pastCount,
            cancelled: cancelledCount,
        },
    };
}

/**
 * Updates the start and end date of a booking.
 * Must be called within a database transaction.
 */
export async function updateBookingDates(
    tx: Tx,
    bookingId: string,
    startDate: Date,
    endDate: Date
) {
    return tx.booking.update({
        where: { id: bookingId },
        data: { startDate, endDate },
    });
}

export async function findOverlappingConfirmedBookingExcluding(
    tx: Tx,
    roomId: string,
    startDate: Date,
    endDate: Date,
    excludeBookingId: string
) {
    return tx.booking.findFirst({
        where: {
            roomId,
            status: BookingStatus.CONFIRMED,
            id: { not: excludeBookingId },
            startDate: { lt: endDate },
            endDate: { gt: startDate },
        },
        select: { id: true },
    });
}


export async function cancelBooking(tx: Tx, bookingId: string) {
    return tx.booking.update({
        where: { id: bookingId },
        data: { status: BookingStatus.CANCELLED },
    });
}
