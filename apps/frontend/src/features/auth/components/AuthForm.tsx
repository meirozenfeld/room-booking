import { useState } from "react";
import viewPassIcon from "../../../assets/icons/view_pass.png";
import hidePassIcon from "../../../assets/icons/hide_pass.png";

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
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-100 to-slate-200">
            <form
                onSubmit={onSubmit}
                className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8 space-y-6 animate-fade-in"
            >
                <div className="text-center space-y-1">
                    <div className="text-3xl font-bold text-slate-900">
                        Room Check Point
                    </div>
                    <div className="text-sm text-slate-500">
                        Secure room booking & access management
                    </div>
                </div>

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

                    <div className="relative">
                        <input
                            type={showPassword ? "text" : "password"}
                            placeholder="Password"
                            value={password}
                            onChange={(e) => onPasswordChange(e.target.value)}
                            className="w-full rounded-lg border border-slate-300 px-4 py-2 pr-12 focus:outline-none focus:ring-2 focus:ring-slate-500"
                        />

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
