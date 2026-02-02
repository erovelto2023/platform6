"use client";

import { useState } from "react";
import { Switch } from "@/components/ui/switch";
import { toggleToolStatus } from "@/lib/actions/tool.actions";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

interface ToolToggleProps {
    toolId: string;
    isEnabled: boolean;
}

export const ToolToggle = ({ toolId, isEnabled }: ToolToggleProps) => {
    const [enabled, setEnabled] = useState(isEnabled);
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleToggle = async () => {
        setLoading(true);
        try {
            const result = await toggleToolStatus(toolId);
            if (result.success) {
                setEnabled(!enabled);
                toast.success(enabled ? "Tool disabled" : "Tool enabled");
                router.refresh();
            } else {
                toast.error(result.error || "Failed to update tool");
            }
        } catch (error) {
            toast.error("Something went wrong");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">
                {enabled ? "Enabled" : "Disabled"}
            </span>
            <Switch
                checked={enabled}
                onCheckedChange={handleToggle}
                disabled={loading}
            />
        </div>
    );
};
