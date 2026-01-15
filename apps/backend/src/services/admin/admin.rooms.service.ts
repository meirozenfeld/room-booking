import { prisma } from "../../infra/db/prisma";

type CreateRoomInput = {
    name: string;
    capacity: number;
};

type UpdateRoomInput = {
    name?: string;
    capacity?: number;
};

type ListRoomsInput = {
    search?: string;
    status?: "ACTIVE" | "INACTIVE";
    minCapacity?: number;
    sortBy?: RoomSortBy;
    order?: SortOrder;
};

type RoomSortBy = "name" | "capacity" | "status";
type SortOrder = "asc" | "desc";

export async function listRoomsService(input: ListRoomsInput = {}) {
    const { search, status, minCapacity, sortBy, order } = input;

    const where: any = {};

    if (search) {
        where.name = {
            contains: search,
            mode: "insensitive",
        };
    }

    if (status === "ACTIVE") {
        where.isActive = true;
    }

    if (status === "INACTIVE") {
        where.isActive = false;
    }

    if (typeof minCapacity === "number") {
        where.capacity = {
            gte: minCapacity,
        };
    }
    let orderBy: any = { createdAt: "desc" };

    if (sortBy && order) {
        switch (sortBy) {
            case "name":
                orderBy = { name: order };
                break;
            case "capacity":
                orderBy = { capacity: order };
                break;
            case "status":
                orderBy = { isActive: order === "asc" ? "asc" : "desc" };
                break;
        }
    }
    return prisma.room.findMany({
        where,
        orderBy,
    });
}

export async function createRoomService(input: CreateRoomInput) {
    const { name, capacity } = input;

    if (!name || !capacity || capacity <= 0) {
        throw new Error("Invalid room data");
    }

    return prisma.room.create({
        data: {
            name,
            capacity,
        },
    });
}

export async function updateRoomService(
    roomId: string,
    input: UpdateRoomInput
) {
    return prisma.room.update({
        where: { id: roomId },
        data: {
            ...input,
        },
    });
}

export async function toggleRoomActiveService(roomId: string) {
    const room = await prisma.room.findUnique({
        where: { id: roomId },
    });

    if (!room) {
        throw new Error("Room not found");
    }

    return prisma.room.update({
        where: { id: roomId },
        data: {
            isActive: !room.isActive,
        },
    });
}
