"use client";

import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Pencil } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { updateLesson } from "@/lib/actions/lesson.actions";

import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface LessonTitleFormProps {
    initialData: {
        title: string;
    };
    courseId: string;
    chapterId: string;
    lessonId: string;
}

const formSchema = z.object({
    title: z.string().min(1, { message: "Title is required" }),
});

export const LessonTitleForm = ({
    initialData,
    courseId,
    chapterId,
    lessonId
}: LessonTitleFormProps) => {
    const [isEditing, setIsEditing] = useState(false);

    const toggleEdit = () => setIsEditing((current) => !current);

    const router = useRouter();

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: initialData,
    });

    const { isSubmitting, isValid } = form.formState;

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        try {
            const response = await updateLesson(courseId, chapterId, lessonId, values);
            if (response.success) {
                toast.success("Lesson title updated");
                toggleEdit();
                router.refresh();
            } else {
                toast.error("Something went wrong");
            }
        } catch {
            toast.error("Something went wrong");
        }
    };

    return (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-3">
            <div className="font-mono text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center justify-between">
                <span>Lesson Title</span>
                <Button onClick={toggleEdit} variant="ghost" size="sm" className="text-orange-400 hover:text-amber-300 hover:bg-slate-800 font-mono text-xs cursor-pointer">
                    {isEditing ? (
                        <>Cancel</>
                    ) : (
                        <>
                            <Pencil className="h-3.5 w-3.5 mr-1.5" />
                            Edit Title
                        </>
                    )}
                </Button>
            </div>
            {!isEditing && (
                <p className="text-sm font-semibold text-slate-100 font-sans">
                    {initialData.title}
                </p>
            )}
            {isEditing && (
                <Form {...form}>
                    <form
                        onSubmit={form.handleSubmit(onSubmit)}
                        className="space-y-4 mt-2"
                    >
                        <FormField
                            control={form.control}
                            name="title"
                            render={({ field }) => (
                                <FormItem>
                                    <FormControl>
                                        <Input
                                            disabled={isSubmitting}
                                            placeholder="e.g. 'Introduction to the course'"
                                            className="bg-slate-950 border-slate-800 text-slate-100 placeholder:text-slate-500 font-mono text-xs focus:border-orange-500"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <div className="flex items-center gap-x-2">
                            <Button
                                disabled={!isValid || isSubmitting}
                                type="submit"
                                size="sm"
                                className="bg-orange-500 hover:bg-orange-600 text-slate-950 font-black font-mono text-xs uppercase"
                            >
                                Save
                            </Button>
                        </div>
                    </form>
                </Form>
            )}
        </div>
    );
};
