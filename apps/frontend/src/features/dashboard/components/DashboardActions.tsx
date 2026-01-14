import ActionCard from "./ActionCard";
import findRoomsIcon from "../../../assets/icons/find_rooms.png";
import myBookingsIcon from "../../../assets/icons/my_bookings.png";

export default function DashboardActions() {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <ActionCard
                title="Find a room"
                description="Search for available rooms and make a booking"
                icon={findRoomsIcon}
                to="/rooms"
            />

            <ActionCard
                title="My bookings"
                description="View and manage your existing bookings"
                icon={myBookingsIcon}
                to="/bookings"
            />

        </div>
    );
}
