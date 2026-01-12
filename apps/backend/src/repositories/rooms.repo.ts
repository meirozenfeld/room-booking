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
                    lt: endDate,
                },
                endDate: {
                    gt: startDate,
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
