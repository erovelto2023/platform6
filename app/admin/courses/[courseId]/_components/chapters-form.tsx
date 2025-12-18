"use client";

import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Loader2, PlusCircle } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { createModule, reorderModules } from "@/lib/actions/module.actions";

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
import { ChaptersList } from "./chapters-list";

interface ChaptersFormProps {
    initialData: {
        modules: any[]; // We'll type this better later
    };
    courseId: string;
}

const formSchema = z.object({
    title: z.string().min(1),
});

export const ChaptersForm = ({
    initialData,
    courseId
}: ChaptersFormProps) => {
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
            const response = await createModule(courseId, values.title);
            if (response.success) {
                toast.success("Chapter created");
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
            await reorderModules(courseId, updateData);
            toast.success("Chapters reordered");
            router.refresh();
        } catch {
            toast.error("Something went wrong");
        } finally {
            setIsUpdating(false);
        }
    }

    const onEdit = (id: string) => {
        router.push(`/admin/courses/${courseId}/chapters/${id}`);
    }

    return (
        <div className="mt-6 border bg-slate-100 rounded-md p-4 relative">
            {isUpdating && (
                <div className="absolute h-full w-full bg-slate-500/20 top-0 right-0 rounded-m flex items-center justify-center z-10">
                    <Loader2 className="animate-spin h-6 w-6 text-sky-700" />
                </div>
            )}
            <div className="font-medium flex items-center justify-between">
                Course chapters
                <Button onClick={toggleCreating} variant="ghost">
                    {isCreating ? (
                        <>Cancel</>
                    ) : (
                        <>
                            <PlusCircle className="h-4 w-4 mr-2" />
                            Add a chapter
                        </>
                    )}
                </Button>
            </div>
            {isCreating && (
                <Form {...form}>
                    <form
                        onSubmit={form.handleSubmit(onSubmit)}
                        className="space-y-4 mt-4"
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
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <Button
                            disabled={!isValid || isSubmitting}
                            type="submit"
                        >
                            Create
                        </Button>
                    </form>
                </Form>
            )}
            {!isCreating && (
                <div className={cn(
                    "text-sm mt-2",
                    !initialData.modules.length && "text-slate-500 italic"
                )}>
                    {!initialData.modules.length && "No chapters"}
                    <ChaptersList
                        onEdit={onEdit}
                        onReorder={onReorder}
                        items={initialData.modules || []}
                    />
                </div>
            )}
            {!isCreating && (
                <p className="text-xs text-muted-foreground mt-4">
                    Drag and drop to reorder the chapters
                </p>
            )}
        </div>
    )
}
