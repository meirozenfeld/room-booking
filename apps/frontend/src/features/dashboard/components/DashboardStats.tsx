type Props = {
    total: number;
    upcoming: number;
    totalIcon: string;
    upcomingIcon: string;
};

/**
 * Individual statistic card component
 */
function StatCard({
    label,
    value,
    icon,
}: {
    label: string;
    value: number;
    icon: string;
}) {
    return (
        <div className="rounded-xl bg-white border border-slate-200 p-4 flex items-center gap-4">
            <img
                src={icon}
                alt=""
                className="h-10 w-10 object-contain"
            />

            <div>
                <div className="text-sm text-slate-500">{label}</div>
                <div className="text-2xl font-semibold text-slate-900">
                    {value}
                </div>
            </div>
        </div>
    );
}

/**
 * Dashboard statistics component
 * Displays total and upcoming booking counts
 */
export default function DashboardStats({ total, upcoming, totalIcon, upcomingIcon }: Props) {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <StatCard
                label="Total bookings (all time)"
                value={total}
                icon={totalIcon}
            />

            <StatCard
                label="Upcoming bookings"
                value={upcoming}
                icon={upcomingIcon}
            />

        </div>
    );
}