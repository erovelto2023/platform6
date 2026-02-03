"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Search, Plus } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useState } from "react";

interface ConversationListProps {
    conversations: any[];
    currentUser: any;
    selectedConversation: any;
    onSelectConversation: (conversation: any) => void;
}

export function ConversationList({
    conversations,
    currentUser,
    selectedConversation,
    onSelectConversation
}: ConversationListProps) {
    const [searchQuery, setSearchQuery] = useState("");

    const filteredConversations = conversations.filter((conv) => {
        const otherUser = conv.participants.find((p: any) => p._id !== currentUser._id);
        const name = `${otherUser?.firstName} ${otherUser?.lastName}`.toLowerCase();
        return name.includes(searchQuery.toLowerCase());
    });

    return (
        <div className="h-full flex flex-col">
            {/* Header */}
            <div className="p-4 border-b">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-bold">Messages</h2>
                    <Button size="icon" variant="ghost">
                        <Plus className="h-5 w-5" />
                    </Button>
                </div>

                {/* Search */}
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <Input
                        placeholder="Search conversations..."
                        className="pl-10"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
            </div>

            {/* Conversations */}
            <div className="flex-1 overflow-y-auto">
                {filteredConversations.length === 0 ? (
                    <div className="p-8 text-center text-slate-500">
                        <p className="font-medium">No conversations yet</p>
                        <p className="text-sm mt-1">
                            Start a conversation from the community
                        </p>
                    </div>
                ) : (
                    filteredConversations.map((conversation) => {
                        const otherUser = conversation.participants.find(
                            (p: any) => p._id !== currentUser._id
                        );
                        const unreadCount = conversation.unreadCount?.[currentUser._id] || 0;
                        const isSelected = selectedConversation?._id === conversation._id;

                        return (
                            <button
                                key={conversation._id}
                                onClick={() => onSelectConversation(conversation)}
                                className={cn(
                                    "w-full p-4 flex items-start gap-3 hover:bg-slate-50 transition border-b",
                                    isSelected && "bg-indigo-50 hover:bg-indigo-50"
                                )}
                            >
                                <Avatar className="h-12 w-12 flex-shrink-0">
                                    <AvatarImage src={otherUser?.profileImage} />
                                    <AvatarFallback className="bg-indigo-100 text-indigo-600">
                                        {otherUser?.firstName?.[0]}{otherUser?.lastName?.[0]}
                                    </AvatarFallback>
                                </Avatar>

                                <div className="flex-1 min-w-0 text-left">
                                    <div className="flex items-center justify-between mb-1">
                                        <h3 className="font-semibold text-sm truncate">
                                            {otherUser?.firstName} {otherUser?.lastName}
                                        </h3>
                                        {conversation.lastMessageAt && (
                                            <span className="text-xs text-slate-500 flex-shrink-0 ml-2">
                                                {formatDistanceToNow(new Date(conversation.lastMessageAt), {
                                                    addSuffix: false
                                                })}
                                            </span>
                                        )}
                                    </div>

                                    <div className="flex items-center justify-between">
                                        <p className="text-sm text-slate-600 truncate">
                                            {conversation.lastMessage?.content || "Start a conversation"}
                                        </p>
                                        {unreadCount > 0 && (
                                            <span className="flex-shrink-0 ml-2 h-5 w-5 rounded-full bg-indigo-600 text-white text-xs flex items-center justify-center font-semibold">
                                                {unreadCount > 9 ? '9+' : unreadCount}
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </button>
                        );
                    })
                )}
            </div>
        </div>
    );
}
