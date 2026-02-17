"use client";

import { useState, useEffect } from "react";
import { SlackSidebar } from "./slack-sidebar";
import { SlackChat } from "./slack-chat";
import { createChannel } from "@/lib/actions/channel.actions";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

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

    // Modal state
    const [openCreateChannel, setOpenCreateChannel] = useState(false);
    const [newChannelName, setNewChannelName] = useState("");
    const [creating, setCreating] = useState(false);

    // Sync URL with state (optional, can do deep linking later)
    const handleSelectChannel = (channelId: string) => {
        setActiveChannelId(channelId);
        setActiveConversationId(undefined);
        // router.push(`/messages/channels/${channelId}`); // TODO: Add routing
    };

    const handleSelectConversation = (conversationId: string) => {
        setActiveConversationId(conversationId);
        setActiveChannelId(undefined);
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

    const activeChannel = channels.find(c => c._id === activeChannelId);
    const activeConversation = initialConversations.find(c => c._id === activeConversationId);

    return (
        <div className="h-[calc(100vh-4rem)] flex overflow-hidden border-t">
            <SlackSidebar
                channels={channels}
                conversations={initialConversations}
                activeChannelId={activeChannelId}
                activeConversationId={activeConversationId}
                onSelectChannel={handleSelectChannel}
                onSelectConversation={handleSelectConversation}
                currentUser={currentUser}
                onCreateChannel={() => setOpenCreateChannel(true)}
            />

            <main className="flex-1 flex flex-col min-w-0 bg-white">
                <SlackChat
                    channel={activeChannel}
                    conversation={activeConversation}
                    currentUser={currentUser}
                />
            </main>

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
