export default function RoomCardSkeleton() {
    return (
        <div className="bg-white rounded-2xl shadow p-6 animate-pulse">
            <div className="h-5 bg-slate-200 rounded w-2/3 mb-4" />
            <div className="h-4 bg-slate-200 rounded w-1/3 mb-6" />
            <div className="h-10 bg-slate-200 rounded" />
        </div>
    );
}
