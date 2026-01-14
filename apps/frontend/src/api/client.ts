import { env } from "../config/env";

export type ApiError = {
    status: number;
    message: string;
};

// Store access token in memory for API requests
let accessToken: string | null = null;

/**
 * Sets the access token for API authentication
 * @param token - The access token string or null to clear
 */
export function setAccessToken(token: string | null) {
    accessToken = token;
}

/**
 * Centralized API fetch function with authentication
 * Handles error responses and token management
 * @param path - API endpoint path
 * @param options - Fetch options (method, body, etc.)
 * @returns Promise with parsed response data
 */
export async function apiFetch(
    path: string,
    options: RequestInit = {}
) {
    // Set default headers
    const headers: Record<string, string> = {
        "Content-Type": "application/json",
        ...(options.headers as Record<string, string> | undefined),
    };

    // Get token from memory or localStorage
    const token =
        accessToken || localStorage.getItem("accessToken");

    // Add authorization header if token exists
    if (token) {
        headers.Authorization = `Bearer ${token}`;
    }

    let res: Response;

    // Make API request
    try {
        res = await fetch(`${env.apiBaseUrl}${path}`, {
            ...options,
            headers,
        });
    } catch {
        // Handle network errors
        throw {
            status: 0,
            message: "Network error. Please try again.",
        } satisfies ApiError;
    }

    // Handle server error responses
    if (!res.ok) {
        let message = "Request failed";

        try {
            const data = await res.json();
            message =
                data?.message ||
                data?.error ||
                message;
        } catch {
            // Fallback to text if JSON parsing fails
            const text = await res.text();
            if (text) message = text;
        }

        throw {
            status: res.status,
            message,
        } satisfies ApiError;
    }

    // Handle 204 No Content responses
    if (res.status === 204) {
        return null;
    }

    // Parse response based on content type
    const contentType = res.headers.get("content-type");
    if (contentType?.includes("application/json")) {
        return res.json();
    }

    // Fallback to text response
    return res.text();
}


