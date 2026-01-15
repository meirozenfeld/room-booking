import AvailabilityModal from "../components/AvailabilityModal";
import AdminRoomsFilters from "../components/AdminRoomsFilters";
import { useAdminRooms } from "../hooks/useAdminRooms";
import { useState } from "react";
import type { AdminRoom } from "../api/admin.rooms.api";
import RoomFormModal from "../components/RoomFormModal";
import ConfirmDialog from "../../../components/ConfirmDialog";

export default function AdminRoomsPage() {
    const {
        rooms,
        search,
        status,
        minCapacity,
        setSearch,
        setStatus,
        setMinCapacity,
        toggle,
        clearFilters,
        toggleSort,
        sortBy,
        order,
        isFetching,
        isInitialLoading,
        createRoom,
        updateRoom,
    } = useAdminRooms();

    const [selectedRoomId, setSelectedRoomId] = useState<string | null>(null);
    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [editRoom, setEditRoom] = useState<AdminRoom | null>(null);
    const [roomToDelete, setRoomToDelete] = useState<AdminRoom | null>(null);

    if (isInitialLoading) {
        return <div className="p-6">Loading rooms…</div>;
    }
    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-semibold">Manage Rooms</h1>

            <AdminRoomsFilters
                search={search}
                status={status}
                minCapacity={minCapacity}
                onSearchChange={setSearch}
                onStatusChange={setStatus}
                onMinCapacityChange={setMinCapacity}
                onClear={clearFilters}
            />
            <button
                onClick={() => setIsCreateOpen(true)}
                className="btn-primary px-4"
            >
                + New Room
            </button>

            <table className="w-full border-collapse bg-white rounded-lg shadow">
                <thead className="bg-slate-100 text-left">
                    <tr>
                        <th
                            className="p-3 cursor-pointer"
                            onClick={() => toggleSort("name")}
                        >
                            <span className="inline-flex items-center gap-1">
                                Name
                                {sortBy !== "name" && <span className="text-xs text-slate-400">⬍</span>}
                                {sortBy === "name" && order === "asc" && <span>▲</span>}
                                {sortBy === "name" && order === "desc" && <span>▼</span>}
                            </span>
                        </th>

                        <th
                            className="p-3 cursor-pointer"
                            onClick={() => toggleSort("capacity")}
                        >
                            <span className="inline-flex items-center gap-1">
                                Capacity
                                {sortBy !== "capacity" && <span className="text-xs text-slate-400">⬍</span>}
                                {sortBy === "capacity" && order === "asc" && <span>▲</span>}
                                {sortBy === "capacity" && order === "desc" && <span>▼</span>}
                            </span>
                        </th>

                        <th
                            className="p-3 cursor-pointer"
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
                            <td colSpan={4} className="p-6 text-center text-slate-500">
                                Loading rooms...
                            </td>
                        </tr>
                    ) : rooms.length === 0 ? (
                        <tr>
                            <td colSpan={4} className="p-6 text-center text-slate-500">
                                No rooms found.
                            </td>
                        </tr>
                    ) : (
                        rooms.map((room) => (
                            <tr key={room.id} className="border-t border-slate-200">
                                <td className="p-3">{room.name}</td>
                                <td className="p-3">{room.capacity}</td>
                                <td className="p-3">
                                    {room.isActive ? "Active" : "Inactive"}
                                </td>
                                <td className="p-3 space-x-3">
                                    <button
                                        onClick={() => toggle(room.id)}
                                        className="text-sm text-blue-600 hover:underline"
                                    >
                                        {room.isActive ? "Deactivate" : "Activate"}
                                    </button>

                                    <button
                                        onClick={() => setSelectedRoomId(room.id)}
                                        className="text-sm text-slate-600 hover:underline"
                                    >
                                        Availability
                                    </button>
                                    <button
                                        onClick={() => setEditRoom(room)}
                                        className="text-sm text-slate-600 hover:underline"
                                    >
                                        Edit
                                    </button>
                                    <button
                                        onClick={() => setRoomToDelete(room)}
                                        className="text-sm text-red-600 hover:underline"
                                    >
                                        Delete
                                    </button>

                                </td>
                            </tr>
                        ))
                    )}
                </tbody>

            </table>

            {selectedRoomId && (
                <AvailabilityModal
                    roomId={selectedRoomId}
                    onClose={() => setSelectedRoomId(null)}
                />
            )}
            <RoomFormModal
                open={isCreateOpen}
                onClose={() => setIsCreateOpen(false)}
                title="Create Room"
                onSubmit={createRoom}
            />

            {editRoom && (
                <RoomFormModal
                    open={true}
                    title="Edit Room"
                    initialData={editRoom}
                    onClose={() => setEditRoom(null)}
                    onSubmit={(data) => updateRoom(editRoom.id, data)}
                />
            )}
            {roomToDelete && (
                <ConfirmDialog
                    open={true}
                    title="Delete this room?"
                    description={`Room "${roomToDelete.name}" will be deleted.`}
                    confirmText="Delete"
                    onCancel={() => setRoomToDelete(null)}
                    onConfirm={async () => {
                        await toggle(roomToDelete.id);
                        setRoomToDelete(null);
                    }}
                />
            )}
        </div>
    );
}
