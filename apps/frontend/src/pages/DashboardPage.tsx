import { useAuth } from "../auth/AuthContext";

export default function DashboardPage() {
    const { user, logout } = useAuth();

    return (
        <div>
            <h2>Dashboard</h2>
            <p>
                Logged in as: {user ? user.email : "Loading user..."}
            </p>
            <button onClick={logout}>Logout</button>
        </div>
    );
}
