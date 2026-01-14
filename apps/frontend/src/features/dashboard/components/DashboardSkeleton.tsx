/**
 * Dashboard skeleton loader component
 * Shows loading placeholders while dashboard data loads
 */
export default function DashboardSkeleton() {
    return (
        <div className="max-w-6xl mx-auto space-y-10 animate-pulse">
            {/* Header skeleton */}
            <div className="h-16 bg-slate-200 rounded-lg w-1/3" />

            {/* Stats skeleton */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="h-20 bg-slate-200 rounded-xl" />
                <div className="h-20 bg-slate-200 rounded-xl" />
            </div>

            {/* Upcoming bookings skeleton */}
            <div className="h-48 bg-slate-200 rounded-xl" />

            {/* Actions skeleton */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="h-24 bg-slate-200 rounded-xl" />
                <div className="h-24 bg-slate-200 rounded-xl" />
            </div>
        </div>
    );
}
