"use client";

import { Trash } from "lucide-react";
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
import { deletePost } from "@/lib/actions/post.actions";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { useState } from "react";

interface DeletePostButtonProps {
    postId: string;
    postTitle: string;
}

export const DeletePostButton = ({ postId, postTitle }: DeletePostButtonProps) => {
    const router = useRouter();
    const [isDeleting, setIsDeleting] = useState(false);

    const handleDelete = async () => {
        try {
            setIsDeleting(true);
            await deletePost(postId);
            toast.success("Post deleted successfully");
            router.refresh();
        } catch (error) {
            toast.error("Failed to delete post");
        } finally {
            setIsDeleting(false);
        }
    };

    return (
        <AlertDialog>
            <AlertDialogTrigger asChild>
                <Button variant="ghost" size="icon" disabled={isDeleting}>
                    <Trash className="h-4 w-4 text-rose-600" />
                </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Delete Post</AlertDialogTitle>
                    <AlertDialogDescription>
                        Are you sure you want to delete <strong>"{postTitle}"</strong>?
                        This action cannot be undone.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                        onClick={handleDelete}
                        className="bg-rose-600 hover:bg-rose-700"
                        disabled={isDeleting}
                    >
                        {isDeleting ? "Deleting..." : "Delete"}
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
};
