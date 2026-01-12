import { env } from "../config/env";

let accessToken: string | null = null;

export function setAccessToken(token: string | null) {
    accessToken = token;
}

export async function apiFetch(
    path: string,
    options: RequestInit = {}
) {
    const headers: Record<string, string> = {
        "Content-Type": "application/json",
        ...(options.headers as Record<string, string> | undefined),
    };

    if (accessToken) {
        headers.Authorization = `Bearer ${accessToken}`;
    }

    const res = await fetch(`${env.apiBaseUrl}${path}`, {
        ...options,
        headers,
    });

    if (!res.ok) {
        // נסה JSON, ואם אין – זרוק שגיאה כללית
        const text = await res.text();
        try {
            throw JSON.parse(text);
        } catch {
            throw new Error(text || "Request failed");
        }
    }

    // 🔴 כאן התיקון
    if (res.status === 204) {
        return null;
    }

    const contentType = res.headers.get("content-type");
    if (contentType && contentType.includes("application/json")) {
        return res.json();
    }

    return res.text();
}

