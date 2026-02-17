"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import {
    Hash,
    MessageSquare,
    Plus,
    Search,
    ChevronDown,
    ChevronRight,
    Lock
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface SlackSidebarProps {
    channels: any[];
    conversations: any[]; // DMs
    activeChannelId?: string;
    activeConversationId?: string;
    onSelectChannel: (channelId: string) => void;
    onSelectConversation: (conversationId: string) => void;
    currentUser: any;
    onCreateChannel: () => void;
}

export function SlackSidebar({
    channels,
    conversations,
    activeChannelId,
    activeConversationId,
    onSelectChannel,
    onSelectConversation,
    currentUser,
    onCreateChannel
}: SlackSidebarProps) {
    const [channelsOpen, setChannelsOpen] = useState(true);
    const [dmsOpen, setDmsOpen] = useState(true);

    return (
        <div className="w-64 bg-[#3F0E40] flex flex-col h-full text-[#cfc3cf]">
            {/* Header */}
            <div className="h-12 flex items-center px-4 border-b border-[#5d2c5d] hover:bg-[#350d36] cursor-pointer transition-colors">
                <h1 className="font-bold text-white truncate">K-Business Workspace</h1>
                <ChevronDown className="w-4 h-4 ml-2" />
            </div>

            <ScrollArea className="flex-1">
                <div className="p-2 space-y-6">
                    {/* Channels Section */}
                    <div>
                        <div className="flex items-center justify-between px-2 group mb-1">
                            <div
                                className="flex items-center cursor-pointer hover:text-white"
                                onClick={() => setChannelsOpen(!channelsOpen)}
                            >
                                {channelsOpen ? (
                                    <ChevronDown className="w-3 h-3 mr-1" />
                                ) : (
                                    <ChevronRight className="w-3 h-3 mr-1" />
                                )}
                                <span className="text-sm font-medium">Channels</span>
                            </div>
                            <Button
                                variant="ghost"
                                size="icon"
                                className="h-4 w-4 text-[#cfc3cf] hover:text-white hover:bg-transparent"
                                onClick={onCreateChannel}
                            >
                                <Plus className="w-4 h-4" />
                            </Button>
                        </div>

                        {channelsOpen && (
                            <div className="space-y-0.5">
                                {channels.map(channel => (
                                    <button
                                        key={channel._id}
                                        onClick={() => onSelectChannel(channel._id)}
                                        className={cn(
                                            "w-full flex items-center px-2 py-1 rounded hover:bg-[#350d36] text-sm text-[15px]",
                                            activeChannelId === channel._id && "bg-[#1164A3] text-white hover:bg-[#1164A3]"
                                        )}
                                    >
                                        {channel.isPrivate ? (
                                            <Lock className="w-3 h-3 mr-2 opacity-70" />
                                        ) : (
                                            <Hash className="w-3 h-3 mr-2 opacity-70" />
                                        )}
                                        <span className="truncate">{channel.name}</span>
                                    </button>
                                ))}
                                <button
                                    onClick={onCreateChannel}
                                    className="w-full flex items-center px-2 py-1 rounded hover:bg-[#350d36] text-sm text-[15px] text-[#cfc3cf]/70"
                                >
                                    <div className="w-4 h-4 mr-2 flex items-center justify-center bg-[#cfc3cf]/20 rounded text-xs">
                                        <Plus className="w-3 h-3" />
                                    </div>
                                    <span>Add Channel</span>
                                </button>
                            </div>
                        )}
                    </div>

                    {/* Direct Messages Section */}
                    <div>
                        <div
                            className="flex items-center px-2 mb-1 cursor-pointer hover:text-white"
                            onClick={() => setDmsOpen(!dmsOpen)}
                        >
                            {dmsOpen ? (
                                <ChevronDown className="w-3 h-3 mr-1" />
                            ) : (
                                <ChevronRight className="w-3 h-3 mr-1" />
                            )}
                            <span className="text-sm font-medium">Direct Messages</span>
                        </div>

                        {dmsOpen && (
                            <div className="space-y-0.5">
                                {conversations.map(conversation => {
                                    const otherUser = conversation.participants.find(
                                        (p: any) => p._id !== currentUser._id
                                    );
                                    const isOffline = true; // Todo: Add presence
                                    return (
                                        <button
                                            key={conversation._id}
                                            onClick={() => onSelectConversation(conversation._id)}
                                            className={cn(
                                                "w-full flex items-center px-2 py-1 rounded hover:bg-[#350d36] text-sm text-[15px] group",
                                                activeConversationId === conversation._id && "bg-[#1164A3] text-white hover:bg-[#1164A3]"
                                            )}
                                        >
                                            <div className="relative mr-2">
                                                <Avatar className="w-4 h-4 rounded">
                                                    <AvatarImage src={otherUser?.profileImage} className="rounded" />
                                                    <AvatarFallback className="rounded text-[10px] bg-slate-500 text-white">
                                                        {otherUser?.firstName?.[0]}
                                                    </AvatarFallback>
                                                </Avatar>
                                                <div className={cn(
                                                    "absolute -bottom-0.5 -right-0.5 w-2 h-2 rounded-full border-2 border-[#3F0E40]",
                                                    isOffline ? "bg-transparent border-slate-400" : "bg-green-500"
                                                )} />
                                            </div>
                                            <span className="truncate opacity-90">
                                                {otherUser?.firstName} {otherUser?.lastName}
                                            </span>
                                            {conversation.unreadCount?.[currentUser._id] > 0 && (
                                                <span className="ml-auto bg-red-500 text-white text-[10px] px-1.5 rounded-full">
                                                    {conversation.unreadCount?.[currentUser._id]}
                                                </span>
                                            )}
                                        </button>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                </div>
            </ScrollArea>
        </div>
    );
}
