"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { updatePageContent } from "@/lib/actions/docs.actions";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { ArrowLeft, Save } from "lucide-react";

const pageSchema = z.object({
    title: z.string().min(2), // We'll update title support later
    content: z.string(),
});

export function PageEditor({ page }: { page: any }) {
    const router = useRouter();
    const form = useForm<z.infer<typeof pageSchema>>({
        resolver: zodResolver(pageSchema),
        defaultValues: { title: page.title, content: page.content || "" },
    });

    async function onSubmit(values: z.infer<typeof pageSchema>) {
        try {
            await updatePageContent(page._id, values.content);
            toast.success("Page saved");
            router.refresh();
        } catch (error) {
            toast.error("Error saving page");
        }
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="h-full flex flex-col">
                <header className="flex items-center justify-between mb-4 pb-4 border-b">
                    <div className="flex items-center gap-4">
                        <Button variant="ghost" size="sm" onClick={() => router.back()} type="button">
                            <ArrowLeft size={16} /> Back
                        </Button>
                        <h1 className="font-bold text-lg">Editing: {page.title}</h1>
                    </div>
                    <Button type="submit" className="gap-2"><Save size={16} /> Save Changes</Button>
                </header>

                <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-6 h-full">
                    <FormField
                        control={form.control}
                        name="content"
                        render={({ field }) => (
                            <FormItem className="h-full flex flex-col">
                                <FormLabel>Markdown Content</FormLabel>
                                <FormControl>
                                    <Textarea
                                        placeholder="# Start writing..."
                                        className="flex-1 font-mono text-sm resize-none p-4"
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    {/* Live Preview (Simple) */}
                    <div className="h-full flex flex-col border rounded-md bg-slate-50 overflow-hidden">
                        <div className="bg-slate-100 px-4 py-2 text-xs font-bold uppercase text-slate-500 border-b">Preview</div>
                        <div className="flex-1 p-8 prose prose-sm max-w-none overflow-y-auto">
                            {/* We need to import ReactMarkdown dynamically to avoid hydration issues often, or just use standard */}
                            {/* For admin editor, simple is fine. */}
                            <p className="text-slate-400 italic">Preview not implemented in this quick editor yet. Check public link.</p>
                        </div>
                    </div>
                </div>
            </form>
        </Form>
    );
}
