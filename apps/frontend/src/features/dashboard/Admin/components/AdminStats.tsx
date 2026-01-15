import totalIcon from "../../../../assets/icons/total_bookings.png";
import upcomingIcon from "../../../../assets/icons/uncoming_bookings.png";

type Props = {
    total: number;
    upcoming: number;
};

export default function AdminStats({ total, upcoming }: Props) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <StatCard
                title="Total bookings (all users - all time)"
                value={total}
                icon={totalIcon}
            />
            <StatCard
                title="Upcoming bookings (all users)"
                value={upcoming}
                icon={upcomingIcon}
            />
        </div>
    );
}

function StatCard({
    title,
    value,
    icon,
}: {
    title: string;
    value: number;
    icon: string;
}) {
    return (
        <div className="bg-white border border-slate-200 rounded-lg p-5 flex items-center gap-4">
            <img src={icon} alt="" className="w-10 h-10 object-contain" />
            <div>
                <div className="text-sm text-slate-500">{title}</div>
                <div className="text-2xl font-semibold">{value}</div>
            </div>
        </div>
    );
}
