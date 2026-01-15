import { Navigate } from "react-router-dom";
import { useAuth } from "../features/auth/AuthContext";
import type { ReactNode } from "react";
import AppLayout from "../layout/AppLayout";

export default function AdminRoute({ children }: { children: ReactNode }) {
    const { user, isInitializing } = useAuth();

    if (isInitializing) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                Loading...
            </div>
        );
    }

    if (!user) {
        return <Navigate to="/login" replace />;
    }

    if (user.role !== "ADMIN") {
        return <Navigate to="/" replace />;
    }

    return <AppLayout>{children}</AppLayout>;
}
