import { Request, Response } from "express";
import { roomSearchQuerySchema } from "../infra/validate/rooms.schemas";
import { searchRoomsService } from "../services/rooms.service";

/**
 * Searches for available rooms with optional filters (date range, capacity).
 * Returns paginated results with availability check.
 */
export async function searchRoomsHandler(req: Request, res: Response) {
    const query = roomSearchQuerySchema.parse(req.query);

    const start = query.startDate ? new Date(query.startDate) : undefined;
    const end = query.endDate ? new Date(query.endDate) : undefined;

    const result = await searchRoomsService({
        ...query,
        startDate: start,
        endDate: end,
    });

    res.json(result);
}
