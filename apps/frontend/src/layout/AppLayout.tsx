import { useEffect, useState } from "react";
import Sidebar from "./Sidebar";
import type { ReactNode } from "react";

export default function AppLayout({ children }: { children: ReactNode }) {
    const [sidebarOpen, setSidebarOpen] = useState<boolean>(() => {
        const stored = localStorage.getItem("sidebarOpen");
        return stored ? JSON.parse(stored) : true;
    });

    useEffect(() => {
        localStorage.setItem("sidebarOpen", JSON.stringify(sidebarOpen));
    }, [sidebarOpen]);
    
    return (
        <div className="min-h-screen bg-slate-100 flex">
            <Sidebar
                isOpen={sidebarOpen}
                onToggle={() => setSidebarOpen((v) => !v)}
            />

            {/* Mobile overlay */}
            {sidebarOpen && (
                <div
                    onClick={() => setSidebarOpen(false)}
                    className="fixed inset-0 bg-black/30 z-40 md:hidden"
                />
            )}

            <main
                className={`
                    flex-1 transition-all duration-300
                    p-6
                    md:${sidebarOpen ? "ml-64" : "ml-16"}
                `}
            >
                {children}
            </main>
        </div>
    );
}
