"use client";

import { useState } from "react";
import { Heart, ThumbsUp, Laugh, Sparkles, Flame, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";

interface ReactionsProps {
    postId: string;
    currentReaction?: string;
    reactions: {
        like: number;
        love: number;
        laugh: number;
        wow: number;
        fire: number;
        star: number;
    };
    onReact: (reactionType: string) => void;
}

const reactionTypes = [
    { type: "like", icon: ThumbsUp, label: "Like", color: "text-blue-500" },
    { type: "love", icon: Heart, label: "Love", color: "text-red-500" },
    { type: "laugh", icon: Laugh, label: "Haha", color: "text-yellow-500" },
    { type: "wow", icon: Sparkles, label: "Wow", color: "text-purple-500" },
    { type: "fire", icon: Flame, label: "Fire", color: "text-orange-500" },
    { type: "star", icon: Star, label: "Star", color: "text-amber-500" },
];

export function Reactions({ postId, currentReaction, reactions, onReact }: ReactionsProps) {
    const [isOpen, setIsOpen] = useState(false);

    const totalReactions = Object.values(reactions).reduce((sum, count) => sum + count, 0);
    const currentReactionData = reactionTypes.find(r => r.type === currentReaction);
    const CurrentIcon = currentReactionData?.icon || ThumbsUp;

    const handleReaction = (type: string) => {
        onReact(type);
        setIsOpen(false);
    };

    return (
        <div className="flex items-center gap-2">
            <Popover open={isOpen} onOpenChange={setIsOpen}>
                <PopoverTrigger asChild>
                    <Button
                        variant="ghost"
                        size="sm"
                        className={cn(
                            "gap-2",
                            currentReaction && currentReactionData?.color
                        )}
                    >
                        <CurrentIcon className="h-4 w-4" />
                        <span className="text-sm">
                            {currentReaction ? currentReactionData?.label : "React"}
                        </span>
                        {totalReactions > 0 && (
                            <span className="text-xs text-slate-500">
                                {totalReactions}
                            </span>
                        )}
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-2" align="start">
                    <div className="flex gap-1">
                        {reactionTypes.map((reaction) => {
                            const Icon = reaction.icon;
                            const count = reactions[reaction.type as keyof typeof reactions] || 0;

                            return (
                                <button
                                    key={reaction.type}
                                    onClick={() => handleReaction(reaction.type)}
                                    className={cn(
                                        "flex flex-col items-center gap-1 p-2 rounded-lg hover:bg-slate-100 transition",
                                        currentReaction === reaction.type && "bg-slate-100"
                                    )}
                                    title={reaction.label}
                                >
                                    <Icon className={cn("h-6 w-6", reaction.color)} />
                                    {count > 0 && (
                                        <span className="text-xs text-slate-500">{count}</span>
                                    )}
                                </button>
                            );
                        })}
                    </div>
                </PopoverContent>
            </Popover>
        </div>
    );
}
