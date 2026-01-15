import nextThreeIcon from "../../../../assets/icons/next_three_bookings.png";
import { Link } from "react-router-dom";

type Booking = {
    id: string;
    startDate: string;
    endDate: string;
    room: {
        name: string;
    };
    user: {
        email: string;
    };
};

function formatDate(date: string) {
    return new Date(date).toLocaleDateString("en-GB");
}

function getRelativeLabel(startDate: string) {
    const now = new Date();
    const start = new Date(startDate);
    const diffDays = Math.ceil(
        (start.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
    );

    if (diffDays <= 0) return "Today";
    if (diffDays === 1) return "Tomorrow";
    return `In ${diffDays} days`;
}

export default function AdminUpcoming({ items }: { items: Booking[] }) {
    return (
        <div className="bg-white border border-slate-200 rounded-xl p-4 space-y-4">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <img
                        src={nextThreeIcon}
                        alt=""
                        className="h-6 w-6 object-contain"
                    />
                    <h2 className="text-lg font-semibold text-slate-900">
                        Next three bookings (all users)
                    </h2>
                </div>

                <Link
                    to="/admin/bookings"
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
                    <li
                        key={b.id}
                        className="py-3 px-2 rounded-md hover:bg-slate-50 transition"
                    >
                        <div className="font-medium text-slate-800">
                            {b.room.name}
                        </div>

                        <div className="text-xs text-slate-500">
                            {b.user.email}
                        </div>

                        <div className="text-slate-500 text-sm flex items-center gap-2">
                            <span>
                                {formatDate(b.startDate)} →{" "}
                                {formatDate(b.endDate)}
                            </span>
                            <span className="text-xs bg-slate-100 px-2 py-0.5 rounded-full">
                                {getRelativeLabel(b.startDate)}
                            </span>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
}
