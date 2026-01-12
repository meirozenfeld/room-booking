import { Request, Response } from "express";
import { searchRooms } from "../repositories/rooms.repo";
import { roomSearchQuerySchema } from "./rooms.schemas";

export async function searchRoomsHandler(
    req: Request,
    res: Response
) {
    const query = roomSearchQuerySchema.parse(req.query);


    const {
        startDate,
        endDate,
        capacity,
        page,
        pageSize,
        sort,
    } = query;

    const skip = (page - 1) * pageSize;
    const take = pageSize;

    const start = startDate ? new Date(startDate) : undefined;
    const end = endDate ? new Date(endDate) : undefined;

    const { data, total } = await searchRooms({
        startDate: start,
        endDate: end,
        capacity,
        skip,
        take,
        sort,
    });

    const hasNext = skip + data.length < total;

    res.json({
        data,
        page,
        pageSize,
        total,
        hasNext,
    });
}
