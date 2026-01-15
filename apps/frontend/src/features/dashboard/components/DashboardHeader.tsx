type Props = {
    greeting: string;
    name: string;
};

/**
 * Dashboard header component
 * Displays app logo and personalized greeting
 */
export default function DashboardHeader({ greeting, name }: Props) {
    return (
        <div className="space-y-3">
            {/* App identity */}
            <div className="flex items-center gap-2">
                <img
                    src="/title.png"
                    alt="Room Check Point"
                    className="h-20 w-80 object-contain"
                />

            </div>

            {/* Greeting */}
            <div>
                <p className="text-lg text-slate-700">
                    {greeting}, <span className="font-medium">{name}</span>
                </p>

                <p className="text-sm text-slate-500">
                    Manage your rooms and bookings in one place
                </p>
            </div>
        </div>
    );
}
