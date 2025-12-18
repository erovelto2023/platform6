"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { formatDistanceToNow } from "date-fns";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface ConversationListProps {
    conversations: any[];
    currentUserId: string;
}

export function ConversationList({ conversations, currentUserId }: ConversationListProps) {
    const pathname = usePathname();

    return (
        <div className="flex flex-col h-full bg-white border-r border-slate-200 w-full md:w-80 lg:w-96">
            <div className="p-4 border-b border-slate-100">
                <h2 className="text-xl font-bold text-slate-900">Messages</h2>
            </div>
            <div className="flex-1 overflow-y-auto">
                {conversations.length === 0 ? (
                    <div className="p-8 text-center text-slate-500">
                        No conversations yet. Start connecting with people!
                    </div>
                ) : (
                    <div className="divide-y divide-slate-50">
                        {conversations.map((conv) => {
                            const isActive = pathname === `/community/messages/${conv._id}`;
                            const isUnread = conv.unreadCount > 0;

                            return (
                                <Link
                                    key={conv._id}
                                    href={`/community/messages/${conv._id}`}
                                    className={cn(
                                        "flex items-center gap-3 p-4 hover:bg-slate-50 transition-colors cursor-pointer",
                                        isActive && "bg-indigo-50 hover:bg-indigo-50 border-r-2 border-indigo-600",
                                        isUnread && "bg-slate-50"
                                    )}
                                >
                                    <div className="relative">
                                        <Avatar className="h-12 w-12 border border-slate-100">
                                            <AvatarImage src={conv.displayImage} />
                                            <AvatarFallback>{conv.displayName[0]}</AvatarFallback>
                                        </Avatar>
                                        {/* Online indicator could go here */}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex justify-between items-baseline mb-1">
                                            <h3 className={cn("font-medium truncate", isUnread ? "text-slate-900 font-semibold" : "text-slate-700")}>
                                                {conv.displayName}
                                            </h3>
                                            {conv.lastMessageAt && (
                                                <span className="text-xs text-slate-400 whitespace-nowrap ml-2">
                                                    {formatDistanceToNow(new Date(conv.lastMessageAt), { addSuffix: false })}
                                                </span>
                                            )}
                                        </div>
                                        <div className="flex justify-between items-center">
                                            <p className={cn("text-sm truncate max-w-[180px]", isUnread ? "text-slate-900 font-medium" : "text-slate-500")}>
                                                {conv.lastMessage?.sender === currentUserId && "You: "}
                                                {conv.lastMessage?.content || "Sent an attachment"}
                                            </p>
                                            {isUnread && (
                                                <span className="h-5 w-5 rounded-full bg-indigo-600 text-white text-[10px] font-bold flex items-center justify-center">
                                                    {conv.unreadCount}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </Link>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
}
