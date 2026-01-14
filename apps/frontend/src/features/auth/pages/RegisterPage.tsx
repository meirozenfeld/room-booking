import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../AuthContext";
import { AuthForm } from "../components/AuthForm";

/**
 * Registration page component
 * Handles new user registration and redirects to rooms page on success
 */
export default function RegisterPage() {
    const { register } = useAuth();
    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    /**
     * Validates email format using regex
     */
    function isValidEmail(value: string) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
    }

    /**
     * Handles form submission with client-side validation
     */
    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();

        // Client-side validation
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

            await register(email, password);
            navigate("/");
        } catch (err: any) {
            if (err.status === 409) {
                setError("An account with this email already exists");
            } else if (err.status === 0) {
                setError("Network error. Please try again.");
            } else {
                setError(err.message || "Registration failed");
            }
        } finally {
            setIsSubmitting(false);
        }
    }

    return (
        <AuthForm
            title="Create your account"
            submitLabel="Get started"
            email={email}
            password={password}
            error={error}
            isSubmitting={isSubmitting}
            onEmailChange={setEmail}
            onPasswordChange={setPassword}
            onSubmit={handleSubmit}
            footer={
                <>
                    Already have an account?{" "}
                    <Link
                        to="/login"
                        className="text-slate-800 font-medium hover:underline"
                    >
                        Sign in
                    </Link>
                </>
            }
        />
    );
}
