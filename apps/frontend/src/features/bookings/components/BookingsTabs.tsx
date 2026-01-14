type Tab = "upcoming" | "past" | "cancelled";

type Props = {
    active: Tab;
    onChange: (tab: Tab) => void;
    counts: Record<Tab, number>;
};


const tabs: { key: Tab; label: string }[] = [
    { key: "upcoming", label: "Upcoming" },
    { key: "past", label: "Past" },
    { key: "cancelled", label: "Cancelled" },
];

export default function BookingsTabs({ active, onChange, counts }: Props) {
    return (
        <div className="flex gap-2">
            {tabs.map((tab) => (
                <button
                    key={tab.key}
                    onClick={() => onChange(tab.key)}
                    className={`
        flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition
        ${active === tab.key
                            ? "bg-slate-900 text-white"
                            : "bg-white border border-slate-200 text-slate-700 hover:bg-slate-50"}
    `}
                >
                    <span>{tab.label}</span>

                    <span
                        className={`
            text-xs px-2 py-0.5 rounded-full
            ${active === tab.key
                                ? "bg-white/20 text-white"
                                : "bg-slate-100 text-slate-600"}
        `}
                    >
                        {counts[tab.key]}
                    </span>
                </button>

            ))}
        </div>
    );
}
