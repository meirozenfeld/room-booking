import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "../../src/features/auth/pages/LoginPage";
import RegisterPage from "../../src/features/auth/pages/RegisterPage";
import DashboardPage from "../features/dashboard/pages/DashboardPage";
import ProtectedRoute from "./ProtectedRoute";
import RoomsSearchPage from "../../src/features/rooms/pages/RoomsSearchPage";
import MyBookingsPage from "../features/bookings/pages/MyBookingsPage";

export default function AppRoutes() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />

                <Route
                    path="/"
                    element={
                        <ProtectedRoute>
                            <DashboardPage />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/rooms"
                    element={
                        <ProtectedRoute>
                            <RoomsSearchPage />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/bookings"
                    element={
                        <ProtectedRoute>
                            <MyBookingsPage />
                        </ProtectedRoute>
                    }
                />
                <Route path="*" element={<Navigate to="/" />} />
            </Routes>
        </BrowserRouter>
    );
}
