import { Link } from "react-router-dom";
import nextThreeIcon from "../../../assets/icons/next_three_bookings.png";

type Booking = {
    id: string;
    startDate: string;
    endDate: string;
    room: {
        name: string;
    };
};

type Props = {
    items: Booking[];
};

function formatDate(date: string) {
    return new Date(date).toLocaleDateString();
}

function getRelativeLabel(startDate: string) {
    const now = new Date();
    const start = new Date(startDate);

    const diffMs = start.getTime() - now.getTime();
    const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));

    if (diffDays <= 0) return "Today";
    if (diffDays === 1) return "Tomorrow";
    return `In ${diffDays} days`;
}

export default function DashboardUpcoming({ items }: Props) {
    return (
        <div className="bg-white border border-slate-200 rounded-xl p-4 space-y-4">
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                    <img
                        src={nextThreeIcon}
                        alt=""
                        className="h-6 w-6 object-contain"
                    />
                    <h2 className="text-lg font-semibold text-slate-900">
                        Next three bookings
                    </h2>
                </div>

                <Link
                    to="/bookings"
                    className="text-sm text-blue-600 hover:underline"
                >
                    View all
                </Link>
            </div>

            {items.length === 0 && (
                <div className="text-sm text-slate-500">
                    No upcoming bookings
                </div>
            )}

            <ul className="divide-y divide-slate-100">
                {items.map((b) => (
                    <Link
                        key={b.id}
                        to={`/bookings?highlight=${b.id}`}
                        className="block"
                    >
                        <li
                            className="
                    py-3
                    px-2
                    rounded-md
                    hover:bg-slate-50
                    transition
                    cursor-pointer
                "
                        >
                            <div className="font-medium text-slate-800">
                                {b.room.name}
                            </div>
                            <div className="text-slate-500 text-sm flex items-center gap-2">
                                <span>
                                    {formatDate(b.startDate)} → {formatDate(b.endDate)}
                                </span>
                                <span className="text-xs bg-slate-100 px-2 py-0.5 rounded-full text-slate-600">
                                    {getRelativeLabel(b.startDate)}
                                </span>
                            </div>

                        </li>
                    </Link>
                ))}
            </ul>
        </div>
    );
}
