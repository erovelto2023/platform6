"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MessageSquare, UserMinus, Ban, MoreHorizontal, Clock } from "lucide-react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { removeFriend, blockUser, cancelFriendRequest } from "@/lib/actions/friendship.actions";
import { toast } from "sonner";
import Link from "next/link";
import { useState } from "react";

interface FriendCardProps {
    friend: any;
    currentUserId: string;
    isPendingSent?: boolean;
}

export function FriendCard({ friend, currentUserId, isPendingSent = false }: FriendCardProps) {
    const [isLoading, setIsLoading] = useState(false);

    const handleRemove = async () => {
        if (!confirm("Are you sure you want to remove this friend?")) return;
        setIsLoading(true);
        try {
            await removeFriend(currentUserId, friend._id);
            toast.success("Friend removed");
        } catch (error) {
            toast.error("Failed to remove friend");
        } finally {
            setIsLoading(false);
        }
    };

    const handleBlock = async () => {
        if (!confirm("Are you sure you want to block this user?")) return;
        setIsLoading(true);
        try {
            await blockUser(currentUserId, friend._id);
            toast.success("User blocked");
        } catch (error) {
            toast.error("Failed to block user");
        } finally {
            setIsLoading(false);
        }
    };

    const handleCancelRequest = async () => {
        setIsLoading(true);
        try {
            await cancelFriendRequest(currentUserId, friend._id);
            toast.success("Request cancelled");
        } catch (error) {
            toast.error("Failed to cancel request");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="bg-white rounded-xl border border-slate-200 p-6 flex flex-col items-center text-center relative overflow-hidden transition-all hover:shadow-md">
            <Link href={`/community/profile/${friend._id}`} className="flex flex-col items-center">
                <Avatar className="h-20 w-20 mb-4 border-4 border-slate-50 hover:border-slate-100 transition-colors">
                    <AvatarImage src={friend.avatar || friend.imageUrl} />
                    <AvatarFallback>{friend.firstName?.[0]}</AvatarFallback>
                </Avatar>

                <div className="mb-1">
                    <h3 className="font-semibold text-slate-900 text-lg hover:text-indigo-600 transition-colors">
                        {friend.firstName} {friend.lastName}
                    </h3>
                    {friend.username && (
                        <p className="text-sm text-slate-500">@{friend.username}</p>
                    )}
                </div>
            </Link>

            <div className="flex gap-2 mb-3">
                <Badge variant="secondary" className="capitalize">
                    {friend.role || 'Student'}
                </Badge>
            </div>

            <p className="text-sm text-slate-600 mb-4 line-clamp-2 min-h-[40px]">
                {friend.bio || "No bio yet."}
            </p>

            <div className="flex gap-2 w-full mt-auto">
                {isPendingSent ? (
                    <Button variant="secondary" className="flex-1" onClick={handleCancelRequest} disabled={isLoading}>
                        <Clock className="h-4 w-4 mr-2" />
                        Cancel Request
                    </Button>
                ) : (
                    <>
                        <Button variant="default" className="flex-1">
                            <MessageSquare className="h-4 w-4 mr-2" />
                            Message
                        </Button>

                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon">
                                    <MoreHorizontal className="h-4 w-4" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                                <DropdownMenuItem onClick={handleRemove} className="text-red-600">
                                    <UserMinus className="h-4 w-4 mr-2" />
                                    Remove Friend
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={handleBlock} className="text-red-600">
                                    <Ban className="h-4 w-4 mr-2" />
                                    Block User
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </>
                )}
            </div>
        </div>
    );
}
