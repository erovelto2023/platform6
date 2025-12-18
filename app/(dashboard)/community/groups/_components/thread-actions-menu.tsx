"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, Trash2, Edit, Flag, Pin, PinOff } from "lucide-react";
import { toast } from "sonner";
import { deleteThread } from "@/lib/actions/group.actions";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface ThreadActionsMenuProps {
    threadId: string;
    groupSlug: string;
    isAuthor: boolean;
    isAdmin: boolean;
    isPinned?: boolean;
}

export function ThreadActionsMenu({
    threadId,
    groupSlug,
    isAuthor,
    isAdmin,
    isPinned = false,
}: ThreadActionsMenuProps) {
    const router = useRouter();
    const [showDeleteDialog, setShowDeleteDialog] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);

    const handleDelete = async () => {
        setIsDeleting(true);
        try {
            await deleteThread(threadId, groupSlug);
            toast.success("Thread deleted successfully");
            router.push(`/community/groups/${groupSlug}`);
        } catch (error) {
            toast.error("Failed to delete thread");
            console.error(error);
        } finally {
            setIsDeleting(false);
            setShowDeleteDialog(false);
        }
    };

    const canManage = isAuthor || isAdmin;

    // if (!canManage) {
    //     return null;
    // }

    return (
        <>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreHorizontal className="h-5 w-5 text-slate-400" />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                    {/* Future: Edit Thread */}
                    {/* <DropdownMenuItem onClick={() => router.push(...) }>
                        <Edit className="mr-2 h-4 w-4" />
                        Edit Thread
                    </DropdownMenuItem> */}

                    {/* Future: Pin/Unpin for Admins */}
                    {/* {isAdmin && (
                        <DropdownMenuItem>
                            {isPinned ? <PinOff className="mr-2 h-4 w-4" /> : <Pin className="mr-2 h-4 w-4" />}
                            {isPinned ? "Unpin Thread" : "Pin Thread"}
                        </DropdownMenuItem>
                    )} */}

                    {canManage ? (
                        <DropdownMenuItem
                            className="text-red-600 focus:text-red-600 focus:bg-red-50"
                            onClick={() => setShowDeleteDialog(true)}
                        >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete Thread
                        </DropdownMenuItem>
                    ) : (
                        <DropdownMenuItem onClick={() => toast.info("Report feature coming soon")}>
                            <Flag className="mr-2 h-4 w-4" />
                            Report Thread
                        </DropdownMenuItem>
                    )}
                </DropdownMenuContent>
            </DropdownMenu>

            <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This action cannot be undone. This will permanently delete the thread and all its replies.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={(e) => {
                                e.preventDefault();
                                handleDelete();
                            }}
                            className="bg-red-600 hover:bg-red-700 text-white"
                            disabled={isDeleting}
                        >
                            {isDeleting ? "Deleting..." : "Delete"}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    );
}
