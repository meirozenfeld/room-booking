import { prisma } from "../../infra/db/prisma";
import { BookingStatus } from "@prisma/client";

type ListAllBookingsInput = {
    userId?: string;
    roomId?: string;
    status?: BookingStatus;
    startDate?: Date;
    endDate?: Date;
    page: number;
    pageSize: number;
    search?: string;
    sortBy?: "user" | "room" | "startDate" | "endDate" | "status";
    order?: "asc" | "desc";
};

export async function listAllBookingsService(input: ListAllBookingsInput) {
    const {
        userId,
        roomId,
        status,
        startDate,
        endDate,
        page,
        pageSize,
        search,
        sortBy,
        order,
    } = input;

    const where: any = {};

    if (search) {
        where.OR = [
            {
                room: {
                    name: {
                        contains: search,
                        mode: "insensitive",
                    },
                },
            },
            {
                user: {
                    email: {
                        contains: search,
                        mode: "insensitive",
                    },
                },
            },
        ];
    }

    if (userId) where.userId = userId;
    if (roomId) where.roomId = roomId;
    if (status) where.status = status as BookingStatus;

    if (startDate || endDate) {
        where.AND = [];
        if (startDate) where.AND.push({ endDate: { gte: startDate } });
        if (endDate) where.AND.push({ startDate: { lte: endDate } });
    }
    let orderBy: any = { createdAt: "desc" };

    if (sortBy && order) {
        switch (sortBy) {
            case "user":
                orderBy = { user: { email: order } };
                break;
            case "room":
                orderBy = { room: { name: order } };
                break;
            case "startDate":
                orderBy = { startDate: order };
                break;
            case "endDate":
                orderBy = { endDate: order };
                break;
            case "status":
                orderBy = { status: order };
                break;
        }
    }

    const skip = (page - 1) * pageSize;

    const [data, total] = await prisma.$transaction([
        prisma.booking.findMany({
            where,
            include: {
                user: { select: { id: true, email: true } },
                room: { select: { id: true, name: true } },
            },
            orderBy,
            skip,
            take: pageSize,
        }),
        prisma.booking.count({ where }),
    ]);

    return {
        data,
        total,
        page,
        pageSize,
        hasNext: skip + data.length < total,
    };
}
