import { Request, Response, NextFunction } from "express";
import { randomUUID } from "crypto";

/**
 * Middleware that generates or preserves request ID for request tracing.
 * Uses x-request-id header if provided, otherwise generates a new UUID.
 */
export function requestIdMiddleware(
    req: Request,
    res: Response,
    next: NextFunction
) {
    const requestId = req.header("x-request-id") ?? randomUUID();

    req.headers["x-request-id"] = requestId;
    res.setHeader("x-request-id", requestId);

    next();
}
