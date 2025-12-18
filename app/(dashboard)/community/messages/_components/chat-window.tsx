"use client";

import { useState, useRef, useEffect } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send, Paperclip, Image as ImageIcon, Smile, MoreVertical } from "lucide-react";
import { cn } from "@/lib/utils";
import { sendMessage } from "@/lib/actions/messaging.actions";
import { formatDistanceToNow } from "date-fns";
import { toast } from "sonner";

interface ChatWindowProps {
    conversation: any;
    currentUserId: string;
    initialMessages: any[];
}

export function ChatWindow({ conversation, currentUserId, initialMessages }: ChatWindowProps) {
    const [messages, setMessages] = useState(initialMessages);
    const [newMessage, setNewMessage] = useState("");
    const [isSending, setIsSending] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const otherParticipant = conversation.participants.find((p: any) => p._id !== currentUserId);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSendMessage = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newMessage.trim() || isSending) return;

        setIsSending(true);
        try {
            const sentMessage = await sendMessage({
                conversationId: conversation._id,
                senderId: currentUserId,
                content: newMessage,
                type: 'text'
            });

            setMessages((prev) => [sentMessage, ...prev]);
            setNewMessage("");
        } catch (error) {
            toast.error("Failed to send message");
        } finally {
            setIsSending(false);
        }
    };

    return (
        <div className="flex flex-col h-full bg-white">
            {/* Header */}
            <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-white z-10">
                <div className="flex items-center gap-3">
                    <Avatar className="h-10 w-10 border border-slate-100">
                        <AvatarImage src={otherParticipant?.avatar || otherParticipant?.imageUrl} />
                        <AvatarFallback>{otherParticipant?.firstName?.[0]}</AvatarFallback>
                    </Avatar>
                    <div>
                        <h3 className="font-semibold text-slate-900">
                            {conversation.isGroup ? conversation.groupName : `${otherParticipant?.firstName} ${otherParticipant?.lastName}`}
                        </h3>
                        <p className="text-xs text-slate-500">
                            {conversation.isGroup ? `${conversation.participants.length} members` : "Online"}
                        </p>
                    </div>
                </div>
                <Button variant="ghost" size="icon">
                    <MoreVertical className="h-5 w-5 text-slate-500" />
                </Button>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50 flex flex-col-reverse">
                <div ref={messagesEndRef} />
                {messages.map((msg, index) => {
                    const isMe = msg.sender._id === currentUserId;
                    const showAvatar = !isMe && (index === messages.length - 1 || messages[index + 1]?.sender._id !== msg.sender._id);

                    return (
                        <div key={msg._id} className={cn("flex gap-2 max-w-[75%]", isMe ? "self-end flex-row-reverse" : "self-start")}>
                            {!isMe && (
                                <div className="w-8 flex-shrink-0">
                                    {showAvatar && (
                                        <Avatar className="h-8 w-8">
                                            <AvatarImage src={msg.sender.avatar || msg.sender.imageUrl} />
                                            <AvatarFallback>{msg.sender.firstName?.[0]}</AvatarFallback>
                                        </Avatar>
                                    )}
                                </div>
                            )}

                            <div className={cn(
                                "rounded-2xl px-4 py-2 shadow-sm",
                                isMe ? "bg-indigo-600 text-white rounded-br-none" : "bg-white text-slate-800 border border-slate-200 rounded-bl-none"
                            )}>
                                <p className="text-sm">{msg.content}</p>
                                <p className={cn("text-[10px] mt-1 text-right opacity-70", isMe ? "text-indigo-100" : "text-slate-400")}>
                                    {formatDistanceToNow(new Date(msg.createdAt), { addSuffix: true })}
                                </p>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Input Area */}
            <div className="p-4 bg-white border-t border-slate-200">
                <form onSubmit={handleSendMessage} className="flex items-end gap-2">
                    <Button type="button" variant="ghost" size="icon" className="text-slate-400 hover:text-slate-600">
                        <Paperclip className="h-5 w-5" />
                    </Button>
                    <div className="flex-1 relative">
                        <Input
                            value={newMessage}
                            onChange={(e) => setNewMessage(e.target.value)}
                            placeholder="Type a message..."
                            className="pr-10 py-6 bg-slate-50 border-slate-200 focus-visible:ring-indigo-500"
                        />
                        <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                        >
                            <Smile className="h-5 w-5" />
                        </Button>
                    </div>
                    <Button
                        type="submit"
                        disabled={!newMessage.trim() || isSending}
                        className="bg-indigo-600 hover:bg-indigo-700 h-12 w-12 rounded-xl"
                    >
                        <Send className="h-5 w-5" />
                    </Button>
                </form>
            </div>
        </div>
    );
}
