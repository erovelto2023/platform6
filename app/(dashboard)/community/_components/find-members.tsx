"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Search, UserPlus, Users, Loader2, Check, UserCheck, Clock, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getSuggestedUsers, searchUsers, sendFriendRequest } from "@/lib/actions/community.actions";
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";
import { getOrCreateConversation } from "@/lib/actions/message.actions";
import Link from "next/link";

interface FindMembersProps {
    currentUser: any;
}

export function FindMembers({ currentUser }: FindMembersProps) {
    const [members, setMembers] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [pendingRequests, setPendingRequests] = useState<Set<string>>(new Set());
    const router = useRouter();

    useEffect(() => {
        const fetchMembers = async () => {
            setLoading(true);
            try {
                if (searchQuery.trim()) {
                    const results = await searchUsers(searchQuery, currentUser._id);
                    setMembers(results);
                } else {
                    const suggestions = await getSuggestedUsers(currentUser._id);
                    // Add default status 'none' to suggestions
                    setMembers(suggestions.map((u: any) => ({ ...u, friendshipStatus: 'none' })));
                }
            } catch (error) {
                console.error("Failed to fetch members:", error);
            } finally {
                setLoading(false);
            }
        };

        const timeoutId = setTimeout(fetchMembers, 500);
        return () => clearTimeout(timeoutId);
    }, [searchQuery, currentUser._id]);

    const handleConnect = async (memberId: string) => {
        try {
            setPendingRequests(prev => new Set(prev).add(memberId));
            await sendFriendRequest(currentUser._id, memberId);
            toast.success("Friend request sent!");

            // Update local state to reflect sent status
            setMembers(prev => prev.map(m =>
                m._id === memberId
                    ? { ...m, friendshipStatus: 'sent' }
                    : m
            ));
        } catch (error: any) {
            toast.error(error.message || "Failed to send request");
            setPendingRequests(prev => {
                const newSet = new Set(prev);
                newSet.delete(memberId);
                return newSet;
            });
        }
    };

    const handleMessage = async (memberId: string) => {
        try {
            const result = await getOrCreateConversation(currentUser._id, memberId);
            if (result.success && result.data) {
                router.push(`/messages?conversationId=${result.data._id}`);
            } else {
                toast.error("Could not start conversation");
            }
        } catch (error) {
            toast.error("Failed to start messaging");
        }
    };

    const renderActionButton = (member: any) => {
        if (member._id === currentUser._id) return null;

        const isPending = pendingRequests.has(member._id);
        const status = member.friendshipStatus;

        if (status === 'friends') {
            return (
                <div className="flex gap-2">
                    <Button size="sm" variant="outline" className="gap-2 text-green-600 border-green-200" disabled>
                        <UserCheck className="h-4 w-4" />
                        Friends
                    </Button>
                    <Button size="sm" variant="ghost" className="gap-2" onClick={() => handleMessage(member._id)}>
                        <MessageCircle className="h-4 w-4" />
                        Message
                    </Button>
                </div>
            );
        }

        if (status === 'sent' || isPending) {
            return (
                <Button size="sm" variant="secondary" className="gap-2" disabled>
                    <Clock className="h-4 w-4" />
                    Sent
                </Button>
            );
        }

        if (status === 'received') {
            return (
                <Button size="sm" variant="default" className="gap-2" disabled>
                    <Clock className="h-4 w-4" />
                    Request Received
                </Button>
            );
        }

        return (
            <div className="flex gap-2">
                <Button
                    size="sm"
                    className="gap-2"
                    onClick={() => handleConnect(member._id)}
                    disabled={isPending}
                >
                    <UserPlus className="h-4 w-4" />
                    Connect
                </Button>
                <Button size="sm" variant="ghost" className="gap-2" onClick={() => handleMessage(member._id)}>
                    <MessageCircle className="h-4 w-4" />
                </Button>
            </div>
        );
    };

    return (
        <div className="space-y-6">
            <Card>
                <CardHeader>
                    <div className="flex items-center gap-2">
                        <Users className="h-5 w-5 text-indigo-600" />
                        <h2 className="text-xl font-semibold">Find Members</h2>
                    </div>
                    <p className="text-sm text-slate-500 mt-1">
                        Connect with other members in the community
                    </p>
                </CardHeader>
                <CardContent>
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                        <Input
                            placeholder="Search members by name or email..."
                            className="pl-10"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                </CardContent>
            </Card>

            {loading ? (
                <div className="flex justify-center p-8">
                    <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
                </div>
            ) : (
                <div className="grid gap-4">
                    {members.length > 0 ? members.map((member) => (
                        <Card key={member._id} className="hover:shadow-md transition">
                            <CardContent className="p-4">
                                <div className="flex items-center justify-between flex-wrap gap-4">
                                    <div className="flex items-center gap-3">
                                        <Link href={`/community/profile/${member._id}`}>
                                            <Avatar className="h-12 w-12 cursor-pointer hover:opacity-80 transition">
                                                <AvatarImage src={member.avatar || member.imageUrl} />
                                                <AvatarFallback className="bg-gradient-to-br from-indigo-500 to-purple-600 text-white">
                                                    {member.firstName?.[0]}
                                                </AvatarFallback>
                                            </Avatar>
                                        </Link>
                                        <div>
                                            <Link href={`/community/profile/${member._id}`} className="hover:underline">
                                                <h3 className="font-semibold">{member.firstName} {member.lastName}</h3>
                                            </Link>
                                            <p className="text-sm text-slate-500">{member.bio || "No bio yet"}</p>
                                        </div>
                                    </div>
                                    {renderActionButton(member)}
                                </div>
                            </CardContent>
                        </Card>
                    )) : (
                        <div className="text-center p-8 text-slate-500">
                            No members found matching your search.
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
