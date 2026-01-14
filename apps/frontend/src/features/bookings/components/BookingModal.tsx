import Modal from "../../../components/modal/Modal";
import ConfirmBooking from "./ConfirmBooking";
import { useToast } from "../../../components/toast/ToastContext";

type Props = {
    open: boolean;
    onClose: () => void;
    roomId: string;
    roomName: string;
    startDate: string;
    endDate: string;
    onSuccess: () => void;
};

export default function BookingModal({
    open,
    onClose,
    roomId,
    roomName,
    startDate,
    endDate,
    onSuccess,
}: Props) {
    const { showToast } = useToast();

    return (
        <Modal open={open} onClose={onClose}>
            <h2 className="text-lg font-semibold text-slate-800 mb-4">
                Confirm booking
            </h2>

            <ConfirmBooking
                roomId={roomId}
                roomName={roomName}
                startDate={startDate}
                endDate={endDate}
                onSuccess={() => {
                    onSuccess();
                    onClose();
                }}
                onError={(msg) => showToast(msg, "error")}
            />
        </Modal>
    );
}
