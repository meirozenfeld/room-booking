/**
 * Custom error class for application errors.
 * Distinguishes operational errors (expected) from programming errors (unexpected).
 * Includes HTTP status code for proper error response mapping.
 */
export class AppError extends Error {
    public readonly statusCode: number;
    public readonly isOperational: boolean;

    constructor(
        message: string,
        statusCode = 500,
        isOperational = true
    ) {
        super(message);
        this.statusCode = statusCode;
        this.isOperational = isOperational;

        Error.captureStackTrace(this, this.constructor);
    }
}
