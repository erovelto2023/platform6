"use client";

import * as React from "react";
import { X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface TagInputProps {
    placeholder?: string;
    tags?: string[];
    setTags: (tags: string[]) => void;
}

export function TagInput({ placeholder, tags = [], setTags }: TagInputProps) {
    const [inputValue, setInputValue] = React.useState("");

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter" || e.key === ",") {
            e.preventDefault();
            const newTag = inputValue.trim();
            if (newTag && !tags.includes(newTag)) {
                setTags([...tags, newTag]);
                setInputValue("");
            }
        } else if (e.key === "Backspace" && !inputValue && tags.length > 0) {
            setTags(tags.slice(0, -1));
        }
    };

    const removeTag = (tagToRemove: string) => {
        setTags(tags.filter((tag) => tag !== tagToRemove));
    };

    return (
        <div className="flex flex-wrap gap-2 p-2 border border-slate-800 rounded-xl bg-slate-950 focus-within:ring-1 focus-within:ring-cyan-500 transition">
            {tags.map((tag) => (
                <Badge key={tag} variant="secondary" className="gap-1 bg-slate-800 text-cyan-400 border border-slate-700 font-mono text-xs">
                    {tag}
                    <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="h-3 w-3 p-0 hover:bg-transparent text-slate-400 hover:text-rose-400"
                        onClick={() => removeTag(tag)}
                    >
                        <X className="h-3 w-3" />
                        <span className="sr-only">Remove {tag}</span>
                    </Button>
                </Badge>
            ))}
            <Input
                className="flex-1 border-none shadow-none focus-visible:ring-0 p-0 h-6 min-w-[120px] bg-transparent text-slate-100 placeholder:text-slate-500 font-mono text-xs"
                placeholder={tags.length === 0 ? placeholder : ""}
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyDown}
            />
        </div>
    );
}
