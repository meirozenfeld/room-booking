import client from "prom-client";

export const register = new client.Registry();

// default Node.js metrics (CPU, memory, event loop וכו')
client.collectDefaultMetrics({ register });

// ספירת בקשות
export const httpRequestsTotal = new client.Counter({
    name: "http_requests_total",
    help: "Total number of HTTP requests",
    labelNames: ["method", "route", "status"],
});

// זמן תגובה
export const httpRequestDuration = new client.Histogram({
    name: "http_request_duration_seconds",
    help: "HTTP request duration in seconds",
    labelNames: ["method", "route", "status"],
    buckets: [0.05, 0.1, 0.3, 0.5, 1, 2, 5],
});

// ספירת שגיאות
export const httpErrorsTotal = new client.Counter({
    name: "http_errors_total",
    help: "Total number of application errors",
    labelNames: ["route", "type"],
});

register.registerMetric(httpRequestsTotal);
register.registerMetric(httpRequestDuration);
register.registerMetric(httpErrorsTotal);
