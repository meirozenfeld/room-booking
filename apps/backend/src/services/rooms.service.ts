import { searchRooms } from "../repositories/rooms.repo";

type SortOption = "createdAtDesc" | "capacityAsc";

/**
 * Searches for available rooms with pagination and filtering.
 * Excludes rooms with overlapping non-cancelled bookings when date range is provided.
 */
export async function searchRoomsService(query: {
    startDate?: Date;
    endDate?: Date;
    capacity?: number;
    page: number;
    pageSize: number;
    sort?: string;
}) {
    const { page, pageSize, sort, ...filters } = query;

    const skip = (page - 1) * pageSize;
    const take = pageSize;

    const normalizedSort: SortOption =
        sort === "capacityAsc" ? "capacityAsc" : "createdAtDesc";

    const { data, total } = await searchRooms({
        ...filters,
        skip,
        take,
        sort: normalizedSort,
    });

    const hasNext = skip + data.length < total;

    return {
        data,
        total,
        page,
        pageSize,
        hasNext,
    };
}
