import {
    createContext,
    useContext,
    useEffect,
    useState,
} from "react";
import type { ReactNode } from "react";
import { apiFetch, setAccessToken } from "../../../src/api/client";

type User = {
    id: string;
    email: string;
    role: string;
};

type AuthContextType = {
    user: User | null;
    accessToken: string | null;
    isInitializing: boolean;
    login: (email: string, password: string) => Promise<void>;
    register: (email: string, password: string) => Promise<void>;
    logout: () => Promise<void>;
};

/**
 * Authentication context for managing user authentication state
 * Provides login, register, and logout functionality
 */
const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [accessToken, setToken] = useState<string | null>(null);
    const [isInitializing, setIsInitializing] = useState(true);

    // Initialize auth state from localStorage on mount
    useEffect(() => {
        const stored = localStorage.getItem("accessToken");
        if (stored) {
            setToken(stored);
            setAccessToken(stored);
            loadMe(stored);
        }
        setIsInitializing(false);
    }, []);

    /**
     * Login user with email and password
     * Stores access token and loads user data
     */
    async function login(email: string, password: string) {
        const res = await apiFetch("/api/auth/login", {
            method: "POST",
            body: JSON.stringify({ email, password }),
        });

        if (!res?.accessToken) {
            throw {
                status: 401,
                message: "Invalid email or password",
            };
        }

        setToken(res.accessToken);
        setAccessToken(res.accessToken);
        localStorage.setItem("accessToken", res.accessToken);

        await loadMe(res.accessToken);
    }

    /**
     * Register new user with email and password
     * Stores access and refresh tokens
     */
    async function register(email: string, password: string) {
        const res = await apiFetch("/api/auth/register", {
            method: "POST",
            body: JSON.stringify({ email, password }),
        });

        setUser(res.user);
        setToken(res.accessToken);
        setAccessToken(res.accessToken);
        localStorage.setItem("accessToken", res.accessToken);
        localStorage.setItem("refreshToken", res.refreshToken);
    }

    /**
     * Logout user and clear all authentication data
     * Calls logout endpoint to invalidate refresh token
     */
    async function logout() {
        const refreshToken = localStorage.getItem("refreshToken");
        if (refreshToken) {
            await apiFetch("/api/auth/logout", {
                method: "POST",
                body: JSON.stringify({ refreshToken }),
            });
        }

        setUser(null);
        setToken(null);
        setAccessToken(null);
        localStorage.clear();
    }

    /**
     * Load current user data from API
     * Used to verify token validity and get user information
     */
    async function loadMe(token: string) {
        try {
            setAccessToken(token);
            const res = await apiFetch("/api/users/me");
            setUser(res.user);
        } catch {
            // Invalid or expired token - clear auth state
            setToken(null);
            setAccessToken(null);
            localStorage.clear();
        }
    }

    return (
        <AuthContext.Provider
            value={{
                user,
                accessToken,
                isInitializing,
                login,
                register,
                logout,
            }}
        >

            {children}
        </AuthContext.Provider>
    );
}

/**
 * Hook to access authentication context
 * Must be used within AuthProvider
 */
export function useAuth() {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error("useAuth must be used within AuthProvider");
    return ctx;
}
