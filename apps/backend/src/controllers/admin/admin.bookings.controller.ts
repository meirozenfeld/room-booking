import { Response } from "express";
import { AuthenticatedRequest } from "../../infra/auth-middleware";
import { listAllBookingsService } from "../../services/admin/admin.bookings.service";
import { BookingStatus } from "@prisma/client";

export async function listAllBookingsHandler(
    req: AuthenticatedRequest,
    res: Response
) {
    const {
        search,
        userId,
        roomId,
        status,
        startDate,
        endDate,
        page = "1",
        pageSize = "20",
        sortBy,
        order,
    } = req.query;

    let parsedStatus: BookingStatus | undefined = undefined;
    if (status === BookingStatus.CONFIRMED || status === BookingStatus.CANCELLED) {
        parsedStatus = status;
    }
    const SORT_FIELDS = ["user", "room", "startDate", "endDate", "status"] as const;
    type SortField = typeof SORT_FIELDS[number];
    let parsedSortBy: SortField | undefined = undefined;

    if (SORT_FIELDS.includes(sortBy as SortField)) {
        parsedSortBy = sortBy as SortField;
    }

    const data = await listAllBookingsService({
        search: search ? String(search) : undefined,
        userId: userId ? String(userId) : undefined,
        roomId: roomId ? String(roomId) : undefined,
        status: parsedStatus,
        startDate: startDate ? new Date(String(startDate)) : undefined,
        endDate: endDate ? new Date(String(endDate)) : undefined,
        page: Number(page),
        pageSize: Number(pageSize),
        sortBy: parsedSortBy,
        order: order === "asc" || order === "desc" ? order : undefined,
    });


    return res.status(200).json(data);
}
