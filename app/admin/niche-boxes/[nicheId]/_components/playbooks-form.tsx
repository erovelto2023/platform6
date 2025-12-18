"use client";

import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Loader2, PlusCircle, Trash, Book } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { updateNicheBox } from "@/lib/actions/niche.actions";

import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface PlaybooksFormProps {
    initialData: {
        playbooks: any[];
    };
    nicheId: string;
}

const formSchema = z.object({
    title: z.string().min(1),
    content: z.string().min(1),
});

export const PlaybooksForm = ({
    initialData,
    nicheId
}: PlaybooksFormProps) => {
    const [isCreating, setIsCreating] = useState(false);
    const [isDeletingId, setIsDeletingId] = useState<string | null>(null);

    const toggleCreating = () => setIsCreating((current) => !current);

    const router = useRouter();

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            title: "",
            content: "",
        },
    });

    const { isSubmitting, isValid } = form.formState;

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        try {
            // We need to append to the existing playbooks
            const updatedPlaybooks = [...(initialData.playbooks || []), values];
            await updateNicheBox(nicheId, { playbooks: updatedPlaybooks });

            toast.success("Playbook added");
            form.reset();
            toggleCreating();
            router.refresh();
        } catch {
            toast.error("Something went wrong");
        }
    }

    const onDelete = async (id: string) => {
        try {
            setIsDeletingId(id);
            const updatedPlaybooks = initialData.playbooks.filter((p: any) => p._id !== id);
            await updateNicheBox(nicheId, { playbooks: updatedPlaybooks });

            toast.success("Playbook removed");
            router.refresh();
        } catch {
            toast.error("Something went wrong");
        } finally {
            setIsDeletingId(null);
        }
    }

    return (
        <div className="mt-6 border bg-slate-100 rounded-md p-4">
            <div className="font-medium flex items-center justify-between">
                Playbooks & Roadmaps
                <Button onClick={toggleCreating} variant="ghost">
                    {isCreating ? (
                        <>Cancel</>
                    ) : (
                        <>
                            <PlusCircle className="h-4 w-4 mr-2" />
                            Add
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
                                            placeholder="Playbook Title (e.g. 30-Day Launch)"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="content"
                            render={({ field }) => (
                                <FormItem>
                                    <FormControl>
                                        <Textarea
                                            disabled={isSubmitting}
                                            placeholder="Content or steps..."
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
                    {(!initialData.playbooks || initialData.playbooks.length === 0) && (
                        <p className="text-sm text-slate-500 italic">No playbooks added yet.</p>
                    )}
                    {initialData.playbooks && initialData.playbooks.map((playbook) => (
                        <div
                            key={playbook._id}
                            className="flex items-center p-3 w-full bg-slate-200 border-slate-200 border text-slate-700 rounded-md"
                        >
                            <Book className="h-4 w-4 mr-2 flex-shrink-0" />
                            <p className="text-xs line-clamp-1 w-full">
                                {playbook.title}
                            </p>
                            {isDeletingId === playbook._id ? (
                                <div className="ml-auto">
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                </div>
                            ) : (
                                <button
                                    onClick={() => onDelete(playbook._id)}
                                    className="ml-auto hover:opacity-75 transition"
                                >
                                    <Trash className="h-4 w-4 text-red-500" />
                                </button>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}
