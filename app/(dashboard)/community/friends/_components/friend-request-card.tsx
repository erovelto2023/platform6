"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Check, X } from "lucide-react";
import { acceptFriendRequest, declineFriendRequest } from "@/lib/actions/friendship.actions";
import { toast } from "sonner";
import Link from "next/link";
import { useState } from "react";

interface FriendRequestCardProps {
    request: any;
    requester: any;
    currentUserId: string;
}

export function FriendRequestCard({ request, requester, currentUserId }: FriendRequestCardProps) {
    const [isLoading, setIsLoading] = useState(false);

    const handleAccept = async () => {
        setIsLoading(true);
        try {
            await acceptFriendRequest(requester._id, currentUserId);
            toast.success("Friend request accepted");
        } catch (error) {
            toast.error("Failed to accept request");
        } finally {
            setIsLoading(false);
        }
    };

    const handleDecline = async () => {
        setIsLoading(true);
        try {
            await declineFriendRequest(requester._id, currentUserId);
            toast.success("Friend request declined");
        } catch (error) {
            toast.error("Failed to decline request");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="bg-white rounded-xl border border-slate-200 p-6 flex flex-col items-center text-center relative overflow-hidden transition-all hover:shadow-md">
            <Link href={`/community/profile/${requester._id}`} className="flex flex-col items-center">
                <Avatar className="h-20 w-20 mb-4 border-4 border-slate-50 hover:border-slate-100 transition-colors">
                    <AvatarImage src={requester.avatar || requester.imageUrl} />
                    <AvatarFallback>{requester.firstName?.[0]}</AvatarFallback>
                </Avatar>

                <div className="mb-1">
                    <h3 className="font-semibold text-slate-900 text-lg hover:text-indigo-600 transition-colors">
                        {requester.firstName} {requester.lastName}
                    </h3>
                    {requester.username && (
                        <p className="text-sm text-slate-500">@{requester.username}</p>
                    )}
                </div>
            </Link>

            <p className="text-sm text-slate-600 mb-6 line-clamp-2 min-h-[40px]">
                {requester.bio || "No bio yet."}
            </p>

            <div className="flex gap-2 w-full mt-auto">
                <Button
                    className="flex-1 bg-indigo-600 hover:bg-indigo-700"
                    onClick={handleAccept}
                    disabled={isLoading}
                >
                    <Check className="h-4 w-4 mr-2" />
                    Accept
                </Button>
                <Button
                    variant="outline"
                    className="flex-1 text-red-600 hover:text-red-700 hover:bg-red-50"
                    onClick={handleDecline}
                    disabled={isLoading}
                >
                    <X className="h-4 w-4 mr-2" />
                    Decline
                </Button>
            </div>
        </div>
    );
}
