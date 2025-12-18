"use client";

import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Lightbulb, Loader2, PlusCircle, Trash, X } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { addBusinessIdea, removeBusinessIdea } from "@/lib/actions/niche.actions";

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

interface BusinessIdeasFormProps {
    initialData: {
        businessIdeas: string[];
    };
    nicheId: string;
}

const formSchema = z.object({
    idea: z.string().min(1),
});

export const BusinessIdeasForm = ({
    initialData,
    nicheId
}: BusinessIdeasFormProps) => {
    const [isCreating, setIsCreating] = useState(false);
    const [isDeletingIdea, setIsDeletingIdea] = useState<string | null>(null);

    const toggleCreating = () => setIsCreating((current) => !current);

    const router = useRouter();

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            idea: "",
        },
    });

    const { isSubmitting, isValid } = form.formState;

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        try {
            const response = await addBusinessIdea(nicheId, values.idea);
            if (response.success) {
                toast.success("Idea added");
                form.reset();
                router.refresh();
            } else {
                toast.error("Something went wrong");
            }
        } catch {
            toast.error("Something went wrong");
        }
    }

    const onDelete = async (idea: string) => {
        try {
            setIsDeletingIdea(idea);
            await removeBusinessIdea(nicheId, idea);
            toast.success("Idea removed");
            router.refresh();
        } catch {
            toast.error("Something went wrong");
        } finally {
            setIsDeletingIdea(null);
        }
    }

    return (
        <div className="mt-6 border bg-slate-100 rounded-md p-4">
            <div className="font-medium flex items-center justify-between">
                Business Ideas
                <Button onClick={toggleCreating} variant="ghost">
                    {isCreating ? (
                        <>Cancel</>
                    ) : (
                        <>
                            <PlusCircle className="h-4 w-4 mr-2" />
                            Add idea
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
                            name="idea"
                            render={({ field }) => (
                                <FormItem>
                                    <FormControl>
                                        <Input
                                            disabled={isSubmitting}
                                            placeholder="e.g. 'Start a pruning service'"
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
                            Add
                        </Button>
                    </form>
                </Form>
            )}
            {!isCreating && (
                <div className="space-y-2 mt-4">
                    {initialData.businessIdeas.length === 0 && (
                        <p className="text-sm text-slate-500 italic">No ideas added yet.</p>
                    )}
                    {initialData.businessIdeas.map((idea, index) => (
                        <div
                            key={index}
                            className="flex items-center p-3 w-full bg-slate-200 border-slate-200 border text-slate-700 rounded-md"
                        >
                            <Lightbulb className="h-4 w-4 mr-2 flex-shrink-0" />
                            <p className="text-xs line-clamp-1 w-full">
                                {idea}
                            </p>
                            {isDeletingIdea === idea ? (
                                <div className="ml-auto">
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                </div>
                            ) : (
                                <button
                                    onClick={() => onDelete(idea)}
                                    className="ml-auto hover:opacity-75 transition"
                                >
                                    <X className="h-4 w-4" />
                                </button>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}
