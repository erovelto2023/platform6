"use client";

import { useSidebarStore } from "@/hooks/use-sidebar-store";
import { Sidebar } from "@/components/dashboard/sidebar";
import { Navbar } from "@/components/dashboard/navbar";
import { cn } from "@/lib/utils";

interface DashboardShellProps {
    children: React.ReactNode;
    userRole?: string | null;
}

export const DashboardShell = ({ children, userRole }: DashboardShellProps) => {
    // Force sidebar update
    const { isCollapsed } = useSidebarStore();

    return (
        <div className="h-full relative">
            <div className={cn(
                "hidden h-full md:flex md:flex-col md:fixed md:inset-y-0 z-[80] bg-gray-900 transition-all duration-300 ease-in-out",
                isCollapsed ? "md:w-20" : "md:w-72"
            )}>
                <Sidebar userRole={userRole} />
            </div>
            <main className={cn(
                "h-full transition-all duration-300 ease-in-out",
                isCollapsed ? "md:pl-20" : "md:pl-72"
            )}>
                <Navbar userRole={userRole} />
                {children}
            </main>
        </div>
    );
};
