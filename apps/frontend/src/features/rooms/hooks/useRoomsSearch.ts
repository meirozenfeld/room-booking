import { useState } from "react";
import { searchRooms, type Room } from "../../../api/rooms.api";

export function useRoomsSearch() {
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
            if (startDate && !endDate) {
                setError("Please select an end date");
                setRooms([]);      
                setHasNext(false); 
                return;
            }

            if (endDate && !startDate) {
                setError("Please select a start date");
                setRooms([]);      
                setHasNext(false); 
                return;
            }

            if (startDate && endDate && endDate < startDate) {
                setError("End date must be after start date");
                setRooms([]);      
                setHasNext(false); 
                return;
            }
            

            if (capacity !== undefined && capacity < 1) {
                setError("Capacity must be at least 1");
                setRooms([]);      
                setHasNext(false); 
                return;
            }
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

    return {
        rooms,
        hasNext,
        loading,
        error,

        capacity,
        startDate,
        endDate,
        selectedRoomId,

        setCapacity,
        setStartDate,
        setEndDate,
        setSelectedRoomId,

        handleSearch,
    };
}
