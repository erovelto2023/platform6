"use client";

import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { deleteBook, deleteChapter, deletePage, deleteShelf } from "@/lib/actions/docs.actions";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { useState } from "react";

export function DeletePageButton({ pageId }: { pageId: string }) {
    const router = useRouter();
    const [isDeleting, setIsDeleting] = useState(false);

    const handleDelete = async () => {
        if (!confirm("Are you sure you want to delete this page?")) return;

        setIsDeleting(true);
        try {
            await deletePage(pageId);
            toast.success("Page deleted successfully");
            router.refresh();
        } catch (error) {
            toast.error("Failed to delete page");
            console.error(error);
        } finally {
            setIsDeleting(false);
        }
    };

    return (
        <button
            onClick={handleDelete}
            disabled={isDeleting}
            className="text-xs text-red-600 hover:text-red-800 hover:underline disabled:opacity-50"
        >
            {isDeleting ? "Deleting..." : "Delete"}
        </button>
    );
}

export function DeleteChapterButton({ chapterId }: { chapterId: string }) {
    const router = useRouter();
    const [isDeleting, setIsDeleting] = useState(false);

    const handleDelete = async () => {
        if (!confirm("Are you sure you want to delete this chapter and all its pages?")) return;

        setIsDeleting(true);
        try {
            await deleteChapter(chapterId);
            toast.success("Chapter deleted successfully");
            router.refresh();
        } catch (error) {
            toast.error("Failed to delete chapter");
            console.error(error);
        } finally {
            setIsDeleting(false);
        }
    };

    return (
        <button
            onClick={handleDelete}
            disabled={isDeleting}
            className="text-xs text-red-600 hover:text-red-800 hover:underline disabled:opacity-50"
        >
            {isDeleting ? "Deleting..." : "Delete"}
        </button>
    );
}

export function DeleteBookButton({ bookId, redirectTo }: { bookId: string; redirectTo?: string }) {
    const router = useRouter();
    const [isDeleting, setIsDeleting] = useState(false);

    const handleDelete = async () => {
        if (!confirm("Are you sure you want to delete this book and all its content?")) return;

        setIsDeleting(true);
        try {
            await deleteBook(bookId);
            toast.success("Book deleted successfully");
            if (redirectTo) {
                router.push(redirectTo);
            } else {
                router.refresh();
            }
        } catch (error) {
            toast.error("Failed to delete book");
            console.error(error);
        } finally {
            setIsDeleting(false);
        }
    };

    return (
        <Button
            onClick={handleDelete}
            disabled={isDeleting}
            variant="destructive"
            size="sm"
            className="gap-2"
        >
            <Trash2 size={16} />
            {isDeleting ? "Deleting..." : "Delete Book"}
        </Button>
    );
}

export function DeleteShelfButton({ shelfId }: { shelfId: string }) {
    const router = useRouter();
    const [isDeleting, setIsDeleting] = useState(false);

    const handleDelete = async () => {
        if (!confirm("Are you sure you want to delete this shelf and all its books, chapters, and pages?")) return;

        setIsDeleting(true);
        try {
            await deleteShelf(shelfId);
            toast.success("Shelf deleted successfully");
            router.refresh();
        } catch (error) {
            toast.error("Failed to delete shelf");
            console.error(error);
        } finally {
            setIsDeleting(false);
        }
    };

    return (
        <button
            onClick={handleDelete}
            disabled={isDeleting}
            className="text-xs text-red-600 hover:text-red-800 hover:underline disabled:opacity-50"
        >
            {isDeleting ? "Deleting..." : "Delete"}
        </button>
    );
}
