"use client";

import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Loader2, PlusCircle } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { createLesson, reorderLessons } from "@/lib/actions/lesson.actions";

import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { LessonsList } from "./lessons-list";

interface LessonsFormProps {
    initialData: {
        lessons: any[];
    };
    courseId: string;
    chapterId: string;
}

const formSchema = z.object({
    title: z.string().min(1),
});

export const LessonsForm = ({
    initialData,
    courseId,
    chapterId
}: LessonsFormProps) => {
    const [isCreating, setIsCreating] = useState(false);
    const [isUpdating, setIsUpdating] = useState(false);

    const toggleCreating = () => setIsCreating((current) => !current);

    const router = useRouter();

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            title: "",
        },
    });

    const { isSubmitting, isValid } = form.formState;

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        try {
            const response = await createLesson(courseId, chapterId, values.title);
            if (response.success) {
                toast.success("Lesson created");
                toggleCreating();
                form.reset();
                router.refresh();
            } else {
                toast.error("Something went wrong");
            }
        } catch {
            toast.error("Something went wrong");
        }
    }

    const onReorder = async (updateData: { id: string; position: number }[]) => {
        try {
            setIsUpdating(true);
            await reorderLessons(courseId, chapterId, updateData);
            toast.success("Lessons reordered");
            router.refresh();
        } catch {
            toast.error("Something went wrong");
        } finally {
            setIsUpdating(false);
        }
    }

    const onEdit = (id: string) => {
        router.push(`/admin/courses/${courseId}/chapters/${chapterId}/lessons/${id}`);
    }

    return (
        <div className="mt-6 border border-slate-800 bg-slate-900 rounded-3xl p-6 shadow-2xl space-y-4 relative">
            {isUpdating && (
                <div className="absolute h-full w-full bg-slate-950/80 top-0 right-0 rounded-3xl flex items-center justify-center z-10 font-mono text-xs text-cyan-400 gap-2">
                    <Loader2 className="animate-spin h-5 w-5 text-cyan-400" />
                    Reordering Lessons...
                </div>
            )}
            <div className="font-bold text-slate-100 flex items-center justify-between text-xs font-mono uppercase tracking-wider">
                <span>Chapter Lessons</span>
                <Button onClick={toggleCreating} variant="ghost" className="h-8 text-cyan-400 hover:text-cyan-300 font-mono text-xs hover:bg-slate-950 rounded-xl">
                    {isCreating ? (
                        <>Cancel</>
                    ) : (
                        <>
                            <PlusCircle className="h-3.5 w-3.5 mr-1.5" />
                            Add a Lesson
                        </>
                    )}
                </Button>
            </div>

            {isCreating && (
                <Form {...form}>
                    <form
                        onSubmit={form.handleSubmit(onSubmit)}
                        className="space-y-4 mt-4 bg-slate-950 p-4 rounded-2xl border border-slate-800"
                    >
                        <FormField
                            control={form.control}
                            name="title"
                            render={({ field }) => (
                                <FormItem>
                                    <FormControl>
                                        <Input
                                            disabled={isSubmitting}
                                            placeholder="e.g. 'Lesson 1: Overview & Tools'"
                                            className="bg-slate-900 border border-slate-800 text-slate-100 placeholder:text-slate-500 font-mono text-xs rounded-xl h-11 focus:border-cyan-500"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage className="text-rose-400 text-xs font-mono" />
                                </FormItem>
                            )}
                        />
                        <Button
                            disabled={!isValid || isSubmitting}
                            type="submit"
                            className="bg-cyan-600 hover:bg-cyan-500 text-white font-mono font-bold text-xs uppercase tracking-wider rounded-xl h-10"
                        >
                            Create Lesson
                        </Button>
                    </form>
                </Form>
            )}

            {!isCreating && (
                <div className={cn(
                    "text-xs font-mono mt-2",
                    !initialData.lessons.length && "text-slate-500 italic bg-slate-950 p-4 rounded-2xl border border-slate-800"
                )}>
                    {!initialData.lessons.length && "No lessons added yet."}
                    <LessonsList
                        onEdit={onEdit}
                        onReorder={onReorder}
                        onDelete={async (lessonId) => {
                            const { deleteLesson } = await import("@/lib/actions/lesson.actions");
                            const res = await deleteLesson(courseId, chapterId, lessonId);
                            if (res.success) {
                                toast.success("Lesson deleted");
                                router.refresh();
                            } else {
                                toast.error("Failed to delete lesson");
                            }
                        }}
                        items={initialData.lessons || []}
                    />
                </div>
            )}
            
            {initialData.lessons.length > 0 && (
                <p className="text-[10px] font-mono text-slate-500 uppercase tracking-wider pt-2">
                    Drag and drop to reorder lessons
                </p>
            )}
        </div>
    );
};
