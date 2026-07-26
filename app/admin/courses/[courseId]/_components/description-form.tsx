"use client";

import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Pencil } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { updateCourse } from "@/lib/actions/course.actions";

import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface DescriptionFormProps {
    initialData: {
        description: string;
    };
    courseId: string;
}

const formSchema = z.object({
    description: z.string().min(1, {
        message: "Description is required",
    }),
});

export const DescriptionForm = ({
    initialData,
    courseId
}: DescriptionFormProps) => {
    const [isEditing, setIsEditing] = useState(false);

    const toggleEdit = () => setIsEditing((current) => !current);

    const router = useRouter();

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            description: initialData?.description || ""
        },
    });

    const { isSubmitting, isValid } = form.formState;

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        try {
            const response = await updateCourse(courseId, values);
            if (response.success) {
                toast.success("Course updated");
                toggleEdit();
                router.refresh();
            } else {
                toast.error("Something went wrong");
            }
        } catch {
            toast.error("Something went wrong");
        }
    }

    return (
        <div className="mt-6 border border-slate-800 bg-slate-900 rounded-3xl p-6 shadow-2xl space-y-3">
            <div className="font-bold text-slate-100 flex items-center justify-between text-xs font-mono uppercase tracking-wider">
                <span>Course Description</span>
                <Button onClick={toggleEdit} variant="ghost" className="h-8 text-cyan-400 hover:text-cyan-300 font-mono text-xs hover:bg-slate-950 rounded-xl">
                    {isEditing ? (
                        <>Cancel</>
                    ) : (
                        <>
                            <Pencil className="h-3.5 w-3.5 mr-1.5" />
                            Edit Description
                        </>
                    )}
                </Button>
            </div>
            {!isEditing && (
                <div className={cn(
                    "text-sm mt-2 font-sans bg-slate-950 p-4 rounded-2xl border border-slate-800 leading-relaxed",
                    !initialData.description ? "text-slate-500 italic" : "text-slate-300"
                )}>
                    {initialData.description || "No description provided."}
                </div>
            )}
            {isEditing && (
                <Form {...form}>
                    <form
                        onSubmit={form.handleSubmit(onSubmit)}
                        className="space-y-4 mt-4"
                    >
                        <FormField
                            control={form.control}
                            name="description"
                            render={({ field }) => (
                                <FormItem>
                                    <FormControl>
                                        <Textarea
                                            disabled={isSubmitting}
                                            placeholder="e.g. 'This course covers end-to-end digital monetization strategies...'"
                                            className="bg-slate-950 border border-slate-800 text-slate-100 placeholder:text-slate-500 font-sans text-xs rounded-2xl p-4 min-h-28 focus:border-cyan-500"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage className="text-rose-400 text-xs font-mono" />
                                </FormItem>
                            )}
                        />
                        <div className="flex items-center gap-x-2">
                            <Button
                                disabled={!isValid || isSubmitting}
                                type="submit"
                                className="bg-cyan-600 hover:bg-cyan-500 text-white font-mono font-bold text-xs uppercase tracking-wider rounded-xl h-10"
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
