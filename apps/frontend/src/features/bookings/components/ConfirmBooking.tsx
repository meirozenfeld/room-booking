import { useState } from "react";
import { createBooking } from "../../../../src/api/bookings.api";
import ConfirmBookingSkeleton from "./ConfirmBookingSkeleton";
import { formatDate } from "../../../utils/date";

type Props = {
    roomId: string;
    roomName: string;
    startDate: string;
    endDate: string;
    onSuccess: () => void;
    onError?: (message: string) => void;
};

/**
 * Booking confirmation component
 * Displays booking details and handles booking creation
 */
export default function ConfirmBooking({
    roomId,
    roomName,
    startDate,
    endDate,
    onSuccess,
    onError,
}: Props) {
    const [loading, setLoading] = useState(false);

    /**
     * Handles booking confirmation
     * Creates the booking via API
     */
    async function handleConfirm() {
        try {
            setLoading(true);

            await createBooking({
                roomId,
                startDate: new Date(startDate).toISOString(),
                endDate: new Date(endDate).toISOString(),
            });

            onSuccess();
        } catch {
            onError?.(
                "This room is no longer available for the selected dates"
            );
        } finally {
            setLoading(false);
        }
    }

    if (loading) {
        return <ConfirmBookingSkeleton />;
    }

    return (

        <div className="mt-4 rounded-xl border border-slate-200 bg-slate-50 p-4 space-y-4">
            <div className="text-sm text-slate-700">
                Confirm booking of{" "}
                <span className="font-semibold">{roomName}</span>
                <br />
                <span className="text-slate-500">
                    {formatDate(startDate)} → {formatDate(endDate)}
                </span>

            </div>

            <div className="flex gap-3">
                <button
                    onClick={handleConfirm}
                    disabled={loading}
                    className="btn-primary flex-1"
                >
                    {loading ? "Booking..." : "Confirm booking"}
                </button>
            </div>
        </div>
    );

}
