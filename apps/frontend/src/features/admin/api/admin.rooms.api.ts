import { apiFetch } from "../../../api/client";

/**
 * Admin room type with active status and timestamps
 */
export type AdminRoom = {
    id: string;
    name: string;
    capacity: number;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
};

/**
 * Fetches admin rooms with filtering and sorting
 * @param params - Optional query parameters for filtering and sorting
 * @returns Rooms response
 */
export async function getAdminRooms(params?: {
    search?: string;
    status?: "ACTIVE" | "INACTIVE";
    minCapacity?: number;
    sortBy?: "name" | "capacity" | "status";
    order?: "asc" | "desc";
}): Promise<{ rooms: AdminRoom[] }> {
    const qs = new URLSearchParams();

    if (params?.search) qs.set("search", params.search);
    if (params?.status) qs.set("status", params.status);
    if (typeof params?.minCapacity === "number") {
        qs.set("minCapacity", String(params.minCapacity));
    }
    if (params?.sortBy) qs.set("sortBy", params.sortBy);
    if (params?.order) qs.set("order", params.order);
    return apiFetch(
        `/api/admin/rooms${qs.toString() ? `?${qs.toString()}` : ""}`
    );
}

/**
 * Creates a new room (admin only)
 * @param input - Room name and capacity
 */
export async function createAdminRoom(input: {
    name: string;
    capacity: number;
}) {
    return apiFetch("/api/admin/rooms", {
        method: "POST",
        body: JSON.stringify(input),
    });
}

/**
 * Updates an existing room (admin only)
 * @param id - Room ID
 * @param input - Partial room data (name and/or capacity)
 */
export async function updateAdminRoom(
    id: string,
    input: Partial<{ name: string; capacity: number }>
) {
    return apiFetch(`/api/admin/rooms/${id}`, {
        method: "PATCH",
        body: JSON.stringify(input),
    });
}

/**
 * Toggles room active/inactive status (admin only)
 * @param id - Room ID to toggle
 */
export async function toggleAdminRoom(id: string) {
    return apiFetch(`/api/admin/rooms/${id}/toggle`, {
        method: "PATCH",
    });
}

/**
 * Gets room availability information
 * @param roomId - Room ID
 */
export async function getRoomAvailability(roomId: string) {
    return apiFetch(`/api/admin/rooms/${roomId}/availability`);
}

/**
 * Blocks a room for specific dates (admin only)
 * @param roomId - Room ID
 * @param input - Start and end dates for blocking
 */
export async function blockRoom(roomId: string, input: {
    startDate: string;
    endDate: string;
}) {
    return apiFetch(`/api/admin/rooms/${roomId}/block`, {
        method: "POST",
        body: JSON.stringify(input),
    });
}

/**
 * Unblocks a room for specific dates (admin only)
 * @param roomId - Room ID
 * @param input - Start and end dates to unblock
 */
export async function unblockRoom(roomId: string, input: {
    startDate: string;
    endDate: string;
}) {
    return apiFetch(`/api/admin/rooms/${roomId}/block`, {
        method: "DELETE",
        body: JSON.stringify(input),
    });
}
