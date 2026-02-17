"use client";

import { useState, useEffect } from "react";
import { SlackHeader } from "./slack-header";
import { SlackSidebar } from "./slack-sidebar";
import { SlackChat } from "./slack-chat";
import { SlackThread } from "./slack-thread";
import { SlackProfileModal } from "./slack-profile-modal";
import { createChannel, generateChannelInvite, getChannels } from "@/lib/actions/channel.actions";
import { getConversations } from "@/lib/actions/message.actions";
import { updateUserPresence } from "@/lib/actions/user.actions";
import { useSocket } from "@/components/providers/socket-provider";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

interface SlackLayoutProps {
    currentUser: any;
    initialChannels: any[];
    initialConversations: any[]; // DMs
    initialChannelId?: string;
    initialConversationId?: string;
}

export function SlackLayout({
    currentUser,
    initialChannels,
    initialConversations,
    initialChannelId,
    initialConversationId
}: SlackLayoutProps) {
    const router = useRouter();
    const [channels, setChannels] = useState(initialChannels);
    const [activeChannelId, setActiveChannelId] = useState<string | undefined>(
        initialChannelId || (initialChannels.length > 0 ? initialChannels[0]._id : undefined)
    );
    const [activeConversationId, setActiveConversationId] = useState<string | undefined>(initialConversationId);
    const [activeThreadMessage, setActiveThreadMessage] = useState<any | null>(null);
    const [selectedProfileUser, setSelectedProfileUser] = useState<any | null>(null);
    const [targetMessageId, setTargetMessageId] = useState<string | undefined>(undefined);

    // Heartbeat for presence
    useEffect(() => {
        if (!currentUser?._id) return;

        const heartbeat = async () => {
            await updateUserPresence(currentUser._id);
        };

        heartbeat(); // Initial
        const interval = setInterval(heartbeat, 30000); // 30s
        return () => clearInterval(interval);
    }, [currentUser?._id]);

    // Poll for sidebar updates (unreads and new channels/DMs)
    useEffect(() => {
        if (!currentUser?._id) return;

        const refreshSidebar = async () => {
            const [channelsRes, dmsRes] = await Promise.all([
                getChannels(currentUser._id),
                getConversations(currentUser._id)
            ]);

            if (channelsRes.success) setChannels(channelsRes.data);
            if (dmsRes.success) setConversations(dmsRes.data);
        };

        const interval = setInterval(refreshSidebar, 5000); // 5s poll for sidebar
        return () => clearInterval(interval);
    }, [currentUser?._id]);

    // Socket listener for sidebar updates
    const { socket, isConnected } = useSocket();
    useEffect(() => {
        if (!socket || !currentUser?._id) return;

        const onUnreadUpdate = (data: any) => {
            // If we are already in this channel/conversation, we might not need to update unreads
            // but simpler to just refresh the sidebar data
            const refreshSidebar = async () => {
                const [channelsRes, dmsRes] = await Promise.all([
                    getChannels(currentUser._id),
                    getConversations(currentUser._id)
                ]);

                if (channelsRes.success) setChannels(channelsRes.data);
                if (dmsRes.success) setConversations(dmsRes.data);
            };

            refreshSidebar();
        };

        socket.on("unread:update", onUnreadUpdate);
        return () => {
            socket.off("unread:update", onUnreadUpdate);
        };
    }, [socket, currentUser?._id]);

    const [conversations, setConversations] = useState(initialConversations);

    // Modal state
    const [openCreateChannel, setOpenCreateChannel] = useState(false);
    const [newChannelName, setNewChannelName] = useState("");
    const [creating, setCreating] = useState(false);
    const [isSearchOpen, setIsSearchOpen] = useState(false);

    // Sync URL with state (optional, can do deep linking later)
    const handleSelectChannel = (channelId: string) => {
        setActiveChannelId(channelId);
        setActiveConversationId(undefined);
        setActiveThreadMessage(null);
        // router.push(`/messages/channels/${channelId}`); // TODO: Add routing
    };

    const handleSelectConversation = (conversationId: string) => {
        setActiveConversationId(conversationId);
        setActiveChannelId(undefined);
        setActiveThreadMessage(null);
        // router.push(`/messages/dms/${conversationId}`); // TODO: Add routing
    };

    const handleCreateChannel = async () => {
        if (!newChannelName.trim()) return;

        try {
            setCreating(true);
            const res = await createChannel({
                name: newChannelName,
                creatorId: currentUser._id,
                isPrivate: false
            });

            if (res.success) {
                toast.success("Channel created!");
                setChannels([...channels, res.data]);
                setActiveChannelId(res.data._id);
                setOpenCreateChannel(false);
                setNewChannelName("");
            } else {
                toast.error(res.error || "Failed to create channel");
            }
        } finally {
            setCreating(false);
        }
    };

    const handleInvite = async () => {
        if (!activeChannelId) {
            toast.error("Please select a channel first");
            return;
        }
        try {
            const res = await generateChannelInvite(activeChannelId, currentUser._id);
            if (res.success) {
                const inviteUrl = `${window.location.origin}/invite/${res.token}`;
                await navigator.clipboard.writeText(inviteUrl);
                toast.success("Invite link copied to clipboard!");
            } else {
                toast.error(res.error || "Failed to generate invite link");
            }
        } catch (err) {
            console.error(err);
            toast.error("Something went wrong");
        }
    };

    const activeChannel = channels.find(c => c._id === activeChannelId);
    const activeConversation = initialConversations.find(c => c._id === activeConversationId);

    const handleSelectMessage = (message: any) => {
        if (message.channelId) {
            setActiveChannelId(message.channelId._id || message.channelId);
            setActiveConversationId(undefined);
        } else if (message.conversationId) {
            setActiveConversationId(message.conversationId._id || message.conversationId);
            setActiveChannelId(undefined);
        }

        // Set target message for scrolling/highlighting
        setTargetMessageId(message._id);
    };

    return (
        <div className="h-screen flex flex-col overflow-hidden">
            <SlackHeader
                userId={currentUser._id}
                onSelectMessage={handleSelectMessage}
                searchOpen={isSearchOpen}
                onSearchOpenChange={setIsSearchOpen}
            />

            <div className="flex-1 flex overflow-hidden border-t min-h-0">
                <SlackSidebar
                    channels={channels}
                    conversations={initialConversations}
                    activeChannelId={activeChannelId}
                    activeConversationId={activeConversationId}
                    onSelectChannel={handleSelectChannel}
                    onSelectConversation={handleSelectConversation}
                    onConversationCreated={(conv) => {
                        handleSelectConversation(conv._id);
                        router.push(`/messages`); // Ensure we are on the messages view
                    }}
                    currentUser={currentUser}
                    onCreateChannel={() => setOpenCreateChannel(true)}
                    onInvite={handleInvite}
                    onShowProfile={(user) => setSelectedProfileUser(user)}
                    onSearchClick={() => setIsSearchOpen(true)}
                />

                <main className="flex-1 flex flex-col min-w-0 bg-white relative">
                    <SlackChat
                        channel={activeChannel}
                        conversation={activeConversation}
                        currentUser={currentUser}
                        onInvite={handleInvite}
                        onThreadClick={(msg) => setActiveThreadMessage(msg)}
                        onShowProfile={(user) => setSelectedProfileUser(user)}
                        targetMessageId={targetMessageId}
                        onTargetMessageScrolled={() => setTargetMessageId(undefined)}
                    />

                    {activeThreadMessage && (
                        <SlackThread
                            parentMessage={activeThreadMessage}
                            currentUser={currentUser}
                            onClose={() => setActiveThreadMessage(null)}
                        />
                    )}
                </main>
            </div>

            <SlackProfileModal
                user={selectedProfileUser}
                currentUser={currentUser}
                open={!!selectedProfileUser}
                onOpenChange={(open) => !open && setSelectedProfileUser(null)}
                onUpdate={(updatedUser) => {
                    // Optionally update local currentUser state if it's the own profile
                    if (updatedUser._id === currentUser._id) {
                        // You might need a way to refresh the global currentUser state
                        // For now, at least closing modal and showing success is handled
                    }
                    setSelectedProfileUser(updatedUser);
                }}
            />

            <Dialog open={openCreateChannel} onOpenChange={setOpenCreateChannel}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Create a channel</DialogTitle>
                        <DialogDescription>
                            Channels are where your team communicates. They’re best when organized around a topic — #marketing, for example.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                        <div className="space-y-2">
                            <Label htmlFor="name">Name</Label>
                            <div className="relative">
                                <span className="absolute left-3 top-2.5 text-slate-500">#</span>
                                <Input
                                    id="name"
                                    value={newChannelName}
                                    onChange={(e) => setNewChannelName(e.target.value.toLowerCase().replace(/\s+/g, '-'))}
                                    className="pl-7"
                                    placeholder="e.g. plan-budget"
                                />
                            </div>
                            <p className="text-xs text-slate-500">Names must be lower-case, without spaces or periods.</p>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setOpenCreateChannel(false)}>Cancel</Button>
                        <Button onClick={handleCreateChannel} disabled={!newChannelName.trim() || creating}>
                            {creating ? "Creating..." : "Create Channel"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
