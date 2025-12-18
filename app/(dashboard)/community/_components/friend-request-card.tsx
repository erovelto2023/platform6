"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Check, X } from "lucide-react";
import { useState } from "react";
import { acceptFriendRequest, rejectFriendRequest } from "@/lib/actions/community.actions";
import { toast } from "react-hot-toast";

interface FriendRequestCardProps {
    request: any;
}

export function FriendRequestCard({ request }: FriendRequestCardProps) {
    const [isProcessing, setIsProcessing] = useState(false);

    const handleAccept = async () => {
        setIsProcessing(true);
        try {
            await acceptFriendRequest(request._id);
            toast.success("Friend request accepted!");
        } catch (error) {
            toast.error("Failed to accept request");
        } finally {
            setIsProcessing(false);
        }
    };

    const handleReject = async () => {
        setIsProcessing(true);
        try {
            await rejectFriendRequest(request._id);
            toast.success("Friend request rejected");
        } catch (error) {
            toast.error("Failed to reject request");
        } finally {
            setIsProcessing(false);
        }
    };

    return (
        <Card className="overflow-hidden">
            <CardContent className="p-4 flex items-center gap-4">
                <Avatar className="h-12 w-12">
                    <AvatarImage src={request.requester.avatar || request.requester.imageUrl} />
                    <AvatarFallback>{request.requester.firstName?.[0]}</AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-sm truncate">
                        {request.requester.firstName} {request.requester.lastName}
                    </h3>
                    <p className="text-xs text-slate-500 truncate">
                        Sent you a friend request
                    </p>
                </div>

                <div className="flex gap-2">
                    <Button size="sm" onClick={handleAccept} disabled={isProcessing} className="bg-indigo-600 hover:bg-indigo-700">
                        <Check className="h-4 w-4 mr-2" />
                        Accept
                    </Button>
                    <Button size="sm" variant="outline" onClick={handleReject} disabled={isProcessing} className="text-red-600 hover:text-red-700 hover:bg-red-50">
                        <X className="h-4 w-4 mr-2" />
                        Deny
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
}
