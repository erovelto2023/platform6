"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea"; // Or generic Textarea
import { createShelf } from "@/lib/actions/docs.actions";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

const formSchema = z.object({
    title: z.string().min(2),
    description: z.string().optional(),
});

export function ShelfForm() {
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
            await createShelf({
                ...values,
                slug: values.title.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, ''),
            });
            toast.success("Shelf created");
            router.refresh(); // Or redirect
        } catch (error) {
            toast.error("Something went wrong");
        }
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 max-w-md bg-white p-6 rounded shadow border">
                <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Shelf Title</FormLabel>
                            <FormControl>
                                <Input placeholder="e.g. Technical Documentation" {...field} />
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
                <Button type="submit">Create Shelf</Button>
            </form>
        </Form>
    );
}
