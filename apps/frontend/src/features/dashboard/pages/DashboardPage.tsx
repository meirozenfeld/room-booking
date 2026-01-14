import { useDashboard } from "../hooks/useDashboard";
import DashboardHeader from "../components/DashboardHeader";
import DashboardStats from "../components/DashboardStats";
import DashboardActions from "../components/DashboardActions";
import DashboardUpcoming from "../components/DashboardUpcoming";
import DashboardSkeleton from "../components/DashboardSkeleton";
import totalIcon from "../../../assets/icons/total_bookings.png";
import upcomingIcon from "../../../assets/icons/uncoming_bookings.png";

export default function DashboardPage() {
    const { greeting, name, stats, upcomingPreview, loading } = useDashboard();
    if (loading) {
        return <DashboardSkeleton />;
    }
    return (
        <div className="max-w-6xl mx-auto space-y-10">
            <DashboardHeader greeting={greeting} name={name} />

            <DashboardStats total={stats.total} upcoming={stats.upcoming} totalIcon={totalIcon} upcomingIcon={upcomingIcon} />

            <DashboardUpcoming items={upcomingPreview} />

            <DashboardActions />
        </div>
    );
}
