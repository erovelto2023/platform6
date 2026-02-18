"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { createVideoProject } from "@/lib/actions/video.actions";
import { toast } from "sonner";

interface CreateProjectButtonProps {
    userId: string;
    variant?: "default" | "secondary";
}

export function CreateProjectButton({ userId, variant = "default" }: CreateProjectButtonProps) {
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();

    const handleCreate = async () => {
        setIsLoading(true);
        try {
            const res = await createVideoProject(userId);
            if (res.success) {
                toast.success("Project created! Opening editor...");
                router.push(`/video-suite/${res.data._id}`);
            } else {
                toast.error(res.error || "Failed to create project");
            }
        } catch (error) {
            toast.error("Something went wrong");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Button
            onClick={handleCreate}
            disabled={isLoading}
            variant={variant}
            className={variant === "default" ? "bg-purple-600 hover:bg-purple-700 text-white gap-2" : "gap-2"}
        >
            {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
            New Project
        </Button>
    );
}
