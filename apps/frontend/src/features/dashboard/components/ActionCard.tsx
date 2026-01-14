import { Link } from "react-router-dom";

type Props = {
    title: string;
    description: string;
    icon: string; // image path
    to: string;
};

/**
 * Action card component
 * Displays a clickable card with icon, title, and description
 */
export default function ActionCard({ title, description, icon, to }: Props) {
    return (
        <Link
            to={to}
            className="
                group rounded-xl border border-slate-200 bg-white p-6
                hover:border-slate-300 hover:shadow-md
                transition-all
            "
        >
            <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-lg bg-slate-100 flex items-center justify-center">
                    <img
                        src={icon}
                        alt={title}
                        className="h-7 w-7 object-contain"
                    />
                </div>

                <div>
                    <h3 className="font-semibold text-slate-900 group-hover:underline">
                        {title}
                    </h3>
                    <p className="text-sm text-slate-500">
                        {description}
                    </p>
                </div>
            </div>
        </Link>
    );
}
