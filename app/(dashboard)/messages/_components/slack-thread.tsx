"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { X, Send, Smile, Paperclip } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { SlackMessage } from "./slack-message";
import { getThreadReplies, sendMessage, toggleReaction } from "@/lib/actions/message.actions";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { useUploadThing } from "@/lib/uploadthing";

interface SlackThreadProps {
    parentMessage: any;
    currentUser: any;
    onClose: () => void;
}

export function SlackThread({ parentMessage, currentUser, onClose }: SlackThreadProps) {
    const [replies, setReplies] = useState<any[]>([]);
    const [newReply, setNewReply] = useState("");
    const [attachments, setAttachments] = useState<string[]>([]);
    const [loading, setLoading] = useState(false);
    const [pending, setPending] = useState(false);
    const scrollRef = useRef<HTMLDivElement>(null);

    const { startUpload, isUploading } = useUploadThing("messageAttachment", {
        onClientUploadComplete: (res: any) => {
            const urls = res.map((f: any) => f.url);
            setAttachments(prev => [...prev, ...urls]);
            toast.success("Files uploaded");
        },
        onUploadError: (err: any) => {
            toast.error("Upload failed");
            console.error(err);
        }
    });

    const scrollToBottom = () => {
        setTimeout(() => {
            if (scrollRef.current) {
                scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
            }
        }, 100);
    };

    const fetchReplies = useCallback(async (silent = false) => {
        if (!parentMessage) return;
        try {
            if (!silent) setLoading(true);
            const res = await getThreadReplies(parentMessage._id);
            if (res.success) {
                setReplies(res.data);
                if (!silent) scrollToBottom();
            }
        } finally {
            if (!silent) setLoading(false);
        }
    }, [parentMessage]);

    useEffect(() => {
        fetchReplies();
    }, [fetchReplies]);

    // Polling replies
    useEffect(() => {
        const interval = setInterval(() => {
            fetchReplies(true);
        }, 3000);
        return () => clearInterval(interval);
    }, [fetchReplies]);

    const handleSendReply = async (e?: React.FormEvent) => {
        e?.preventDefault();
        if (!newReply.trim() || pending) return;

        setPending(true);
        const content = newReply;
        setNewReply("");

        try {
            const res = await sendMessage({
                conversationId: parentMessage.conversationId,
                channelId: parentMessage.channelId,
                senderId: currentUser._id,
                content,
                replyTo: parentMessage._id,
                attachments
            });

            if (res.success) {
                setReplies(prev => [...prev, res.data]);
                setAttachments([]);
                scrollToBottom();
            } else {
                toast.error("Failed to send reply");
                setNewReply(content);
            }
        } catch (err) {
            console.error(err);
            toast.error("Something went wrong");
        } finally {
            setPending(false);
        }
    };

    const handleReaction = async (messageId: string, emoji: string) => {
        try {
            const res = await toggleReaction(messageId, currentUser._id, emoji);
            if (res.success) {
                // Update local state for immediate feedback
                setReplies(prev => prev.map(m => {
                    if (m._id === messageId) {
                        const newReactions = { ...(m.reactions || {}) };
                        if (newReactions[currentUser._id] === emoji) {
                            delete newReactions[currentUser._id];
                        } else {
                            newReactions[currentUser._id] = emoji;
                        }
                        return { ...m, reactions: newReactions };
                    }
                    return m;
                }));
            } else {
                toast.error("Failed to toggle reaction");
            }
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div className="w-[400px] border-l flex flex-col h-full bg-white animate-in slide-in-from-right duration-300">
            {/* Header */}
            <div className="h-16 border-b flex items-center justify-between px-4 flex-shrink-0">
                <div className="flex flex-col">
                    <h3 className="font-bold text-slate-900">Thread</h3>
                    <span className="text-xs text-slate-500">#{parentMessage.channelId ? "channel" : "conversation"}</span>
                </div>
                <Button variant="ghost" size="icon" onClick={onClose} className="h-8 w-8 text-slate-500">
                    <X className="w-5 h-5" />
                </Button>
            </div>

            {/* Content */}
            <ScrollArea className="flex-1">
                <div className="pb-4">
                    {/* Parent Message */}
                    <div className="border-b pb-2 mb-2 bg-slate-50/50">
                        <SlackMessage
                            message={parentMessage}
                            onReaction={(emoji) => handleReaction(parentMessage._id, emoji)}
                        />
                    </div>

                    <div className="px-5 py-2 flex items-center gap-2">
                        <span className="text-xs text-slate-500 font-medium">
                            {replies.length} {replies.length === 1 ? 'reply' : 'replies'}
                        </span>
                        <div className="h-px flex-1 bg-slate-200" />
                    </div>

                    {/* Replies */}
                    <div className="space-y-0.5">
                        {loading && replies.length === 0 ? (
                            <div className="p-8 text-center text-slate-400">Loading replies...</div>
                        ) : (
                            replies.map((reply, i) => (
                                <SlackMessage
                                    key={reply._id}
                                    message={reply}
                                    isSameSender={i > 0 && replies[i - 1].sender?._id === reply.sender?._id}
                                    onReaction={(emoji) => handleReaction(reply._id, emoji)}
                                />
                            ))
                        )}
                        <div ref={scrollRef} />
                    </div>
                </div>
            </ScrollArea>

            {/* Input */}
            <div className="p-4 pt-0">
                <div className="border border-slate-300 rounded-lg bg-white overflow-hidden">
                    <form onSubmit={handleSendReply} className="p-2">
                        <Input
                            className="border-0 focus-visible:ring-0 px-2 py-3 h-auto text-sm resize-none shadow-none"
                            placeholder="Reply..."
                            value={newReply}
                            onChange={(e) => setNewReply(e.target.value)}
                        />
                        <div className="flex justify-between items-center mt-2">
                            <div className="flex gap-1">
                                <Button type="button" variant="ghost" size="icon" className="h-7 w-7 text-slate-500">
                                    <Smile className="w-4 h-4" />
                                </Button>
                                <label className="cursor-pointer">
                                    <input
                                        type="file"
                                        className="hidden"
                                        multiple
                                        onChange={(e) => {
                                            if (e.target.files) startUpload(Array.from(e.target.files));
                                        }}
                                    />
                                    <div className={cn(
                                        "h-7 w-7 flex items-center justify-center rounded-md text-slate-500 hover:bg-slate-100",
                                        isUploading && "opacity-50 animate-pulse"
                                    )}>
                                        <Paperclip className="w-4 h-4" />
                                    </div>
                                </label>
                            </div>
                            <Button
                                type="submit"
                                size="sm"
                                variant="ghost"
                                className={cn(
                                    "h-7 w-7 p-0",
                                    (newReply.trim() || attachments.length > 0) ? "text-[#007a5a]" : "text-slate-300"
                                )}
                                disabled={(!newReply.trim() && attachments.length === 0) || pending}
                            >
                                <Send className="w-4 h-4" />
                            </Button>
                        </div>
                    </form>
                </div>
            </div>

            {attachments.length > 0 && (
                <div className="px-4 pb-2 flex flex-wrap gap-2">
                    {attachments.map((url, i) => (
                        <div key={i} className="relative group h-14 w-14 border rounded overflow-hidden bg-white shadow-sm">
                            <img src={url} alt="Attached" className="h-full w-full object-cover" />
                            <button
                                type="button"
                                onClick={() => setAttachments(prev => prev.filter((_, idx) => idx !== i))}
                                className="absolute top-0 right-0 bg-black/50 text-white rounded-full p-0.5 opacity-0 group-hover:opacity-100"
                            >
                                <X className="w-2.5 h-2.5" />
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
