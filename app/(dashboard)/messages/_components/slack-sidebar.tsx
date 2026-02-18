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
    Lock,
    UserPlus
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { SlackNewDmModal } from "./slack-new-dm-modal";

interface SlackSidebarProps {
    channels: any[];
    conversations: any[]; // DMs
    activeChannelId?: string;
    activeConversationId?: string;
    onSelectChannel: (channelId: string) => void;
    onSelectConversation: (conversationId: string) => void;
    currentUser: any;
    onCreateChannel: () => void;
    onInvite?: () => void;
    onShowProfile: (user: any) => void;
    onConversationCreated: (conversation: any) => void;
    onSearchClick: () => void;
}

export function SlackSidebar({
    channels,
    conversations,
    activeChannelId,
    activeConversationId,
    onSelectChannel,
    onSelectConversation,
    currentUser,
    onCreateChannel,
    onInvite,
    onShowProfile,
    onConversationCreated,
    onSearchClick
}: SlackSidebarProps) {
    const [channelsOpen, setChannelsOpen] = useState(true);
    const [dmsOpen, setDmsOpen] = useState(true);
    const [openNewDm, setOpenNewDm] = useState(false);

    return (
        <div className="w-64 bg-[#3F0E40] flex flex-col h-full text-[#cfc3cf]">
            {/* Header */}
            <div className="h-12 flex items-center px-4 border-b border-[#5d2c5d] hover:bg-[#350d36] cursor-pointer transition-colors">
                <h1 className="font-bold text-white truncate">K-Business Workspace</h1>
                <ChevronDown className="w-4 h-4 ml-2" />
            </div>

            <ScrollArea className="flex-1">
                <div className="p-2 space-y-6">
                    {/* Search Item */}
                    <button
                        onClick={onSearchClick}
                        className="w-full flex items-center px-2 py-1.5 rounded hover:bg-[#350d36] text-[15px] group text-[#cfc3cf] transition-colors"
                    >
                        <Search className="w-4 h-4 mr-2 opacity-70 group-hover:opacity-100" />
                        <span>Search</span>
                        <kbd className="ml-auto pointer-events-none hidden h-4 select-none items-center gap-1 rounded bg-white/10 px-1.5 font-mono text-[10px] font-medium opacity-50 group-hover:opacity-100 sm:flex">
                            <span className="text-xs">⌘</span>K
                        </kbd>
                    </button>

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
                                        <span className={cn(
                                            "truncate",
                                            channel.unreadCounts?.[currentUser._id] > 0 && "font-bold text-white"
                                        )}>
                                            {channel.name}
                                        </span>
                                        {channel.unreadCounts?.[currentUser._id] > 0 && (
                                            <span className="ml-auto bg-[#EB144C] text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full min-w-[18px] text-center">
                                                {channel.unreadCounts[currentUser._id]}
                                            </span>
                                        )}
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
                    <div className="flex items-center justify-between px-2 group mb-1">
                        <div
                            className="flex items-center cursor-pointer hover:text-white"
                            onClick={() => setDmsOpen(!dmsOpen)}
                        >
                            {dmsOpen ? (
                                <ChevronDown className="w-3 h-3 mr-1" />
                            ) : (
                                <ChevronRight className="w-3 h-3 mr-1" />
                            )}
                            <span className="text-sm font-medium">Direct Messages</span>
                        </div>
                        <Button
                            variant="ghost"
                            size="icon"
                            className="h-4 w-4 text-[#cfc3cf] hover:text-white hover:bg-transparent"
                            onClick={() => setOpenNewDm(true)}
                        >
                            <Plus className="w-4 h-4" />
                        </Button>
                    </div>

                    {dmsOpen && (
                        <div className="space-y-0.5">
                            {conversations.map(conversation => {
                                const isGroup = conversation.isGroup;
                                const otherUser = isGroup ? null : (conversation.participants.find(
                                    (p: any) => p._id !== currentUser._id
                                ) || currentUser);

                                const displayName = isGroup
                                    ? (conversation.groupName || conversation.participants
                                        .filter((p: any) => p._id !== currentUser._id)
                                        .map((p: any) => p.firstName)
                                        .join(", "))
                                    : (otherUser?._id === currentUser?._id
                                        ? `${currentUser.firstName} ${currentUser.lastName} (you)`
                                        : `${otherUser?.firstName} ${otherUser?.lastName}`);

                                const isOnline = !isGroup && otherUser?.lastActiveAt &&
                                    (new Date().getTime() - new Date(otherUser.lastActiveAt).getTime()) < 300000; // 5 mins
                                return (
                                    <button
                                        key={conversation._id}
                                        onClick={(e) => {
                                            if (!isGroup && (e.target as HTMLElement).closest('.avatar-trigger')) {
                                                onShowProfile(otherUser);
                                            } else {
                                                onSelectConversation(conversation._id);
                                            }
                                        }}
                                        className={cn(
                                            "w-full flex items-center px-2 py-1 rounded hover:bg-[#350d36] text-sm text-[15px] group",
                                            activeConversationId === conversation._id && "bg-[#1164A3] text-white hover:bg-[#1164A3]"
                                        )}
                                    >
                                        <div className="relative mr-2 avatar-trigger hover:opacity-80 transition-opacity">
                                            <Avatar className="w-4 h-4 rounded">
                                                {isGroup ? (
                                                    <AvatarFallback className="rounded text-[10px] bg-slate-600 text-white flex items-center justify-center">
                                                        {conversation.participants.length}
                                                    </AvatarFallback>
                                                ) : (
                                                    <>
                                                        <AvatarImage src={otherUser?.profileImage} className="rounded" />
                                                        <AvatarFallback className="rounded text-[10px] bg-slate-500 text-white">
                                                            {otherUser?.firstName?.[0]}
                                                        </AvatarFallback>
                                                    </>
                                                )}
                                            </Avatar>
                                            {!isGroup && (
                                                <div className={cn(
                                                    "absolute -bottom-0.5 -right-0.5 w-2 h-2 rounded-full border-2 border-[#3F0E40]",
                                                    isOnline ? "bg-green-500" : "bg-transparent border-slate-400"
                                                )} />
                                            )}
                                        </div>
                                        <span className={cn(
                                            "truncate opacity-90",
                                            conversation.unreadCounts?.[currentUser._id] > 0 && "font-bold opacity-100 text-white"
                                        )}>
                                            {displayName}
                                        </span>
                                        {conversation.unreadCounts?.[currentUser._id] > 0 && (
                                            <span className="ml-auto bg-[#EB144C] text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full min-w-[18px] text-center">
                                                {conversation.unreadCounts[currentUser._id]}
                                            </span>
                                        )}
                                    </button>
                                );
                            })}
                        </div>
                    )}
                </div>
            </ScrollArea>

            <div className="p-4 border-t border-[#5d2c5d]">
                <Button
                    variant="ghost"
                    className="w-full justify-start text-[#cfc3cf] hover:text-white hover:bg-[#350d36] transition-colors gap-2"
                    onClick={onInvite}
                >
                    <UserPlus className="w-4 h-4" />
                    <span className="text-sm">Invite people</span>
                </Button>
            </div>
            <SlackNewDmModal
                open={openNewDm}
                onOpenChange={setOpenNewDm}
                currentUser={currentUser}
                onConversationCreated={onConversationCreated}
            />
        </div >
    );
}
