import { Response } from "express";
import { AuthenticatedRequest } from "../../infra/auth-middleware";
import {
    listRoomsService,
    createRoomService,
    updateRoomService,
    toggleRoomActiveService,
} from "../../services/admin/admin.rooms.service";

export async function listRoomsHandler(
    req: AuthenticatedRequest,
    res: Response
) {
    const { search, status, minCapacity, sortBy, order } = req.query;
    const ROOM_SORT_FIELDS = ["name", "capacity", "status"] as const;
    type RoomSortField = typeof ROOM_SORT_FIELDS[number];

    let parsedStatus: "ACTIVE" | "INACTIVE" | undefined = undefined;

    if (status === "ACTIVE" || status === "INACTIVE") {
        parsedStatus = status;
    }
    let parsedSortBy: RoomSortField | undefined = undefined;
    let parsedOrder: "asc" | "desc" | undefined = undefined;

    if (ROOM_SORT_FIELDS.includes(sortBy as RoomSortField)) {
        parsedSortBy = sortBy as RoomSortField;
    }

    if (order === "asc" || order === "desc") {
        parsedOrder = order;
    }

    const rooms = await listRoomsService({
        search: typeof search === "string" ? search : undefined,
        status: parsedStatus,
        minCapacity:
            typeof minCapacity === "string" ? Number(minCapacity) : undefined,
        sortBy: parsedSortBy,
        order: parsedOrder,
    });

    return res.status(200).json({ rooms });
}

export async function createRoomHandler(
    req: AuthenticatedRequest,
    res: Response
) {
    const { name, capacity } = req.body;

    const room = await createRoomService({
        name,
        capacity,
    });

    return res.status(201).json(room);
}

export async function updateRoomHandler(
    req: AuthenticatedRequest,
    res: Response
) {
    const { id } = req.params;
    const { name, capacity } = req.body;

    const room = await updateRoomService(id, {
        name,
        capacity,
    });

    return res.status(200).json(room);
}

export async function toggleRoomActiveHandler(
    req: AuthenticatedRequest,
    res: Response
) {
    const { id } = req.params;

    const room = await toggleRoomActiveService(id);

    return res.status(200).json(room);
}
