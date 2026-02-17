"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { MessageSquare, Reply, Smile, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SlackReactionPicker } from "./slack-reaction-picker";

interface SlackMessageProps {
    message: any;
    isSameSender?: boolean;
    onThreadClick?: (message: any) => void;
    onReaction?: (emoji: string) => void;
    onShowProfile?: () => void;
}

export function SlackMessage({ message, isSameSender, onThreadClick, onReaction, onShowProfile }: SlackMessageProps) {
    const sender = message.sender || { firstName: "Unknown", lastName: "User" };

    if (isSameSender) {
        return (
            <div className="group flex items-start px-5 py-0.5 hover:bg-slate-50 -ml-5 pl-14">
                <div className="hidden group-hover:block absolute left-2 top-0 text-[10px] text-slate-400">
                    {format(new Date(message.createdAt), "h:mm a")}
                </div>
                <div className="text-[15px] text-slate-900 leading-relaxed">
                    {message.content}
                </div>

                {/* Floating Actions */}
                <div className="hidden group-hover:flex items-center absolute -top-4 right-5 bg-white border border-slate-200 shadow-sm rounded-lg p-0.5 z-10">
                    <SlackReactionPicker onSelect={(emoji) => onReaction?.(emoji)}>
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-500 hover:bg-slate-100">
                            <Smile className="h-4 w-4" />
                        </Button>
                    </SlackReactionPicker>
                    <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-slate-500 hover:bg-slate-100"
                        onClick={() => onThreadClick?.(message)}
                    >
                        <MessageSquare className="h-4 w-4" />
                    </Button>
                </div>
            </div>
        );
    }

    return (
        <div className="group flex items-start gap-2 px-5 py-1 hover:bg-slate-50 mt-1">
            <Avatar
                className="h-9 w-9 mt-0.5 rounded cursor-pointer hover:opacity-80 transition-opacity"
                onClick={onShowProfile}
            >
                <AvatarImage src={sender.profileImage} className="rounded" />
                <AvatarFallback className="rounded bg-indigo-600 text-white text-xs">
                    {sender.firstName?.[0]}{sender.lastName?.[0]}
                </AvatarFallback>
            </Avatar>

            <div className="flex-1 min-w-0">
                <div className="flex items-baseline gap-2">
                    <span
                        className="font-bold text-[15px] hover:underline cursor-pointer"
                        onClick={onShowProfile}
                    >
                        {sender.firstName} {sender.lastName}
                    </span>
                    <span className="text-xs text-slate-500">
                        {format(new Date(message.createdAt), "h:mm a")}
                    </span>
                </div>
                <div className="text-[15px] text-slate-900 leading-relaxed">
                    {message.content}
                </div>

                {message.attachments?.length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-2">
                        {message.attachments.map((url: string, i: number) => (
                            <img
                                key={i}
                                src={url}
                                alt="Attachment"
                                className="max-h-60 rounded-md border border-slate-200"
                            />
                        ))}
                    </div>
                )}

                {/* Thread Indicator */}
                {message.replyCount > 0 && (
                    <button
                        onClick={() => onThreadClick?.(message)}
                        className="mt-2 flex items-center gap-2 text-xs font-semibold text-blue-600 hover:underline group/thread"
                    >
                        <div className="flex -space-x-1.5 overflow-hidden">
                            <span className="h-5 w-5 rounded bg-blue-100 flex items-center justify-center border border-white">
                                <MessageSquare className="h-3 w-3" />
                            </span>
                        </div>
                        <span>{message.replyCount} {message.replyCount === 1 ? 'reply' : 'replies'}</span>
                        <span className="text-slate-500 font-normal hidden group-hover/thread:inline">
                            View thread
                        </span>
                    </button>
                )}

                {/* Reactions */}
                {message.reactions && Object.keys(message.reactions).length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-1">
                        {Object.entries(
                            Object.entries(message.reactions).reduce((acc: any, [userId, emoji]: any) => {
                                if (!acc[emoji]) acc[emoji] = [];
                                acc[emoji].push(userId);
                                return acc;
                            }, {})
                        ).map(([emoji, userIds]: any) => (
                            <button
                                key={emoji}
                                onClick={() => onReaction?.(emoji)}
                                className={cn(
                                    "flex items-center gap-1 px-1.5 py-0.5 rounded-full border bg-slate-50 hover:bg-white text-xs transition-colors",
                                    // Todo: Highlight if current user reacted
                                    "border-slate-200 text-slate-700"
                                )}
                            >
                                <span>{emoji}</span>
                                <span className="font-semibold">{userIds.length}</span>
                            </button>
                        ))}
                        <SlackReactionPicker onSelect={(emoji) => onReaction?.(emoji)}>
                            <button className="flex items-center gap-1 px-1.5 py-0.5 rounded-full border border-slate-200 bg-slate-50 hover:bg-white text-slate-500 text-xs transition-colors">
                                <Plus className="h-3 w-3" />
                            </button>
                        </SlackReactionPicker>
                    </div>
                )}
            </div>

            {/* Floating Actions */}
            <div className="hidden group-hover:flex items-center absolute -top-4 right-5 bg-white border border-slate-200 shadow-sm rounded-lg p-0.5 z-10">
                <SlackReactionPicker onSelect={(emoji) => onReaction?.(emoji)}>
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-500 hover:bg-slate-100">
                        <Smile className="h-4 w-4" />
                    </Button>
                </SlackReactionPicker>
                <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-slate-500 hover:bg-slate-100"
                    onClick={() => onThreadClick?.(message)}
                >
                    <MessageSquare className="h-4 w-4" />
                </Button>
            </div>
        </div>
    );
}
