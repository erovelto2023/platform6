"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { exportBrandBase } from "@/lib/actions/brand-baser.actions";
import { toast } from "sonner";
import { Download, Loader2 } from "lucide-react";

interface ExportButtonProps {
    brandBaseId: string;
    brandName: string;
    size?: "default" | "sm";
}

export const ExportButton = ({ brandBaseId, brandName, size = "default" }: ExportButtonProps) => {
    const [isExporting, setIsExporting] = useState(false);

    const handleExport = async () => {
        setIsExporting(true);
        try {
            const result = await exportBrandBase(brandBaseId);

            if (result.success && result.text) {
                // Create a blob and download
                const blob = new Blob([result.text], { type: "text/plain" });
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement("a");
                a.href = url;
                a.download = `${brandName.replace(/[^a-z0-9]/gi, "_")}_BrandBase.txt`;
                document.body.appendChild(a);
                a.click();
                window.URL.revokeObjectURL(url);
                document.body.removeChild(a);

                toast.success("Brand base exported!");
            } else {
                toast.error(result.error || "Failed to export");
            }
        } catch (error) {
            toast.error("Failed to export");
        } finally {
            setIsExporting(false);
        }
    };

    return (
        <Button
            size={size}
            variant="outline"
            onClick={handleExport}
            disabled={isExporting}
        >
            {isExporting ? (
                <>
                    <Loader2 className={`${size === "sm" ? "h-3 w-3" : "h-4 w-4"} mr-1 animate-spin`} />
                    {size === "sm" ? "..." : "Exporting..."}
                </>
            ) : (
                <>
                    <Download className={`${size === "sm" ? "h-3 w-3" : "h-4 w-4"} mr-1`} />
                    {size === "sm" ? "Export" : "Export for ChatGPT"}
                </>
            )}
        </Button>
    );
};
