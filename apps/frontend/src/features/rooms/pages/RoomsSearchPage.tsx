import RoomsSearchForm from "../components/RoomsSearchForm";
import RoomsList from "../components/RoomsList";
import { useRoomsSearch } from "../hooks/useRoomsSearch";
import LoadMoreButton from "../components/LoadMoreButton";
import { useToast } from "../../../components/toast/ToastContext";

/**
 * Rooms search page component
 * Allows users to search for available rooms with filters
 */
export default function RoomsSearchPage() {
    const {
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
    } = useRoomsSearch();
    
    const { showToast } = useToast();

    return (
        <div className="max-w-7xl mx-auto px-6 py-8 space-y-8">
            <h1 className="text-2xl font-semibold text-slate-800">
                Find your room
            </h1>

            <RoomsSearchForm
                capacity={capacity}
                startDate={startDate}
                endDate={endDate}
                loading={loading}
                onCapacityChange={setCapacity}
                onStartDateChange={setStartDate}
                onEndDateChange={setEndDate}
                onSearch={() => handleSearch(true)}
            />

            {error && (
                <div className="text-red-600 bg-red-50 rounded-lg px-4 py-3">
                    {error}
                </div>
            )}

            {/* Rooms list */}
            <RoomsList
                rooms={rooms}
                startDate={startDate}
                endDate={endDate}
                selectedRoomId={selectedRoomId}
                onSelectRoom={setSelectedRoomId}
                onBookingSuccess={() => {
                    showToast("Room booked successfully", "success");
                    setSelectedRoomId(null);
                }}

            />

            {/* Empty state when no rooms found */}
            {!loading && rooms.length === 0 && !error && (
                <div className="text-center text-slate-500 py-12">
                    No rooms found for the selected criteria
                </div>
            )}

            {/* Load more button */}
            <LoadMoreButton
                loading={loading}
                hasNext={hasNext}
                onClick={() => handleSearch(false)}
            />
        </div>
    );
}
