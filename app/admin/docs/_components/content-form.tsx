"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { createPage, createChapter } from "@/lib/actions/docs.actions";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const pageSchema = z.object({
    title: z.string().min(2),
    content: z.string().optional(),
});

const chapterSchema = z.object({
    title: z.string().min(2),
});

export function ContentForm({ bookId }: { bookId: string }) {
    const router = useRouter();

    const pageForm = useForm<z.infer<typeof pageSchema>>({
        resolver: zodResolver(pageSchema),
        defaultValues: { title: "", content: "" },
    });

    const chapterForm = useForm<z.infer<typeof chapterSchema>>({
        resolver: zodResolver(chapterSchema),
        defaultValues: { title: "" },
    });

    async function onPageSubmit(values: z.infer<typeof pageSchema>) {
        try {
            await createPage({
                ...values,
                bookId,
                slug: values.title.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, ''),
                content: values.content || "# New Page",
                isPublished: true
            });
            toast.success("Page created");
            router.refresh();
            pageForm.reset();
        } catch (error) {
            toast.error("Error creating page");
        }
    }

    async function onChapterSubmit(values: z.infer<typeof chapterSchema>) {
        try {
            await createChapter({
                ...values,
                bookId,
                slug: values.title.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, ''),
            });
            toast.success("Chapter created");
            router.refresh();
            chapterForm.reset();
        } catch (error) {
            toast.error("Error creating chapter");
        }
    }

    return (
        <div className="bg-white p-6 rounded shadow border">
            <Tabs defaultValue="page">
                <TabsList className="mb-4">
                    <TabsTrigger value="page">Add Page</TabsTrigger>
                    <TabsTrigger value="chapter">Add Chapter</TabsTrigger>
                </TabsList>

                <TabsContent value="page">
                    <Form {...pageForm}>
                        <form onSubmit={pageForm.handleSubmit(onPageSubmit)} className="space-y-4">
                            <FormField
                                control={pageForm.control}
                                name="title"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Page Title</FormLabel>
                                        <FormControl>
                                            <Input placeholder="e.g. Installation Guide" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            {/* Simple Textarea for now, Rich Text Editor would be ideal later */}
                            <FormField
                                control={pageForm.control}
                                name="content"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Initial Content (Markdown)</FormLabel>
                                        <FormControl>
                                            <Textarea placeholder="# Hello World..." className="font-mono" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <Button type="submit">Create Page</Button>
                        </form>
                    </Form>
                </TabsContent>

                <TabsContent value="chapter">
                    <Form {...chapterForm}>
                        <form onSubmit={chapterForm.handleSubmit(onChapterSubmit)} className="space-y-4">
                            <FormField
                                control={chapterForm.control}
                                name="title"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Chapter Title</FormLabel>
                                        <FormControl>
                                            <Input placeholder="e.g. Advanced Topics" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <Button type="submit">Create Chapter</Button>
                        </form>
                    </Form>
                </TabsContent>
            </Tabs>
        </div>
    );
}
