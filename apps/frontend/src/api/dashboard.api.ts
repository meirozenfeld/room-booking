import { apiFetch } from "./client";

export type UpcomingBookingPreview = {
    id: string;
    startDate: string;
    endDate: string;
    room: {
        name: string;
    };
};

export type DashboardStatsResponse = {
    stats: {
        totalBookings: number;
        upcomingBookings: number;
    };
    upcomingPreview: UpcomingBookingPreview[];
};

/**
 * Fetches dashboard statistics and upcoming bookings preview
 * @returns Dashboard data including stats and upcoming bookings
 */
export async function getDashboardStats(): Promise<DashboardStatsResponse> {
    return apiFetch("/api/dashboard");
}
