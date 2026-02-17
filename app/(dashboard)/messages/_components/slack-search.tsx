"use client";

import { useState, useEffect } from "react";
import { Search } from "lucide-react";
import {
    CommandDialog,
    CommandInput,
    CommandList,
    CommandEmpty,
    CommandGroup,
    CommandItem
} from "@/components/ui/command";
import { searchMessages } from "@/lib/actions/message.actions";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

interface SlackSearchProps {
    userId: string;
    onSelectMessage: (message: any) => void;
}

export function SlackSearch({ userId, onSelectMessage }: SlackSearchProps) {
    const [open, setOpen] = useState(false);
    const [query, setQuery] = useState("");
    const [results, setResults] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const down = (e: KeyboardEvent) => {
            if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
                e.preventDefault();
                setOpen((open) => !open);
            }
        };
        document.addEventListener("keydown", down);
        return () => document.removeEventListener("keydown", down);
    }, []);

    useEffect(() => {
        const fetchResults = async () => {
            if (query.length < 2) {
                setResults([]);
                return;
            }
            setLoading(true);
            try {
                const res = await searchMessages(query, userId);
                if (res.success) {
                    setResults(res.data);
                }
            } finally {
                setLoading(false);
            }
        };

        const timer = setTimeout(fetchResults, 400);
        return () => clearTimeout(timer);
    }, [query, userId]);

    return (
        <>
            <button
                onClick={() => setOpen(true)}
                className="w-full max-w-[400px] h-7 bg-[#481349] hover:bg-[#5D2B5E] text-slate-300 flex items-center gap-2 px-2 rounded-md transition-colors text-xs border border-white/10"
            >
                <Search className="h-3.5 w-3.5" />
                <span className="flex-1 text-left">Search in workspace</span>
                <kbd className="pointer-events-none hidden h-4 select-none items-center gap-1 rounded border border-white/20 bg-white/10 px-1.5 font-mono text-[10px] font-medium opacity-100 sm:flex">
                    <span className="text-xs">⌘</span>K
                </kbd>
            </button>

            <CommandDialog open={open} onOpenChange={setOpen}>
                <div className="flex flex-col h-full">
                    <CommandInput
                        placeholder="Search messages..."
                        onValueChange={setQuery}
                    />
                    <CommandList className="max-h-[400px] overflow-y-auto">
                        {loading && <div className="p-4 text-center text-xs text-slate-500">Searching...</div>}
                        {!loading && query.length > 0 && results.length === 0 && (
                            <CommandEmpty>No messages found.</CommandEmpty>
                        )}
                        {!loading && results.length > 0 && (
                            <CommandGroup heading="Messages">
                                {results.map((msg) => (
                                    <CommandItem
                                        key={msg._id}
                                        onSelect={() => {
                                            onSelectMessage(msg);
                                            setOpen(false);
                                        }}
                                        className="flex flex-col items-start gap-1 p-3 cursor-pointer aria-selected:bg-slate-100"
                                    >
                                        <div className="flex items-center gap-2 w-full justify-between">
                                            <span className="font-bold text-slate-900">
                                                {msg.sender?.firstName} {msg.sender?.lastName}
                                            </span>
                                            <span className="text-[10px] text-slate-500">
                                                {format(new Date(msg.createdAt), "MMM d, h:mm a")}
                                            </span>
                                        </div>
                                        <div className="text-xs text-slate-600 line-clamp-2 w-full">
                                            {msg.content}
                                        </div>
                                        <div className="text-[10px] text-[#007a5a] font-medium">
                                            {msg.channelId ? `#${msg.channelId.name}` : "Direct Message"}
                                        </div>
                                    </CommandItem>
                                ))}
                            </CommandGroup>
                        )}
                    </CommandList>
                </div>
            </CommandDialog>
        </>
    );
}
