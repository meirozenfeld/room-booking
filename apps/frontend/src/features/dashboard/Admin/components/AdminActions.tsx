import ActionCard from "../../components/ActionCard"; 
import manageRoomsIcon from "../../../../assets/icons/manage_rooms.png";
import allBookingsIcon from "../../../../assets/icons/all_bookings.png";

export default function AdminActions() {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <ActionCard
                title="Manage rooms"
                description="Create, edit and manage all rooms"
                icon={manageRoomsIcon}
                to="/admin/rooms"
            />

            <ActionCard
                title="All bookings"
                description="View and manage bookings from all users"
                icon={allBookingsIcon}
                to="/admin/bookings"
            />
        </div>
    );
}
