export default function AdminSkeleton() {
    return (
        <div className="space-y-4 animate-pulse">
            <div className="h-6 w-40 bg-slate-200 rounded" />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="h-20 bg-slate-200 rounded-xl" />
                <div className="h-20 bg-slate-200 rounded-xl" />
            </div>
            <div className="h-40 bg-slate-200 rounded-xl" />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="h-24 bg-slate-200 rounded-xl" />
                <div className="h-24 bg-slate-200 rounded-xl" />
            </div>
        </div>
    );
}
