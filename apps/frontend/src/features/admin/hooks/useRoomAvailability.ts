import { useEffect, useMemo, useState } from "react";
import {
    getRoomAvailability,
    blockRoom,
    unblockRoom,
} from "../api/admin.rooms.api";
import { useToast } from "../../../components/toast/ToastContext";

export function useRoomAvailability(roomId: string) {
    const [blocks, setBlocks] = useState<{ date: string }[]>([]);
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    const { showToast } = useToast();

    const blockedDatesSet = useMemo(
        () => new Set(blocks.map((b) => b.date.slice(0, 10))),
        [blocks]
    );

    useEffect(() => {
        load();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [roomId]);

    async function load() {
        const res = await getRoomAvailability(roomId);
        setBlocks(res.blocks);
    }

    function validateDates(): boolean {
        if (!startDate || !endDate) {
            setError("Please select a start and end date");
            return false;
        }

        const start = new Date(startDate);
        const end = new Date(endDate);
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        if (start > end) {
            setError("Start date cannot be after end date");
            return false;
        }

        if (start < today) {
            setError("Dates in the past cannot be modified");
            return false;
        }

        return true;
    }

    function getDatesInRange(start: string, end: string): string[] {
        const dates: string[] = [];
        const current = new Date(start);
        const last = new Date(end);

        while (current <= last) {
            dates.push(current.toISOString().slice(0, 10));
            current.setDate(current.getDate() + 1);
        }

        return dates;
    }

    async function block() {
        setError(null);
        if (!validateDates()) return;

        const range = getDatesInRange(startDate, endDate);
        const alreadyBlocked = range.filter((d) =>
            blockedDatesSet.has(d)
        );

        if (alreadyBlocked.length > 0) {
            setError(
                `Some dates are already blocked: ${alreadyBlocked.join(", ")}`
            );
            return;
        }

        try {
            setLoading(true);
            await blockRoom(roomId, { startDate, endDate });
            await load();
            showToast("Dates blocked successfully", "success");
        } catch {
            setError("Failed to block dates. Please try again.");
            showToast("Block failed", "error");
        } finally {
            setLoading(false);
        }
    }

    async function unblock() {
        setError(null);
        if (!validateDates()) return;

        const range = getDatesInRange(startDate, endDate);
        const notBlocked = range.filter(
            (d) => !blockedDatesSet.has(d)
        );

        if (notBlocked.length === range.length) {
            setError("None of the selected dates are blocked");
            return;
        }

        try {
            setLoading(true);
            await unblockRoom(roomId, { startDate, endDate });
            await load();
            showToast("Dates unblocked successfully", "success");
        } catch {
            setError("Failed to unblock dates. Please try again.");
            showToast("Unblock failed", "error");
        } finally {
            setLoading(false);
        }
    }

    async function unblockAll() {
        if (blocks.length === 0) return;

        const dates = blocks.map((b) => b.date.slice(0, 10)).sort();
        const startDate = dates[0];
        const endDate = dates[dates.length - 1];

        try {
            setLoading(true);
            await unblockRoom(roomId, { startDate, endDate });
            await load();
            showToast("All dates unblocked successfully", "success");
        } catch {
            showToast("Failed to unblock all dates", "error");
        } finally {
            setLoading(false);
        }
    }

    return {
        blocks,
        startDate,
        endDate,
        error,
        loading,
        setStartDate,
        setEndDate,
        block,
        unblock,
        unblockAll,
    };
}
