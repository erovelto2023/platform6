"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { joinGroup } from "@/lib/actions/group.actions";
import { toast } from "sonner";
import { Loader2, UserPlus, Check } from "lucide-react";

interface JoinGroupButtonProps {
    groupId: string;
    userId: string;
    isMember: boolean;
}

export function JoinGroupButton({ groupId, userId, isMember }: JoinGroupButtonProps) {
    const [isLoading, setIsLoading] = useState(false);
    const [joined, setJoined] = useState(isMember);

    const handleJoin = async () => {
        setIsLoading(true);
        try {
            const result = await joinGroup(groupId, userId);
            if (result.success) {
                setJoined(true);
                toast.success("Joined group!");
            } else {
                toast.error(result.message || "Failed to join");
            }
        } catch (error) {
            toast.error("Something went wrong");
        } finally {
            setIsLoading(false);
        }
    };

    if (joined) {
        return (
            <Button variant="outline" disabled className="bg-emerald-50 text-emerald-600 border-emerald-200">
                <Check className="h-4 w-4 mr-2" />
                Joined
            </Button>
        );
    }

    return (
        <Button onClick={handleJoin} disabled={isLoading}>
            {isLoading ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            ) : (
                <UserPlus className="h-4 w-4 mr-2" />
            )}
            Join Group
        </Button>
    );
}
