import { Request, Response, NextFunction } from "express";
import { AppError } from "./app-error";
import { logger } from "./logger";
import { httpErrorsTotal } from "./observability/metrics";

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

    logger.error({ err }, "Unexpected error");

    return res.status(500).json({
        error: "Internal server error",
    });
}
