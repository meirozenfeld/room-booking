import { Request, Response } from "express";
import { register } from "./metrics";

/**
 * Exposes Prometheus metrics endpoint in standard format.
 * Used by monitoring systems to scrape application metrics.
 */
export async function metricsHandler(
    _req: Request,
    res: Response
) {
    res.setHeader("Content-Type", register.contentType);
    res.end(await register.metrics());
}
