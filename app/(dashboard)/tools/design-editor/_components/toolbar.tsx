'use client';

import { Button } from "@/components/ui/button";
import { Download, Trash2 } from "lucide-react";

interface EditorToolbarProps {
    hasSelection: boolean;
    selectedColor: string;
    onDelete: () => void;
    onDownload: () => void;
    onColorChange: (color: string) => void;
}

export default function EditorToolbar({ hasSelection, selectedColor, onDelete, onDownload, onColorChange }: EditorToolbarProps) {
    return (
        <div className="h-16 border-b bg-white flex items-center justify-between px-6 shadow-sm z-10">
            <div className="flex items-center gap-4">
                <h1 className="font-bold text-lg">Design Editor</h1>
                {hasSelection && (
                    <div className="flex items-center gap-2 border-l pl-4 ml-4">
                        <span className="text-sm font-medium">Color:</span>
                        <input
                            type="color"
                            className="h-8 w-8 rounded cursor-pointer border-none p-0"
                            value={selectedColor}
                            onChange={(e) => onColorChange(e.target.value)}
                        />
                        <Button variant="ghost" size="icon" onClick={onDelete} className="text-red-500 hover:text-red-600 hover:bg-red-50">
                            <Trash2 className="h-5 w-5" />
                        </Button>
                    </div>
                )}
            </div>

            <div className="flex items-center gap-2">
                <Button onClick={onDownload} className="bg-indigo-600 hover:bg-indigo-700">
                    <Download className="h-4 w-4 mr-2" />
                    Download
                </Button>
            </div>
        </div>
    );
}
