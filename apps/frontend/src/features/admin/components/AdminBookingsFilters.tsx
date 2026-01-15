type Props = {
    search: string;
    status: "ALL" | "CONFIRMED" | "CANCELLED";
    onSearchChange: (v: string) => void;
    onStatusChange: (v: "ALL" | "CONFIRMED" | "CANCELLED") => void;
    startDate?: string;
    endDate?: string;
    onStartDateChange: (v?: string) => void;
    onEndDateChange: (v?: string) => void;
    onClear: () => void;
};

/**
 * Admin bookings filters component
 * Provides search, status, and date range filters for bookings
 */
export default function AdminBookingsFilters({
    search,
    status,
    onSearchChange,
    onStatusChange,
    startDate,
    endDate,
    onStartDateChange,
    onEndDateChange,
    onClear,
}: Props) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-6 gap-4 bg-white p-4 rounded-lg shadow">
            {/* Search */}
            <div className="md:col-span-2">
                <label className="block text-sm text-slate-600 mb-1">
                    Search
                </label>
                <input
                    value={search}
                    onChange={(e) => onSearchChange(e.target.value)}
                    placeholder="User email or room name"
                    className="w-full border rounded px-3 py-2"
                />
            </div>

            {/* Start date */}
            <div>
                <label className="block text-sm text-slate-600 mb-1">
                    Start date
                </label>
                <input
                    type="date"
                    value={startDate || ""}
                    onChange={(e) =>
                        onStartDateChange(e.target.value || undefined)
                    }
                    className="w-full border rounded px-3 py-2"
                />
            </div>

            {/* End date */}
            <div>
                <label className="block text-sm text-slate-600 mb-1">
                    End date
                </label>
                <input
                    type="date"
                    value={endDate || ""}
                    onChange={(e) =>
                        onEndDateChange(e.target.value || undefined)
                    }
                    className="w-full border rounded px-3 py-2"
                />
            </div>

            {/* Status */}
            <div>
                <label className="block text-sm text-slate-600 mb-1">
                    Status
                </label>
                <select
                    value={status}
                    onChange={(e) =>
                        onStatusChange(e.target.value as any)
                    }
                    className="w-full border rounded px-3 py-2"
                >
                    <option value="ALL">All</option>
                    <option value="CONFIRMED">Confirmed</option>
                    <option value="CANCELLED">Cancelled</option>
                </select>
            </div>

            {/* Clear */}
            <div className="flex items-end">
                <button
                    onClick={onClear}
                    className="text-sm text-slate-600 hover:underline"
                >
                    Clear filters
                </button>
            </div>
        </div>
    );

}
