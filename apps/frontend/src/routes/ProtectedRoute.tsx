import { Navigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";
import type { ReactNode } from "react";

export default function ProtectedRoute({
    children,
}: {
    children: ReactNode;
}) {
    const { accessToken, isInitializing } = useAuth();

    if (isInitializing) {
        return <div>Loading...</div>; // או spinner
    }

    if (!accessToken) {
        return <Navigate to="/login" replace />;
    }

    return <>{children}</>;
}
