"use client";

import { useState, useEffect } from "react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { getUsers } from "@/lib/actions/user.actions";
import { createGroupConversation, getOrCreateConversation } from "@/lib/actions/message.actions";
import { toast } from "sonner";
import { Check, Search } from "lucide-react";
import { Input } from "@/components/ui/input";

interface SlackNewDmModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    currentUser: any;
    onConversationCreated: (conversation: any) => void;
}

export function SlackNewDmModal({ open, onOpenChange, currentUser, onConversationCreated }: SlackNewDmModalProps) {
    const [users, setUsers] = useState<any[]>([]);
    const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
    const [loading, setLoading] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [search, setSearch] = useState("");

    useEffect(() => {
        if (open) {
            const fetchUsers = async () => {
                setLoading(true);
                try {
                    const res = await getUsers();
                    if (res.success) {
                        setUsers(res.data);
                    }
                } finally {
                    setLoading(false);
                }
            };
            fetchUsers();
        }
    }, [open, currentUser?._id]);

    const handleToggleUser = (userId: string) => {
        setSelectedUsers(prev =>
            prev.includes(userId)
                ? prev.filter(id => id !== userId)
                : [...prev, userId]
        );
    };

    const handleCreate = async () => {
        if (selectedUsers.length === 0) return;

        setSubmitting(true);
        try {
            if (selectedUsers.length === 1) {
                const res = await getOrCreateConversation(currentUser._id, selectedUsers[0]);
                if (res.success) {
                    onConversationCreated(res.data);
                    onOpenChange(false);
                    setSelectedUsers([]);
                    setSearch("");
                } else {
                    toast.error(res.error || "Failed to get conversation");
                }
            } else {
                const res = await createGroupConversation(currentUser._id, selectedUsers);
                if (res.success) {
                    onConversationCreated(res.data);
                    onOpenChange(false);
                    setSelectedUsers([]);
                    setSearch("");
                } else {
                    toast.error(res.error || "Failed to create group DM");
                }
            }
        } catch (err) {
            console.error(err);
            toast.error("Something went wrong");
        } finally {
            setSubmitting(false);
        }
    };

    const filteredUsers = users.filter(user =>
        `${user.firstName} ${user.lastName}`.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[425px] p-0 overflow-hidden gap-0 bg-white">
                <DialogHeader className="p-6 pb-0">
                    <DialogTitle className="text-xl font-bold">Direct Messages</DialogTitle>
                    <DialogDescription className="text-slate-500">
                        Select one or more people to start a conversation.
                    </DialogDescription>
                </DialogHeader>

                <div className="px-6 py-4 border-b">
                    <div className="relative">
                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-500" />
                        <Input
                            placeholder="To: @somebody"
                            className="pl-9 h-9 border-slate-200 focus-visible:ring-[#007a5a]"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>
                </div>

                <ScrollArea className="h-[300px]">
                    <div className="space-y-0.5 p-2">
                        {loading && users.length === 0 ? (
                            <div className="text-center py-8 text-sm text-slate-500">Loading users...</div>
                        ) : filteredUsers.length === 0 ? (
                            <div className="text-center py-8 text-sm text-slate-500">No users found.</div>
                        ) : (
                            filteredUsers.map((user) => (
                                <div
                                    key={user._id}
                                    onClick={() => handleToggleUser(user._id)}
                                    className="flex items-center gap-3 p-2 px-4 rounded-md hover:bg-slate-100 cursor-pointer group"
                                >
                                    <div className="relative">
                                        <Avatar className="h-8 w-8 rounded">
                                            <AvatarImage src={user.profileImage} />
                                            <AvatarFallback className="rounded bg-[#007a5a] text-white text-xs">
                                                {user.firstName[0]}
                                            </AvatarFallback>
                                        </Avatar>
                                        {selectedUsers.includes(user._id) && (
                                            <div className="absolute -top-1 -right-1 bg-blue-600 text-white rounded-full p-0.5 border-2 border-white">
                                                <Check className="h-2 w-2" />
                                            </div>
                                        )}
                                    </div>
                                    <div className="flex-1 overflow-hidden">
                                        <div className="font-medium text-sm text-slate-900 truncate">
                                            {user.firstName} {user.lastName}
                                        </div>
                                    </div>
                                    <Checkbox
                                        checked={selectedUsers.includes(user._id)}
                                        onCheckedChange={() => handleToggleUser(user._id)}
                                        className="h-5 w-5 rounded border-slate-300 data-[state=checked]:bg-[#007a5a] data-[state=checked]:border-[#007a5a]"
                                    />
                                </div>
                            ))
                        )}
                    </div>
                </ScrollArea>

                <DialogFooter className="p-4 bg-slate-50 border-t flex items-center justify-between sm:justify-between">
                    <div className="text-xs text-slate-500 font-medium">
                        {selectedUsers.length} selected
                    </div>
                    <div className="flex gap-2">
                        <Button variant="ghost" size="sm" onClick={() => onOpenChange(false)} disabled={submitting}>
                            Cancel
                        </Button>
                        <Button
                            size="sm"
                            onClick={handleCreate}
                            disabled={selectedUsers.length === 0 || submitting}
                            className="bg-[#007a5a] hover:bg-[#148567] text-white px-4"
                        >
                            {submitting ? "Starting..." : selectedUsers.length > 1 ? "Create Group DM" : "Go"}
                        </Button>
                    </div>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
