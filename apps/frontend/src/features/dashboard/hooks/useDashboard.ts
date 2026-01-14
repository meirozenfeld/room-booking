import { useEffect, useState } from "react";
import { useAuth } from "../../auth/AuthContext";
import { getDashboardStats } from "../../../api/dashboard.api";

function getGreetingByHour(hour: number) {
    if (hour >= 5 && hour < 12) return "Good morning";
    if (hour >= 12 && hour < 17) return "Good afternoon";
    if (hour >= 17 && hour < 22) return "Good evening";
    return "Good night";
}

function getNameFromEmail(email: string) {
    return email.split("@")[0];
}

export function useDashboard() {
    const { user } = useAuth();

    const hour = new Date().getHours();
    const greeting = getGreetingByHour(hour);

    const name = user?.email
        ? getNameFromEmail(user.email)
        : "there";

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
        }[]
    >([]);

    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function loadStats() {
            try {
                const res = await getDashboardStats();
                setStats({
                    upcoming: res.stats.upcomingBookings,
                    total: res.stats.totalBookings,
                });
                setUpcomingPreview(res.upcomingPreview);

            } catch (e) {
                console.error("Failed to load dashboard stats", e);
            } finally {
                setLoading(false);
            }
        }

        loadStats();
    }, []);

    return {
        greeting,
        name,
        user,
        stats,
        upcomingPreview,
        hasUpcoming: upcomingPreview.length > 0,
        loading,
    };


}
