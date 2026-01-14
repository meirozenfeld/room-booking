import { useState } from "react";
import { useAuth } from "../AuthContext";
import { useNavigate, Link } from "react-router-dom";
import { AuthForm } from "../components/AuthForm";

export default function LoginPage() {
    const navigate = useNavigate();
    const { login } = useAuth();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    function isValidEmail(value: string) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
    }

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        if (!email || !password) {
            setError("Email and password are required");
            return;
        }
        if (!isValidEmail(email)) {
            setError("Please enter a valid email address");
            return;
        }
        if (password.length < 8) {
            setError("Password must be at least 8 characters");
            return;
        }
        try {
            setIsSubmitting(true);
            setError(null);
            await login(email, password);
            navigate("/");
        } catch (err: any) {
            if (err.status === 401) {
                setError("Invalid email or password");
            } else if (err.status === 0) {
                setError("Network error. Please try again.");
            } else {
                setError(err.message || "Login failed");
            }
        } finally {
            setIsSubmitting(false);
        }
    }


    return (
        <AuthForm
            title="Welcome back"
            submitLabel="Sign in"
            email={email}
            password={password}
            error={error}
            isSubmitting={isSubmitting}
            onEmailChange={setEmail}
            onPasswordChange={setPassword}
            onSubmit={handleSubmit}
            footer={
                <>
                    Don't have an account?{" "}
                    <Link
                        to="/register"
                        className="text-slate-800 font-medium hover:underline"
                    >
                        Register
                    </Link>
                </>
            }
        />
    );
}
