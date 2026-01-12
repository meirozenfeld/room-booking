import { apiFetch } from "./client";

export type Booking = {
    id: string;
    roomId: string;
    userId: string;
    startDate: string;
    endDate: string;
    status: "CONFIRMED" | "CANCELLED";
    createdAt: string;
};

export async function createBooking(params: {
    roomId: string;
    startDate: string;
    endDate: string;
}): Promise<Booking> {
    return apiFetch("/bookings", {
        method: "POST",
        body: JSON.stringify(params),
    });
}
