import { ZodSchema } from "zod";
import { Request, Response, NextFunction } from "express";
import { AppError } from "./app-error";

export const validate =
    (schema: ZodSchema) =>
        (req: Request, _res: Response, next: NextFunction) => {
            const result = schema.safeParse({
                body: req.body,
                query: req.query,
                params: req.params,
            });

            if (!result.success) {
                throw new AppError("Validation failed", 400);
            }

            next();
        };
