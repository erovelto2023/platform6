
"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { createContentItem, updateContentItem } from "@/lib/actions/content.actions";
import { useState } from "react";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { DialogFooter } from "@/components/ui/dialog";

const contentFormSchema = z.object({
    title: z.string().min(1, "Title is required"),
    type: z.enum(['video', 'blog', 'social', 'email', 'other']),
    status: z.enum(['idea', 'planned', 'in-progress', 'published']),
    scheduledAt: z.string().refine((val) => !isNaN(Date.parse(val)), {
        message: "Invalid date",
    }),
    headline: z.string().optional(),
    keywords: z.string().optional(), // Comma separated string for input
    notes: z.string().optional(),
});

interface ContentFormProps {
    initialData?: any;
    onSuccess?: () => void;
}

export function ContentForm({ initialData, onSuccess }: ContentFormProps) {
    const [isLoading, setIsLoading] = useState(false);

    const defaultDate = initialData?.scheduledAt
        ? new Date(initialData.scheduledAt).toISOString().slice(0, 16)
        : new Date().toISOString().slice(0, 16);

    const form = useForm<z.infer<typeof contentFormSchema>>({
        resolver: zodResolver(contentFormSchema),
        defaultValues: {
            title: initialData?.title || "",
            type: initialData?.type || "blog",
            status: initialData?.status || "idea",
            scheduledAt: defaultDate,
            headline: initialData?.headline || "",
            keywords: initialData?.keywords?.join(", ") || "",
            notes: initialData?.notes || "",
        },
    });

    async function onSubmit(values: z.infer<typeof contentFormSchema>) {
        setIsLoading(true);
        try {
            const formattedValues = {
                ...values,
                keywords: values.keywords ? values.keywords.split(",").map(k => k.trim()).filter(k => k) : [],
                scheduledAt: new Date(values.scheduledAt),
            };

            let res;
            if (initialData?._id) {
                res = await updateContentItem(initialData._id, formattedValues);
            } else {
                res = await createContentItem(formattedValues);
            }

            if (res.success) {
                toast.success(initialData ? "Content updated" : "Content created");
                onSuccess?.();
            } else {
                toast.error(res.error || "Failed to save content");
            }
        } catch (error) {
            toast.error("An error occurred");
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Title</FormLabel>
                            <FormControl>
                                <Input placeholder="e.g. 5 Tips for SEO" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <div className="grid grid-cols-2 gap-4">
                    <FormField
                        control={form.control}
                        name="type"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Type</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <FormControl>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select type" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        <SelectItem value="blog">Blog Post</SelectItem>
                                        <SelectItem value="video">Video</SelectItem>
                                        <SelectItem value="social">Social Media</SelectItem>
                                        <SelectItem value="email">Email Newsletter</SelectItem>
                                        <SelectItem value="other">Other</SelectItem>
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="status"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Status</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <FormControl>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select status" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        <SelectItem value="idea">Idea</SelectItem>
                                        <SelectItem value="planned">Planned</SelectItem>
                                        <SelectItem value="in-progress">In Progress</SelectItem>
                                        <SelectItem value="published">Published</SelectItem>
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>

                <FormField
                    control={form.control}
                    name="scheduledAt"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Scheduled Date & Time</FormLabel>
                            <FormControl>
                                <Input type="datetime-local" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="headline"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Headline / Hook</FormLabel>
                            <FormControl>
                                <Input placeholder="Catchy headline..." {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="keywords"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Keywords (comma separated)</FormLabel>
                            <FormControl>
                                <Input placeholder="seo, marketing, growth" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="notes"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Notes / Outline</FormLabel>
                            <FormControl>
                                <Textarea placeholder="Rough outline or ideas..." className="resize-none" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <DialogFooter>
                    <Button type="submit" disabled={isLoading} className="bg-indigo-600 hover:bg-indigo-700">
                        {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Save Content
                    </Button>
                </DialogFooter>
            </form>
        </Form>
    );
}
