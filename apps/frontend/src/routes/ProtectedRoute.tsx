import { Navigate } from "react-router-dom";
import { useAuth } from "../features/auth/AuthContext";
import type { ReactNode } from "react";
import AppLayout from "../layout/AppLayout";

export default function ProtectedRoute({
    children,
}: {
    children: ReactNode;
}) {
    const { accessToken, isInitializing } = useAuth();

    if (isInitializing) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                Loading...
            </div>
        );
    }

    if (!accessToken) {
        return <Navigate to="/login" replace />;
    }

    return <AppLayout>{children}</AppLayout>;
}
