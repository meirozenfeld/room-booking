import { env } from "../config/env";

export type ApiError = {
    status: number;
    message: string;
};

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

    const token =
        accessToken || localStorage.getItem("accessToken");

    if (token) {
        headers.Authorization = `Bearer ${token}`;
    }

    let res: Response;

    try {
        res = await fetch(`${env.apiBaseUrl}${path}`, {
            ...options,
            headers,
        });
    } catch {
        throw {
            status: 0,
            message: "Network error. Please try again.",
        } satisfies ApiError;
    }

    // ❌ שגיאה מהשרת
    if (!res.ok) {
        let message = "Request failed";

        try {
            const data = await res.json();
            message =
                data?.message ||
                data?.error ||
                message;
        } catch {
            // fallback לטקסט
            const text = await res.text();
            if (text) message = text;
        }

        throw {
            status: res.status,
            message,
        } satisfies ApiError;
    }

    // 204 No Content
    if (res.status === 204) {
        return null;
    }

    const contentType = res.headers.get("content-type");
    if (contentType?.includes("application/json")) {
        return res.json();
    }

    return res.text();
}


