import type { Room } from "../../../api/rooms.api";
import RoomCard from "./RoomCard";
import BookingModal from "../../bookings/components/BookingModal";

type Props = {
    rooms: Room[];
    startDate: string;
    endDate: string;
    selectedRoomId: string | null;
    onSelectRoom: (roomId: string | null) => void;
    onBookingSuccess: () => void;
};

export default function RoomsList({
    rooms,
    startDate,
    endDate,
    selectedRoomId,
    onSelectRoom,
    onBookingSuccess,
}: Props) {
    return (
        <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {rooms.map((room) => (
                    <RoomCard
                        key={room.id}
                        room={room}
                        canBook={Boolean(startDate && endDate)}
                        onBook={() => onSelectRoom(room.id)}
                    />
                ))}
            </div>

            <BookingModal
                open={Boolean(selectedRoomId)}
                onClose={() => onSelectRoom(null)}
                roomId={selectedRoomId ?? ""}
                roomName={
                    rooms.find((r) => r.id === selectedRoomId)?.name ?? ""
                }
                startDate={startDate}
                endDate={endDate}
                onSuccess={onBookingSuccess}
            />
        </>
    );
}
