import { useState, useEffect } from "react";
import Modal from "../../../components/modal/Modal";

type Props = {
    open: boolean;
    onClose: () => void;
    onSubmit: (data: { name: string; capacity: number }) => Promise<void>;
    initialData?: {
        name: string;
        capacity: number;
    };
    title: string;
};

/**
 * Room form modal component
 * Used for both creating and editing rooms
 */
export default function RoomFormModal({
    open,
    onClose,
    onSubmit,
    initialData,
    title,
}: Props) {
    const [name, setName] = useState("");
    const [capacity, setCapacity] = useState<number>(1);

    // Initialize form with existing data when editing
    useEffect(() => {
        if (initialData) {
            setName(initialData.name);
            setCapacity(initialData.capacity);
        }
    }, [initialData]);

    /**
     * Handles form submission
     */
    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        await onSubmit({ name, capacity });
        onClose();
    }

    return (
        <Modal open={open} onClose={onClose}>
            <h2 className="text-xl font-semibold mb-4">{title}</h2>

            <form onSubmit={handleSubmit} className="space-y-4">
                <input
                    className="input"
                    placeholder="Room name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                />

                <input
                    className="input"
                    type="number"
                    min={1}
                    placeholder="Capacity"
                    value={capacity}
                    onChange={(e) => setCapacity(Number(e.target.value))}
                    required
                />

                <div className="flex justify-end gap-2">
                    <button
                        type="button"
                        onClick={onClose}
                        className="btn-secondary"
                    >
                        Cancel
                    </button>
                    <button type="submit" className="btn-primary px-4">
                        Save
                    </button>
                </div>
            </form>
        </Modal>
    );
}
