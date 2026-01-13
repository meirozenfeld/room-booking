import { z } from "zod";

export const roomSearchQuerySchema = z.object({
    startDate: z.string().optional(),
    endDate: z.string().optional(),

    capacity: z.coerce.number().int().positive().optional(),

    page: z.coerce.number().int().positive().default(1),
    pageSize: z.coerce.number().int().positive().max(50).default(10),

    sort: z
        .enum(["createdAtDesc", "capacityAsc"])
        .default("createdAtDesc"),
}).refine(
    (data) =>
        (!data.startDate && !data.endDate) ||
        (data.startDate && data.endDate),
    {
        message: "startDate and endDate must be provided together",
        path: ["startDate"],
    }
);

export type RoomSearchQuery = z.infer<typeof roomSearchQuerySchema>;
