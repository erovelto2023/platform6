"use client";

import { useEffect, useState } from "react";
import { getPopularPosts } from "@/lib/actions/community.actions";
import { PostCard } from "./post-card";
import { Loader2 } from "lucide-react";

interface PopularFeedProps {
    currentUser: any;
}

export function PopularFeed({ currentUser }: PopularFeedProps) {
    const [posts, setPosts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPopular = async () => {
            try {
                const fetchedPosts = await getPopularPosts(20);
                setPosts(fetchedPosts);
            } catch (error) {
                console.error("Failed to fetch popular posts:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchPopular();
    }, []);

    if (loading) {
        return (
            <div className="flex justify-center p-8">
                <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
            </div>
        );
    }

    if (posts.length === 0) {
        return (
            <div className="text-center p-8 bg-slate-50 rounded-lg border">
                <p className="text-slate-500">No popular posts yet. Be the first to go viral!</p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-2 mb-4">
                <h2 className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                    Trending Now
                </h2>
                <span className="text-xs font-semibold px-2 py-1 bg-indigo-100 text-indigo-700 rounded-full">
                    Top 20
                </span>
            </div>

            {posts.map((post) => (
                <PostCard key={post._id} post={post} currentUser={currentUser} />
            ))}
        </div>
    );
}
