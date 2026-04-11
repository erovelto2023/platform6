"use client";

import { UserButton } from "@clerk/nextjs";
import { Menu } from "lucide-react";
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

    useEffect(() => {
        setMounted(true);
    }, []);

    return (
        <div className="flex items-center p-4 border-b h-[65px]">
            {mounted ? (
                <>
                    <Sheet>
                        <SheetTrigger className="md:hidden pr-4 hover:opacity-75 transition" asChild>
                            <button className="md:hidden pr-4 hover:opacity-75 transition">
                                <Menu />
                            </button>
                        </SheetTrigger>
                        <SheetContent side="left" className="p-0 bg-[#111827] border-none text-white">
                            <Sidebar userRole={userRole} />
                        </SheetContent>
                    </Sheet>

                    <div className="hidden md:flex">
                        <BusinessSwitcher />
                    </div>
                </>
            ) : (
                <div className="md:hidden pr-4">
                    <Menu className="text-slate-200 opacity-50" />
                </div>
            )}

            <div className="flex w-full justify-end items-center gap-4">
                <NotificationBellWrapper />
                {mounted && <UserButton />}
            </div>
        </div>
    );
};
