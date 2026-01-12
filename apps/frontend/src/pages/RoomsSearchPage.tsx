import { useState } from "react";
import { searchRooms, type Room } from "../api/rooms";
import ConfirmBooking from "../components/ConfirmBooking";

export default function RoomsSearchPage() {
    const [rooms, setRooms] = useState<Room[]>([]);
    const [page, setPage] = useState(1);
    const [hasNext, setHasNext] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const [capacity, setCapacity] = useState<number | undefined>();
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [selectedRoomId, setSelectedRoomId] = useState<string | null>(null);

    async function handleSearch(reset = true) {
        try {
            if (reset) {
                setSelectedRoomId(null);
            }
            setLoading(true);
            setError(null);

            const res = await searchRooms({
                capacity,
                startDate: startDate || undefined,
                endDate: endDate || undefined,
                page: reset ? 1 : page,
                pageSize: 5,
                sort: "createdAtDesc",
            });

            setRooms(reset ? res.data : [...rooms, ...res.data]);
            setHasNext(res.hasNext);
            setPage(reset ? 2 : page + 1);
        } catch (e: any) {
            setError(e.message || "Failed to load rooms");
        } finally {
            setLoading(false);
        }
    }

    return (
        <div>
            <h2>Search Rooms</h2>

            <div>
                <input
                    type="number"
                    placeholder="Capacity"
                    value={capacity ?? ""}
                    onChange={(e) =>
                        setCapacity(e.target.value ? Number(e.target.value) : undefined)
                    }
                />

                <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                />

                <input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                />

                <button onClick={() => handleSearch(true)} disabled={loading}>
                    Search
                </button>
            </div>

            {error && <p style={{ color: "red" }}>{error}</p>}

            <ul>
                {rooms.map((room) => (
                    <li key={room.id}>
                        <strong>{room.name}</strong> – capacity {room.capacity}

                        <button
                            style={{ marginLeft: 8 }}
                            onClick={() => {
                                if (!startDate || !endDate) {
                                    alert("Please select start and end dates before booking");
                                    return;
                                }
                                setSelectedRoomId(room.id);
                            }}
                        >
                            Book
                        </button>


                        {selectedRoomId === room.id && startDate && endDate && (
                            <ConfirmBooking
                                roomId={room.id}
                                roomName={room.name}
                                startDate={startDate}
                                endDate={endDate}
                                onSuccess={() => {
                                    alert("Booking confirmed!");
                                    setSelectedRoomId(null);
                                }}
                            />
                        )}
                    </li>
                ))}
            </ul>

            {hasNext && (
                <button onClick={() => handleSearch(false)} disabled={loading}>
                    Load more
                </button>
            )}

            {loading && <p>Loading...</p>}
        </div>
    );
}
