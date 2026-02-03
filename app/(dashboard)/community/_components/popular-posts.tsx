"use client";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { PostCard } from "./post-card";
import { TrendingUp, Flame, Star, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { getPopularPosts } from "@/lib/actions/community.actions";

interface PopularPostsProps {
    currentUser: any;
    posts: any[];
}

export function PopularPosts({ currentUser }: PopularPostsProps) {
    const [fetchedPosts, setFetchedPosts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPopular = async () => {
            try {
                const data = await getPopularPosts(20);
                setFetchedPosts(data);
            } catch (error) {
                console.error("Failed to fetch popular posts:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchPopular();
    }, []);

    const trendingTopics = [
        { name: "Marketing Strategies", count: 45 },
        { name: "Content Creation", count: 38 },
        { name: "Business Growth", count: 32 },
        { name: "Social Media", count: 28 },
        { name: "Email Marketing", count: 24 },
    ];

    if (loading) {
        return (
            <div className="flex justify-center p-8">
                <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Trending Topics */}
            <Card>
                <CardHeader>
                    <div className="flex items-center gap-2">
                        <Flame className="h-5 w-5 text-orange-500" />
                        <h2 className="text-xl font-semibold">Trending Topics</h2>
                    </div>
                </CardHeader>
                <CardContent className="space-y-3">
                    {trendingTopics.map((topic, index) => (
                        <div key={topic.name} className="flex items-center justify-between p-2 rounded-lg hover:bg-slate-50 cursor-pointer transition">
                            <div className="flex items-center gap-3">
                                <span className="flex items-center justify-center w-6 h-6 rounded-full bg-indigo-100 text-indigo-600 text-xs font-bold">
                                    {index + 1}
                                </span>
                                <span className="font-medium text-sm">{topic.name}</span>
                            </div>
                            <span className="text-xs text-slate-500">{topic.count} posts</span>
                        </div>
                    ))}
                </CardContent>
            </Card>

            {/* Popular Posts */}
            <div>
                <div className="flex items-center gap-2 mb-4">
                    <TrendingUp className="h-5 w-5 text-indigo-600" />
                    <h2 className="text-xl font-semibold">Most Popular Posts</h2>
                </div>
                <div className="space-y-4">
                    {fetchedPosts.length > 0 ? (
                        fetchedPosts.map((post: any) => (
                            <PostCard key={post._id} post={post} currentUser={currentUser} />
                        ))
                    ) : (
                        <Card>
                            <CardContent className="text-center py-10 text-slate-500">
                                No popular posts yet. Start engaging with the community!
                            </CardContent>
                        </Card>
                    )}
                </div>
            </div>
        </div>
    );
}
