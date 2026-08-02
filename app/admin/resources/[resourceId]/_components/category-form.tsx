"use client";

import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Pencil } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { updateResource } from "@/lib/actions/resource.actions";
import { cn } from "@/lib/utils";

interface CategoryFormProps {
    initialData: {
        category: string;
    };
    resourceId: string;
};

const formSchema = z.object({
    category: z.string().min(1),
});

export const CategoryForm = ({
    initialData,
    resourceId
}: CategoryFormProps) => {
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
            await updateResource(resourceId, values);
            toast.success("Resource updated");
            toggleEdit();
            router.refresh();
        } catch {
            toast.error("Something went wrong");
        }
    }

    return (
        <div className="border bg-slate-900 border-slate-800 rounded-2xl p-5 shadow-xl text-slate-100">
            <div className="font-mono font-bold text-xs uppercase tracking-wider text-slate-200 flex items-center justify-between">
                <span>Resource Category</span>
                <Button 
                    onClick={toggleEdit} 
                    variant="ghost" 
                    size="sm"
                    className="text-orange-400 hover:text-amber-300 hover:bg-slate-800 cursor-pointer h-7 text-xs font-mono font-bold"
                >
                    {isEditing ? (
                        <>Cancel</>
                    ) : (
                        <>
                            <Pencil className="h-3.5 w-3.5 mr-1.5" />
                            Edit Category
                        </>
                    )}
                </Button>
            </div>
            {!isEditing && (
                <p className={cn(
                    "text-xs font-mono font-bold text-amber-300 mt-2 bg-slate-950 p-2.5 rounded-xl border border-slate-800",
                    !initialData.category && "text-slate-500 italic"
                )}>
                    {initialData.category || "No category"}
                </p>
            )}
            {isEditing && (
                <Form {...form}>
                    <form
                        onSubmit={form.handleSubmit(onSubmit)}
                        className="space-y-4 mt-3"
                    >
                        <FormField
                            control={form.control}
                            name="category"
                            render={({ field }) => (
                                <FormItem>
                                    <FormControl>
                                        <Input
                                            disabled={isSubmitting}
                                            placeholder="e.g. 'Marketing', 'Templates'..."
                                            className="bg-slate-950 border-slate-800 text-slate-100 font-mono text-xs focus:border-orange-500"
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
                                className="bg-orange-500 hover:bg-orange-600 text-slate-950 font-bold font-mono text-xs cursor-pointer"
                            >
                                Save Category
                            </Button>
                        </div>
                    </form>
                </Form>
            )}
        </div>
    )
}
