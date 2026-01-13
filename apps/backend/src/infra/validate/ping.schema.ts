import { z } from "zod";

export const pingSchema = z.object({
    body: z.object({
        message: z.string().min(1),
    }),
});
