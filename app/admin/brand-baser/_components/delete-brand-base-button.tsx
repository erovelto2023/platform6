"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { deleteBrandBase } from "@/lib/actions/brand-baser.actions";
import { toast } from "sonner";
import { Trash2, Loader2 } from "lucide-react";

interface DeleteBrandBaseButtonProps {
    brandBaseId: string;
    brandName: string;
}

export const DeleteBrandBaseButton = ({ brandBaseId, brandName }: DeleteBrandBaseButtonProps) => {
    const router = useRouter();
    const [isDeleting, setIsDeleting] = useState(false);

    const handleDelete = async () => {
        try {
            setIsDeleting(true);
            const result = await deleteBrandBase(brandBaseId);

            if (result.success) {
                toast.success("Brand document deleted");
                router.refresh();
            } else {
                toast.error(result.error || "Failed to delete");
            }
        } catch (error) {
            toast.error("Something went wrong");
        } finally {
            setIsDeleting(false);
        }
    };

    return (
        <AlertDialog>
            <AlertDialogTrigger asChild>
                <Button size="sm" variant="outline" className="text-rose-600 hover:bg-rose-50 border-rose-200">
                    <Trash2 className="h-3 w-3 mr-1" />
                    Delete
                </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Delete Brand Document</AlertDialogTitle>
                    <AlertDialogDescription>
                        Are you sure you want to delete <strong>{brandName}</strong>?
                        This will permanently remove all 20 questions and answers. This action cannot be undone.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                        onClick={handleDelete}
                        disabled={isDeleting}
                        className="bg-rose-600 hover:bg-rose-700"
                    >
                        {isDeleting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Delete Document
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
};
