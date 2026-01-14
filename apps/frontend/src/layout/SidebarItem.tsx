import { NavLink } from "react-router-dom";

type Props = {
    to: string;
    label: string;
    icon: string; // path to image
    isOpen: boolean;
};

/**
 * Sidebar navigation item component
 * Renders a navigation link with icon and optional label
 */
export default function SidebarItem({ to, label, icon, isOpen }: Props) {
    return (
        <NavLink
            to={to}
            end
            className={({ isActive }) =>
                `
                flex items-center gap-3 px-3 py-2 rounded-md text-sm
                transition-colors
                ${isActive
                    ? "bg-slate-100 text-slate-900 font-medium"
                    : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"}
            `
            }
        >
            <img
                src={icon}
                alt={label}
                className="h-5 w-5 object-contain"
            />

            {isOpen && <span className="whitespace-nowrap">{label}</span>}
        </NavLink>
    );
}
