import type { Toast } from "./ToastContext";

/**
 * Toast style mapping by type
 */
const styles: Record<string, string> = {
    success: "bg-green-600",
    error: "bg-red-600",
    info: "bg-slate-800",
};

/**
 * Toast container component
 * Renders all active toast notifications
 */
export default function ToastContainer({ toasts }: { toasts: Toast[] }) {
    return (
        <div className="fixed bottom-6 right-6 space-y-3 z-50">
            {toasts.map((toast) => (
                <div
                    key={toast.id}
                    className={`text-white px-4 py-3 rounded-lg shadow-lg
                    animate-slide-in ${styles[toast.type]}`}
                >
                    {toast.message}
                </div>
            ))}
        </div>
    );
}
