import { useRoomAvailability } from "../hooks/useRoomAvailability";
import ConfirmDialog from "../../../components/ConfirmDialog";
import { useState } from "react";

type Props = {
    roomId: string;
    onClose: () => void;
};

/**
 * Availability management modal (UI only)
 * Business logic is handled by useRoomAvailability hook
 */
export default function AvailabilityModal({ roomId, onClose }: Props) {
    const {
        blocks,
        startDate,
        endDate,
        error,
        loading,
        setStartDate,
        setEndDate,
        block,
        unblock,
        unblockAll,
    } = useRoomAvailability(roomId);

    const [confirmOpen, setConfirmOpen] = useState(false);

    return (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl p-6 w-full max-w-md space-y-4">
                <h2 className="text-lg font-semibold">
                    Manage Availability
                </h2>

                {error && (
                    <div className="rounded-md bg-red-50 text-red-700 px-3 py-2 text-sm">
                        {error}
                    </div>
                )}

                <div className="flex gap-2">
                    <input
                        type="date"
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                        className="border rounded px-2 py-1 flex-1"
                    />
                    <input
                        type="date"
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                        className="border rounded px-2 py-1 flex-1"
                    />
                </div>

                <div className="flex gap-2">
                    <button
                        onClick={block}
                        disabled={loading}
                        className="flex-1 bg-slate-800 text-white py-1 rounded disabled:opacity-50"
                    >
                        {loading ? "Processing..." : "Block"}
                    </button>

                    <button
                        onClick={unblock}
                        disabled={loading}
                        className="flex-1 border rounded py-1 disabled:opacity-50"
                    >
                        {loading ? "Processing..." : "Unblock"}
                    </button>
                    <button
                        disabled={blocks.length === 0 || loading}
                        onClick={() => setConfirmOpen(true)}
                        className="flex-1 border rounded py-1 disabled:opacity-50"
                    >
                        Unblock all dates
                    </button>
                </div>


                <div className="text-sm text-slate-600">
                    Blocked dates:
                </div>

                {blocks.length === 0 ? (
                    <div className="text-sm text-slate-500 italic">
                        No blocked dates for this room.
                    </div>
                ) : (
                    <ul className="text-sm space-y-1 max-h-32 overflow-auto">
                        {blocks.map((b) => (
                            <li key={b.date}>
                                {new Date(b.date).toLocaleDateString("en-GB")}
                            </li>
                        ))}
                    </ul>
                )}

                <button
                    onClick={onClose}
                    className="text-sm text-slate-500 hover:underline"
                >
                    Close
                </button>
            </div>
            <ConfirmDialog
                open={confirmOpen}
                title="Unblock all dates?"
                description="This will remove all blocked dates for this room. This action cannot be undone."
                confirmText="Unblock all"
                cancelText="Cancel"
                onCancel={() => setConfirmOpen(false)}
                onConfirm={async () => {
                    setConfirmOpen(false);
                    await unblockAll();
                }}
            />
        </div>
    );
}
