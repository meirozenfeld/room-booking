import { Request, Response } from "express";

/**
 * Health check endpoint that returns application uptime.
 * Used by load balancers and monitoring systems.
 */
export function healthHandler(_req: Request, res: Response) {
    res.status(200).json({
        status: "ok",
        uptime: process.uptime(),
    });
}
