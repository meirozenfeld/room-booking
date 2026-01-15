import { apiFetch } from "../../../api/client";

export type AdminUpcomingBookingPreview = {
    id: string;
    startDate: string;
    endDate: string;
    room: {
        id: string;
        name: string;
    };
    user: {
        id: string;
        email: string;
    };
};

export type AdminDashboardStatsResponse = {
    stats: {
        totalBookings: number;
        upcomingBookings: number;
    };
    upcomingPreview: AdminUpcomingBookingPreview[];
};

/**
 * Fetch admin dashboard aggregated stats (all users)
 */
export async function getAdminDashboardStats(): Promise<AdminDashboardStatsResponse> {
    return apiFetch("/api/admin/dashboard");
}
