"use client";

import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Loader2, RefreshCw } from "lucide-react";
import { useRouter } from "next/navigation";

interface SyncButtonProps {
    action: (slug: string) => Promise<{ success: boolean; message?: string; error?: string }>;
    slug: string;
    label: string;
    loadingLabel?: string;
    variant?: "default" | "outline" | "secondary" | "ghost" | "link" | "destructive";
    className?: string;
    icon?: React.ReactNode;
}

export function SyncButton({ 
    action, 
    slug, 
    label, 
    loadingLabel = "Syncing...", 
    variant = "outline", 
    className,
    icon 
}: SyncButtonProps) {
    const [isPending, startTransition] = useTransition();
    const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
    const [message, setMessage] = useState("");
    const router = useRouter();

    const handleSync = async () => {
        setStatus("loading");
        setMessage("");

        startTransition(async () => {
            try {
                const result = await action(slug);
                if (result.success) {
                    setStatus("success");
                    setMessage("Sync complete!");
                    router.refresh(); // Force a refresh of the server component data
                } else {
                    setStatus("error");
                    setMessage(result.message || result.error || "Sync failed");
                    console.error("Sync Error:", result);
                }
            } catch (err: any) {
                console.error("Sync Exception:", err);
                setStatus("error");
                const errorText = typeof err === 'string' 
                    ? err 
                    : (err?.message || "An unexpected error occurred. Please check your API keys.");
                setMessage(errorText);
            }
        });
    };

    return (
        <div className="flex flex-col gap-2">
            <Button
                variant={variant}
                className={className}
                disabled={isPending || status === "loading"}
                onClick={handleSync}
            >
                {isPending || status === "loading" ? (
                    <>
                        <Loader2 className="mr-2 h-3 w-3 animate-spin" />
                        {loadingLabel}
                    </>
                ) : (
                    <>
                        {icon && <span className="mr-2">{icon}</span>}
                        {label}
                    </>
                )}
            </Button>
            
            {message && (
                <div className={`text-[9px] font-black uppercase tracking-widest mt-1 ${status === "success" ? "text-emerald-500" : "text-red-500"}`}>
                    {message}
                </div>
            )}
        </div>
    );
}
