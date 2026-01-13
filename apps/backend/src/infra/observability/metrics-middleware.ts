import { Request, Response, NextFunction } from "express";
import {
    httpRequestsTotal,
    httpRequestDuration,
} from "./metrics";

/**
 * Middleware that collects Prometheus metrics for HTTP requests.
 * Tracks request count and duration with labels for method, route, and status.
 * Uses high-resolution time (hrtime) for accurate duration measurement.
 */
export function metricsMiddleware(
    req: Request,
    res: Response,
    next: NextFunction
) {
    const start = process.hrtime();

    res.on("finish", () => {
        const diff = process.hrtime(start);
        const durationSeconds = diff[0] + diff[1] / 1e9;

        const route =
            req.route?.path ||
            req.baseUrl ||
            "unknown";

        const labels = {
            method: req.method,
            route,
            status: res.statusCode.toString(),
        };

        httpRequestsTotal.inc(labels);
        httpRequestDuration.observe(labels, durationSeconds);
    });

    next();
}
