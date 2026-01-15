import { useEffect, useState } from "react";
import {
    getAdminBookings,
    cancelAdminBooking,
    type AdminBooking,
} from "../api/admin.bookings.api";
import { useToast } from "../../../components/toast/ToastContext";
import { useDebounce } from "../../../utils/useDebounce";

export type SortBy = "user" | "room" | "startDate" | "endDate" | "status";
type SortOrder = "asc" | "desc";

/**
 * Custom hook for managing admin bookings
 * Handles fetching, filtering, sorting, pagination, and cancellation
 */
export function useAdminBookings() {
    const [bookings, setBookings] = useState<AdminBooking[]>([]);
    const [isInitialLoading, setIsInitialLoading] = useState(true);
    const [isFetching, setIsFetching] = useState(false);
    const [page, setPage] = useState(1);
    const [confirmId, setConfirmId] = useState<string | null>(null);
    const [actionLoading, setActionLoading] = useState(false);
    const [search, setSearch] = useState("");
    const [status, setStatus] = useState<"CONFIRMED" | "CANCELLED" | "ALL">("ALL");
    const debouncedSearch = useDebounce(search, 400);
    const [startDate, setStartDate] = useState<string | undefined>();
    const [endDate, setEndDate] = useState<string | undefined>();
    const [sortBy, setSortBy] = useState<SortBy | undefined>();
    const [order, setOrder] = useState<SortOrder>("asc");

    const { showToast } = useToast();

    // Reload bookings when filters, pagination, or sorting changes
    useEffect(() => {
        load();
    }, [page, debouncedSearch, status, startDate, endDate, sortBy, order]);

    // Reset to first page when search or status changes
    useEffect(() => {
        setPage(1);
    }, [search, status]);

    /**
     * Clears all filter values and resets to defaults
     */
    function clearFilters() {
        setSearch("");
        setStatus("ALL");
        setStartDate(undefined);
        setEndDate(undefined);
        setPage(1);
    }

    /**
     * Loads bookings from API with current filters and pagination
     */
    async function load() {
        setIsFetching(true);

        const res = await getAdminBookings({
            page,
            pageSize: 10,
            search: debouncedSearch || undefined,
            status: status === "ALL" ? undefined : status,
            startDate,
            endDate,
            sortBy,
            order,
        });

        setBookings(res.data);
        setIsFetching(false);
        setIsInitialLoading(false);
    }

    /**
     * Cancels a booking by ID
     * Shows success/error toast and reloads bookings
     */
    async function confirmCancel() {
        if (!confirmId) return;

        try {
            setActionLoading(true);
            await cancelAdminBooking(confirmId);
            showToast("Booking cancelled successfully", "success");
            await load();
        } catch {
            showToast("Failed to cancel booking", "error");
        } finally {
            setActionLoading(false);
            setConfirmId(null);
        }
    }

    /**
     * Toggles sorting for a field
     * Cycle: no sort → asc → desc → no sort
     * @param field - Field to sort by
     */
    function toggleSort(field: SortBy) {
        setPage(1);

        // No sort or sorting by different column - set to ascending
        if (sortBy !== field) {
            setSortBy(field);
            setOrder("asc");
            return;
        }

        // Toggle from ascending to descending
        if (order === "asc") {
            setOrder("desc");
            return;
        }

        // Toggle from descending to no sort
        setSortBy(undefined);
        setOrder("asc"); // Default value, not used when sortBy is undefined
    }


    return {
        bookings,
        page,
        confirmId,
        actionLoading,
        search,
        status,
        sortBy,
        order,
        setSortBy,
        setOrder,
        toggleSort,
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
        isFetching,
        isInitialLoading,
    };


}
