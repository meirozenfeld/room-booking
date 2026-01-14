import { useMyBookings } from "../hooks/useMyBookings";
import BookingsList from "../components/BookingsList.tsx";
import BookingsTabs from "../components/BookingsTabs";
import BookingsListSkeleton from "../components/BookingsListSkeleton.tsx";
import BookingsFilters from "../components/BookingsFilters";
import type { Filters } from "../components/BookingsFilters";
import { useState } from "react";

/**
 * My Bookings page component
 * Displays user's bookings with filtering, sorting, and pagination
 */
export default function MyBookingsPage() {
    const [activeTab, setActiveTab] = useState<
        "upcoming" | "past" | "cancelled"
    >("upcoming");

    const [fadeKey, setFadeKey] = useState(0);

    const [filters, setFilters] = useState<Filters>({
        search: "",
        sortBy: "createdAt",
        order: "desc",
    });

    const { bookings, counts, loading, error, hasMore, loadMore, reload } = useMyBookings(filters, activeTab);

    /**
     * Resets all filters to default values
     */
    function clearFilters() {
        setFilters({
            search: "",
            sortBy: "createdAt",
            order: "desc",
        });
    }


    return (
        <div className="max-w-6xl mx-auto px-4 py-8 space-y-6">
            <header className="space-y-1">
                <h1 className="text-2xl font-semibold text-slate-900">
                    My bookings
                </h1>
                <p className="text-slate-500 text-sm">
                    Manage your upcoming and past room bookings
                </p>
            </header>
            <BookingsFilters
                filters={filters}
                onChange={setFilters}
                onClear={clearFilters}
            />
            <BookingsTabs
                active={activeTab}
                onChange={(tab) => {
                    setActiveTab(tab);
                    setFadeKey((k) => k + 1);
                }}
                counts={counts}
            />


            {loading && bookings.length === 0 && <BookingsListSkeleton />}

            {error && (
                <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-red-700">
                    {error}
                </div>
            )}

            {!loading && bookings.length === 0 && (
                <div className="rounded-lg border border-slate-200 bg-slate-50 p-8 text-center text-slate-600">
                    No bookings found for this section.
                </div>
            )}


            {bookings.length > 0 && (
                <>
                    <div
                        key={fadeKey}
                        className="animate-fade-in"
                    >
                        <BookingsList bookings={bookings} onChange={reload} />
                    </div>

                    {hasMore && (
                        <div className="flex justify-center pt-4">
                            <button
                                onClick={loadMore}
                                disabled={loading}
                                className="btn-secondary"
                            >
                                {loading ? "Loading..." : "Load more"}
                            </button>
                        </div>
                    )}


                </>
            )}
        </div>
    );
}
