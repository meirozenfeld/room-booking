type Props = {
    search: string;
    status: "ALL" | "ACTIVE" | "INACTIVE";
    minCapacity?: number;
    onSearchChange: (v: string) => void;
    onStatusChange: (v: "ALL" | "ACTIVE" | "INACTIVE") => void;
    onMinCapacityChange: (v?: number) => void;
    onClear: () => void;
};

/**
 * Admin rooms filters component
 * Provides search, status, and minimum capacity filters for rooms
 */
export default function AdminRoomsFilters({
    search,
    status,
    minCapacity,
    onSearchChange,
    onStatusChange,
    onMinCapacityChange,
    onClear,
}: Props) {
    return (
        <div className="flex flex-wrap gap-3 items-end bg-white p-4 rounded-lg shadow">
            <input
                type="text"
                placeholder="Search room..."
                value={search}
                onChange={(e) => onSearchChange(e.target.value)}
                className="border rounded px-3 py-2"
            />

            <select
                value={status}
                onChange={(e) =>
                    onStatusChange(e.target.value as any)
                }
                className="border rounded px-3 py-2"
            >
                <option value="ALL">All</option>
                <option value="ACTIVE">Active</option>
                <option value="INACTIVE">Inactive</option>
            </select>

            <input
                type="number"
                min={1}
                placeholder="Min capacity"
                value={minCapacity ?? ""}
                onChange={(e) =>
                    onMinCapacityChange(
                        e.target.value ? Number(e.target.value) : undefined
                    )
                }
                className="border rounded px-3 py-2 w-36"
            />

            <button
                onClick={onClear}
                className="text-sm text-slate-600 hover:underline"
            >
                Clear filters
            </button>
        </div>
    );
}
