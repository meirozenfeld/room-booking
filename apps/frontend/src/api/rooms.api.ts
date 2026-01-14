import { apiFetch } from "./client";

export type Room = {
    id: string;
    name: string;
    capacity: number;
    isActive: boolean;
};

export type RoomsSearchResponse = {
    data: Room[];
    page: number;
    pageSize: number;
    total: number;
    hasNext: boolean;
};

type SearchParams = {
    startDate?: string;
    endDate?: string;
    capacity?: number;
    page: number;
    pageSize: number;
    sort: "createdAtDesc" | "capacityAsc";
};

export async function searchRooms(
    params: SearchParams
): Promise<RoomsSearchResponse> {
    const query = new URLSearchParams();

    if (params.startDate) query.set("startDate", params.startDate);
    if (params.endDate) query.set("endDate", params.endDate);
    if (params.capacity) query.set("capacity", String(params.capacity));

    query.set("page", String(params.page));
    query.set("pageSize", String(params.pageSize));
    query.set("sort", params.sort);

    return apiFetch(`/api/rooms/search?${query.toString()}`);
}
