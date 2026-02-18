"use client";

import { useEffect, useState, useCallback } from "react";
import { format } from "date-fns";
import { Bookmark, Hash, MessageSquare, X, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { getBookmarkedMessages } from "@/lib/actions/message.actions";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface SlackSavedItemsProps {
    currentUser: any;
    onClose: () => void;
    onSelectMessage: (message: any) => void;
}

export function SlackSavedItems({
    currentUser,
    onClose,
    onSelectMessage
}: SlackSavedItemsProps) {
    const [savedMessages, setSavedMessages] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchSavedMessages = useCallback(async () => {
        try {
            setLoading(true);
            const res = await getBookmarkedMessages(currentUser._id);
            if (res.success) {
                setSavedMessages(res.data);
            } else {
                toast.error("Failed to fetch saved items");
            }
        } finally {
            setLoading(false);
        }
    }, [currentUser._id]);

    useEffect(() => {
        fetchSavedMessages();
    }, [fetchSavedMessages]);

    return (
        <div className="flex-1 flex flex-col h-full bg-white overflow-hidden">
            {/* Header */}
            <div className="h-16 border-b flex items-center justify-between px-5 flex-shrink-0 bg-white">
                <div className="flex items-center gap-4">
                    <Button variant="ghost" size="icon" onClick={onClose} className="sm:hidden">
                        <ArrowLeft className="w-5 h-5" />
                    </Button>
                    <div className="flex items-center gap-2">
                        <Bookmark className="w-5 h-5 text-[#E01E5A] fill-[#E01E5A]" />
                        <h3 className="font-bold text-slate-900 text-lg">Saved Items</h3>
                    </div>
                </div>
                <Button variant="ghost" size="icon" onClick={onClose} className="hidden sm:flex text-slate-500">
                    <X className="w-5 h-5" />
                </Button>
            </div>

            <div className="flex-1 bg-slate-50 min-h-0">
                <ScrollArea className="h-full">
                    <div className="max-w-4xl mx-auto p-6 space-y-4">
                        {loading ? (
                            <div className="flex flex-col items-center justify-center py-20 text-slate-400">
                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mb-4" />
                                <p>Loading your saved items...</p>
                            </div>
                        ) : savedMessages.length === 0 ? (
                            <div className="bg-white rounded-xl border border-slate-200 p-12 text-center shadow-sm">
                                <div className="bg-slate-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                                    <Bookmark className="w-10 h-10 text-slate-300" />
                                </div>
                                <h3 className="text-xl font-bold text-slate-900 mb-2">No saved items yet</h3>
                                <p className="text-slate-500 max-w-sm mx-auto">
                                    Save messages to easily find them later. Just click the three dots on any message and select "Bookmark".
                                </p>
                            </div>
                        ) : (
                            savedMessages.map((msg) => (
                                <div
                                    key={msg._id}
                                    className="bg-white border border-slate-200 rounded-xl shadow-sm hover:shadow-md transition-all cursor-pointer group"
                                    onClick={() => onSelectMessage(msg)}
                                >
                                    <div className="p-4">
                                        <div className="flex items-start justify-between mb-3">
                                            <div className="flex items-center gap-3">
                                                <div className="h-10 w-10 rounded-lg overflow-hidden bg-slate-100 flex-shrink-0 border border-slate-100">
                                                    {msg.sender?.profileImage ? (
                                                        <img src={msg.sender.profileImage} className="h-full w-full object-cover" alt="Profile" />
                                                    ) : (
                                                        <div className="h-full w-full flex items-center justify-center font-bold text-slate-400">
                                                            {msg.sender?.firstName?.[0]}{msg.sender?.lastName?.[0]}
                                                        </div>
                                                    )}
                                                </div>
                                                <div>
                                                    <div className="flex items-center gap-2">
                                                        <span className="font-bold text-slate-900">{msg.sender?.firstName} {msg.sender?.lastName}</span>
                                                        <span className="text-xs text-slate-400">{format(new Date(msg.createdAt), "MMM d, h:mm a")}</span>
                                                    </div>
                                                    <div className="flex items-center gap-1.5 text-xs text-slate-500 mt-0.5">
                                                        {msg.channelId ? (
                                                            <>
                                                                <Hash className="w-3 h-3" />
                                                                <span className="font-medium hover:underline">{msg.channelId.name}</span>
                                                            </>
                                                        ) : (
                                                            <>
                                                                <MessageSquare className="w-3 h-3" />
                                                                <span className="font-medium hover:underline lowercase">
                                                                    {msg.conversationId?.participants
                                                                        ?.filter((p: any) => p._id !== currentUser._id)
                                                                        ?.map((p: any) => p.firstName)
                                                                        ?.join(", ") || "Direct Message"}
                                                                </span>
                                                            </>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                            <Bookmark className="w-5 h-5 text-[#E01E5A] fill-[#E01E5A] opacity-0 group-hover:opacity-100 transition-opacity" />
                                        </div>
                                        <div className="text-[15px] text-slate-700 leading-relaxed pl-[52px]">
                                            {msg.content}
                                        </div>
                                        {msg.attachments && msg.attachments.length > 0 && (
                                            <div className="mt-3 flex gap-2 pl-[52px]">
                                                {msg.attachments.map((url: string, i: number) => (
                                                    <img key={i} src={url} className="h-20 w-20 rounded-lg border object-cover" alt="Attachment" />
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                    <div className="px-4 py-2 border-t border-slate-50 bg-slate-50/50 rounded-b-xl flex items-center justify-end">
                                        <span className="text-xs font-semibold text-blue-600 group-hover:underline">View in chat →</span>
                                    </div>
                                </div>
                            ))
                        )}
                        <div className="py-10 text-center text-xs text-slate-400 uppercase tracking-widest font-semibold flex items-center justify-center gap-4">
                            <div className="h-px bg-slate-200 flex-1" />
                            End of saved items
                            <div className="h-px bg-slate-200 flex-1" />
                        </div>
                    </div>
                </ScrollArea>
            </div>
        </div>
    );
}
