
"use client";

import { Button } from "@/components/ui/button";
import { Code, Copy, Check } from "lucide-react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import { toast } from "sonner";

export function EmbedButton({ serviceId }: { serviceId: string }) {
    const [copied, setCopied] = useState(false);

    // Construct the embed URL
    // In production, this would be the actual public URL
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
    const embedUrl = `${appUrl}/book/${serviceId}`;

    const embedCode = `<iframe src="${embedUrl}" width="100%" height="600px" frameborder="0"></iframe>`;

    const onCopy = () => {
        navigator.clipboard.writeText(embedCode);
        setCopied(true);
        toast.success("Embed code copied!");
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button variant="outline" size="icon" title="Get Embed Code">
                    <Code className="h-4 w-4 text-slate-500" />
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Embed Booking Widget</DialogTitle>
                    <DialogDescription>
                        Copy this code and paste it into your website to let clients book directly.
                    </DialogDescription>
                </DialogHeader>
                <div className="flex items-center space-x-2">
                    <div className="grid flex-1 gap-2">
                        <Label htmlFor="embed-code" className="sr-only">
                            Embed Code
                        </Label>
                        <Textarea
                            id="embed-code"
                            readOnly
                            value={embedCode}
                            className="font-mono text-xs h-24"
                        />
                    </div>
                </div>
                <div className="flex justify-end">
                    <Button size="sm" className="px-3" onClick={onCopy}>
                        <span className="sr-only">Copy</span>
                        {copied ? <Check className="h-4 w-4 mr-2" /> : <Copy className="h-4 w-4 mr-2" />}
                        {copied ? "Copied" : "Copy Code"}
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}
