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
import toast from "react-hot-toast";
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
            <div className="h-full flex flex-col bg-white">
                {/* Top Bar */}
                <div className="flex items-center justify-between px-6 py-4 border-b bg-white sticky top-0 z-40">
                    <div className="flex items-center gap-4">
                        <Link href="/admin/blog" className="text-slate-500 hover:text-slate-700">
                            <ArrowLeft className="h-5 w-5" />
                        </Link>
                        <span className="text-sm text-slate-500">
                            {initialData ? "Editing Post" : "New Post"}
                        </span>
                        <span className="text-slate-300">|</span>
                        <span className={`text-xs font-medium px-2 py-1 rounded-full ${watch("isPublished") ? "bg-green-100 text-green-700" : "bg-slate-100 text-slate-600"}`}>
                            {watch("isPublished") ? "Published" : "Draft"}
                        </span>
                    </div>
                    <div className="flex items-center gap-2">
                        <Button variant="ghost" size="sm" onClick={() => setPreviewMode(!previewMode)}>
                            <Eye className="h-4 w-4 mr-2" />
                            {previewMode ? "Edit" : "Preview"}
                        </Button>

                        <Sheet>
                            <SheetTrigger asChild>
                                <Button variant="outline" size="icon">
                                    <Settings className="h-4 w-4" />
                                </Button>
                            </SheetTrigger>
                            <SheetContent className="w-[400px] sm:w-[540px] overflow-y-auto">
                                <SheetHeader>
                                    <SheetTitle>Post Settings</SheetTitle>
                                    <SheetDescription>
                                        Manage post metadata, SEO, and access control.
                                    </SheetDescription>
                                </SheetHeader>
                                <div className="mt-6 space-y-6">
                                    <FormField
                                        control={form.control}
                                        name="slug"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Post URL</FormLabel>
                                                <FormControl>
                                                    <div className="flex items-center">
                                                        <span className="text-slate-400 text-sm mr-1">/blog/</span>
                                                        <Input {...field} className="h-8" />
                                                    </div>
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <div className="space-y-4">
                                        <h3 className="text-sm font-medium text-slate-900">Publishing</h3>
                                        <FormField
                                            control={form.control}
                                            name="isPublished"
                                            render={({ field }) => (
                                                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                                                    <div className="space-y-0.5">
                                                        <FormLabel>Publish Post</FormLabel>
                                                        <FormDescription>
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
                                                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                                                    <div className="space-y-0.5">
                                                        <FormLabel>Featured Post</FormLabel>
                                                        <FormDescription>
                                                            Pin to the top of the blog.
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
                                                    <FormLabel>Access Level</FormLabel>
                                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                        <FormControl>
                                                            <SelectTrigger>
                                                                <SelectValue placeholder="Select access level" />
                                                            </SelectTrigger>
                                                        </FormControl>
                                                        <SelectContent>
                                                            <SelectItem value="public">Public (Everyone)</SelectItem>
                                                            <SelectItem value="members">Members Only (Free)</SelectItem>
                                                            <SelectItem value="paid">Paid Members Only</SelectItem>
                                                        </SelectContent>
                                                    </Select>
                                                    <FormDescription>
                                                        Who can view this post?
                                                    </FormDescription>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    </div>

                                    <div className="space-y-4">
                                        <h3 className="text-sm font-medium text-slate-900">Organization</h3>
                                        <FormField
                                            control={form.control}
                                            name="categories"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Categories</FormLabel>
                                                    <FormControl>
                                                        <TagInput
                                                            placeholder="Add category..."
                                                            tags={field.value}
                                                            setTags={field.onChange}
                                                        />
                                                    </FormControl>
                                                    <FormDescription>
                                                        Press Enter to add.
                                                    </FormDescription>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                        <FormField
                                            control={form.control}
                                            name="tags"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Tags</FormLabel>
                                                    <FormControl>
                                                        <TagInput
                                                            placeholder="Add tag..."
                                                            tags={field.value}
                                                            setTags={field.onChange}
                                                        />
                                                    </FormControl>
                                                    <FormDescription>
                                                        Press Enter to add.
                                                    </FormDescription>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    </div>

                                    <div className="space-y-4">
                                        <h3 className="text-sm font-medium text-slate-900">Featured Image</h3>
                                        <FormField
                                            control={form.control}
                                            name="imageUrl"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormControl>
                                                        <div className="border rounded-md p-4 bg-slate-50">
                                                            {imageUrl ? (
                                                                <div className="relative aspect-video rounded-md overflow-hidden mb-4">
                                                                    <Image
                                                                        src={imageUrl}
                                                                        alt="Featured image"
                                                                        fill
                                                                        className="object-cover"
                                                                    />
                                                                    <button
                                                                        type="button"
                                                                        onClick={() => setValue("imageUrl", "")}
                                                                        className="absolute top-2 right-2 bg-rose-500 text-white p-1 rounded-full hover:bg-rose-600"
                                                                    >
                                                                        <X className="h-4 w-4" />
                                                                    </button>
                                                                </div>
                                                            ) : (
                                                                <div className="flex items-center justify-center h-32 bg-slate-200 rounded-md mb-4">
                                                                    <ImageIcon className="h-8 w-8 text-slate-400" />
                                                                </div>
                                                            )}
                                                            <UploadButton
                                                                endpoint="courseThumbnail"
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
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    </div>

                                    <div className="space-y-4">
                                        <h3 className="text-sm font-medium text-slate-900">SEO & Social</h3>
                                        <FormField
                                            control={form.control}
                                            name="seoTitle"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Meta Title</FormLabel>
                                                    <FormControl>
                                                        <Input {...field} placeholder={title} />
                                                    </FormControl>
                                                    <FormDescription>
                                                        Recommended: 60 chars.
                                                    </FormDescription>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                        <FormField
                                            control={form.control}
                                            name="seoDescription"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Meta Description</FormLabel>
                                                    <FormControl>
                                                        <Textarea {...field} placeholder="Summary for search engines..." className="h-20" />
                                                    </FormControl>
                                                    <FormDescription>
                                                        Recommended: 145-160 chars.
                                                    </FormDescription>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    </div>

                                    {initialData && (
                                        <div className="pt-6 border-t">
                                            <Button
                                                variant="destructive"
                                                className="w-full"
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

                        <Button onClick={form.handleSubmit(onSubmit)} disabled={isSubmitting} className="bg-indigo-600 hover:bg-indigo-700">
                            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Save
                        </Button>
                    </div>
                </div>

                {/* Main Editor Area */}
                <div className="flex-1 overflow-y-auto bg-white">
                    <div className="max-w-4xl mx-auto px-6 py-12">
                        <form className="space-y-8">
                            {previewMode ? (
                                <div className="prose prose-lg prose-indigo max-w-none">
                                    <h1>{title}</h1>
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
                                                        placeholder="Post Title"
                                                        className="text-4xl md:text-5xl font-bold border-none shadow-none resize-none px-0 focus-visible:ring-0 min-h-[80px] overflow-hidden"
                                                        rows={1}
                                                        onChange={(e) => {
                                                            field.onChange(e);
                                                            handleTitleChange(e);
                                                            // Auto-resize
                                                            e.target.style.height = 'auto';
                                                            e.target.style.height = e.target.scrollHeight + 'px';
                                                        }}
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    {/* Featured Image Upload */}
                                    <FormField
                                        control={form.control}
                                        name="imageUrl"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className="text-base font-semibold">Featured Image</FormLabel>
                                                <FormControl>
                                                    <div className="border rounded-lg p-4 bg-slate-50">
                                                        {imageUrl ? (
                                                            <div className="relative aspect-video rounded-lg overflow-hidden mb-4">
                                                                <Image
                                                                    src={imageUrl}
                                                                    alt="Featured image"
                                                                    fill
                                                                    className="object-cover"
                                                                />
                                                                <button
                                                                    type="button"
                                                                    onClick={() => setValue("imageUrl", "")}
                                                                    className="absolute top-2 right-2 bg-rose-500 text-white p-2 rounded-full hover:bg-rose-600 transition"
                                                                >
                                                                    <X className="h-4 w-4" />
                                                                </button>
                                                            </div>
                                                        ) : (
                                                            <div className="flex items-center justify-center h-48 bg-slate-200 rounded-lg mb-4">
                                                                <ImageIcon className="h-12 w-12 text-slate-400" />
                                                            </div>
                                                        )}
                                                        <ImageUploadButton
                                                            onUploadComplete={(url) => {
                                                                setValue("imageUrl", url);
                                                                toast.success("Image uploaded");
                                                            }}
                                                            onUploadError={(error) => {
                                                                toast.error(`Upload failed: ${error.message}`);
                                                            }}
                                                        />
                                                    </div>
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
                                                <FormLabel className="text-base font-semibold">Content</FormLabel>
                                                <FormControl>
                                                    <RichTextEditor
                                                        content={field.value}
                                                        onChange={field.onChange}
                                                        placeholder="Tell your story..."
                                                    />
                                                </FormControl>
                                                <FormMessage />
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
