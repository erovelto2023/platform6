"use client";

import { Trash } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { ConfirmModal } from "@/components/modals/confirm-modal";
import { deleteResource, updateResource } from "@/lib/actions/resource.actions";
import { useConfettiStore } from "@/hooks/use-confetti-store";

interface ResourceActionsProps {
    disabled: boolean;
    resourceId: string;
    isPublished: boolean;
};

export const ResourceActions = ({
    disabled,
    resourceId,
    isPublished
}: ResourceActionsProps) => {
    const router = useRouter();
    const confetti = useConfettiStore();
    const [isLoading, setIsLoading] = useState(false);

    const onClick = async () => {
        try {
            setIsLoading(true);

            if (isPublished) {
                await updateResource(resourceId, { isPublished: false });
                toast.success("Resource unpublished");
            } else {
                await updateResource(resourceId, { isPublished: true });
                toast.success("Resource published");
                confetti.onOpen();
            }

            router.refresh();
        } catch {
            toast.error("Something went wrong");
        } finally {
            setIsLoading(false);
        }
    }

    const onDelete = async () => {
        try {
            setIsLoading(true);

            await deleteResource(resourceId);
            toast.success("Resource deleted");
            router.refresh();
            router.push(`/admin/resources`);
        } catch {
            toast.error("Something went wrong");
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <div className="flex items-center gap-x-2">
            <Button
                onClick={onClick}
                disabled={disabled || isLoading}
                variant="outline"
                size="sm"
            >
                {isPublished ? "Unpublish" : "Publish"}
            </Button>
            <ConfirmModal onConfirm={onDelete}>
                <Button size="sm" disabled={isLoading}>
                    <Trash className="h-4 w-4" />
                </Button>
            </ConfirmModal>
        </div>
    )
}
