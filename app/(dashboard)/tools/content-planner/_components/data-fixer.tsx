"use client";

import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";
import { fixContentOwnership } from "@/lib/actions/content.actions";
import { toast } from "sonner";
import { useState } from "react";

export function DataFixer() {
    const [isLoading, setIsLoading] = useState(false);

    const handleFix = async () => {
        setIsLoading(true);
        try {
            const result = await fixContentOwnership();
            if (result.success) {
                toast.success(`Recovered ${result.count} posts!`);
            } else {
                toast.error(result.message || "Failed to fix data");
            }
        } catch (error) {
            toast.error("Error fixing data");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Button variant="outline" size="sm" onClick={handleFix} disabled={isLoading}>
            <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
            Sync Legacy Data
        </Button>
    );
}
