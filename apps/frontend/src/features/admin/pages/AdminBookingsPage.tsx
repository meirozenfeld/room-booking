import ConfirmDialog from "../../../components/ConfirmDialog";
import { useAdminBookings } from "../hooks/useAdminBookings";
import AdminBookingsFilters from "../components/AdminBookingsFilters";

/**
 * Admin page for managing all bookings
 * UI only – business logic handled by useAdminBookings hook
 */
export default function AdminBookingsPage() {
    const {
        bookings,
        page,
        confirmId,
        actionLoading,
        search,
        status,
        setSearch,
        setStatus,
        setPage,
        setConfirmId,
        confirmCancel,
        startDate,
        endDate,
        setStartDate,
        setEndDate,
        clearFilters,
        sortBy,
        order,
        toggleSort,
        isFetching,
        isInitialLoading,
    } = useAdminBookings();

    if (!isInitialLoading && bookings.length === 0) {
        return (
            <div className="space-y-4">
                <h1 className="text-2xl font-semibold">All Bookings</h1>

                <div className="rounded-lg bg-white p-6 text-slate-500 shadow">
                    No bookings found.
                </div>
            </div>
        );
    }


    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-semibold">All Bookings</h1>
            <AdminBookingsFilters
                search={search}
                status={status}
                startDate={startDate}
                endDate={endDate}
                onSearchChange={setSearch}
                onStatusChange={setStatus}
                onStartDateChange={setStartDate}
                onEndDateChange={setEndDate}
                onClear={clearFilters}
            />

            <table className="w-full border-collapse bg-white rounded-lg shadow">
                <thead className="bg-slate-100 text-left">
                    <tr>
                        <th
                            className="p-3 cursor-pointer select-none"
                            onClick={() => toggleSort("user")}
                        >
                            <span className="inline-flex items-center gap-1">
                                User
                                {sortBy !== "user" && <span className="text-xs text-slate-400">⬍</span>}
                                {sortBy === "user" && order === "asc" && <span>▲</span>}
                                {sortBy === "user" && order === "desc" && <span>▼</span>}
                            </span>
                        </th>
                        <th
                            className="p-3 cursor-pointer select-none"
                            onClick={() => toggleSort("room")}
                        >
                            <span className="inline-flex items-center gap-1">
                                Room
                                {sortBy !== "room" && <span className="text-xs text-slate-400">⬍</span>}
                                {sortBy === "room" && order === "asc" && <span>▲</span>}
                                {sortBy === "room" && order === "desc" && <span>▼</span>}
                            </span>
                        </th>
                        <th
                            className="p-3 cursor-pointer select-none"
                            onClick={() => toggleSort("startDate")}
                        >
                            <span className="inline-flex items-center gap-1">
                                Start
                                {sortBy !== "startDate" && <span className="text-xs text-slate-400">⬍</span>}
                                {sortBy === "startDate" && order === "asc" && <span>▲</span>}
                                {sortBy === "startDate" && order === "desc" && <span>▼</span>}
                            </span>                        </th>
                        <th
                            className="p-3 cursor-pointer select-none"
                            onClick={() => toggleSort("endDate")}
                        >
                            <span className="inline-flex items-center gap-1">
                                End
                                {sortBy !== "endDate" && <span className="text-xs text-slate-400">⬍</span>}
                                {sortBy === "endDate" && order === "asc" && <span>▲</span>}
                                {sortBy === "endDate" && order === "desc" && <span>▼</span>}
                            </span>                             </th>
                        <th
                            className="p-3 cursor-pointer select-none"
                            onClick={() => toggleSort("status")}
                        >
                            <span className="inline-flex items-center gap-1">
                                Status
                                {sortBy !== "status" && <span className="text-xs text-slate-400">⬍</span>}
                                {sortBy === "status" && order === "asc" && <span>▲</span>}
                                {sortBy === "status" && order === "desc" && <span>▼</span>}
                            </span>
                        </th>
                        <th className="p-3">Actions</th>
                    </tr>
                </thead>

                <tbody>
                    {isFetching ? (
                        <tr>
                            <td colSpan={6} className="p-6 text-center text-slate-500">
                                Loading bookings...
                            </td>
                        </tr>
                    ) : bookings.length === 0 ? (
                        <tr>
                            <td colSpan={6} className="p-6 text-center text-slate-500">
                                No bookings found.
                            </td>
                        </tr>
                    ) : (
                        bookings.map((b) => (
                            <tr key={b.id} className="border-t border-slate-200">
                                <td className="p-3">{b.user.email}</td>
                                <td className="p-3">{b.room.name}</td>
                                <td className="p-3">
                                    {new Date(b.startDate).toLocaleDateString()}
                                </td>
                                <td className="p-3">
                                    {new Date(b.endDate).toLocaleDateString()}
                                </td>
                                <td className="p-3">
                                    <span
                                        className={`inline-block rounded-full px-2 py-0.5 text-xs font-medium
                                        ${b.status === "CONFIRMED"
                                                ? "bg-green-100 text-green-700"
                                                : "bg-slate-200 text-slate-600"
                                            }`}
                                    >
                                        {b.status}
                                    </span>
                                </td>
                                <td className="p-3">
                                    {b.status === "CONFIRMED" ? (
                                        <button
                                            onClick={() => setConfirmId(b.id)}
                                            disabled={actionLoading}
                                            className="text-sm text-red-600 hover:underline disabled:opacity-50"
                                        >
                                            Cancel
                                        </button>
                                    ) : (
                                        <span className="text-sm text-slate-400">
                                            —
                                        </span>
                                    )}
                                </td>
                            </tr>
                        ))
                    )}
                </tbody>
            </table>

            <div className="flex justify-between">
                <button
                    disabled={page === 1}
                    onClick={() => setPage((p) => p - 1)}
                    className="text-sm disabled:opacity-50"
                >
                    Previous
                </button>

                <button
                    onClick={() => setPage((p) => p + 1)}
                    className="text-sm"
                >
                    Next
                </button>
            </div>

            <ConfirmDialog
                open={!!confirmId}
                title="Cancel booking?"
                description="This action cannot be undone."
                confirmText="Cancel booking"
                onConfirm={confirmCancel}
                onCancel={() => setConfirmId(null)}
            />
        </div>
    );
}
