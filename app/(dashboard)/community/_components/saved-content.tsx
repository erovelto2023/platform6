"use client";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { PostCard } from "./post-card";
import { Bookmark, MessageSquare } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface SavedContentProps {
    currentUser: any;
    posts: any[];
}

export function SavedContent({ currentUser, posts }: SavedContentProps) {
    // Filter posts that the current user has saved
    const savedPosts = posts.filter(post =>
        post.savedBy?.includes(currentUser._id)
    );

    // Mock saved comments - replace with real data
    const savedComments = [
        {
            id: 1,
            author: { name: "John Doe", avatar: "", initials: "JD" },
            content: "This is a great insight! I've been implementing this strategy and seeing amazing results.",
            postTitle: "10 Marketing Strategies That Work",
            savedAt: "2 days ago"
        },
        {
            id: 2,
            author: { name: "Jane Smith", avatar: "", initials: "JS" },
            content: "Thanks for sharing this! The step-by-step guide is exactly what I needed.",
            postTitle: "Content Creation Workflow",
            savedAt: "5 days ago"
        },
    ];

    return (
        <div className="space-y-6">
            <Card>
                <CardHeader>
                    <div className="flex items-center gap-2">
                        <Bookmark className="h-5 w-5 text-indigo-600" />
                        <h2 className="text-xl font-semibold">Saved Content</h2>
                    </div>
                    <p className="text-sm text-slate-500 mt-1">
                        Posts and comments you've saved for later
                    </p>
                </CardHeader>
            </Card>

            <Tabs defaultValue="posts" className="w-full">
                <TabsList className="w-full bg-white border">
                    <TabsTrigger value="posts" className="flex-1">
                        <Bookmark className="h-4 w-4 mr-2" />
                        Saved Posts ({savedPosts.length})
                    </TabsTrigger>
                    <TabsTrigger value="comments" className="flex-1">
                        <MessageSquare className="h-4 w-4 mr-2" />
                        Saved Comments ({savedComments.length})
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="posts" className="space-y-4 mt-4">
                    {savedPosts.length > 0 ? (
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
                </TabsContent>

                <TabsContent value="comments" className="space-y-4 mt-4">
                    {savedComments.length > 0 ? (
                        savedComments.map((comment) => (
                            <Card key={comment.id}>
                                <CardContent className="p-4">
                                    <div className="flex items-start gap-3">
                                        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center text-sm font-semibold">
                                            {comment.author.initials}
                                        </div>
                                        <div className="flex-1">
                                            <div className="flex items-center gap-2 mb-1">
                                                <span className="font-semibold text-sm">{comment.author.name}</span>
                                                <span className="text-xs text-slate-500">• {comment.savedAt}</span>
                                            </div>
                                            <p className="text-sm text-slate-700 mb-2">{comment.content}</p>
                                            <p className="text-xs text-slate-500">
                                                On: <span className="font-medium text-indigo-600">{comment.postTitle}</span>
                                            </p>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))
                    ) : (
                        <Card>
                            <CardContent className="text-center py-10 text-slate-500">
                                <MessageSquare className="h-12 w-12 mx-auto mb-3 text-slate-300" />
                                <p className="font-medium">No saved comments yet</p>
                                <p className="text-sm mt-1">
                                    Save helpful comments to reference them later
                                </p>
                            </CardContent>
                        </Card>
                    )}
                </TabsContent>
            </Tabs>
        </div>
    );
}
