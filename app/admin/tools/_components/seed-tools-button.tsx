"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { seedTools } from "@/lib/actions/tool.actions";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Database } from "lucide-react";

export const SeedToolsButton = () => {
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleSeed = async () => {
        setLoading(true);
        try {
            const result = await seedTools();
            if (result.success) {
                toast.success("Tools seeded successfully");
                router.refresh();
            } else {
                toast.error(result.error || "Failed to seed tools");
            }
        } catch (error) {
            toast.error("Something went wrong");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Button onClick={handleSeed} disabled={loading}>
            <Database className="h-4 w-4 mr-2" />
            {loading ? "Seeding..." : "Seed Tools"}
        </Button>
    );
};
