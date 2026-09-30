"use client";

import { UserButton } from "@clerk/nextjs";
import { Menu, Search, ChevronDown, Layers } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Sidebar } from "@/components/dashboard/sidebar";
import { NotificationBellWrapper } from "@/components/notifications";
import { useEffect, useState } from "react";
import { BusinessSwitcher } from "@/components/accounting/BusinessSwitcher";

interface NavbarProps {
    userRole?: string | null;
}

export const Navbar = ({ userRole }: NavbarProps = {}) => {
    const [mounted, setMounted] = useState(false);
    const showSidebar = userRole !== 'free';

    useEffect(() => {
        setMounted(true);
    }, []);

    return (
        <div className="flex items-center justify-between px-6 border-b border-slate-200 h-16 bg-white shadow-xs sticky top-0 z-40">
            {/* Left: Mobile Menu Trigger + Brand Switcher Logo */}
            <div className="flex items-center gap-4">
                {mounted && showSidebar && (
                    <Sheet>
                        <SheetTrigger className="md:hidden pr-2 hover:opacity-75 transition" asChild>
                            <button className="text-slate-700">
                                <Menu className="w-5 h-5" />
                            </button>
                        </SheetTrigger>
                        <SheetContent side="left" className="p-0 bg-white border-r border-slate-200 text-slate-900 shadow-2xl">
                            <Sidebar userRole={userRole} />
                        </SheetContent>
                    </Sheet>
                )}

                {/* ScalePlus Brand Switcher Button */}
                <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center text-white shadow-xs">
                        <Layers className="w-4 h-4" />
                    </div>
                    <button className="flex items-center gap-1 text-sm font-bold text-slate-900 hover:text-indigo-600 transition-all border border-slate-200 rounded-lg px-2.5 py-1 bg-slate-50/80">
                        <span className="tracking-tight">ScalePlus</span>
                        <ChevronDown className="w-3.5 h-3.5 text-slate-500" />
                    </button>
                </div>
            </div>

            {/* Center: Search Input & Explore Link */}
            <div className="hidden lg:flex items-center gap-4 flex-1 max-w-xl mx-8">
                <div className="relative w-full">
                    <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input 
                        type="text" 
                        placeholder="Search communities, courses, pages..." 
                        className="w-full pl-9 pr-4 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                    />
                </div>
                <button className="text-xs font-semibold text-slate-500 hover:text-indigo-600 whitespace-nowrap transition-all">
                    Explore Communities
                </button>
            </div>

            {/* Right: Notifications & User Avatar */}
            <div className="flex items-center gap-3">
                {mounted && (
                    <div className="hidden md:flex items-center">
                        <BusinessSwitcher />
                    </div>
                )}
                <div className="relative p-1.5 rounded-full hover:bg-slate-100 transition-all text-slate-600">
                    <NotificationBellWrapper />
                </div>
                {mounted ? (
                    <UserButton />
                ) : (
                    <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-700 border border-indigo-200 flex items-center justify-center font-bold text-xs">
                        SP
                    </div>
                )}
            </div>
        </div>
    );
};
