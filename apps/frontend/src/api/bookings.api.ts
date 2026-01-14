import { apiFetch } from "./client";

export type Booking = {
    id: string;
    roomId: string;
    userId: string;
    startDate: string;
    endDate: string;
    status: "CONFIRMED" | "CANCELLED";
    createdAt: string;
};

/**
 * Creates a new booking for a room
 * @param params - Booking parameters (roomId, startDate, endDate)
 * @returns Created booking object
 */
export async function createBooking(params: {
    roomId: string;
    startDate: string;
    endDate: string;
}): Promise<Booking> {
    return apiFetch("/bookings", {
        method: "POST",
        body: JSON.stringify(params),
    });
}

export type MyBooking = {
    id: string;
    startDate: string;
    endDate: string;
    status: "CONFIRMED" | "CANCELLED";
    createdAt: string;
    room: { id: string; name: string; capacity: number };
};

/**
 * Fetches user's bookings with filtering and pagination
 * @param params - Query parameters for filtering and pagination
 * @returns Paginated bookings response with counts
 */
export async function getMyBookings(params: {
    section?: "upcoming" | "past" | "cancelled";
    search?: string;
    startDate?: string;
    endDate?: string;
    minCapacity?: number;
    sortBy?: "roomName" | "startDate" | "createdAt";
    order?: "asc" | "desc";
    page?: number;
    pageSize?: number;
}): Promise<{
    items: MyBooking[];
    page: number;
    pageSize: number;
    hasMore: boolean;
    counts: {
        upcoming: number;
        past: number;
        cancelled: number;
    };
}> {

    const qs = new URLSearchParams();
    if (params.section) qs.set("section", params.section);
    if (params.search) qs.set("search", params.search);
    if (params.startDate) qs.set("startDate", params.startDate);
    if (params.endDate) qs.set("endDate", params.endDate);
    if (typeof params.minCapacity === "number") qs.set("minCapacity", String(params.minCapacity));
    if (params.sortBy) qs.set("sortBy", params.sortBy);
    if (params.order) qs.set("order", params.order);
    if (typeof params.page === "number") qs.set("page", String(params.page));
    if (typeof params.pageSize === "number") qs.set("pageSize", String(params.pageSize));

    const url = `/bookings/my${qs.toString() ? `?${qs.toString()}` : ""}`;
    return apiFetch(url);
}

/**
 * Cancels a booking by ID
 * @param id - Booking ID to cancel
 */
export async function cancelBooking(id: string) {
    return apiFetch(`/bookings/${id}/cancel`, { method: "PATCH" });
}

/**
 * Reschedules a booking to new dates
 * @param params - Booking ID and new start/end dates
 */
export async function rescheduleBooking(params: { id: string; startDate: string; endDate: string }) {
    return apiFetch(`/bookings/${params.id}/reschedule`, {
        method: "PATCH",
        body: JSON.stringify({ startDate: params.startDate, endDate: params.endDate }),
    });
}
