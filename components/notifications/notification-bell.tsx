"use client";

import { useState, useEffect } from "react";
import { Bell } from "lucide-react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { NotificationList } from "./notification-list";
import { getUnreadCount } from "@/lib/actions/notification.actions";

interface NotificationBellProps {
    userId: string;
}

export function NotificationBell({ userId }: NotificationBellProps) {
    const [unreadCount, setUnreadCount] = useState(0);
    const [isOpen, setIsOpen] = useState(false);

    useEffect(() => {
        loadUnreadCount();

        // Poll for new notifications every 30 seconds
        const interval = setInterval(loadUnreadCount, 30000);

        return () => clearInterval(interval);
    }, [userId]);

    const loadUnreadCount = async () => {
        const result = await getUnreadCount(userId);
        if (result.success) {
            setUnreadCount(result.count);
        }
    };

    const handleMarkAllRead = () => {
        setUnreadCount(0);
    };

    return (
        <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="relative">
                    <Bell className="h-5 w-5" />
                    {unreadCount > 0 && (
                        <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-red-500 text-white text-xs flex items-center justify-center font-semibold">
                            {unreadCount > 9 ? '9+' : unreadCount}
                        </span>
                    )}
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-96 p-0">
                <NotificationList
                    userId={userId}
                    onMarkAllRead={handleMarkAllRead}
                    onClose={() => setIsOpen(false)}
                />
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
