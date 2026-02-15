'use client';

import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Type, Square, Image as ImageIcon, Circle, Triangle, Sparkles } from "lucide-react";

interface EditorSidebarProps {
    onAddText: () => void;
    onAddRectangle: () => void;
    onAddCircle: () => void;
    onAddTriangle: () => void;
    onAddImage: (url: string) => void;
    onToggleAI: () => void;
    isAIOpen: boolean;
}

export default function EditorSidebar({
    onAddText,
    onAddRectangle,
    onAddCircle,
    onAddTriangle,
    onAddImage,
    onToggleAI,
    isAIOpen
}: EditorSidebarProps) {
    return (
        <div className="w-20 border-r bg-white flex flex-col items-center py-4 gap-4 z-30 shadow-sm relative">
            <Button
                variant={isAIOpen ? "secondary" : "ghost"}
                className={`flex flex-col h-auto py-3 px-2 gap-1 w-full rounded-none ${isAIOpen ? "bg-indigo-50 text-indigo-600 border-r-2 border-indigo-600" : ""}`}
                onClick={onToggleAI}
            >
                <Sparkles className="h-6 w-6" />
                <span className="text-[10px]">AI Assistant</span>
            </Button>
            <div className="w-10 h-[1px] bg-slate-200 my-1" />
            <Button variant="ghost" className="flex flex-col h-auto py-3 px-2 gap-1 w-full rounded-none" onClick={onAddText}>
                <Type className="h-6 w-6" />
                <span className="text-[10px]">Text</span>
            </Button>
            <Button variant="ghost" className="flex flex-col h-auto py-3 px-2 gap-1 w-full rounded-none" onClick={onAddRectangle}>
                <Square className="h-6 w-6" />
                <span className="text-[10px]">Box</span>
            </Button>
            <Button variant="ghost" className="flex flex-col h-auto py-3 px-2 gap-1 w-full rounded-none" onClick={onAddCircle}>
                <Circle className="h-6 w-6" />
                <span className="text-[10px]">Circle</span>
            </Button>
            <Button variant="ghost" className="flex flex-col h-auto py-3 px-2 gap-1 w-full rounded-none" onClick={onAddTriangle}>
                <Triangle className="h-6 w-6" />
                <span className="text-[10px]">Triangle</span>
            </Button>
            <Button variant="ghost" className="flex flex-col h-auto py-3 px-2 gap-1 w-full rounded-none" onClick={() => onAddImage("https://placehold.co/300x200")}>
                <ImageIcon className="h-6 w-6" />
                <span className="text-[10px]">Image</span>
            </Button>
        </div>
    );
}
