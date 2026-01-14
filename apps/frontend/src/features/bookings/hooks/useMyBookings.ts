import { useEffect, useState } from "react";
import { getMyBookings, type MyBooking } from "../../../api/bookings.api";
import type { Filters } from "../components/BookingsFilters";


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

    useEffect(() => {
        const id = setTimeout(() => {
            setDebouncedSearch(filters.search);
        }, 400);

        return () => clearTimeout(id);
    }, [filters.search]);

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
    useEffect(() => {
        // איפוס מלא כשעוברים טאב
        setBookings([]);
        setPage(1);
        setHasMore(true);
    }, [activeTab]);
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
