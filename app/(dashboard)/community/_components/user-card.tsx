"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { UserPlus, UserCheck, Clock, MessageCircle } from "lucide-react";
import { useState } from "react";
import { sendFriendRequest } from "@/lib/actions/community.actions";
import { toast } from "react-hot-toast";

interface UserCardProps {
    user: any;
    currentUserId: string;
}

export function UserCard({ user, currentUserId }: UserCardProps) {
    const [status, setStatus] = useState(user.friendshipStatus);
    const [isLoading, setIsLoading] = useState(false);

    const handleConnect = async () => {
        setIsLoading(true);
        try {
            await sendFriendRequest(currentUserId, user._id);
            setStatus('sent');
            toast.success("Friend request sent!");
        } catch (error) {
            toast.error("Failed to send request");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Card className="overflow-hidden">
            <CardContent className="p-4 flex items-center gap-4">
                <Avatar className="h-12 w-12">
                    <AvatarImage src={user.avatar || user.imageUrl} />
                    <AvatarFallback>{user.firstName?.[0]}</AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-sm truncate">
                        {user.firstName} {user.lastName}
                    </h3>
                    <p className="text-xs text-slate-500 truncate">
                        {user.bio || "No bio yet"}
                    </p>
                </div>

                {status === 'none' && (
                    <Button size="sm" onClick={handleConnect} disabled={isLoading} className="bg-indigo-600 hover:bg-indigo-700">
                        <UserPlus className="h-4 w-4 mr-2" />
                        Connect
                    </Button>
                )}

                {status === 'sent' && (
                    <Button size="sm" variant="outline" disabled>
                        <Clock className="h-4 w-4 mr-2" />
                        Pending
                    </Button>
                )}

                {status === 'received' && (
                    <Button size="sm" variant="secondary" disabled>
                        <Clock className="h-4 w-4 mr-2" />
                        Respond
                    </Button>
                )}

                {status === 'friends' && (
                    <Button size="sm" variant="outline">
                        <MessageCircle className="h-4 w-4 mr-2" />
                        Message
                    </Button>
                )}
            </CardContent>
        </Card>
    );
}
