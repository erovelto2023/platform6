"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { PostCard } from "./post-card";
import { Bookmark, Loader2 } from "lucide-react";
import { getSavedPosts } from "@/lib/actions/community.actions";

interface SavedContentProps {
    currentUser: any;
    // posts prop is unused now as we fetch fresh saved posts
    posts?: any[];
}

export function SavedContent({ currentUser }: SavedContentProps) {
    const [savedPosts, setSavedPosts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchSaved = async () => {
            if (!currentUser) return;
            try {
                const res = await getSavedPosts(currentUser._id);
                setSavedPosts(res);
            } catch (error) {
                console.error("Failed to fetch saved posts", error);
            } finally {
                setLoading(false);
            }
        };
        fetchSaved();
    }, [currentUser]);

    return (
        <div className="space-y-6">
            <Card>
                <CardHeader>
                    <div className="flex items-center gap-2">
                        <Bookmark className="h-5 w-5 text-indigo-600" />
                        <h2 className="text-xl font-semibold">Saved Content</h2>
                    </div>
                    <p className="text-sm text-slate-500 mt-1">
                        Posts you've saved for later
                    </p>
                </CardHeader>
            </Card>

            <div className="space-y-4">
                {loading ? (
                    <div className="flex justify-center py-10">
                        <Loader2 className="h-8 w-8 animate-spin text-slate-400" />
                    </div>
                ) : savedPosts.length > 0 ? (
                    savedPosts.map((post: any) => (
                        <PostCard key={post._id} post={post} currentUser={currentUser} />
                    ))
                ) : (
                    <Card>
                        <CardContent className="text-center py-10 text-slate-500">
                            <Bookmark className="h-12 w-12 mx-auto mb-3 text-slate-300" />
                            <p className="font-medium">No saved posts yet</p>
                            <p className="text-sm mt-1">
                                Click the bookmark icon on posts to save them here
                            </p>
                        </CardContent>
                    </Card>
                )}
            </div>
        </div>
    );
}
