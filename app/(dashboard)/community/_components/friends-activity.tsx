"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { UserPlus, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getFriendsActivity, getSuggestedUsers, sendFriendRequest } from "@/lib/actions/community.actions";
import { PostCard } from "./post-card";
import { toast } from "react-hot-toast";
import Link from "next/link";

interface FriendsActivityProps {
    currentUser: any;
}

export function FriendsActivity({ currentUser }: FriendsActivityProps) {
    const [posts, setPosts] = useState<any[]>([]);
    const [suggestions, setSuggestions] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [fetchedPosts, fetchedSuggestions] = await Promise.all([
                    getFriendsActivity(currentUser._id),
                    getSuggestedUsers(currentUser._id, 5)
                ]);
                setPosts(fetchedPosts);
                setSuggestions(fetchedSuggestions);
            } catch (error) {
                console.error("Failed to load friend activity", error);
            } finally {
                setLoading(false);
            }
        };

        if (currentUser) {
            fetchData();
        }
    }, [currentUser]);

    const handleAddFriend = async (userId: string) => {
        try {
            await sendFriendRequest(currentUser._id, userId);
            toast.success("Friend request sent");
            setSuggestions(prev => prev.filter(u => u._id !== userId));
        } catch (error) {
            toast.error("Failed to send request");
        }
    };

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2 space-y-6">
                <div className="flex items-center justify-between">
                    <h2 className="text-xl font-semibold">Recent from Friends</h2>
                </div>

                {loading ? (
                    <div className="space-y-4">
                        {[1, 2].map(i => (
                            <div key={i} className="h-48 bg-slate-100 animate-pulse rounded-lg" />
                        ))}
                    </div>
                ) : posts.length > 0 ? (
                    posts.map((post) => (
                        <PostCard key={post._id} post={post} currentUser={currentUser} />
                    ))
                ) : (
                    <Card>
                        <CardContent className="py-10 text-center text-slate-500">
                            No recent posts from friends.
                        </CardContent>
                    </Card>
                )}
            </div>

            <div className="space-y-6">
                <Card>
                    <CardHeader>
                        <CardTitle className="text-lg">People You May Know</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {loading ? (
                            [1, 2, 3].map(i => (
                                <div key={i} className="flex gap-3">
                                    <div className="h-10 w-10 bg-slate-100 rounded-full animate-pulse" />
                                    <div className="flex-1 space-y-2">
                                        <div className="h-4 w-24 bg-slate-100 rounded animate-pulse" />
                                        <div className="h-3 w-16 bg-slate-100 rounded animate-pulse" />
                                    </div>
                                </div>
                            ))
                        ) : suggestions.length > 0 ? (
                            suggestions.map((user) => (
                                <div key={user._id} className="flex items-center justify-between">
                                    <Link href={`/community/profile/${user._id}`} className="flex items-center gap-3">
                                        <Avatar className="h-10 w-10">
                                            <AvatarImage src={user.avatar || user.imageUrl} />
                                            <AvatarFallback>{user.firstName?.[0]}</AvatarFallback>
                                        </Avatar>
                                        <div>
                                            <p className="font-medium text-sm hover:underline">{user.firstName} {user.lastName}</p>
                                            <p className="text-xs text-slate-500 truncate max-w-[120px]">{user.bio || "Member"}</p>
                                        </div>
                                    </Link>
                                    <Button size="sm" variant="ghost" className="h-8 w-8 p-0" onClick={() => handleAddFriend(user._id)}>
                                        <UserPlus className="h-4 w-4" />
                                    </Button>
                                </div>
                            ))
                        ) : (
                            <p className="text-sm text-center text-slate-500">No suggestions available.</p>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
