'use client';

import { Button } from "@/components/ui/button";
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
        <div className="w-20 border-r border-slate-800 bg-slate-900 flex flex-col items-center py-4 gap-3 z-30 shadow-xl relative text-slate-200">
            <Button
                variant={isAIOpen ? "secondary" : "ghost"}
                className={`flex flex-col h-auto py-3 px-2 gap-1 w-full rounded-none font-mono cursor-pointer transition-all ${
                    isAIOpen ? "bg-orange-500/20 text-orange-400 border-r-2 border-orange-500 font-bold" : "text-slate-400 hover:text-slate-100 hover:bg-slate-800/80"
                }`}
                onClick={onToggleAI}
            >
                <Sparkles className="h-5 w-5 text-amber-400" />
                <span className="text-[10px] uppercase font-bold">AI Helper</span>
            </Button>
            <div className="w-10 h-[1px] bg-slate-800 my-1" />
            <Button variant="ghost" className="flex flex-col h-auto py-3 px-2 gap-1 w-full rounded-none text-slate-300 hover:text-amber-400 hover:bg-slate-800/80 cursor-pointer" onClick={onAddText}>
                <Type className="h-5 w-5" />
                <span className="text-[10px] font-mono font-bold uppercase">Text</span>
            </Button>
            <Button variant="ghost" className="flex flex-col h-auto py-3 px-2 gap-1 w-full rounded-none text-slate-300 hover:text-amber-400 hover:bg-slate-800/80 cursor-pointer" onClick={onAddRectangle}>
                <Square className="h-5 w-5" />
                <span className="text-[10px] font-mono font-bold uppercase">Box</span>
            </Button>
            <Button variant="ghost" className="flex flex-col h-auto py-3 px-2 gap-1 w-full rounded-none text-slate-300 hover:text-amber-400 hover:bg-slate-800/80 cursor-pointer" onClick={onAddCircle}>
                <Circle className="h-5 w-5" />
                <span className="text-[10px] font-mono font-bold uppercase">Circle</span>
            </Button>
            <Button variant="ghost" className="flex flex-col h-auto py-3 px-2 gap-1 w-full rounded-none text-slate-300 hover:text-amber-400 hover:bg-slate-800/80 cursor-pointer" onClick={onAddTriangle}>
                <Triangle className="h-5 w-5" />
                <span className="text-[10px] font-mono font-bold uppercase">Triangle</span>
            </Button>
            <Button variant="ghost" className="flex flex-col h-auto py-3 px-2 gap-1 w-full rounded-none text-slate-300 hover:text-amber-400 hover:bg-slate-800/80 cursor-pointer" onClick={() => onAddImage("https://placehold.co/300x200")}>
                <ImageIcon className="h-5 w-5" />
                <span className="text-[10px] font-mono font-bold uppercase">Image</span>
            </Button>
        </div>
    );
}
