"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { createReply } from "@/lib/actions/group.actions";
import { toast } from "sonner";
import { Loader2, Send } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface ReplyFormProps {
    threadId: string;
    groupSlug: string;
    userId: string;
    userAvatar?: string;
    userInitials?: string;
}

export function ReplyForm({ threadId, groupSlug, userId, userAvatar, userInitials }: ReplyFormProps) {
    const [content, setContent] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!content.trim()) return;

        setIsLoading(true);
        try {
            await createReply({
                content,
                thread: threadId,
                groupSlug,
                author: userId,
            });

            setContent("");
            toast.success("Reply posted!");
        } catch (error) {
            toast.error("Failed to post reply");
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex gap-4">
            <Avatar className="h-10 w-10 border border-slate-100 hidden md:block">
                <AvatarImage src={userAvatar} />
                <AvatarFallback>{userInitials}</AvatarFallback>
            </Avatar>

            <div className="flex-1">
                <form onSubmit={handleSubmit} className="relative">
                    <Textarea
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        placeholder="Write a reply..."
                        className="min-h-[100px] pr-12 resize-none"
                    />
                    <div className="absolute bottom-3 right-3">
                        <Button
                            size="sm"
                            type="submit"
                            disabled={isLoading || !content.trim()}
                            className="h-8 w-8 p-0 rounded-full"
                        >
                            {isLoading ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                                <Send className="h-4 w-4" />
                            )}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
}
