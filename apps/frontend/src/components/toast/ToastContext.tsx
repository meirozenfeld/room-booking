import { createContext, useContext, useState } from "react";
import type { ReactNode } from "react";
import ToastContainer from "./ToastContainer";

export type ToastType = "success" | "error" | "info";

export type Toast = {
    id: number;
    message: string;
    type: ToastType;
};

type ToastContextType = {
    showToast: (message: string, type?: ToastType) => void;
};

/**
 * Toast notification context
 * Provides global toast notification functionality
 */
const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function ToastProvider({ children }: { children: ReactNode }) {
    const [toasts, setToasts] = useState<Toast[]>([]);

    /**
     * Shows a toast notification
     * Automatically removes after 3 seconds
     */
    function showToast(message: string, type: ToastType = "info") {
        const id = Date.now();
        setToasts((prev) => [...prev, { id, message, type }]);

        setTimeout(() => {
            setToasts((prev) => prev.filter((t) => t.id !== id));
        }, 3000);
    }

    return (
        <ToastContext.Provider value={{ showToast }}>
            {children}
            <ToastContainer toasts={toasts} />
        </ToastContext.Provider>
    );
}

/**
 * Hook to access toast context
 * Must be used within ToastProvider
 */
export function useToast() {
    const ctx = useContext(ToastContext);
    if (!ctx) throw new Error("useToast must be used within ToastProvider");
    return ctx;
}
