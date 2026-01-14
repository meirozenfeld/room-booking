import logo from "../../../assets/logo.png";

type Props = {
    greeting: string;
    name: string;
};

export default function DashboardHeader({ greeting, name }: Props) {
    return (
        <div className="space-y-3">
            {/* App identity */}
            <div className="flex items-center gap-1">
                <img
                    src={logo}
                    alt="Room Check Point"
                    className="h-20 w-20 object-contain"
                />

                <h1 className="text-3xl font-bold text-slate-900">
                    Room Check Point
                </h1>
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
