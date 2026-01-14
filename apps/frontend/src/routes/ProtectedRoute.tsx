import { Navigate } from "react-router-dom";
import { useAuth } from "../features/auth/AuthContext";
import type { ReactNode } from "react";
import AppLayout from "../layout/AppLayout";

/**
 * Protected route wrapper component
 * Ensures user is authenticated before rendering children
 * Redirects to login if not authenticated
 */
export default function ProtectedRoute({
    children,
}: {
    children: ReactNode;
}) {
    const { accessToken, isInitializing } = useAuth();

    // Show loading state while checking authentication
    if (isInitializing) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                Loading...
            </div>
        );
    }

    // Redirect to login if not authenticated
    if (!accessToken) {
        return <Navigate to="/login" replace />;
    }

    // Render children with app layout if authenticated
    return <AppLayout>{children}</AppLayout>;
}
