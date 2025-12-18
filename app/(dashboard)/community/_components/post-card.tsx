"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { formatDistanceToNow } from "date-fns";
import { Heart, MessageCircle, MoreHorizontal, Share2, ThumbsUp, Trash2 } from "lucide-react";
import { useState, useEffect } from "react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toggleReaction, addComment, getComments, deleteComment, deletePost } from "@/lib/actions/community.actions";
import { toast } from "react-hot-toast";
import ReactPlayer from "react-player";

interface PostCardProps {
    post: any;
    currentUser: any;
}

const REACTIONS = [
    { label: "Like", icon: "👍", value: "like" },
    { label: "Love", icon: "❤️", value: "love" },
    { label: "Haha", icon: "😂", value: "laugh" },
    { label: "Wow", icon: "😮", value: "wow" },
    { label: "Sad", icon: "😢", value: "sad" },
    { label: "Angry", icon: "😡", value: "angry" },
];

export function PostCard({ post, currentUser }: PostCardProps) {
    const [commentText, setCommentText] = useState("");
    const [showComments, setShowComments] = useState(false);
    const [comments, setComments] = useState<any[]>([]);
    const [optimisticReactions, setOptimisticReactions] = useState(post.reactionCounts || {});
    const [userReaction, setUserReaction] = useState(post.reactions?.[currentUser._id]);
    const [isClient, setIsClient] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);

    useEffect(() => {
        setIsClient(true);
    }, []);

    useEffect(() => {
        if (showComments && comments.length === 0 && post.commentCount > 0) {
            getComments(post._id).then(setComments);
        }
    }, [showComments, post._id, post.commentCount]);

    const handleReaction = async (type: string) => {
        // Optimistic update
        const isRemoving = userReaction === type;
        const newReaction = isRemoving ? null : type;

        setUserReaction(newReaction);
        setOptimisticReactions((prev: any) => {
            const newCounts = { ...prev };
            if (userReaction) newCounts[userReaction]--;
            if (!isRemoving) newCounts[type] = (newCounts[type] || 0) + 1;
            return newCounts;
        });

        try {
            await toggleReaction(post._id, currentUser._id, type);
        } catch (error) {
            // Revert on failure (omitted for brevity)
            toast.error("Failed to react");
        }
    };

    const handleComment = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!commentText.trim()) return;

        try {
            const newComment = await addComment({
                userId: currentUser._id,
                postId: post._id,
                content: commentText
            });
            // Add optimistic comment with user details
            const commentWithUser = {
                ...newComment,
                userId: {
                    firstName: currentUser.firstName,
                    lastName: currentUser.lastName,
                    avatar: currentUser.avatar,
                    imageUrl: currentUser.imageUrl
                }
            };
            setComments(prev => [...prev, commentWithUser]);
            setCommentText("");
            setShowComments(true);
            toast.success("Comment added");
        } catch (error) {
            toast.error("Failed to comment");
        }
    };

    const handleDeleteComment = async (commentId: string) => {
        try {
            await deleteComment(commentId, currentUser._id);
            setComments(prev => prev.filter(c => c._id !== commentId));
            toast.success("Comment deleted");
        } catch (error) {
            toast.error("Failed to delete comment");
        }
    };

    const handleDeletePost = async () => {
        if (!confirm("Are you sure you want to delete this post?")) return;
        setIsDeleting(true);
        try {
            await deletePost(post._id, currentUser._id);
            toast.success("Post deleted");
            // Ideally we should remove the post from the UI, but revalidatePath on server might handle it if we refresh or if the parent component re-fetches.
            // For now, let's just reload the page to be safe, or assume the parent will handle it.
            // Since this is a client component, we can't easily force a server re-render of the parent list without a router refresh.
            window.location.reload();
        } catch (error) {
            toast.error("Failed to delete post");
            setIsDeleting(false);
        }
    };

    if (isDeleting) return null; // Hide card immediately

    return (
        <Card className="mb-4 overflow-visible">
            <CardHeader className="flex flex-row items-center gap-4 p-4 pb-2">
                <Avatar>
                    <AvatarImage src={post.userId.avatar || post.userId.imageUrl} />
                    <AvatarFallback>{post.userId.firstName?.[0]}</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="font-semibold text-sm">
                            {post.userId.firstName} {post.userId.lastName}
                        </h3>
                        {post.feeling && (
                            <span className="text-sm text-slate-500">
                                is feeling {post.feeling}
                            </span>
                        )}
                    </div>
                    <p className="text-xs text-slate-500">
                        {formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })}
                    </p>
                </div>
                {currentUser._id === post.userId._id && (
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                                <MoreHorizontal className="h-4 w-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={handleDeletePost} className="text-red-600 focus:text-red-600 cursor-pointer">
                                <Trash2 className="h-4 w-4 mr-2" />
                                Delete Post
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                )}
            </CardHeader>

            <CardContent className="p-4 pt-0">
                <p className="text-sm whitespace-pre-wrap mb-3">{post.content}</p>

                {/* Image Media */}
                {post.media && post.media.length > 0 && (
                    <div className="rounded-lg overflow-hidden border mb-3">
                        <img src={post.media[0]} alt="Post content" className="w-full h-auto" />
                    </div>
                )}

                {/* Video Media */}
                {post.video && isClient && (
                    <div className="rounded-lg overflow-hidden border aspect-video">
                        {/* @ts-ignore */}
                        <ReactPlayer url={post.video} width="100%" height="100%" controls />
                    </div>
                )}
            </CardContent>

            <div className="px-4 py-2 border-t flex items-center justify-between text-xs text-slate-500">
                <div className="flex items-center gap-1">
                    {Object.entries(optimisticReactions).some(([_, count]: any) => count > 0) && (
                        <>
                            <span>🔥</span>
                            <span>{Object.values(optimisticReactions).reduce((a: any, b: any) => a + b, 0) as number}</span>
                        </>
                    )}
                </div>
                <div>
                    {(post.commentCount > 0 || comments.length > 0) && <span>{Math.max(post.commentCount, comments.length)} Comments</span>}
                </div>
            </div>

            <CardFooter className="p-2 border-t grid grid-cols-3 gap-1 relative z-0">
                <div className="group relative flex justify-center">
                    <Button
                        variant="ghost"
                        className={`w-full ${userReaction ? "text-indigo-600" : "text-slate-600"}`}
                        onClick={() => handleReaction("like")}
                    >
                        <ThumbsUp className="h-4 w-4 mr-2" />
                        {userReaction === "like" ? "Liked" : "Like"}
                    </Button>

                    {/* Hover Reaction Menu */}
                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:flex bg-white shadow-xl rounded-full p-1 border animate-in fade-in slide-in-from-bottom-2 z-50">
                        {REACTIONS.map((r) => (
                            <button
                                key={r.value}
                                onClick={(e) => {
                                    e.stopPropagation();
                                    handleReaction(r.value);
                                }}
                                className="p-2 hover:scale-125 transition-transform text-2xl cursor-pointer"
                                title={r.label}
                                type="button"
                            >
                                {r.icon}
                            </button>
                        ))}
                    </div>
                    {/* Invisible bridge to prevent menu closing */}
                    <div className="absolute bottom-full left-0 w-full h-4 bg-transparent hidden group-hover:block" />
                </div>

                <Button variant="ghost" className="w-full text-slate-600" onClick={() => setShowComments(!showComments)}>
                    <MessageCircle className="h-4 w-4 mr-2" />
                    Comment
                </Button>
                <Button variant="ghost" className="w-full text-slate-600">
                    <Share2 className="h-4 w-4 mr-2" />
                    Share
                </Button>
            </CardFooter>

            {/* Comments Section */}
            {showComments && (
                <div className="p-4 bg-slate-50 border-t">
                    <div className="space-y-4 mb-4">
                        {comments.map((comment) => (
                            <div key={comment._id} className="flex gap-3 group/comment">
                                <Avatar className="h-8 w-8">
                                    <AvatarImage src={comment.userId.avatar || comment.userId.imageUrl} />
                                    <AvatarFallback>{comment.userId.firstName?.[0]}</AvatarFallback>
                                </Avatar>
                                <div className="flex-1">
                                    <div className="bg-white p-3 rounded-lg border shadow-sm relative">
                                        <p className="font-semibold text-xs text-slate-900">
                                            {comment.userId.firstName} {comment.userId.lastName}
                                        </p>
                                        <p className="text-sm text-slate-700 mt-1">{comment.content}</p>

                                        {/* Delete Comment Button */}
                                        {currentUser._id === comment.userId._id && (
                                            <button
                                                onClick={() => handleDeleteComment(comment._id)}
                                                className="absolute top-2 right-2 text-slate-400 hover:text-red-500 opacity-0 group-hover/comment:opacity-100 transition-opacity"
                                                title="Delete comment"
                                            >
                                                <Trash2 className="h-3 w-3" />
                                            </button>
                                        )}
                                    </div>
                                    <div className="flex items-center gap-4 mt-1 ml-1">
                                        <span className="text-xs text-slate-500">
                                            {formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true })}
                                        </span>
                                        <button className="text-xs font-medium text-slate-500 hover:text-indigo-600">Like</button>
                                        <button className="text-xs font-medium text-slate-500 hover:text-indigo-600">Reply</button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    <form onSubmit={handleComment} className="flex gap-2">
                        <Avatar className="h-8 w-8">
                            <AvatarImage src={currentUser.avatar || currentUser.imageUrl} />
                            <AvatarFallback>{currentUser.firstName?.[0]}</AvatarFallback>
                        </Avatar>
                        <Input
                            placeholder="Write a comment..."
                            className="flex-1 bg-white"
                            value={commentText}
                            onChange={(e) => setCommentText(e.target.value)}
                        />
                    </form>
                </div>
            )}
        </Card>
    );
}
