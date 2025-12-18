"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { formatDistanceToNow } from "date-fns";
import { MoreHorizontal, ThumbsUp, Check, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { markAsSolved } from "@/lib/actions/group.actions";
import { toast } from "sonner";
import { useState } from "react";
import { cn } from "@/lib/utils";

interface ReplyListProps {
    replies: any[];
    isQuestion?: boolean;
    isAuthor?: boolean;
    threadId?: string;
    groupSlug?: string;
}

export function ReplyList({ replies, isQuestion, isAuthor, threadId, groupSlug }: ReplyListProps) {
    const [isLoading, setIsLoading] = useState(false);

    const handleMarkSolved = async (replyId: string) => {
        if (!threadId || !groupSlug) return;

        setIsLoading(true);
        try {
            await markAsSolved(threadId, replyId, groupSlug);
            toast.success("Marked as best answer!");
        } catch (error) {
            toast.error("Failed to mark answer");
        } finally {
            setIsLoading(false);
        }
    };

    if (replies.length === 0) {
        return null;
    }

    // Sort replies: Accepted answer first
    const sortedReplies = [...replies].sort((a, b) => {
        if (a.isAcceptedAnswer) return -1;
        if (b.isAcceptedAnswer) return 1;
        return 0;
    });

    return (
        <div className="space-y-6">
            {sortedReplies.map((reply) => (
                <div
                    key={reply._id}
                    className={cn(
                        "flex gap-4 group rounded-lg p-4 -mx-4 transition-colors",
                        reply.isAcceptedAnswer ? "bg-emerald-50 border border-emerald-100" : "hover:bg-slate-50"
                    )}
                >
                    <Avatar className="h-10 w-10 border border-slate-100">
                        <AvatarImage src={reply.author?.avatar} />
                        <AvatarFallback>{reply.author?.firstName?.[0]}</AvatarFallback>
                    </Avatar>

                    <div className="flex-1 space-y-1">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <span className="font-semibold text-sm text-slate-900">
                                    {reply.author?.firstName} {reply.author?.lastName}
                                </span>
                                <span className="text-xs text-slate-500">
                                    {formatDistanceToNow(new Date(reply.createdAt), { addSuffix: true })}
                                </span>
                                {reply.isAcceptedAnswer && (
                                    <span className="flex items-center gap-1 text-xs font-medium text-emerald-600 bg-emerald-100 px-2 py-0.5 rounded-full">
                                        <CheckCircle2 className="h-3 w-3" />
                                        Best Answer
                                    </span>
                                )}
                            </div>

                            {/* Actions */}
                            <div className="flex items-center gap-2">
                                {isQuestion && isAuthor && !reply.isAcceptedAnswer && (
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        className="h-7 text-xs opacity-0 group-hover:opacity-100 transition-opacity"
                                        onClick={() => handleMarkSolved(reply._id)}
                                        disabled={isLoading}
                                    >
                                        <Check className="h-3 w-3 mr-1" />
                                        Mark as Answer
                                    </Button>
                                )}
                                <Button variant="ghost" size="icon" className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <MoreHorizontal className="h-4 w-4 text-slate-400" />
                                </Button>
                            </div>
                        </div>

                        <div className="text-slate-700 text-sm leading-relaxed whitespace-pre-wrap">
                            {reply.content}
                        </div>

                        <div className="flex items-center gap-4 pt-1">
                            <button className="flex items-center gap-1 text-xs text-slate-500 hover:text-slate-900 transition-colors">
                                <ThumbsUp className="h-3 w-3" />
                                <span>Like</span>
                            </button>
                            <button className="text-xs text-slate-500 hover:text-slate-900 transition-colors">
                                Reply
                            </button>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}
