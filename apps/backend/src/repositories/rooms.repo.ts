import { PrismaClient, BookingStatus } from "@prisma/client";

const prisma = new PrismaClient();

type SearchRoomsParams = {
    startDate?: Date;
    endDate?: Date;
    capacity?: number;
    skip: number;
    take: number;
    sort: "createdAtDesc" | "capacityAsc";
};

/**
 * Searches for active rooms with optional filters.
 * When date range is provided, excludes rooms with overlapping non-cancelled bookings.
 * Uses Promise.all to fetch data and count in parallel for better performance.
 */
export async function searchRooms(params: SearchRoomsParams) {
    const {
        startDate,
        endDate,
        capacity,
        skip,
        take,
        sort,
    } = params;

    const whereClause: any = {
        isActive: true,
    };

    if (capacity) {
        whereClause.capacity = {
            gte: capacity,
        };
    }

    if (startDate && endDate) {
        whereClause.bookings = {
            none: {
                status: {
                    not: BookingStatus.CANCELLED,
                },
                startDate: {
                    lte: endDate,
                },
                endDate: {
                    gte: startDate,
                },
            },
        };
    }

    const orderBy =
        sort === "capacityAsc"
            ? { capacity: "asc" as const }
            : { createdAt: "desc" as const };


    const [data, total] = await Promise.all([
        prisma.room.findMany({
            where: whereClause,
            skip,
            take,
            orderBy,
            select: {
                id: true,
                name: true,
                capacity: true,
                isActive: true,
            },
        }),
        prisma.room.count({
            where: whereClause,
        }),
    ]);

    return { data, total };
}
