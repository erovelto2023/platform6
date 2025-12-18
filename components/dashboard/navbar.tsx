"use client";

import { UserButton } from "@clerk/nextjs";
import { Menu } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Sidebar } from "@/components/dashboard/sidebar";

import { useEffect, useState } from "react";

export const Navbar = () => {
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    if (!isMounted) {
        return (
            <div className="flex items-center p-4">
                <button className="md:hidden pr-4 hover:opacity-75 transition">
                    <Menu />
                </button>
                <div className="flex w-full justify-end">
                    {/* Skeleton or empty div to prevent layout shift if desired, or just null */}
                    <div className="w-8 h-8 rounded-full bg-slate-200 animate-pulse" />
                </div>
            </div>
        );
    }

    return (
        <div className="flex items-center p-4">
            <Sheet>
                <SheetTrigger className="md:hidden pr-4 hover:opacity-75 transition">
                    <Menu />
                </SheetTrigger>
                <SheetContent side="left" className="p-0 bg-[#111827] border-none text-white">
                    <Sidebar />
                </SheetContent>
            </Sheet>
            <div className="flex w-full justify-end">
                <UserButton />
            </div>
        </div>
    );
};
