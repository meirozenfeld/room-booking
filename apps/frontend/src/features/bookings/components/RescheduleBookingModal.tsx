import { useState } from "react";
import Modal from "../../../components/modal/Modal";
import { rescheduleBooking } from "../../../api/bookings.api";
import { formatDate } from "../../../utils/date";
import { useToast } from "../../../components/toast/ToastContext";

type Props = {
    open: boolean;
    onClose: () => void;
    bookingId: string;
    roomName: string;
    initialStartDate: string;
    initialEndDate: string;
    onSuccess: () => void;
};

/**
 * Reschedule booking modal component
 * Allows users to change booking dates
 */
export default function RescheduleBookingModal({
    open,
    onClose,
    bookingId,
    roomName,
    initialStartDate,
    initialEndDate,
    onSuccess,
}: Props) {
    const { showToast } = useToast();

    const [startDate, setStartDate] = useState(initialStartDate.slice(0, 10));
    const [endDate, setEndDate] = useState(initialEndDate.slice(0, 10));
    const [loading, setLoading] = useState(false);

    /**
     * Validates and saves new booking dates
     */
    async function handleSave() {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        if (!startDate || !endDate) {
            showToast("Please select both start and end dates", "error");
            return;
        }

        if (new Date(startDate) < today) {
            showToast("Start date cannot be in the past", "error");
            return;
        }

        if (endDate < startDate) {
            showToast("End date must be after start date", "error");
            return;
        }


        try {
            setLoading(true);
            await rescheduleBooking({
                id: bookingId,
                startDate,
                endDate,
            });

            showToast("Booking updated", "success");
            onSuccess();
            onClose();
        } catch {
            showToast("Room is not available for the selected dates", "error");
        } finally {
            setLoading(false);
        }
    }

    return (
        <Modal open={open} onClose={onClose}>
            <h2 className="text-lg font-semibold text-slate-800 mb-4">
                Change booking dates
            </h2>

            <div className="space-y-4">
                <div className="text-sm text-slate-600">
                    <span className="font-medium">{roomName}</span>
                    <br />
                    Current: {formatDate(initialStartDate)} →{" "}
                    {formatDate(initialEndDate)}
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm text-slate-600 mb-1">
                            Start date
                        </label>
                        <input
                            type="date"
                            value={startDate}
                            onChange={(e) => setStartDate(e.target.value)}
                            className="input w-full"
                        />
                    </div>

                    <div>
                        <label className="block text-sm text-slate-600 mb-1">
                            End date
                        </label>
                        <input
                            type="date"
                            value={endDate}
                            onChange={(e) => setEndDate(e.target.value)}
                            className="input w-full"
                        />
                    </div>
                </div>

                <div className="flex gap-3 pt-4">
                    <button
                        onClick={onClose}
                        className="btn-secondary flex-1"
                        disabled={loading}
                    >
                        Cancel
                    </button>

                    <button
                        onClick={handleSave}
                        className="btn-primary flex-1"
                        disabled={loading}
                    >
                        {loading ? "Saving..." : "Save changes"}
                    </button>
                </div>
            </div>
        </Modal>
    );
}
