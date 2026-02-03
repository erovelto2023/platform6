"use client";

import { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";
import { NotificationBell } from "./notification-bell";
import { Bell } from "lucide-react";
import { Button } from "@/components/ui/button";

export function NotificationBellWrapper() {
    const [dbUserId, setDbUserId] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const { user, isLoaded } = useUser();

    useEffect(() => {
        const fetchDbUser = async () => {
            if (user?.id) {
                try {
                    const response = await fetch(`/api/user/${user.id}`);

                    if (response.ok) {
                        const data = await response.json();
                        setDbUserId(data._id);
                    }
                } catch (error) {
                    console.error("Failed to fetch user:", error);
                } finally {
                    setLoading(false);
                }
            } else if (isLoaded) {
                setLoading(false);
            }
        };

        if (isLoaded) {
            fetchDbUser();
        }
    }, [user?.id, isLoaded]);

    // Show loading skeleton while fetching
    if (loading) {
        return (
            <Button variant="ghost" size="icon" className="relative" disabled>
                <Bell className="h-5 w-5 text-slate-400" />
            </Button>
        );
    }

    // If no user ID after loading, don't show anything
    if (!dbUserId) {
        return null;
    }

    return <NotificationBell userId={dbUserId} />;
}
