"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { X, Send, Smile, Paperclip } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { SlackMessage } from "./slack-message";
import { SlackReactionPicker } from "./slack-reaction-picker";
import { getThreadReplies, sendMessage, toggleReaction, updateMessage, deleteMessage } from "@/lib/actions/message.actions";
import { getUsers } from "@/lib/actions/user.actions";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { useUploadThing } from "@/lib/uploadthing";
import { useSocket } from "@/components/providers/socket-provider";

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
    const inputRef = useRef<HTMLInputElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const { socket } = useSocket();

    // Mention state
    const [allUsers, setAllUsers] = useState<any[]>([]);
    const [mentionSearch, setMentionSearch] = useState("");
    const [showMentions, setShowMentions] = useState(false);
    const [mentionIndex, setMentionIndex] = useState(0);

    const { startUpload, isUploading } = useUploadThing("messageAttachment", {
        onClientUploadComplete: (res: any) => {
            const urls = res.map((f: any) => f.ufsUrl || f.url);
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

    // Fetch users for mentions
    useEffect(() => {
        const fetchUsers = async () => {
            const res = await getUsers();
            if (res.success) {
                setAllUsers(res.data);
            }
        };
        fetchUsers();
    }, []);

    // Mention helpers
    const filteredMentions = allUsers
        .filter(u =>
            u._id !== currentUser._id &&
            (u.firstName?.toLowerCase().includes(mentionSearch.toLowerCase()) ||
                u.lastName?.toLowerCase().includes(mentionSearch.toLowerCase()) ||
                u.username?.toLowerCase().includes(mentionSearch.toLowerCase()))
        )
        .slice(0, 5);

    const handleMentionSelect = (user: any) => {
        const before = newReply.substring(0, newReply.lastIndexOf("@"));
        const username = user.username || `${user.firstName}${user.lastName}`.toLowerCase().replace(/\s/g, "");
        setNewReply(before + "@" + username + " ");
        setShowMentions(false);
        inputRef.current?.focus();
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setNewReply(value);

        const lastWord = value.split(" ").pop() || "";
        if (lastWord.startsWith("@")) {
            setMentionSearch(lastWord.substring(1));
            setShowMentions(true);
            setMentionIndex(0);
        } else {
            setShowMentions(false);
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (showMentions) {
            if (e.key === "ArrowDown") {
                e.preventDefault();
                setMentionIndex(prev => (prev + 1) % filteredMentions.length);
            } else if (e.key === "ArrowUp") {
                e.preventDefault();
                setMentionIndex(prev => (prev - 1 + filteredMentions.length) % filteredMentions.length);
            } else if (e.key === "Enter" && filteredMentions.length > 0) {
                e.preventDefault();
                handleMentionSelect(filteredMentions[mentionIndex]);
            } else if (e.key === "Escape") {
                setShowMentions(false);
            }
        }
    };

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

                // Emit real-time message event
                if (socket) {
                    socket.emit("message:new", res.data);

                    // Emit notifications for mentions
                    if (res.data.mentions?.length > 0) {
                        res.data.mentions.forEach((mentionId: string) => {
                            if (mentionId !== currentUser._id) {
                                socket.emit("notification:new", {
                                    recipientId: mentionId,
                                    senderId: currentUser._id,
                                    senderName: `${currentUser.firstName} ${currentUser.lastName}`,
                                    type: "mention",
                                    content: `replied to a thread you are in`,
                                    link: parentMessage.channelId
                                        ? `/messages?channelId=${parentMessage.channelId._id || parentMessage.channelId}`
                                        : `/messages/${parentMessage.conversationId._id || parentMessage.conversationId}`
                                });
                            }
                        });
                    }
                }
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

    const handleEditMessage = async (messageId: string, content: string) => {
        try {
            const res = await updateMessage(messageId, currentUser._id, content);
            if (res.success) {
                setReplies(prev => prev.map(m => m._id === messageId ? { ...m, content, isEdited: true } : m));
            } else {
                toast.error(res.error || "Failed to edit message");
            }
        } catch (err) {
            console.error(err);
            toast.error("Something went wrong");
        }
    };

    const handleDeleteMessage = async (messageId: string) => {
        try {
            const res = await deleteMessage(messageId, currentUser._id);
            if (res.success) {
                setReplies(prev => prev.filter(m => m._id !== messageId));
                toast.success("Message deleted");
            } else {
                toast.error(res.error || "Failed to delete message");
            }
        } catch (err) {
            console.error(err);
            toast.error("Something went wrong");
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

    const handleEmojiSelect = (emoji: string) => {
        setNewReply(prev => prev + emoji);
        inputRef.current?.focus();
    };

    const handlePaperclipClick = () => {
        fileInputRef.current?.click();
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
                            currentUser={currentUser}
                            onReaction={(emoji) => handleReaction(parentMessage._id, emoji)}
                            onEdit={handleEditMessage}
                            onDelete={handleDeleteMessage}
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
                                    currentUser={currentUser}
                                    isSameSender={i > 0 && replies[i - 1].sender?._id === reply.sender?._id}
                                    onReaction={(emoji) => handleReaction(reply._id, emoji)}
                                    onEdit={handleEditMessage}
                                    onDelete={handleDeleteMessage}
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
                        <div className="relative">
                            <Input
                                ref={inputRef}
                                className="border-0 focus-visible:ring-0 px-2 py-3 h-auto text-sm resize-none shadow-none"
                                placeholder="Reply..."
                                value={newReply}
                                onChange={handleInputChange}
                                onKeyDown={handleKeyDown}
                            />
                            {showMentions && filteredMentions.length > 0 && (
                                <div className="absolute bottom-full left-0 mb-2 w-64 bg-white border border-slate-200 rounded-lg shadow-xl z-50 overflow-hidden">
                                    <div className="p-2 bg-slate-50 border-b text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                                        Members
                                    </div>
                                    <div className="max-h-60 overflow-y-auto">
                                        {filteredMentions.map((user, i) => (
                                            <div
                                                key={user._id}
                                                className={cn(
                                                    "flex items-center gap-2 p-2 px-3 cursor-pointer transition-colors",
                                                    i === mentionIndex ? "bg-indigo-50 text-indigo-600" : "hover:bg-slate-50"
                                                )}
                                                onClick={() => handleMentionSelect(user)}
                                            >
                                                <div className="h-6 w-6 rounded-full overflow-hidden bg-slate-200">
                                                    {user.profileImage ? (
                                                        <img src={user.profileImage} className="h-full w-full object-cover" />
                                                    ) : (
                                                        <div className="h-full w-full flex items-center justify-center text-[10px] font-bold">
                                                            {user.firstName?.[0]}{user.lastName?.[0]}
                                                        </div>
                                                    )}
                                                </div>
                                                <div className="flex-1 truncate">
                                                    <span className="font-medium text-sm">@{user.username || `${user.firstName}${user.lastName}`.toLowerCase()}</span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                        <div className="flex justify-between items-center mt-2">
                            <div className="flex gap-1">
                                <SlackReactionPicker onSelect={handleEmojiSelect}>
                                    <Button type="button" variant="ghost" size="icon" className="h-7 w-7 text-slate-500">
                                        <Smile className="w-4 h-4" />
                                    </Button>
                                </SlackReactionPicker>
                                <label className="cursor-pointer">
                                    <input
                                        type="file"
                                        className="hidden"
                                        multiple
                                        ref={fileInputRef}
                                        onChange={(e) => {
                                            if (e.target.files) startUpload(Array.from(e.target.files));
                                        }}
                                    />
                                    <div
                                        onClick={handlePaperclipClick}
                                        className={cn(
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
