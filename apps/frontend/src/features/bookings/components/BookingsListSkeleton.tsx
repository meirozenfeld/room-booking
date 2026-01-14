/**
 * Bookings list skeleton loader component
 * Shows loading placeholders for booking cards
 */
export default function BookingsListSkeleton() {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {Array.from({ length: 6 }).map((_, i) => (
                <div
                    key={i}
                    className="h-40 rounded-xl bg-slate-100 animate-pulse"
                />
            ))}
        </div>
    );
}
