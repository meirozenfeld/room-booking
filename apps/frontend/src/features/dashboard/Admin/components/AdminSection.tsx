import { useAdminDashboard } from "../hooks/useAdminDashboard";
import AdminStats from "../components/AdminStats";
import AdminUpcoming from "../components/AdminUpcoming";
import AdminActions from "../components/AdminActions";
import AdminSkeleton from "./AdminSkeleton";

export default function AdminSection() {
    const { stats, upcomingPreview, loading, refresh } = useAdminDashboard();

    if (loading) {
        return (
            <section className="space-y-6 pt-6 border-t border-slate-200">
                <div className="flex items-center justify-between">
                    <h2 className="text-lg font-semibold">Admin overview</h2>
                </div>
                <AdminSkeleton />
            </section>
        );
    }


    return (
        <section className="space-y-6 pt-6 border-t border-slate-200">
            <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold">Admin overview</h2>

                <button
                    onClick={refresh}
                    className="
            flex items-center gap-1
            text-sm text-blue-600
            hover:underline
        "
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className={`w-4 h-4 ${loading ? "animate-spin" : ""}`}
                    >
                        <path d="M21 12a9 9 0 1 1-2.64-6.36" />
                        <polyline points="21 3 21 9 15 9" />
                    </svg>

                    Refresh
                </button>
            </div>


            <AdminStats
                total={stats.total}
                upcoming={stats.upcoming}
            />

            <AdminUpcoming items={upcomingPreview} />

            <AdminActions />
        </section>
    );
}
