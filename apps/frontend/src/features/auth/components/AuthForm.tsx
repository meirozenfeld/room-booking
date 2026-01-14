import { useState } from "react";
import viewPassIcon from "../../../assets/icons/view_pass.png";
import hidePassIcon from "../../../assets/icons/hide_pass.png";
import logoTitle from "../../../assets/logo_title.png";

type AuthFormProps = {
    title: string;
    submitLabel: string;
    email: string;
    password: string;
    error?: string | null;
    onEmailChange: (value: string) => void;
    onPasswordChange: (value: string) => void;
    onSubmit: (e: React.FormEvent) => void;
    footer?: React.ReactNode;
    isSubmitting?: boolean;
};

/**
 * Reusable authentication form component
 * Used for both login and registration
 */
export function AuthForm({
    title,
    submitLabel,
    email,
    password,
    error,
    onEmailChange,
    onPasswordChange,
    onSubmit,
    footer,
    isSubmitting,
}: AuthFormProps) {
    const [showPassword, setShowPassword] = useState(false);

    return (
        <div className="min-h-screen flex flex-col items-center justify-center gap-6 bg-gradient-to-br from-slate-100 to-slate-200">
            {/* Logo and title section */}
            <div className="flex flex-col items-center gap-2">
                <img
                    src={logoTitle}
                    alt="Room Check Point"
                    className="h-25 object-contain"
                />

                <div className="text-sm text-slate-500">
                    Secure room booking & access management
                </div>
            </div>

            {/* Authentication form card */}
            <form
                onSubmit={onSubmit}
                className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8 space-y-6 animate-fade-in"
            >
                <h2 className="text-xl font-semibold text-slate-800 text-center">
                    {title}
                </h2>

                {error && (
                    <div className="rounded-lg bg-red-50 text-red-700 px-4 py-3 text-sm">
                        {error}
                    </div>
                )}

                <div className="space-y-4">
                    <input
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => onEmailChange(e.target.value)}
                        className="w-full rounded-lg border border-slate-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-slate-500"
                    />

                    {/* Password input with show/hide toggle */}
                    <div className="relative">
                        <input
                            type={showPassword ? "text" : "password"}
                            placeholder="Password"
                            value={password}
                            onChange={(e) => onPasswordChange(e.target.value)}
                            className="w-full rounded-lg border border-slate-300 px-4 py-2 pr-12 focus:outline-none focus:ring-2 focus:ring-slate-500"
                        />

                        {/* Toggle password visibility button */}
                        <button
                            type="button"
                            onClick={() => setShowPassword((prev) => !prev)}
                            className="absolute inset-y-0 right-3 flex items-center"
                            tabIndex={-1}
                        >
                            <img
                                src={showPassword ? hidePassIcon : viewPassIcon}
                                alt={showPassword ? "Hide password" : "Show password"}
                                className="w-5 h-5 opacity-70 hover:opacity-100 transition"
                            />
                        </button>
                    </div>
                </div>

                <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full rounded-lg bg-slate-800 text-white py-2 font-medium
                        hover:bg-slate-700 transition
                        disabled:opacity-60 disabled:cursor-not-allowed"
                >
                    {isSubmitting ? "Signing in..." : submitLabel}
                </button>

                {footer && (
                    <div className="text-center text-sm text-slate-600">
                        {footer}
                    </div>
                )}
            </form>
        </div>
    );

}
