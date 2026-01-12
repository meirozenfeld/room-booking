import { Request, Response, NextFunction } from "express";
import { randomUUID } from "crypto";

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
