"use client";
// Phase 12: Real-time & UX Polish - SlackChat with Jump-to-Message support

import { useEffect, useRef, useState, useCallback } from "react";
import { format } from "date-fns";
import { Hash, Info, Lock, Send, Paperclip, Smile, Plus, UserPlus, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { SlackMessage } from "./slack-message";
import { SlackReactionPicker } from "./slack-reaction-picker";
import { sendChannelMessage, getChannelMessages, clearChannelUnreads } from "@/lib/actions/channel.actions";
import { getMessages, sendMessage, toggleReaction, updateMessage, deleteMessage, markMessagesAsRead } from "@/lib/actions/message.actions";
import { getUsers } from "@/lib/actions/user.actions";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { useUploadThing } from "@/lib/uploadthing";
import { useSocket } from "@/components/providers/socket-provider";

interface SlackChatProps {
    channel?: any;
    conversation?: any;
    currentUser: any;
    onInvite?: () => void;
    onThreadClick?: (message: any) => void;
    onShowProfile: (user: any) => void;
    targetMessageId?: string;
    onTargetMessageScrolled?: () => void;
}

export function SlackChat({
    channel,
    conversation,
    currentUser,
    onInvite,
    onThreadClick,
    onShowProfile,
    targetMessageId,
    onTargetMessageScrolled
}: SlackChatProps) {
    const { socket, isConnected } = useSocket();
    const [messages, setMessages] = useState<any[]>([]);
    const [newMessage, setNewMessage] = useState("");
    const [attachments, setAttachments] = useState<string[]>([]);
    const [loading, setLoading] = useState(false);
    const scrollRef = useRef<HTMLDivElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);
    const [pending, setPending] = useState(false);

    // Mention state
    const [allUsers, setAllUsers] = useState<any[]>([]);
    const [mentionSearch, setMentionSearch] = useState("");
    const [showMentions, setShowMentions] = useState(false);
    const [mentionIndex, setMentionIndex] = useState(0);

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

    const isAtBottom = () => {
        if (!scrollRef.current) return true;
        const { scrollTop, scrollHeight, clientHeight } = scrollRef.current;
        return scrollHeight - scrollTop - clientHeight < 50;
    };

    const scrollToBottom = () => {
        setTimeout(() => {
            if (scrollRef.current) {
                scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
            }
        }, 100);
    };

    const fetchMessages = useCallback(async (silent = false) => {
        if (!channel && !conversation) return;

        try {
            if (!silent) setLoading(true);
            let res;
            if (channel) {
                res = await getChannelMessages(channel._id);
            } else {
                res = await getMessages(conversation._id);
            }

            if (res.success) {
                // If silent update, check if we need to scroll (only if at bottom)
                // For now, simpler approach: just update state
                // Only scroll on initial load or if user sent message
                const wasAtBottom = isAtBottom();
                setMessages(res.data);
                if (!silent || (wasAtBottom && res.data.length > messages.length)) {
                    scrollToBottom();
                }
            }
        } finally {
            if (!silent) setLoading(false);
        }
    }, [channel, conversation]);

    // Initial fetch
    useEffect(() => {
        fetchMessages();

        // Clear unreads when entering channel/conversation
        if (channel) {
            clearChannelUnreads(channel._id, currentUser._id);
        } else if (conversation) {
            markMessagesAsRead(conversation._id, currentUser._id);
        }
    }, [fetchMessages, channel?._id, conversation?._id, currentUser._id]);

    // Fetch all users for mentions
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
        .slice(0, 8);

    const handleMentionSelect = (user: any) => {
        const before = newMessage.substring(0, newMessage.lastIndexOf("@"));
        const username = user.username || `${user.firstName}${user.lastName}`.toLowerCase().replace(/\s/g, "");
        setNewMessage(before + "@" + username + " ");
        setShowMentions(false);
        inputRef.current?.focus();
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setNewMessage(value);

        const lastChar = value[value.length - 1];
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

    // Socket listeners for real-time updates
    useEffect(() => {
        if (!socket) return;

        const onNewMessage = (msg: any) => {
            // Only add if it belongs to the current view
            const isForChannel = channel && msg.channelId === channel._id;
            const isForConversation = conversation && msg.conversationId === conversation._id;

            if (isForChannel || isForConversation) {
                setMessages((prev) => {
                    if (prev.find(m => m._id === msg._id)) return prev;
                    return [...prev, msg];
                });
                scrollToBottom();
            }
        };

        socket.on("message:new", onNewMessage);

        return () => {
            socket.off("message:new", onNewMessage);
        };
    }, [socket, channel?._id, conversation?._id]);

    // Handle jumping to a specific message
    useEffect(() => {
        if (!targetMessageId || messages.length === 0) return;

        const timer = setTimeout(() => {
            const element = document.getElementById(`message-${targetMessageId}`);
            if (element && scrollRef.current) {
                element.scrollIntoView({ behavior: "smooth", block: "center" });
                // Clear the target after a short delay so highlighting eventually disappears
                setTimeout(() => {
                    onTargetMessageScrolled?.();
                }, 2000);
            }
        }, 500);

        return () => clearTimeout(timer);
    }, [targetMessageId, messages.length, onTargetMessageScrolled]);

    const handleSendMessage = async (e?: React.FormEvent) => {
        e?.preventDefault();
        if (!newMessage.trim() || pending) return;

        setPending(true);
        const content = newMessage;
        setNewMessage(""); // Optimistic clear

        try {
            let res;
            if (channel) {
                res = await sendChannelMessage({
                    channelId: channel._id,
                    senderId: currentUser._id,
                    content,
                    attachments
                });
            } else {
                res = await sendMessage({
                    conversationId: conversation._id,
                    senderId: currentUser._id,
                    content,
                    attachments
                });
            }

            if (res.success) {
                setNewMessage("");
                setAttachments([]);

                // Emit socket event for real-time update
                if (socket) {
                    socket.emit("message:new", res.data);
                }

                // For channels, we also want to trigger an unread update for others
                if (channel && socket) {
                    socket.emit("unread:update", {
                        channelId: channel._id,
                        senderId: currentUser._id
                    });
                } else if (conversation && socket) {
                    socket.emit("unread:update", {
                        conversationId: conversation._id,
                        senderId: currentUser._id
                    });
                }

                // Emit notifications for mentions in real-time
                if (socket && res.data.mentions?.length > 0) {
                    res.data.mentions.forEach((mentionId: string) => {
                        if (mentionId !== currentUser._id) {
                            socket.emit("notification:new", {
                                recipientId: mentionId,
                                senderId: currentUser._id,
                                senderName: `${currentUser.firstName} ${currentUser.lastName}`,
                                type: "mention",
                                content: `mentioned you in ${channel ? `#${channel.name}` : "a message"}`,
                                link: channel ? `/messages?channelId=${channel._id}` : `/messages/${conversation._id}`
                            });
                        }
                    });
                }

                fetchMessages(true);
            } else {
                toast.error("Failed to send message");
                setNewMessage(content); // Restore on error
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
                setMessages(prev => prev.map(m => m._id === messageId ? { ...m, content, isEdited: true } : m));
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
                setMessages(prev => prev.filter(m => m._id !== messageId));
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
                setMessages(prev => prev.map(m => {
                    if (m._id === messageId) {
                        const newReactions = { ...(m.reactions || {}) };
                        if (newReactions[currentUser._id] === emoji) {
                            delete newReactions[currentUser._id];
                        } else {
                            newReactions[currentUser._id] = emoji;
                        }
                    }
                    return m;
                }));
            }
        } catch (err) {
            console.error(err);
        }
    };

    const handleEmojiSelect = (emoji: string) => {
        setNewMessage(prev => prev + emoji);
        inputRef.current?.focus();
    };

    const handlePlusClick = () => {
        fileInputRef.current?.click();
    };

    if (!channel && !conversation) {
        return (
            <div className="flex-1 flex items-center justify-center bg-white text-slate-500">
                <div className="text-center">
                    <p>Select a channel or conversation to start chatting.</p>
                </div>
            </div>
        );
    }

    const isGroup = conversation?.isGroup;
    const otherUser = isGroup ? null : (conversation?.participants.find((p: any) => p._id !== currentUser._id) || currentUser);

    const title = channel ? channel.name : (
        isGroup
            ? (conversation.groupName || conversation.participants
                .filter((p: any) => p._id !== currentUser._id)
                .map((p: any) => p.firstName)
                .join(", "))
            : (otherUser?._id === currentUser?._id
                ? `${currentUser.firstName} ${currentUser.lastName} (you)`
                : `${otherUser?.firstName} ${otherUser?.lastName}`)
    );

    return (
        <div className="flex-1 flex flex-col h-full bg-white">
            {/* Header */}
            <div className="h-16 border-b flex items-center justify-between px-5 flex-shrink-0">
                <div className="flex items-center">
                    {channel ? (
                        channel.isPrivate ? <Lock className="w-4 h-4 mr-2" /> : <Hash className="w-4 h-4 mr-2 text-slate-500" />
                    ) : (
                        isGroup ? (
                            <div className="w-5 h-5 rounded bg-slate-200 flex items-center justify-center text-[10px] font-bold text-slate-600 mr-2">
                                {conversation.participants.length}
                            </div>
                        ) : (
                            <div className="w-2 h-2 rounded-full bg-green-500 mr-2" />
                        )
                    )}
                    <h3 className="font-bold text-slate-900 truncate max-w-[400px]">{title}</h3>
                </div>
                <div className="flex items-center gap-2">
                    {channel && (
                        <Button
                            variant="ghost"
                            size="sm"
                            className="text-slate-500 hover:text-slate-900 hidden md:flex items-center gap-2"
                            onClick={onInvite}
                        >
                            <UserPlus className="w-4 h-4" />
                            <span>Invite</span>
                        </Button>
                    )}
                    <Button variant="ghost" size="icon" className="text-slate-500">
                        <Info className="w-5 h-5" />
                    </Button>
                </div>
            </div>

            {/* Messages */}
            <div
                ref={scrollRef}
                className="flex-1 overflow-y-auto"
            >
                {loading && messages.length === 0 ? (
                    <div className="flex items-center justify-center h-full text-slate-400">Loading messages...</div>
                ) : (
                    <div className="pb-4">
                        {messages.length === 0 ? (
                            <div className="p-8 text-slate-500 pb-20">
                                <h3 className="font-bold text-2xl mb-2">Welcome to #{title}!</h3>
                                <p>This is the start of the <span className="font-semibold">#{title}</span> channel.</p>
                            </div>
                        ) : (
                            messages.map((msg, i) => (
                                <SlackMessage
                                    key={msg._id}
                                    message={msg}
                                    currentUser={currentUser}
                                    isSameSender={i > 0 && messages[i - 1].sender?._id === msg.sender?._id}
                                    onThreadClick={onThreadClick}
                                    onReaction={(emoji) => handleReaction(msg._id, emoji)}
                                    onShowProfile={() => onShowProfile(msg.sender)}
                                    onEdit={handleEditMessage}
                                    onDelete={handleDeleteMessage}
                                    isTarget={msg._id === targetMessageId}
                                />
                            ))
                        )}
                    </div>
                )}
            </div>

            {/* Input Area */}
            <div className="p-5 pt-0">
                <div className="border border-slate-300 rounded-lg shadow-sm bg-white overflow-hidden focus-within:ring-1 focus-within:ring-blue-500 focus-within:border-blue-500 transition-all">
                    {/* Toolbar */}
                    <div className="flex items-center bg-slate-50 border-b p-1 px-2 gap-1">
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-600"><span className="font-bold">B</span></Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-600"><span className="italic">I</span></Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-600"><span className="line-through">S</span></Button>
                        <div className="w-px h-4 bg-slate-300 mx-1" />
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
                                onClick={handlePlusClick}
                                className={cn(
                                    "h-8 w-8 flex items-center justify-center rounded-md text-slate-600 hover:bg-slate-200",
                                    isUploading && "opacity-50 animate-pulse"
                                )}
                            >
                                <Paperclip className="w-4 h-4" />
                            </div>
                        </label>
                    </div>

                    {attachments.length > 0 && (
                        <div className="p-2 flex flex-wrap gap-2 bg-slate-50 border-b">
                            {attachments.map((url, i) => (
                                <div key={i} className="relative group h-20 w-20 border rounded overflow-hidden bg-white">
                                    <img src={url} alt="Attached" className="h-full w-full object-cover" />
                                    <button
                                        type="button"
                                        onClick={() => setAttachments(prev => prev.filter((_, idx) => idx !== i))}
                                        className="absolute top-1 right-1 bg-black/50 text-white rounded-full p-0.5 opacity-0 group-hover:opacity-100"
                                    >
                                        <X className="w-3 h-3" />
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}

                    <form onSubmit={handleSendMessage} className="p-2">
                        <div className="relative">
                            <Input
                                ref={inputRef}
                                className="border-0 focus-visible:ring-0 px-2 py-3 h-auto text-[15px] resize-none shadow-none"
                                placeholder={`Message #${title}`}
                                value={newMessage}
                                onChange={handleInputChange}
                                onKeyDown={handleKeyDown}
                                autoFocus
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
                                                    <span className="ml-2 text-xs text-slate-400">{user.firstName} {user.lastName}</span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                        <div className="flex justify-between items-center mt-2">
                            <div className="flex gap-1">
                                <Button
                                    type="button"
                                    variant="ghost"
                                    size="icon"
                                    className="h-8 w-8 text-slate-500 hover:bg-slate-100"
                                    onClick={handlePlusClick}
                                >
                                    <Plus className="w-5 h-5" />
                                </Button>
                                <SlackReactionPicker onSelect={handleEmojiSelect}>
                                    <Button type="button" variant="ghost" size="icon" className="h-8 w-8 text-slate-500 hover:bg-slate-100">
                                        <Smile className="w-5 h-5" />
                                    </Button>
                                </SlackReactionPicker>
                            </div>
                            <Button
                                type="submit"
                                size="sm"
                                className={cn(
                                    "transition-colors",
                                    newMessage.trim() ? "bg-[#007a5a] hover:bg-[#148567]" : "bg-slate-200 text-slate-400 hover:bg-slate-200"
                                )}
                                disabled={!newMessage.trim() || pending}
                            >
                                <Send className="w-4 h-4 mr-1" /> Send
                            </Button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
