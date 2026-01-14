import type { Room } from "../../../api/rooms.api";

type Props = {
    room: Room;
    canBook: boolean;
    onBook: () => void;
};

export default function RoomCard({ room, canBook, onBook }: Props) {
    return (
        <div className="bg-white rounded-2xl shadow hover:shadow-lg transition p-6 flex flex-col justify-between">
            <div>
                <h3 className="text-lg font-semibold text-slate-800">
                    {room.name}
                </h3>

                <span className="inline-block mt-2 text-sm bg-slate-100 text-slate-600 px-3 py-1 rounded-full">
                    Capacity {room.capacity}
                </span>
            </div>

            <div className="mt-6">
                <button
                    onClick={onBook}
                    disabled={!canBook}
                    className={`w-full rounded-lg px-4 py-2 font-medium transition
                        ${canBook
                            ? "border border-slate-300 text-slate-700 hover:bg-slate-100"
                            : "bg-slate-100 text-slate-400 cursor-not-allowed"
                        }`}
                >
                    Book room
                </button>

                {!canBook && (
                    <p className="mt-2 text-xs text-slate-500 text-center">
                        Select start and end dates to enable booking
                    </p>
                )}
            </div>
        </div>
    );
}
