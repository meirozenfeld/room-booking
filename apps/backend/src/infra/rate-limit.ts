import rateLimit from "express-rate-limit";

/**
 * Rate limiter for authentication endpoints.
 * Limits to 100 requests per 15 minutes per IP address.
 */
export const authRateLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    standardHeaders: true,
    legacyHeaders: false,
});
