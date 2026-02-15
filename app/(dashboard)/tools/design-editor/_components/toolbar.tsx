'use client';

import { Button } from "@/components/ui/button";
import { Download, Trash2, Undo, Redo } from "lucide-react";
import { fabric } from 'fabric';

interface EditorToolbarProps {
    activeObject: fabric.Object | null | undefined;
    onDelete: () => void;
    onDownload: () => void;
    onColorChange: (color: string) => void;
}

export default function EditorToolbar({ activeObject, onDelete, onDownload, onColorChange }: EditorToolbarProps) {
    return (
        <div className="h-16 border-b bg-white flex items-center justify-between px-6 shadow-sm z-10">
            <div className="flex items-center gap-4">
                <h1 className="font-bold text-lg">Design Editor</h1>
                {activeObject && (
                    <div className="flex items-center gap-2 border-l pl-4 ml-4">
                        <span className="text-sm font-medium">Color:</span>
                        <input
                            type="color"
                            className="h-8 w-8 rounded cursor-pointer border-none p-0"
                            // @ts-ignore
                            value={activeObject.get('fill') as string || "#000000"}
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
