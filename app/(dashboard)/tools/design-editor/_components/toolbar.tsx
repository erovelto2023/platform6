'use client';

import { Button } from "@/components/ui/button";
import { Download, Trash2, Paintbrush } from "lucide-react";

interface EditorToolbarProps {
    hasSelection: boolean;
    selectedColor: string;
    onDelete: () => void;
    onDownload: () => void;
    onColorChange: (color: string) => void;
}

export default function EditorToolbar({ hasSelection, selectedColor, onDelete, onDownload, onColorChange }: EditorToolbarProps) {
    return (
        <div className="h-16 border-b border-slate-800 bg-slate-900 flex items-center justify-between px-6 shadow-xl z-10 text-slate-100">
            <div className="flex items-center gap-4">
                <h1 className="font-black text-lg text-slate-100 uppercase tracking-tight flex items-center gap-2">
                    <Paintbrush className="h-5 w-5 text-orange-400" />
                    Design <span className="bg-gradient-to-r from-orange-400 to-amber-400 bg-clip-text text-transparent">Editor</span>
                </h1>
                {hasSelection && (
                    <div className="flex items-center gap-3 border-l border-slate-800 pl-4 ml-4">
                        <span className="text-xs font-mono text-slate-300 font-bold uppercase">Fill Color:</span>
                        <input
                            type="color"
                            className="h-8 w-8 rounded-lg cursor-pointer border border-slate-700 bg-slate-950 p-0"
                            value={selectedColor}
                            onChange={(e) => onColorChange(e.target.value)}
                        />
                        <Button variant="ghost" size="icon" onClick={onDelete} className="text-rose-400 hover:text-rose-300 hover:bg-rose-950/60 cursor-pointer">
                            <Trash2 className="h-4 w-4" />
                        </Button>
                    </div>
                )}
            </div>

            <div className="flex items-center gap-2">
                <Button onClick={onDownload} className="bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-400 hover:to-amber-500 text-slate-950 font-black font-mono text-xs uppercase tracking-wider shadow-md cursor-pointer">
                    <Download className="h-4 w-4 mr-2" />
                    Download Canvas
                </Button>
            </div>
        </div>
    );
}
