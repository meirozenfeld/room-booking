type Props = {
    capacity?: number;
    startDate: string;
    endDate: string;
    loading: boolean;
    onCapacityChange: (value?: number) => void;
    onStartDateChange: (value: string) => void;
    onEndDateChange: (value: string) => void;
    onSearch: () => void;
};

export default function RoomsSearchForm({
    capacity,
    startDate,
    endDate,
    loading,
    onCapacityChange,
    onStartDateChange,
    onEndDateChange,
    onSearch,
}: Props) {
    return (
        <div className="bg-white rounded-2xl shadow-md p-6 grid grid-cols-1 md:grid-cols-4 gap-4">
            <input
                type="number"
                min={1}
                step={1}
                placeholder="Capacity"
                value={capacity ?? ""}
                onChange={(e) => {
                    const raw = e.target.value;

                    // מאפשר למחוק את השדה
                    if (raw === "") {
                        onCapacityChange(undefined);
                        return;
                    }

                    const value = Number(raw);

                    if (Number.isNaN(value)) {
                        return;
                    }

                    if (value < 1) {
                        onCapacityChange(1);
                    } else {
                        onCapacityChange(value);
                    }
                }}


                className="input"
            />


            <input
                type="date"
                value={startDate}
                onChange={(e) => onStartDateChange(e.target.value)}
                className="input"
            />

            <input
                type="date"
                value={endDate}
                onChange={(e) => onEndDateChange(e.target.value)}
                className="input"
            />

            <button
                onClick={onSearch}
                disabled={loading}
                className="btn-primary"
            >
                {loading ? "Searching..." : "Search"}
            </button>
        </div>
    );
}
