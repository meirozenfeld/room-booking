import { useAuth } from "../features/auth/AuthContext";
import SidebarItem from "./SidebarItem";
import { useEffect, useState } from "react";
import logo_title from "../assets/logo_title.png";
import dashboardIcon from "../assets/icons/dashboard.png";
import findRoomsIcon from "../assets/icons/find_rooms.png";
import myBookingsIcon from "../assets/icons/my_bookings.png";
import logoutIcon from "../assets/icons/logout.png";
import arrowLeft from "../assets/icons/arrow_left.png";
import arrowRight from "../assets/icons/arrow_right.png";

type Props = {
    isOpen: boolean;
    onToggle: () => void;
};

export default function Sidebar({ isOpen, onToggle }: Props) {
    const { user, logout } = useAuth();
    const [showText, setShowText] = useState(isOpen);

    useEffect(() => {
        if (isOpen) {
            const t = setTimeout(() => setShowText(true), 200);
            return () => clearTimeout(t);
        } else {
            setShowText(false);
        }
    }, [isOpen]);

    return (
        <aside
            className={`
        bg-white border-r border-slate-200
        transition-all duration-300 ease-in-out
        h-screen flex flex-col
        ${isOpen ? "w-64" : "w-16"}
        fixed md:static top-0 left-0 z-50
        ${isOpen ? "translate-x-0" : "-translate-x-full"}
        md:translate-x-0
    `}
        >

            {/* Top */}
            <div
                className={`
        h-14 border-b border-slate-200
        flex items-center
        ${isOpen ? "justify-between px-2" : "justify-center"}
    `}
            >
                {isOpen ? (
                    <div className="flex items-center justify-between w-full">
                        <div className="flex items-center gap-2 overflow-hidden">
                            <img
                                src={logo_title}
                                alt="Room Check Point"
                                className="h-30 w-38 object-contain"
                            />
                        </div>

                        <ToggleButton isOpen={isOpen} onToggle={onToggle} />
                    </div>
                ) : (
                    <ToggleButton isOpen={isOpen} onToggle={onToggle} />
                )}
            </div>


            {/* User */}
            {user && isOpen && (
                <div className="px-4 py-4 border-b border-slate-200">
                    <div className="text-xs text-slate-500">Logged in as</div>
                    <div className="text-sm truncate">{user.email}</div>
                    <div className="text-xs text-slate-500">Role: {user.role}</div>
                </div>
            )}

            {/* Nav */}
            <nav className="px-2 py-4 space-y-1 flex-1">
                <SidebarItem
                    to="/"
                    label="Dashboard"
                    icon={dashboardIcon}
                    isOpen={isOpen}
                />

                <SidebarItem
                    to="/rooms"
                    label="Find rooms"
                    icon={findRoomsIcon}
                    isOpen={isOpen}
                />

                <SidebarItem
                    to="/bookings"
                    label="My bookings"
                    icon={myBookingsIcon}
                    isOpen={isOpen}
                />

            </nav>

            {/* Logout */}
            <div className="px-2 py-4 border-t border-slate-200">
                <button
                    onClick={logout}
                    className="
            w-full flex items-center gap-3 px-3 py-2 rounded-md
            hover:bg-slate-100 transition
        "
                >
                    <img
                        src={logoutIcon}
                        alt="Logout"
                        className="h-5 w-5 object-contain"
                    />

                    {showText && <span>Logout</span>}
                </button>
            </div>

        </aside>
    );
}

function ToggleButton({
    isOpen,
    onToggle,
}: {
    isOpen: boolean;
    onToggle: () => void;
}) {
    return (
        <button
            onClick={onToggle}
            aria-label="Toggle sidebar"
            className="
                w-9 h-9
                flex items-center justify-center
                rounded-md
                hover:bg-slate-100
                transition
            "
        >
            <img
                src={isOpen ? arrowLeft : arrowRight}
                alt={isOpen ? "Collapse sidebar" : "Expand sidebar"}
                className="w-5 h-5 object-contain"
            />
        </button>
    );
}


