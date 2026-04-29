"use client";

import { useState } from "react";
import { 
    Dialog, 
    DialogContent, 
    DialogHeader, 
    DialogTitle, 
    DialogTrigger 
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Image as ImageIcon, Library } from "lucide-react";
import MediaLibrary from "@/app/admin/media/_components/MediaLibrary";

interface MediaPickerProps {
    onSelect: (url: string) => void;
    title?: string;
    trigger?: React.ReactNode;
}

export default function MediaPicker({ onSelect, title = "Select from Gallery", trigger }: MediaPickerProps) {
    const [open, setOpen] = useState(false);

    const handleSelect = (url: string) => {
        onSelect(url);
        setOpen(false);
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                {trigger || (
                    <Button 
                        type="button" 
                        variant="outline" 
                        className="flex items-center gap-2 bg-zinc-900 border-zinc-800 text-zinc-300 hover:text-white hover:bg-zinc-800 rounded-xl px-4 py-2 text-xs font-bold uppercase tracking-widest transition-all"
                    >
                        <Library size={16} />
                        {title}
                    </Button>
                )}
            </DialogTrigger>
            <DialogContent className="bg-[#0A0D14] border-slate-800 text-white sm:max-w-[90vw] lg:max-w-[1000px] h-[90vh] overflow-hidden rounded-[40px] p-0 flex flex-col">
                <div className="p-8 flex-1 flex flex-col min-h-0">
                    <DialogHeader className="mb-6 flex-none">
                        <DialogTitle className="text-3xl font-black italic uppercase tracking-tighter flex items-center gap-4">
                            <div className="p-3 bg-[#6366F1]/10 rounded-[20px]">
                                <ImageIcon className="h-6 w-6 text-[#6366F1]" />
                            </div>
                            Media <span className="text-[#6366F1]">Gallery</span>
                        </DialogTitle>
                    </DialogHeader>
                    
                    <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
                        <MediaLibrary onSelect={handleSelect} />
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
