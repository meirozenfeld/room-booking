import { useEffect, useState, useCallback } from "react";
import { getAdminDashboardStats } from "../../../admin/api/admin.dashboard.api";

/**
 * Custom hook for admin dashboard data
 * Fetches aggregated booking statistics for all users
 */
export function useAdminDashboard() {
    const [stats, setStats] = useState({
        upcoming: 0,
        total: 0,
    });

    const [upcomingPreview, setUpcomingPreview] = useState<
        {
            id: string;
            startDate: string;
            endDate: string;
            room: { name: string };
            user: { email: string };
        }[]
    >([]);

    const [loading, setLoading] = useState(true);

    const loadAdminStats = useCallback(async () => {
        setLoading(true);
        try {
            const res = await getAdminDashboardStats();

            setStats({
                upcoming: res.stats.upcomingBookings,
                total: res.stats.totalBookings,
            });

            setUpcomingPreview(res.upcomingPreview);
        } catch (e) {
            console.error("Failed to load admin dashboard stats", e);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        loadAdminStats();
    }, [loadAdminStats]);

    return {
        stats,
        upcomingPreview,
        hasUpcoming: upcomingPreview.length > 0,
        loading,
        refresh: loadAdminStats,
    };
}
