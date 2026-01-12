import { useState } from "react";
import { createBooking } from "../api/bookings";

type Props = {
    roomId: string;
    roomName: string;
    startDate: string;
    endDate: string;
    onSuccess: () => void;
};

export default function ConfirmBooking({
    roomId,
    roomName,
    startDate,
    endDate,
    onSuccess,
}: Props) {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    async function handleConfirm() {
        try {
            setLoading(true);
            setError(null);

            await createBooking({
                roomId,
                startDate: new Date(startDate).toISOString(),
                endDate: new Date(endDate).toISOString(),
            });

            onSuccess();
        } catch (e: any) {
            if (e?.error) {
                setError("This room is no longer available for the selected dates");
            } else {
                setError("Booking failed");
            }
        } finally {
            setLoading(false);
        }
    }

    return (
        <div style={{ marginTop: 8 }}>
            <p>
                Confirm booking of <strong>{roomName}</strong> from{" "}
                {startDate} to {endDate}?
            </p>

            {error && <p style={{ color: "red" }}>{error}</p>}

            <button onClick={handleConfirm} disabled={loading}>
                {loading ? "Booking..." : "Confirm"}
            </button>
        </div>
    );
}
