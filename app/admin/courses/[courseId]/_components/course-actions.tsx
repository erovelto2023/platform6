"use client";

import { Trash } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { ConfirmModal } from "@/components/modals/confirm-modal";
import { deleteCourse, publishCourse, unpublishCourse } from "@/lib/actions/course.actions";
import { useConfettiStore } from "@/hooks/use-confetti-store";

interface CourseActionsProps {
    disabled: boolean;
    courseId: string;
    isPublished: boolean;
};

export const CourseActions = ({
    disabled,
    courseId,
    isPublished
}: CourseActionsProps) => {
    const router = useRouter();
    const confetti = useConfettiStore();
    const [isLoading, setIsLoading] = useState(false);

    const onClick = async () => {
        try {
            setIsLoading(true);

            if (isPublished) {
                await unpublishCourse(courseId);
                toast.success("Course unpublished");
            } else {
                await publishCourse(courseId);
                toast.success("Course published");
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

            await deleteCourse(courseId);
            toast.success("Course deleted");
            router.push(`/admin/courses`);
            router.refresh();
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
                size="sm"
                className="h-10 px-4 bg-cyan-600 hover:bg-cyan-500 disabled:opacity-40 text-white font-mono font-bold text-xs uppercase tracking-wider rounded-xl cursor-pointer"
            >
                {isPublished ? "Unpublish" : "Publish Course"}
            </Button>
            <ConfirmModal onConfirm={onDelete}>
                <Button size="sm" disabled={isLoading} className="h-10 w-10 p-0 bg-rose-950 hover:bg-rose-900 border border-rose-800 text-rose-300 rounded-xl cursor-pointer">
                    <Trash className="h-4 w-4" />
                </Button>
            </ConfirmModal>
        </div>
    );
};
