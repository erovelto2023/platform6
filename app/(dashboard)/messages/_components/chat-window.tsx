"use client";

import { useState, useEffect, useRef } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send, MoreVertical, Phone, Video } from "lucide-react";
import { getMessages, sendMessage, markMessagesAsRead } from "@/lib/actions/message.actions";
import { formatDistanceToNow } from "date-fns";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

interface ChatWindowProps {
    conversation: any;
    currentUser: any;
}

export function ChatWindow({ conversation, currentUser }: ChatWindowProps) {
    const [messages, setMessages] = useState<any[]>([]);
    const [messageText, setMessageText] = useState("");
    const [loading, setLoading] = useState(true);
    const [sending, setSending] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const otherUser = conversation.participants.find(
        (p: any) => p._id !== currentUser._id
    );

    useEffect(() => {
        loadMessages();
        markAsRead();

        // Auto-refresh messages every 5 seconds
        const interval = setInterval(loadMessages, 5000);
        return () => clearInterval(interval);
    }, [conversation._id]);

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const loadMessages = async () => {
        const result = await getMessages(conversation._id);
        if (result.success && result.data) {
            setMessages(result.data);
        }
        setLoading(false);
    };

    const markAsRead = async () => {
        await markMessagesAsRead(conversation._id, currentUser._id);
    };

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    const handleSend = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!messageText.trim() || sending) return;

        setSending(true);
        const tempMessage = {
            _id: Date.now().toString(),
            content: messageText,
            senderId: currentUser,
            createdAt: new Date(),
            isRead: false
        };

        setMessages(prev => [...prev, tempMessage]);
        setMessageText("");

        try {
            const result = await sendMessage({
                conversationId: conversation._id,
                senderId: currentUser._id,
                content: messageText
            });

            if (result.success && result.data) {
                // Replace temp message with real one
                setMessages(prev =>
                    prev.map(m => m._id === tempMessage._id ? result.data : m)
                );
            } else {
                toast.error("Failed to send message");
                setMessages(prev => prev.filter(m => m._id !== tempMessage._id));
            }
        } catch (error) {
            toast.error("Failed to send message");
            setMessages(prev => prev.filter(m => m._id !== tempMessage._id));
        } finally {
            setSending(false);
        }
    };

    return (
        <div className="h-full flex flex-col bg-white">
            {/* Header */}
            <div className="p-4 border-b flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <Avatar className="h-10 w-10">
                        <AvatarImage src={otherUser?.profileImage} />
                        <AvatarFallback className="bg-indigo-100 text-indigo-600">
                            {otherUser?.firstName?.[0]}{otherUser?.lastName?.[0]}
                        </AvatarFallback>
                    </Avatar>
                    <div>
                        <h3 className="font-semibold">
                            {otherUser?.firstName} {otherUser?.lastName}
                        </h3>
                        <p className="text-xs text-slate-500">Active now</p>
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    <Button size="icon" variant="ghost">
                        <Phone className="h-5 w-5" />
                    </Button>
                    <Button size="icon" variant="ghost">
                        <Video className="h-5 w-5" />
                    </Button>
                    <Button size="icon" variant="ghost">
                        <MoreVertical className="h-5 w-5" />
                    </Button>
                </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50">
                {loading ? (
                    <div className="flex items-center justify-center h-full">
                        <p className="text-slate-500">Loading messages...</p>
                    </div>
                ) : messages.length === 0 ? (
                    <div className="flex items-center justify-center h-full">
                        <div className="text-center">
                            <p className="text-slate-500 font-medium">No messages yet</p>
                            <p className="text-sm text-slate-400 mt-1">
                                Send a message to start the conversation
                            </p>
                        </div>
                    </div>
                ) : (
                    messages.map((message, index) => {
                        const isOwn = message.senderId._id === currentUser._id || message.senderId === currentUser._id;
                        const showAvatar = index === 0 ||
                            messages[index - 1].senderId._id !== message.senderId._id;

                        return (
                            <div
                                key={message._id}
                                className={cn(
                                    "flex gap-2",
                                    isOwn ? "justify-end" : "justify-start"
                                )}
                            >
                                {!isOwn && showAvatar && (
                                    <Avatar className="h-8 w-8 flex-shrink-0">
                                        <AvatarImage src={otherUser?.profileImage} />
                                        <AvatarFallback className="bg-indigo-100 text-indigo-600 text-xs">
                                            {otherUser?.firstName?.[0]}{otherUser?.lastName?.[0]}
                                        </AvatarFallback>
                                    </Avatar>
                                )}
                                {!isOwn && !showAvatar && <div className="w-8" />}

                                <div className={cn("max-w-[70%]", isOwn && "flex flex-col items-end")}>
                                    <div
                                        className={cn(
                                            "px-4 py-2 rounded-2xl",
                                            isOwn
                                                ? "bg-indigo-600 text-white"
                                                : "bg-white border"
                                        )}
                                    >
                                        <p className="text-sm whitespace-pre-wrap break-words">
                                            {message.content}
                                        </p>
                                    </div>
                                    <span className="text-xs text-slate-500 mt-1 px-2">
                                        {formatDistanceToNow(new Date(message.createdAt), {
                                            addSuffix: true
                                        })}
                                    </span>
                                </div>
                            </div>
                        );
                    })
                )}
                <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="p-4 border-t bg-white">
                <form onSubmit={handleSend} className="flex gap-2">
                    <Input
                        placeholder="Type a message..."
                        value={messageText}
                        onChange={(e) => setMessageText(e.target.value)}
                        disabled={sending}
                        className="flex-1"
                    />
                    <Button type="submit" disabled={sending || !messageText.trim()}>
                        <Send className="h-4 w-4" />
                    </Button>
                </form>
            </div>
        </div>
    );
}
