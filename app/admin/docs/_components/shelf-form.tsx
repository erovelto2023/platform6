"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
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
            form.reset();
            router.refresh();
        } catch (error) {
            toast.error("Something went wrong");
        }
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 max-w-md bg-slate-950 p-6 rounded-2xl border border-slate-800 shadow-xl font-sans">
                <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel className="text-slate-200 font-bold text-xs uppercase tracking-wider">Shelf Title *</FormLabel>
                            <FormControl>
                                <Input placeholder="e.g. Technical Documentation" {...field} className="bg-slate-900 border-slate-800 text-slate-100 placeholder:text-slate-500 rounded-xl focus:border-cyan-500 text-xs font-mono" />
                            </FormControl>
                            <FormMessage className="text-rose-400 text-xs" />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel className="text-slate-200 font-bold text-xs uppercase tracking-wider">Description</FormLabel>
                            <FormControl>
                                <Textarea placeholder="Short description of this documentation shelf..." {...field} className="bg-slate-900 border-slate-800 text-slate-100 placeholder:text-slate-500 rounded-xl focus:border-cyan-500 text-xs font-mono min-h-[100px]" />
                            </FormControl>
                            <FormMessage className="text-rose-400 text-xs" />
                        </FormItem>
                    )}
                />
                <Button type="submit" className="w-full bg-gradient-to-r from-cyan-600 via-indigo-600 to-purple-600 hover:from-cyan-500 hover:to-purple-500 text-white font-extrabold py-2.5 rounded-xl text-xs uppercase tracking-wider shadow-lg shadow-indigo-600/30 border-0 cursor-pointer">
                    Create Shelf
                </Button>
            </form>
        </Form>
    );
}
