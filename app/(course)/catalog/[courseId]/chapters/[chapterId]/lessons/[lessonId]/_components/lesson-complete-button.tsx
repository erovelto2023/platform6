"use client";

import { useState } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Loader2, CheckCircle } from "lucide-react";

import { Button } from "@/components/ui/button";
import { markLessonComplete, markLessonIncomplete } from "@/lib/actions/progress.actions";

interface LessonCompleteButtonProps {
    courseId: string;
    lessonId: string;
    isCompleted: boolean;
    nextLessonId?: string;
    nextChapterId?: string;
}

export const LessonCompleteButton = ({
    courseId,
    lessonId,
    isCompleted,
    nextLessonId,
    nextChapterId,
}: LessonCompleteButtonProps) => {
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();

    const toggleComplete = async () => {
        try {
            setIsLoading(true);
            if (isCompleted) {
                await markLessonIncomplete(courseId, lessonId);
                toast.success("Marked as incomplete");
            } else {
                await markLessonComplete(courseId, lessonId);
                toast.success("Marked as complete");

                if (nextLessonId && nextChapterId) {
                    router.push(`/catalog/${courseId}/chapters/${nextChapterId}/lessons/${nextLessonId}`);
                }
            }
            router.refresh();
        } catch {
            toast.error("Something went wrong");
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <Button
            onClick={toggleComplete}
            disabled={isLoading}
            variant={isCompleted ? "outline" : "default"}
            className="w-full md:w-auto"
        >
            {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : (
                isCompleted ? (
                    <>
                        <CheckCircle className="h-4 w-4 mr-2" />
                        Completed
                    </>
                ) : "Mark as Complete"
            )}
        </Button>
    )
}
