export type Filters = {
    search: string;
    startDate?: string;
    endDate?: string;
    minCapacity?: number;
    sortBy?: "roomName" | "startDate" | "createdAt";
    order?: "asc" | "desc";
};

type Props = {
    filters: Filters;
    onChange: (next: Filters) => void;
    onClear: () => void;
};

/**
 * Bookings filters component
 * Provides search, date range, capacity, and sorting filters
 */
export default function BookingsFilters({ filters, onChange, onClear }: Props) {
    // Check if any filters are active (non-default values)
    const hasActiveFilters =
        filters.search ||
        filters.startDate ||
        filters.endDate ||
        filters.minCapacity ||
        filters.sortBy !== "createdAt" ||
        filters.order !== "desc";

    return (
        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                <input
                    type="text"
                    placeholder="Search room name"
                    value={filters.search}
                    onChange={(e) =>
                        onChange({ ...filters, search: e.target.value })
                    }
                    className="input"
                />

                <input
                    type="date"
                    value={filters.startDate ?? ""}
                    onChange={(e) =>
                        onChange({ ...filters, startDate: e.target.value || undefined })
                    }
                    className="input"
                />

                <input
                    type="date"
                    value={filters.endDate ?? ""}
                    onChange={(e) =>
                        onChange({ ...filters, endDate: e.target.value || undefined })
                    }
                    className="input"
                />

                <input
                    type="number"
                    min={1}
                    placeholder="Min capacity"
                    value={filters.minCapacity ?? ""}
                    onChange={(e) =>
                        onChange({
                            ...filters,
                            minCapacity: e.target.value
                                ? Number(e.target.value)
                                : undefined,
                        })
                    }
                    className="input"
                />
                <select
                    value={`${filters.sortBy ?? "createdAt"}:${filters.order ?? "desc"}`}
                    onChange={(e) => {
                        const [sortBy, order] = e.target.value.split(":");
                        onChange({
                            ...filters,
                            sortBy: sortBy as Filters["sortBy"],
                            order: order as Filters["order"],
                        });
                    }}
                    className="input"
                >
                    <option value="createdAt:desc">Newest first</option>
                    <option value="createdAt:asc">Oldest first</option>
                    <option value="roomName:asc">Room name A–Z</option>
                    <option value="roomName:desc">Room name Z–A</option>
                    <option value="startDate:asc">Start date ↑</option>
                    <option value="startDate:desc">Start date ↓</option>
                </select>
                {hasActiveFilters && (
                    <div className="flex justify-start pt-1">
                        <button
                            onClick={onClear}
                            className="btn-secondary text-sm"
                        >
                            Clear filters
                        </button>
                    </div>
                )}


            </div>
        </div>
    );
}
