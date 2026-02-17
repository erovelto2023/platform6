"use client";

import { SlackSearch } from "./slack-search";
import { HelpCircle, Clock } from "lucide-react";

interface SlackHeaderProps {
    userId: string;
    onSelectMessage: (message: any) => void;
    searchOpen: boolean;
    onSearchOpenChange: (open: boolean) => void;
}

export function SlackHeader({
    userId,
    onSelectMessage,
    searchOpen,
    onSearchOpenChange
}: SlackHeaderProps) {
    return (
        <div className="bg-[#350d36] h-10 flex items-center justify-center relative px-4 border-b border-white/10 shrink-0">
            <div className="absolute left-4 hidden md:flex items-center">
                <Clock className="w-4 h-4 text-slate-300 hover:text-white cursor-pointer transition-colors" />
            </div>

            <div className="flex-1 flex justify-center max-w-[600px]">
                <SlackSearch
                    userId={userId}
                    onSelectMessage={onSelectMessage}
                    open={searchOpen}
                    onOpenChange={onSearchOpenChange}
                />
            </div>

            <div className="absolute right-4 hidden md:flex items-center">
                <HelpCircle className="w-4 h-4 text-slate-300 hover:text-white cursor-pointer transition-colors" />
            </div>
        </div>
    );
}
