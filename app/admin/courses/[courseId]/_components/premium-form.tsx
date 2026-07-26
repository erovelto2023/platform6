"use client";

import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Pencil } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { updateCourse } from "@/lib/actions/course.actions";

interface PremiumFormProps {
    initialData: {
        isPremium?: boolean;
    };
    courseId: string;
}

const formSchema = z.object({
    isPremium: z.boolean().default(false),
});

export const PremiumForm = ({
    initialData,
    courseId
}: PremiumFormProps) => {
    const [isEditing, setIsEditing] = useState(false);

    const toggleEdit = () => setIsEditing((current) => !current);

    const router = useRouter();

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema) as any,
        defaultValues: {
            isPremium: !!initialData.isPremium,
        },
    });

    const { isSubmitting, isValid } = form.formState;

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        try {
            await updateCourse(courseId, values);
            toast.success("Course updated");
            toggleEdit();
            router.refresh();
        } catch {
            toast.error("Something went wrong");
        }
    }

    return (
        <div className="mt-6 border border-slate-800 bg-slate-900 rounded-3xl p-6 shadow-2xl space-y-3">
            <div className="font-bold text-slate-100 flex items-center justify-between text-xs font-mono uppercase tracking-wider">
                <span>Course Access Tier</span>
                <Button onClick={toggleEdit} variant="ghost" className="h-8 text-cyan-400 hover:text-cyan-300 font-mono text-xs hover:bg-slate-950 rounded-xl">
                    {isEditing ? (
                        <>Cancel</>
                    ) : (
                        <>
                            <Pencil className="h-3.5 w-3.5 mr-1.5" />
                            Edit Access
                        </>
                    )}
                </Button>
            </div>
            {!isEditing && (
                <div className="text-sm font-mono bg-slate-950 p-4 rounded-2xl border border-slate-800 flex items-center gap-2">
                    <span className="text-slate-400">Access Setting:</span>
                    <span className={initialData.isPremium ? "text-purple-400 font-bold" : "text-emerald-400 font-bold"}>
                        {initialData.isPremium ? "Premium Members Only" : "Free for Everyone"}
                    </span>
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
                            name="isPremium"
                            render={({ field }) => (
                                <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-2xl border border-slate-800 bg-slate-950 p-4">
                                    <FormControl>
                                        <Checkbox
                                            checked={field.value}
                                            onCheckedChange={field.onChange}
                                            className="border-slate-700 text-cyan-500 focus:ring-cyan-500"
                                        />
                                    </FormControl>
                                    <div className="space-y-1 leading-none">
                                        <FormDescription className="text-xs font-mono text-slate-300">
                                            Check this box if this course is restricted to paid premium subscribers.
                                        </FormDescription>
                                    </div>
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
