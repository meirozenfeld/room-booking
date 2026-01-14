import { Request, Response, NextFunction } from "express";
import { AppError } from "./app-error";
import { logger } from "./logger";
import { httpErrorsTotal } from "./observability/metrics";
import { ZodError } from "zod";

/**
 * Global error handler middleware.
 * Handles AppError instances with their specific status codes.
 * Logs all errors and returns generic 500 for unexpected errors.
 */
export function errorMiddleware(
    err: Error,
    _req: Request,
    res: Response,
    _next: NextFunction
) {
    // ✅ Zod validation errors (robust detection)
    if (
        err instanceof ZodError ||
        (err as any)?.name === "ZodError" ||
        Array.isArray((err as any)?.issues)
    ) {
        httpErrorsTotal.inc({
            route: _req.originalUrl || "unknown",
            type: "ZodError",
        });

        return res.status(400).json({
            error:
                (err as any)?.issues?.[0]?.message ??
                "Invalid request data",
        });
    }

    // ✅ Known application errors
    if (err instanceof AppError) {
        httpErrorsTotal.inc({
            route: _req.originalUrl || "unknown",
            type: "AppError",
        });

        logger.error(
            {
                err,
                requestId: _req.headers["x-request-id"],
            },
            "Application error"
        );

        return res.status(err.statusCode).json({
            error: err.message,
        });
    }

    // ❌ Unexpected errors → 500
    logger.error({ err }, "Unexpected error");

    return res.status(500).json({
        error: "Internal server error",
    });
}

