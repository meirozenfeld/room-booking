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

export async function getDashboardStats(): Promise<DashboardStatsResponse> {
    return apiFetch("/api/dashboard");
}
