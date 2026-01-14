type Props = {
    open: boolean;
    title: string;
    description?: string;
    confirmText?: string;
    cancelText?: string;
    onConfirm: () => void;
    onCancel: () => void;
};

/**
 * Confirmation dialog component
 * Displays a modal for user confirmation before destructive actions
 */
export default function ConfirmDialog({
    open,
    title,
    description,
    confirmText = "Confirm",
    cancelText = "Cancel",
    onConfirm,
    onCancel,
}: Props) {
    if (!open) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
            <div className="w-full max-w-sm rounded-xl bg-white p-5 shadow-lg animate-scale-in">
                <h3 className="text-lg font-semibold text-slate-900">
                    {title}
                </h3>

                {description && (
                    <p className="mt-1 text-sm text-slate-600">
                        {description}
                    </p>
                )}

                <div className="mt-4 flex justify-end gap-2">
                    <button
                        onClick={onCancel}
                        className="btn-secondary text-sm"
                    >
                        {cancelText}
                    </button>

                    <button
                        onClick={onConfirm}
                        className="btn-danger-outline text-sm"
                    >
                        {confirmText}
                    </button>
                </div>
            </div>
        </div>
    );
}
