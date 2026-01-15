import { Response } from "express";
import { AuthenticatedRequest } from "../../infra/auth-middleware";
import {
    blockRoomService,
    unblockRoomService,
    listRoomBlocksService,
} from "../../services/admin/admin.availability.service";

export async function listRoomBlocksHandler(
    req: AuthenticatedRequest,
    res: Response
) {
    const roomId = req.params.id;
    const blocks = await listRoomBlocksService(roomId);
    return res.status(200).json({ blocks });
}

export async function blockRoomHandler(
    req: AuthenticatedRequest,
    res: Response
) {
    const roomId = req.params.id;
    const { startDate, endDate } = req.body;

    const result = await blockRoomService({
        roomId,
        startDate: new Date(startDate),
        endDate: new Date(endDate),
    });

    return res.status(201).json(result);
}

export async function unblockRoomHandler(
    req: AuthenticatedRequest,
    res: Response
) {
    const roomId = req.params.id;
    const { startDate, endDate } = req.body;

    const result = await unblockRoomService({
        roomId,
        startDate: new Date(startDate),
        endDate: new Date(endDate),
    });

    return res.status(200).json(result);
}
