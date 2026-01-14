import { z } from "zod";

export const createBookingSchema = z.object({
    body: z.object({
        roomId: z.string().uuid(),
        startDate: z.string().datetime(),
        endDate: z.string().datetime(),
    }).refine(
        (data) => new Date(data.endDate) >= new Date(data.startDate),
        { message: "endDate must be after startDate" }
    ),
});
