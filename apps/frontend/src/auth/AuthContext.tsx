import {
    createContext,
    useContext,
    useEffect,
    useState,
} from "react";
import type { ReactNode } from "react";
import { apiFetch, setAccessToken } from "../api/client";

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


const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [accessToken, setToken] = useState<string | null>(null);
    const [isInitializing, setIsInitializing] = useState(true);

    useEffect(() => {
        const stored = localStorage.getItem("accessToken");
        if (stored) {
            setToken(stored);
            setAccessToken(stored);
            loadMe(stored);
        }
        setIsInitializing(false);
    }, []);




    async function login(email: string, password: string) {
        const res = await apiFetch("/api/auth/login", {
            method: "POST",
            body: JSON.stringify({ email, password }),
        });

        setUser(res.user);
        setToken(res.accessToken);
        setAccessToken(res.accessToken);
        localStorage.setItem("accessToken", res.accessToken);
        localStorage.setItem("refreshToken", res.refreshToken);
    }

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

    async function loadMe(token: string) {
        try {
            setAccessToken(token);
            const res = await apiFetch("/api/users/me");
            setUser(res.user);
        } catch {
            // token לא תקין / פג תוקף
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

export function useAuth() {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error("useAuth must be used within AuthProvider");
    return ctx;
}
