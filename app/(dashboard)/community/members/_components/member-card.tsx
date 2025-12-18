"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { UserPlus, MessageSquare, Check, Clock } from "lucide-react";
import { useState } from "react";
import { sendFriendRequest } from "@/lib/actions/friendship.actions";
import { toast } from "sonner";
import Link from "next/link";

interface MemberCardProps {
    member: any;
    currentUserId: string;
}

export function MemberCard({ member, currentUserId }: MemberCardProps) {
    const [status, setStatus] = useState(member.friendshipStatus || 'none');
    const isOnline = member.lastActiveAt && new Date(member.lastActiveAt) > new Date(Date.now() - 5 * 60 * 1000);

    const handleAddFriend = async () => {
        try {
            const res = await sendFriendRequest(currentUserId, member._id);
            if (res.success) {
                setStatus('sent');
                toast.success("Friend request sent!");
            } else {
                toast.error(res.message);
            }
        } catch (error) {
            toast.error("Failed to send request");
        }
    };

    return (
        <div className="bg-white rounded-xl border border-slate-200 p-6 flex flex-col items-center text-center relative overflow-hidden transition-all hover:shadow-md">
            {isOnline && (
                <div className="absolute top-4 right-4 h-3 w-3 bg-green-500 rounded-full border-2 border-white" title="Online" />
            )}

            <Link href={`/community/profile/${member._id}`} className="flex flex-col items-center">
                <Avatar className="h-20 w-20 mb-4 border-4 border-slate-50 hover:border-slate-100 transition-colors">
                    <AvatarImage src={member.avatar || member.imageUrl} />
                    <AvatarFallback>{member.firstName?.[0]}</AvatarFallback>
                </Avatar>

                <div className="mb-1">
                    <h3 className="font-semibold text-slate-900 text-lg hover:text-indigo-600 transition-colors">
                        {member.firstName} {member.lastName}
                    </h3>
                    {member.username && (
                        <p className="text-sm text-slate-500">@{member.username}</p>
                    )}
                </div>
            </Link>

            <div className="flex gap-2 mb-3">
                <Badge variant={member.role === 'admin' ? "default" : "secondary"} className="capitalize">
                    {member.role}
                </Badge>
            </div>

            <p className="text-sm text-slate-600 mb-4 line-clamp-2 min-h-[40px]">
                {member.bio || "No bio yet."}
            </p>

            <div className="flex gap-2 w-full mt-auto">
                {status === 'friends' && (
                    <Button variant="outline" className="flex-1" disabled>
                        <Check className="h-4 w-4 mr-2" />
                        Friends
                    </Button>
                )}

                {status === 'sent' && (
                    <Button variant="secondary" className="flex-1" disabled>
                        <Clock className="h-4 w-4 mr-2" />
                        Pending
                    </Button>
                )}

                {status === 'received' && (
                    <Button className="flex-1" variant="default" disabled>
                        Respond
                    </Button>
                )}

                {status === 'none' && (
                    <Button
                        className="flex-1"
                        onClick={handleAddFriend}
                        disabled={member._id === currentUserId}
                    >
                        <UserPlus className="h-4 w-4 mr-2" />
                        Add
                    </Button>
                )}

                <Button variant="secondary" size="icon" disabled={member._id === currentUserId}>
                    <MessageSquare className="h-4 w-4 text-slate-600" />
                </Button>
            </div>
        </div>
    );
}
