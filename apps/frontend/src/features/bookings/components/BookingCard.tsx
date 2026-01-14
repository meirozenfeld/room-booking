import { type MyBooking, cancelBooking } from "../../../api/bookings.api";
import { formatDate } from "../../../utils/date";
import { useToast } from "../../../components/toast/ToastContext";
import { useState } from "react";
import RescheduleBookingModal from "./RescheduleBookingModal";
import ConfirmDialog from "../../../../src/components/ConfirmDialog";

type Props = {
    booking: MyBooking;
    onChange: () => void;
};

export default function BookingCard({ booking, onChange }: Props) {
    const { showToast } = useToast();
    const [loading, setLoading] = useState(false);
    const [rescheduleOpen, setRescheduleOpen] = useState(false);
    const [confirmOpen, setConfirmOpen] = useState(false);

    const isCancelled = booking.status === "CANCELLED";
    const isPast = new Date(booking.endDate) < new Date();

    async function confirmCancel() {
        try {
            setLoading(true);
            await cancelBooking(booking.id);
            showToast("Booking cancelled", "success");
            onChange();
        } catch {
            showToast("Failed to cancel booking", "error");
        } finally {
            setLoading(false);
            setConfirmOpen(false);
        }
    }


    return (
        <div
            className={`
                rounded-xl border border-slate-200 bg-white p-4 animate-scale-in
                ${isCancelled
                    ? "border-slate-200 opacity-60"
                    : "border-slate-200 hover:shadow-md"}
            `}
        >
            {/* Header */}
            <div className="flex items-start justify-between gap-4">
                <div>
                    <h3 className="text-lg font-semibold text-slate-900">
                        {booking.room.name}
                    </h3>

                    <p className="text-sm text-slate-500">
                        Capacity: {booking.room.capacity}
                    </p>
                </div>

                <span
                    className={`text-xs px-3 py-1 rounded-full font-medium
                        ${booking.status === "CONFIRMED"
                            ? "bg-green-100 text-green-700"
                            : "bg-slate-200 text-slate-600"}
                    `}
                >
                    {booking.status}
                </span>
            </div>

            {/* Dates */}
            <div className="text-sm text-slate-700">
                {formatDate(booking.startDate)} → {formatDate(booking.endDate)}
            </div>

            {/* Cancelled message */}
            {isCancelled && (
                <div className="text-sm text-slate-500 italic">
                    This booking was cancelled
                </div>
            )}
            {isPast && !isCancelled && (
                <div className="text-sm text-slate-500 italic">
                    This booking has ended
                </div>
            )}

            {/* Actions */}
            {!isCancelled && !isPast && (
                <div className="flex items-center gap-2 pt-3">
                    <button
                        onClick={() => setRescheduleOpen(true)}
                        className="btn-secondary text-sm flex items-center gap-1"
                    >
                        Change dates
                    </button>
                    <button
                        onClick={() => setConfirmOpen(true)}
                        disabled={loading}
                        className="btn-danger-outline text-sm flex items-center gap-1"
                    >
                        Cancel
                    </button>
                </div>

            )}


            <RescheduleBookingModal
                open={rescheduleOpen}
                onClose={() => setRescheduleOpen(false)}
                bookingId={booking.id}
                roomName={booking.room.name}
                initialStartDate={booking.startDate}
                initialEndDate={booking.endDate}
                onSuccess={onChange}
            />
            <ConfirmDialog
                open={confirmOpen}
                title="Cancel booking?"
                description="This action cannot be undone."
                confirmText="Yes, cancel"
                onCancel={() => setConfirmOpen(false)}
                onConfirm={confirmCancel}
            />

        </div>
    );
}
