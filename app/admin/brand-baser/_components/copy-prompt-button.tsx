"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Copy, Check } from "lucide-react";
import { toast } from "sonner";

interface CopyPromptButtonProps {
    promptTitle: string;
    promptContent: string;
}

export const CopyPromptButton = ({ promptTitle, promptContent }: CopyPromptButtonProps) => {
    const [copied, setCopied] = useState(false);

    const handleCopy = () => {
        navigator.clipboard.writeText(promptContent);
        setCopied(true);
        toast.success(`${promptTitle} copied!`);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <Button
            onClick={handleCopy}
            variant="outline"
            className="w-full"
            size="sm"
        >
            {copied ? (
                <>
                    <Check className="h-4 w-4 mr-2 text-emerald-600" />
                    Copied!
                </>
            ) : (
                <>
                    <Copy className="h-4 w-4 mr-2" />
                    Copy Prompt
                </>
            )}
        </Button>
    );
};
