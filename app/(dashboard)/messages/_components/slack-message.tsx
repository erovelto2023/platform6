"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

interface SlackMessageProps {
    message: any;
    isSameSender?: boolean;
}

export function SlackMessage({ message, isSameSender }: SlackMessageProps) {
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
            </div>
        );
    }

    return (
        <div className="group flex items-start gap-2 px-5 py-1 hover:bg-slate-50 mt-1">
            <Avatar className="h-9 w-9 mt-0.5 rounded cursor-pointer hover:opacity-80 transition-opacity">
                <AvatarImage src={sender.profileImage} className="rounded" />
                <AvatarFallback className="rounded bg-indigo-600 text-white text-xs">
                    {sender.firstName?.[0]}{sender.lastName?.[0]}
                </AvatarFallback>
            </Avatar>

            <div className="flex-1 min-w-0">
                <div className="flex items-baseline gap-2">
                    <span className="font-bold text-[15px] hover:underline cursor-pointer">
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
            </div>
        </div>
    );
}
