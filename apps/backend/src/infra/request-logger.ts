import { Request, Response, NextFunction } from "express";
import { logger } from "./logger";

/**
 * Middleware that logs HTTP request details including method, path, status, and duration.
 * Uses response 'finish' event to capture complete request lifecycle.
 */
export function requestLogger(
    req: Request,
    res: Response,
    next: NextFunction
) {
    const start = Date.now();

    res.on("finish", () => {
        const duration = Date.now() - start;

        logger.info({
            method: req.method,
            path: req.originalUrl,
            statusCode: res.statusCode,
            durationMs: duration,
            requestId: req.headers["x-request-id"],
        });
    });

    next();
}
