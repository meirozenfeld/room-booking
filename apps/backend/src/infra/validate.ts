import { ZodSchema } from "zod";
import { Request, Response, NextFunction } from "express";
import { AppError } from "./app-error";

/**
 * Middleware factory that validates request data (body, query, params) against a Zod schema.
 * Throws AppError with 400 status if validation fails.
 */
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
