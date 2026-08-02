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
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { Textarea } from "@/components/ui/textarea";

interface LessonDescriptionFormProps {
    initialData: {
        content?: string;
    };
    courseId: string;
    chapterId: string;
    lessonId: string;
}

const formSchema = z.object({
    content: z.string().min(1, {
        message: "Content is required",
    }),
});

export const LessonDescriptionForm = ({
    initialData,
    courseId,
    chapterId,
    lessonId
}: LessonDescriptionFormProps) => {
    const [isEditing, setIsEditing] = useState(false);

    const toggleEdit = () => setIsEditing((current) => !current);

    const router = useRouter();

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            content: initialData.content || "",
        },
    });

    const { isSubmitting, isValid } = form.formState;

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        try {
            await updateLesson(courseId, chapterId, lessonId, values);
            toast.success("Lesson content updated");
            toggleEdit();
            router.refresh();
        } catch {
            toast.error("Something went wrong");
        }
    };

    return (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-3">
            <div className="font-mono text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center justify-between">
                <span>Lecture Content</span>
                <Button onClick={toggleEdit} variant="ghost" size="sm" className="text-orange-400 hover:text-amber-300 hover:bg-slate-800 font-mono text-xs cursor-pointer">
                    {isEditing ? (
                        <>Cancel</>
                    ) : (
                        <>
                            <Pencil className="h-3.5 w-3.5 mr-1.5" />
                            Edit Content
                        </>
                    )}
                </Button>
            </div>
            {!isEditing && (
                <div className={cn(
                    "text-sm font-sans text-slate-200 leading-relaxed whitespace-pre-wrap bg-slate-950 p-4 rounded-xl border border-slate-800",
                    !initialData.content && "text-slate-500 italic font-mono text-xs font-normal"
                )}>
                    {initialData.content || "No content provided yet."}
                </div>
            )}
            {isEditing && (
                <Form {...form}>
                    <form
                        onSubmit={form.handleSubmit(onSubmit)}
                        className="space-y-4 mt-2"
                    >
                        <FormField
                            control={form.control}
                            name="content"
                            render={({ field }) => (
                                <FormItem>
                                    <FormControl>
                                        <Textarea
                                            disabled={isSubmitting}
                                            placeholder="Enter lecture text here..."
                                            {...field}
                                            className="h-60 bg-slate-950 border-slate-800 text-slate-100 placeholder:text-slate-500 font-mono text-xs focus:border-orange-500"
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
