import { apiFetch } from "../../../api/client";

/**
 * Admin booking type with user and room information
 */
export type AdminBooking = {
    id: string;
    startDate: string;
    endDate: string;
    status: "CONFIRMED" | "CANCELLED";
    createdAt: string;
    user: {
        id: string;
        email: string;
    };
    room: {
        id: string;
        name: string;
    };
};

/**
 * Fetches admin bookings with filtering, pagination, and sorting
 * @param params - Query parameters for filtering and pagination
 * @returns Paginated bookings response
 */
export async function getAdminBookings(params: {
    page?: number;
    pageSize?: number;
    search?: string;
    status?: "CONFIRMED" | "CANCELLED";
    startDate?: string;
    endDate?: string;
    sortBy?: string;
    order?: "asc" | "desc";
}) {


    const qs = new URLSearchParams();

    if (params.page) qs.set("page", String(params.page));
    if (params.pageSize) qs.set("pageSize", String(params.pageSize));
    if (params.search) qs.set("search", params.search);
    if (params.status) qs.set("status", params.status);
    if (params.startDate) qs.set("startDate", params.startDate);
    if (params.endDate) qs.set("endDate", params.endDate);
    if (params.sortBy) qs.set("sortBy", params.sortBy);
    if (params.order) qs.set("order", params.order);

    return apiFetch(
        `/api/admin/bookings${qs.toString() ? `?${qs.toString()}` : ""}`
    );
}

/**
 * Cancels a booking by ID (admin only)
 * @param id - Booking ID to cancel
 */
export async function cancelAdminBooking(id: string) {
    return apiFetch(`/api/admin/bookings/${id}/cancel`, {
        method: "PATCH",
    });
}
