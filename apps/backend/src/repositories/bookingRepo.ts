import { PrismaClient, BookingStatus } from "@prisma/client";

type Tx = Omit<
    PrismaClient,
    "$connect" | "$disconnect" | "$on" | "$transaction" | "$use" | "$extends"
>;
export async function lockRoomForUpdate(tx: Tx, roomId: string) {
    // Row-level lock to serialize bookings per room.
    // Important: must run INSIDE the same DB transaction.
    await tx.$queryRaw`SELECT id FROM "Room" WHERE id = ${roomId} FOR UPDATE`;
}

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

export async function hasBlockedAvailabilityInRange(
    tx: Tx,
    roomId: string,
    startDate: Date,
    endDate: Date
) {
    // Interpret RoomAvailability as "admin blocks" only.
    // We assume date represents a day-block (00:00).
    return tx.roomAvailability.findFirst({
        where: {
            roomId,
            isBlocked: true,
            date: {
                gte: startDate,
                lt: endDate, // end is exclusive
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
