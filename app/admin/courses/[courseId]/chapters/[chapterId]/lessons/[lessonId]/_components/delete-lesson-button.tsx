"use client";

import { useState } from "react";
import { Trash2, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { deleteLesson } from "@/lib/actions/lesson.actions";
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
import { toast } from "sonner";

interface DeleteLessonButtonProps {
    courseId: string;
    chapterId: string;
    lessonId: string;
}

export function DeleteLessonButton({ courseId, chapterId, lessonId }: DeleteLessonButtonProps) {
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();

    const onDelete = async () => {
        try {
            setIsLoading(true);
            const response = await deleteLesson(courseId, chapterId, lessonId);
            if (response.success) {
                toast.success("Lesson deleted successfully");
                router.push(`/admin/courses/${courseId}/chapters/${chapterId}`);
                router.refresh();
            } else {
                toast.error("Failed to delete lesson");
            }
        } catch {
            toast.error("Something went wrong");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <AlertDialog>
            <AlertDialogTrigger asChild>
                <Button 
                    variant="outline" 
                    size="sm" 
                    disabled={isLoading}
                    className="bg-slate-900 border-rose-900/60 text-rose-400 hover:text-white hover:bg-rose-950 font-mono text-xs cursor-pointer flex items-center gap-1.5"
                >
                    {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
                    Delete Lesson
                </Button>
            </AlertDialogTrigger>
            <AlertDialogContent className="bg-slate-900 border-slate-800 text-slate-100 font-sans">
                <AlertDialogHeader>
                    <AlertDialogTitle className="text-xl font-black font-mono uppercase text-slate-100">
                        Are you sure you want to delete this lesson?
                    </AlertDialogTitle>
                    <AlertDialogDescription className="text-xs font-mono text-slate-400">
                        This action cannot be undone. This lesson and all of its contents will be permanently deleted from this chapter.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel className="bg-slate-950 border-slate-800 text-slate-300 hover:text-white hover:bg-slate-800 font-mono text-xs cursor-pointer">
                        Cancel
                    </AlertDialogCancel>
                    <AlertDialogAction 
                        onClick={onDelete}
                        className="bg-rose-600 hover:bg-rose-500 text-white font-mono text-xs font-bold uppercase cursor-pointer"
                    >
                        Yes, Delete Lesson
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}
