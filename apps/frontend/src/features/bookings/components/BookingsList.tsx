import { type MyBooking } from "../../../api/bookings.api";
import BookingCard from "./BookingCard.tsx";

type Props = {
    bookings: MyBooking[];
    onChange: () => void;
};

/**
 * Bookings list component
 * Renders a grid of booking cards
 */
export default function BookingsList({ bookings, onChange }: Props) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {bookings.map((booking) => (
                <BookingCard
                    key={booking.id}
                    booking={booking}
                    onChange={onChange}
                />
            ))}
        </div>
    );
}
