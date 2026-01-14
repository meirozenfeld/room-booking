import { useEffect, useState } from "react";
import { getMyBookings, type MyBooking } from "../../../api/bookings.api";
import type { Filters } from "../components/BookingsFilters";

/**
 * Custom hook for managing user bookings
 * Handles pagination, filtering, and tab switching
 * @param filters - Filter criteria for bookings
 * @param activeTab - Current active tab (upcoming/past/cancelled)
 * @param pageSize - Number of items per page
 */
export function useMyBookings(
    filters: Filters,
    activeTab: "upcoming" | "past" | "cancelled",
    pageSize = 6
) {
    const [bookings, setBookings] = useState<MyBooking[]>([]);
    const [page, setPage] = useState(1);
    const [debouncedSearch, setDebouncedSearch] = useState(filters.search);
    const [hasMore, setHasMore] = useState(true);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [counts, setCounts] = useState({
        upcoming: 0,
        past: 0,
        cancelled: 0,
    });

    // Debounce search input to avoid excessive API calls
    useEffect(() => {
        const id = setTimeout(() => {
            setDebouncedSearch(filters.search);
        }, 400);

        return () => clearTimeout(id);
    }, [filters.search]);

    /**
     * Loads a page of bookings from the API
     * @param nextPage - Page number to load
     */
    async function loadPage(nextPage: number) {
        try {
            setLoading(true);
            setError(null);

            const data = await getMyBookings({
                ...filters,
                section: activeTab,
                search: debouncedSearch,
                page: nextPage,
                pageSize,
            });



            setBookings((prev) =>
                nextPage === 1 ? data.items : [...prev, ...data.items]
            );
            if (data.counts) {
                setCounts(data.counts);
            }

            setHasMore(data.hasMore);
            setPage(nextPage);
        } catch {
            setError("Failed to load bookings");
        } finally {
            setLoading(false);
        }
    }

    // Reset all state when switching tabs
    useEffect(() => {
        setBookings([]);
        setPage(1);
        setHasMore(true);
    }, [activeTab]);

    // Reload bookings when filters or tab changes
    useEffect(() => {
        loadPage(1);
    }, [
        activeTab,
        debouncedSearch,
        filters.startDate,
        filters.endDate,
        filters.minCapacity,
        filters.sortBy,
        filters.order,
    ]);




    return {
        bookings,
        counts,
        loading,
        error,
        hasMore,
        loadMore: () => loadPage(page + 1),
        reload: () => loadPage(1),
    };

}
