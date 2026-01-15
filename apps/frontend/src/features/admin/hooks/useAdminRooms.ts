import { useEffect, useState } from "react";
import {
    getAdminRooms,
    toggleAdminRoom,
    type AdminRoom,
} from "../api/admin.rooms.api";
import { useDebounce } from "../../../utils/useDebounce";
import { useToast } from "../../../components/toast/ToastContext";
import {
    createAdminRoom,
    updateAdminRoom,
} from "../api/admin.rooms.api";

/**
 * Custom hook for managing admin rooms
 * Handles fetching, filtering, sorting, creating, updating, and toggling room status
 */
export function useAdminRooms() {
    const [rooms, setRooms] = useState<AdminRoom[]>([]);
    const [isInitialLoading, setIsInitialLoading] = useState(true);
    const [isFetching, setIsFetching] = useState(false);
    const [search, setSearch] = useState("");
    const [status, setStatus] = useState<"ALL" | "ACTIVE" | "INACTIVE">("ALL");
    const [minCapacity, setMinCapacity] = useState<number | undefined>();
    const [sortBy, setSortBy] =
        useState<"name" | "capacity" | "status" | undefined>();
    const [order, setOrder] = useState<"asc" | "desc" | undefined>(undefined);

    const debouncedSearch = useDebounce(search, 400);
    const { showToast } = useToast();

    // Reload rooms when filters or sorting changes
    useEffect(() => {
        load();
    }, [debouncedSearch, status, minCapacity, sortBy, order]);

    /**
     * Loads rooms from API with current filters and sorting
     */
    async function load() {
        setIsFetching(true);
        const res = await getAdminRooms({
            search: debouncedSearch || undefined,
            status: status === "ALL" ? undefined : status,
            minCapacity,
            sortBy,
            order,
        });
        setRooms(res.rooms);
        setIsFetching(false);
        setIsInitialLoading(false);
    }

    /**
     * Creates a new room
     * @param data - Room name and capacity
     */
    async function createRoom(data: { name: string; capacity: number }) {
        try {
            await createAdminRoom(data);
            showToast("Room created", "success");
            await load();
        } catch {
            showToast("Failed to create room", "error");
        }
    }

    /**
     * Updates an existing room
     * @param id - Room ID
     * @param data - Updated room name and/or capacity
     */
    async function updateRoom(
        id: string,
        data: { name: string; capacity: number }
    ) {
        try {
            await updateAdminRoom(id, data);
            showToast("Room updated", "success");
            await load();
        } catch {
            showToast("Failed to update room", "error");
        }
    }

    /**
     * Toggles room active/inactive status
     * @param roomId - Room ID to toggle
     */
    async function toggle(roomId: string) {
        try {
            await toggleAdminRoom(roomId);
            showToast("Room status updated", "success");
            await load();
        } catch {
            showToast("Failed to update room", "error");
        }
    }

    /**
     * Clears all filter values and resets to defaults
     */
    function clearFilters() {
        setSearch("");
        setStatus("ALL");
        setMinCapacity(undefined);
    }

    /**
     * Toggles sorting for a field
     * Cycle: no sort → asc → desc → no sort
     * @param field - Field to sort by
     */
    function toggleSort(field: "name" | "capacity" | "status") {
        if (!sortBy || sortBy !== field) {
            setSortBy(field);
            setOrder("asc");
            return;
        }

        if (order === "asc") {
            setOrder("desc");
            return;
        }

        setSortBy(undefined);
        setOrder(undefined);
    }


    return {
        rooms,
        search,
        status,
        minCapacity,
        setSearch,
        setStatus,
        setMinCapacity,
        toggle,
        clearFilters,
        sortBy,
        order,
        setSortBy,
        setOrder,
        toggleSort,
        isFetching,
        isInitialLoading,
        createRoom,
        updateRoom,
    };
}
