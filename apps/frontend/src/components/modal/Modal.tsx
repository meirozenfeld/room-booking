import type { ReactNode } from "react";

type Props = {
    open: boolean;
    onClose: () => void;
    children: ReactNode;
};

/**
 * Modal dialog component
 * Displays content in a centered overlay with backdrop
 */
export default function Modal({ open, onClose, children }: Props) {
    if (!open) return null;

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center"
            aria-modal
            role="dialog"
        >
            {/* Backdrop - closes modal on click */}
            <div
                className="absolute inset-0 bg-black/40 backdrop-blur-sm"
                onClick={onClose}
            />

            {/* Modal content container */}
            <div className="relative z-10 w-full max-w-md bg-white rounded-2xl shadow-xl animate-scale-in">
                <button
                    onClick={onClose}
                    className="absolute top-3 right-3 text-slate-400 hover:text-slate-600"
                    aria-label="Close"
                >
                    ✕
                </button>

                <div className="p-6">{children}</div>
            </div>
        </div>
    );
}
