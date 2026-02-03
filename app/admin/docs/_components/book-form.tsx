"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { createBook } from "@/lib/actions/docs.actions";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

const formSchema = z.object({
    title: z.string().min(2),
    description: z.string().optional(),
});

export function BookForm({ shelfId }: { shelfId: string }) {
    const router = useRouter();
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            title: "",
            description: "",
        },
    });

    async function onSubmit(values: z.infer<typeof formSchema>) {
        try {
            await createBook({
                ...values,
                shelfId,
                slug: values.title.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, ''),
            });
            toast.success("Book created");
            router.refresh();
            form.reset();
        } catch (error) {
            toast.error("Something went wrong");
        }
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 bg-white p-6 rounded shadow border">
                <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Book Title</FormLabel>
                            <FormControl>
                                <Input placeholder="e.g. Getting Started" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Description</FormLabel>
                            <FormControl>
                                <Textarea placeholder="Short description..." {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <Button type="submit">Create Book</Button>
            </form>
        </Form>
    );
}
