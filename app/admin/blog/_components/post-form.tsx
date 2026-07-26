"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from "@/components/ui/form";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { createPost, updatePost, deletePost } from "@/lib/actions/post.actions";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Loader2, Trash, X, ImageIcon, Settings, ArrowLeft, Eye } from "lucide-react";
import { UploadButton } from "@/lib/uploadthing";
import Image from "next/image";
import Link from "next/link";
import { TagInput } from "@/components/ui/tag-input";
import { RichTextEditor } from "@/components/rich-text-editor";
import { ImageUploadButton } from "@/components/image-upload-button";
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet";
import MediaPicker from "@/components/admin/MediaPicker";

const formSchema = z.object({
    title: z.string().min(1, "Title is required"),
    slug: z.string().min(1, "Slug is required"),
    content: z.string().min(1, "Content is required"),
    excerpt: z.string().optional(),
    imageUrl: z.string().optional(),
    isPublished: z.boolean().default(false),
    accessLevel: z.enum(["public", "members", "paid"]).default("public"),
    featured: z.boolean().default(false),
    seoTitle: z.string().optional(),
    seoDescription: z.string().optional(),
    canonicalUrl: z.string().optional(),
    ogImage: z.string().optional(),
    tags: z.array(z.string()).default([]),
    categories: z.array(z.string()).default([]),
});

interface PostFormProps {
    initialData?: any;
}

export const PostForm = ({ initialData }: PostFormProps) => {
    const router = useRouter();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [previewMode, setPreviewMode] = useState(false);

    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            title: initialData?.title || "",
            slug: initialData?.slug || "",
            content: initialData?.content || "",
            excerpt: initialData?.excerpt || "",
            imageUrl: initialData?.imageUrl || "",
            isPublished: initialData?.isPublished || false,
            accessLevel: (initialData?.accessLevel as "public" | "members" | "paid") || "public",
            featured: initialData?.featured || false,
            seoTitle: initialData?.seoTitle || "",
            seoDescription: initialData?.seoDescription || "",
            canonicalUrl: initialData?.canonicalUrl || "",
            ogImage: initialData?.ogImage || "",
            tags: initialData?.tags || [],
            categories: initialData?.categories || [],
        },
    });

    const { watch, setValue } = form;
    const title = watch("title");
    const content = watch("content");
    const imageUrl = watch("imageUrl");

    const handleTitleChange = (e: any) => {
        setValue("title", e.target.value);
        if (!initialData && !form.getValues("slug")) {
            const slug = e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)+/g, "");
            setValue("slug", slug);
        }
    };

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        try {
            setIsSubmitting(true);
            if (initialData) {
                await updatePost(initialData._id, values);
                toast.success("Post updated");
            } else {
                await createPost({ ...values, publishedAt: values.isPublished ? new Date() : null });
                toast.success("Post created");
                router.push("/admin/blog");
            }
            router.refresh();
        } catch (error) {
            toast.error("Something went wrong");
        } finally {
            setIsSubmitting(false);
        }
    };

    const onDelete = async () => {
        try {
            setIsSubmitting(true);
            await deletePost(initialData._id);
            toast.success("Post deleted");
            router.push("/admin/blog");
            router.refresh();
        } catch (error) {
            toast.error("Something went wrong");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Form {...form}>
            <div className="h-full flex flex-col bg-slate-950 text-slate-100 min-h-screen">
                {/* Top Bar */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-900 sticky top-0 z-40 shadow-xl">
                    <div className="flex items-center gap-4">
                        <Link href="/admin/blog" className="text-slate-400 hover:text-cyan-400 transition-colors">
                            <ArrowLeft className="h-5 w-5" />
                        </Link>
                        <span className="text-sm font-mono font-bold text-slate-200 uppercase">
                            {initialData ? "Editing Post" : "New Post"}
                        </span>
                        <span className="text-slate-700">|</span>
                        <span className={`text-xs font-mono font-bold uppercase px-3 py-1 rounded-xl border ${watch("isPublished") ? "bg-emerald-950 text-emerald-400 border-emerald-800" : "bg-slate-950 text-amber-400 border-amber-800"}`}>
                            {watch("isPublished") ? "Published" : "Draft"}
                        </span>
                    </div>
                    <div className="flex items-center gap-3">
                        <Button variant="ghost" size="sm" onClick={() => setPreviewMode(!previewMode)} className="h-9 px-3 text-cyan-400 hover:text-cyan-300 font-mono text-xs bg-slate-950 border border-slate-800 hover:bg-slate-800 rounded-xl">
                            <Eye className="h-4 w-4 mr-2 text-cyan-400" />
                            {previewMode ? "Edit Mode" : "Preview Mode"}
                        </Button>

                        <Sheet>
                            <SheetTrigger asChild>
                                <Button variant="outline" size="icon" className="h-9 w-9 bg-slate-950 border-slate-800 text-slate-300 hover:text-cyan-400 hover:bg-slate-800 rounded-xl">
                                    <Settings className="h-4 w-4" />
                                </Button>
                            </SheetTrigger>
                            <SheetContent className="w-[400px] sm:w-[540px] overflow-y-auto bg-slate-900 border-slate-800 text-slate-100 p-6 shadow-2xl">
                                <SheetHeader className="border-b border-slate-800 pb-4">
                                    <SheetTitle className="text-slate-100 font-black uppercase text-lg">Post Settings</SheetTitle>
                                    <SheetDescription className="text-slate-400 font-mono text-xs">
                                        Manage post metadata, SEO, and access control.
                                    </SheetDescription>
                                </SheetHeader>
                                <div className="mt-6 space-y-6">
                                    <FormField
                                        control={form.control}
                                        name="slug"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className="text-xs font-mono font-bold text-slate-300 uppercase">Post URL Slug</FormLabel>
                                                <FormControl>
                                                    <div className="flex items-center">
                                                        <span className="text-slate-500 text-xs font-mono mr-2">/blog/</span>
                                                        <Input {...field} className="h-10 bg-slate-950 border-slate-800 text-slate-100 font-mono text-xs rounded-xl focus:border-cyan-500" />
                                                    </div>
                                                </FormControl>
                                                <FormMessage className="text-rose-400 text-xs font-mono" />
                                            </FormItem>
                                        )}
                                    />

                                    <div className="space-y-4 pt-2 border-t border-slate-800">
                                        <h3 className="text-xs font-mono font-bold text-cyan-400 uppercase">Publishing</h3>
                                        <FormField
                                            control={form.control}
                                            name="isPublished"
                                            render={({ field }) => (
                                                <FormItem className="flex flex-row items-center justify-between rounded-2xl border border-slate-800 bg-slate-950 p-4 shadow-sm">
                                                    <div className="space-y-0.5">
                                                        <FormLabel className="text-xs font-mono font-bold text-slate-200">Publish Post</FormLabel>
                                                        <FormDescription className="text-[11px] font-mono text-slate-400">
                                                            Make this post visible to the public.
                                                        </FormDescription>
                                                    </div>
                                                    <FormControl>
                                                        <Switch
                                                            checked={field.value}
                                                            onCheckedChange={field.onChange}
                                                        />
                                                    </FormControl>
                                                </FormItem>
                                            )}
                                        />
                                        <FormField
                                            control={form.control}
                                            name="featured"
                                            render={({ field }) => (
                                                <FormItem className="flex flex-row items-center justify-between rounded-2xl border border-slate-800 bg-slate-950 p-4 shadow-sm">
                                                    <div className="space-y-0.5">
                                                        <FormLabel className="text-xs font-mono font-bold text-slate-200">Featured Post</FormLabel>
                                                        <FormDescription className="text-[11px] font-mono text-slate-400">
                                                            Pin to the top of the blog feed.
                                                        </FormDescription>
                                                    </div>
                                                    <FormControl>
                                                        <Switch
                                                            checked={field.value}
                                                            onCheckedChange={field.onChange}
                                                        />
                                                    </FormControl>
                                                </FormItem>
                                            )}
                                        />
                                        <FormField
                                            control={form.control}
                                            name="accessLevel"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel className="text-xs font-mono font-bold text-slate-300 uppercase">Access Level</FormLabel>
                                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                        <FormControl>
                                                            <SelectTrigger className="bg-slate-950 border-slate-800 text-slate-100 font-mono text-xs rounded-xl h-10">
                                                                <SelectValue placeholder="Select access level" />
                                                            </SelectTrigger>
                                                        </FormControl>
                                                        <SelectContent className="bg-slate-900 border-slate-800 text-slate-100">
                                                            <SelectItem value="public">Public (Everyone)</SelectItem>
                                                            <SelectItem value="members">Members Only (Free)</SelectItem>
                                                            <SelectItem value="paid">Paid Members Only</SelectItem>
                                                        </SelectContent>
                                                    </Select>
                                                    <FormDescription className="text-[11px] font-mono text-slate-400">
                                                        Who can view this article?
                                                    </FormDescription>
                                                    <FormMessage className="text-rose-400 text-xs font-mono" />
                                                </FormItem>
                                            )}
                                        />
                                    </div>

                                    <div className="space-y-4 pt-2 border-t border-slate-800">
                                        <h3 className="text-xs font-mono font-bold text-cyan-400 uppercase">Organization</h3>
                                        <FormField
                                            control={form.control}
                                            name="categories"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel className="text-xs font-mono font-bold text-slate-300 uppercase">Categories</FormLabel>
                                                    <FormControl>
                                                        <TagInput
                                                            placeholder="Add category..."
                                                            tags={field.value}
                                                            setTags={field.onChange}
                                                        />
                                                    </FormControl>
                                                    <FormDescription className="text-[11px] font-mono text-slate-400">
                                                        Press Enter to add category tags.
                                                    </FormDescription>
                                                    <FormMessage className="text-rose-400 text-xs font-mono" />
                                                </FormItem>
                                            )}
                                        />
                                        <FormField
                                            control={form.control}
                                            name="tags"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel className="text-xs font-mono font-bold text-slate-300 uppercase">Tags</FormLabel>
                                                    <FormControl>
                                                        <TagInput
                                                            placeholder="Add tag..."
                                                            tags={field.value}
                                                            setTags={field.onChange}
                                                        />
                                                    </FormControl>
                                                    <FormDescription className="text-[11px] font-mono text-slate-400">
                                                        Press Enter to add keyword tags.
                                                    </FormDescription>
                                                    <FormMessage className="text-rose-400 text-xs font-mono" />
                                                </FormItem>
                                            )}
                                        />
                                    </div>

                                    <div className="space-y-4 pt-2 border-t border-slate-800">
                                        <h3 className="text-xs font-mono font-bold text-cyan-400 uppercase">Featured Image</h3>
                                        <FormField
                                            control={form.control}
                                            name="imageUrl"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormControl>
                                                        <div className="border border-slate-800 rounded-2xl p-4 bg-slate-950">
                                                            {imageUrl ? (
                                                                <div className="relative aspect-video rounded-xl overflow-hidden mb-4 border border-slate-800">
                                                                    <Image
                                                                        src={imageUrl}
                                                                        alt="Featured image"
                                                                        fill
                                                                        className="object-cover"
                                                                    />
                                                                    <button
                                                                        type="button"
                                                                        onClick={() => setValue("imageUrl", "")}
                                                                        className="absolute top-2 right-2 bg-rose-600 text-white p-1.5 rounded-full hover:bg-rose-500 transition"
                                                                    >
                                                                        <X className="h-4 w-4" />
                                                                    </button>
                                                                </div>
                                                            ) : (
                                                                <div className="flex items-center justify-center h-32 bg-slate-900 rounded-xl mb-4 border border-slate-800">
                                                                    <ImageIcon className="h-8 w-8 text-slate-600" />
                                                                </div>
                                                            )}
                                                            <UploadButton
                                                                endpoint="courseThumbnail"
                                                                appearance={{
                                                                    button: "bg-cyan-600 hover:bg-cyan-500 text-white font-mono font-bold text-xs uppercase rounded-xl px-4 py-2"
                                                                }}
                                                                onClientUploadComplete={(res) => {
                                                                    setValue("imageUrl", res[0].url);
                                                                    toast.success("Image uploaded");
                                                                }}
                                                                onUploadError={(error: Error) => {
                                                                    toast.error(`Upload failed: ${error.message}`);
                                                                }}
                                                            />
                                                        </div>
                                                    </FormControl>
                                                    <FormMessage className="text-rose-400 text-xs font-mono" />
                                                </FormItem>
                                            )}
                                        />
                                    </div>

                                    <div className="space-y-4 pt-2 border-t border-slate-800">
                                        <h3 className="text-xs font-mono font-bold text-cyan-400 uppercase">SEO & Social Metadata</h3>
                                        <FormField
                                            control={form.control}
                                            name="seoTitle"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel className="text-xs font-mono font-bold text-slate-300 uppercase">Meta Title</FormLabel>
                                                    <FormControl>
                                                        <Input {...field} placeholder={title} className="h-10 bg-slate-950 border-slate-800 text-slate-100 font-mono text-xs rounded-xl focus:border-cyan-500" />
                                                    </FormControl>
                                                    <FormDescription className="text-[11px] font-mono text-slate-400">
                                                        Recommended length: ~60 characters.
                                                    </FormDescription>
                                                    <FormMessage className="text-rose-400 text-xs font-mono" />
                                                </FormItem>
                                            )}
                                        />
                                        <FormField
                                            control={form.control}
                                            name="seoDescription"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel className="text-xs font-mono font-bold text-slate-300 uppercase">Meta Description</FormLabel>
                                                    <FormControl>
                                                        <Textarea {...field} placeholder="Summary for search engine result snippets..." className="h-20 bg-slate-950 border-slate-800 text-slate-100 font-mono text-xs rounded-xl focus:border-cyan-500 p-3" />
                                                    </FormControl>
                                                    <FormDescription className="text-[11px] font-mono text-slate-400">
                                                        Recommended length: 145-160 characters.
                                                    </FormDescription>
                                                    <FormMessage className="text-rose-400 text-xs font-mono" />
                                                </FormItem>
                                            )}
                                        />
                                    </div>

                                    {initialData && (
                                        <div className="pt-6 border-t border-slate-800">
                                            <Button
                                                variant="destructive"
                                                className="w-full bg-rose-950 hover:bg-rose-900 border border-rose-800 text-rose-300 font-mono font-bold uppercase text-xs rounded-xl h-10"
                                                onClick={onDelete}
                                                disabled={isSubmitting}
                                            >
                                                <Trash className="h-4 w-4 mr-2" />
                                                Delete Post
                                            </Button>
                                        </div>
                                    )}
                                </div>
                            </SheetContent>
                        </Sheet>

                        <Button onClick={form.handleSubmit(onSubmit)} disabled={isSubmitting} className="h-9 px-5 bg-gradient-to-r from-cyan-600 via-indigo-600 to-purple-600 hover:from-cyan-500 hover:to-purple-500 text-white font-mono font-bold text-xs uppercase tracking-wider rounded-xl cursor-pointer">
                            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Save Article
                        </Button>
                    </div>
                </div>

                {/* Main Editor Area */}
                <div className="flex-1 overflow-y-auto bg-slate-950 p-6">
                    <div className="max-w-4xl mx-auto bg-slate-900 border border-slate-800 rounded-3xl p-8 md:p-12 shadow-2xl space-y-8">
                        <form className="space-y-8">
                            {previewMode ? (
                                <div className="prose prose-invert max-w-none font-sans leading-relaxed">
                                    <h1 className="text-4xl font-black text-slate-100 mb-4">{title}</h1>
                                    <div dangerouslySetInnerHTML={{ __html: content }} />
                                </div>
                            ) : (
                                <>
                                    <FormField
                                        control={form.control}
                                        name="title"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormControl>
                                                    <Textarea
                                                        {...field}
                                                        placeholder="Enter Post Title..."
                                                        className="text-3xl md:text-5xl font-black border-none shadow-none resize-none px-0 focus-visible:ring-0 min-h-[80px] overflow-hidden bg-transparent text-slate-100 placeholder:text-slate-600 leading-tight"
                                                        rows={1}
                                                        onChange={(e) => {
                                                            field.onChange(e);
                                                            handleTitleChange(e);
                                                            e.target.style.height = 'auto';
                                                            e.target.style.height = e.target.scrollHeight + 'px';
                                                        }}
                                                    />
                                                </FormControl>
                                                <FormMessage className="text-rose-400 text-xs font-mono" />
                                            </FormItem>
                                        )}
                                    />

                                    {/* Featured Image Upload */}
                                    <FormField
                                        control={form.control}
                                        name="imageUrl"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className="text-xs font-mono font-bold uppercase text-slate-300">Featured Banner Image</FormLabel>
                                                <FormControl>
                                                    <div className="border border-slate-800 rounded-2xl p-4 bg-slate-950">
                                                        {imageUrl ? (
                                                            <div className="relative aspect-video rounded-xl overflow-hidden mb-4 border border-slate-800">
                                                                <Image
                                                                    src={imageUrl}
                                                                    alt="Featured image"
                                                                    fill
                                                                    className="object-cover"
                                                                />
                                                                <button
                                                                    type="button"
                                                                    onClick={() => setValue("imageUrl", "")}
                                                                    className="absolute top-2 right-2 bg-rose-600 text-white p-2 rounded-full hover:bg-rose-500 transition"
                                                                >
                                                                    <X className="h-4 w-4" />
                                                                </button>
                                                            </div>
                                                        ) : (
                                                            <div className="flex items-center justify-center h-48 bg-slate-900 border border-slate-800 rounded-xl mb-4">
                                                                <ImageIcon className="h-10 w-10 text-slate-600" />
                                                            </div>
                                                        )}
                                                        <div className="flex gap-2">
                                                            <ImageUploadButton
                                                                onUploadComplete={(url) => {
                                                                    setValue("imageUrl", url);
                                                                    toast.success("Image uploaded");
                                                                }}
                                                                onUploadError={(error) => {
                                                                    toast.error(`Upload failed: ${error.message}`);
                                                                }}
                                                            />
                                                            <MediaPicker onSelect={(url) => {
                                                                setValue("imageUrl", url);
                                                                toast.success("Image selected from gallery");
                                                            }} />
                                                        </div>
                                                    </div>
                                                </FormControl>
                                                <FormMessage className="text-rose-400 text-xs font-mono" />
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={form.control}
                                        name="content"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className="text-xs font-mono font-bold uppercase text-slate-300">Article Content</FormLabel>
                                                <FormControl>
                                                    <RichTextEditor
                                                        content={field.value}
                                                        onChange={field.onChange}
                                                        placeholder="Write your article content here..."
                                                    />
                                                </FormControl>
                                                <FormMessage className="text-rose-400 text-xs font-mono" />
                                            </FormItem>
                                        )}
                                    />
                                </>
                            )}
                        </form>
                    </div>
                </div>
            </div>
        </Form>
    );
};
