"use client";

import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Smile, Heart, ThumbsUp, PartyPopper, Check, Rocket } from "lucide-react";

const COMMON_EMOJIS = [
    { emoji: "👍", label: "plus-one" },
    { emoji: "❤️", label: "heart" },
    { emoji: "🔥", label: "fire" },
    { emoji: "🙌", label: "raised-hands" },
    { emoji: "🎉", label: "tada" },
    { emoji: "✅", label: "check" },
    { emoji: "🚀", label: "rocket" },
    { emoji: "🤔", label: "thinking" },
];

interface SlackReactionPickerProps {
    onSelect: (emoji: string) => void;
    children: React.ReactNode;
}

export function SlackReactionPicker({ onSelect, children }: SlackReactionPickerProps) {
    return (
        <Popover>
            <PopoverTrigger asChild>
                {children}
            </PopoverTrigger>
            <PopoverContent className="w-auto p-1 bg-white border border-slate-200 shadow-lg rounded-xl flex gap-1 z-[100]">
                {COMMON_EMOJIS.map(({ emoji, label }) => (
                    <Button
                        key={label}
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-lg hover:bg-slate-100"
                        onClick={() => onSelect(emoji)}
                    >
                        {emoji}
                    </Button>
                ))}
            </PopoverContent>
        </Popover>
    );
}
