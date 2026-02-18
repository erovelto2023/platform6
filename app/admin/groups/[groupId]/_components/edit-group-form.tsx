"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
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
import { updateGroup } from "@/lib/actions/group.actions";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Loader2 } from "lucide-react";

import { UploadButton } from "@/lib/uploadthing";
import Image from "next/image";
import { X } from "lucide-react";

const formSchema = z.object({
    name: z.string().min(2, {
        message: "Group name must be at least 2 characters.",
    }),
    description: z.string().min(10, {
        message: "Description must be at least 10 characters.",
    }),
    category: z.string().min(2, {
        message: "Category is required.",
    }),
    type: z.enum(["Public", "Private", "Paid"]),
    imageUrl: z.string().optional(),
    bannerUrl: z.string().optional(),
});

interface EditGroupFormProps {
    group: any;
}

export function EditGroupForm({ group }: EditGroupFormProps) {
    const router = useRouter();
    const [isSubmitting, setIsSubmitting] = useState(false);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: group.name,
            description: group.description,
            category: group.category,
            type: group.type,
            imageUrl: group.imageUrl || "",
            bannerUrl: group.bannerUrl || "",
        },
    });

    async function onSubmit(values: z.infer<typeof formSchema>) {
        setIsSubmitting(true);
        try {
            await updateGroup(group._id, values);
            toast.success("Group updated successfully");
            router.refresh();
        } catch (error) {
            toast.error("Something went wrong");
        } finally {
            setIsSubmitting(false);
        }
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <FormField
                        control={form.control}
                        name="imageUrl"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Group Avatar</FormLabel>
                                <FormControl>
                                    <div className="flex flex-col items-center gap-4 p-4 border rounded-lg bg-slate-50">
                                        {field.value ? (
                                            <div className="relative h-32 w-32">
                                                <Image
                                                    src={field.value}
                                                    alt="Avatar"
                                                    fill
                                                    className="object-cover rounded-full border-4 border-white shadow-sm"
                                                />
                                                <Button
                                                    type="button"
                                                    variant="destructive"
                                                    size="icon"
                                                    className="absolute -top-2 -right-2 h-6 w-6 rounded-full"
                                                    onClick={() => field.onChange("")}
                                                >
                                                    <X className="h-3 w-3" />
                                                </Button>
                                            </div>
                                        ) : (
                                            <div className="h-32 w-32 rounded-full bg-slate-200 flex items-center justify-center text-slate-400">
                                                No Image
                                            </div>
                                        )}
                                        <UploadButton
                                            endpoint="communityAvatar"
                                            appearance={{
                                                button: "bg-slate-900 text-white hover:bg-slate-800 ut-uploading:cursor-not-allowed",
                                                allowedContent: "text-slate-500 text-xs"
                                            }}
                                            onClientUploadComplete={(res) => {
                                                field.onChange(res[0].ufsUrl || res[0].url);
                                                toast.success("Avatar uploaded");
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

                    <FormField
                        control={form.control}
                        name="bannerUrl"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Group Banner</FormLabel>
                                <FormControl>
                                    <div className="flex flex-col items-center gap-4 p-4 border rounded-lg bg-slate-50">
                                        {field.value ? (
                                            <div className="relative h-32 w-full">
                                                <Image
                                                    src={field.value}
                                                    alt="Banner"
                                                    fill
                                                    className="object-cover rounded-md border border-slate-200"
                                                />
                                                <Button
                                                    type="button"
                                                    variant="destructive"
                                                    size="icon"
                                                    className="absolute -top-2 -right-2 h-6 w-6 rounded-full"
                                                    onClick={() => field.onChange("")}
                                                >
                                                    <X className="h-3 w-3" />
                                                </Button>
                                            </div>
                                        ) : (
                                            <div className="h-32 w-full rounded-md bg-slate-200 flex items-center justify-center text-slate-400">
                                                No Banner
                                            </div>
                                        )}
                                        <UploadButton
                                            endpoint="communityCoverImage"
                                            appearance={{
                                                button: "bg-slate-900 text-white hover:bg-slate-800 ut-uploading:cursor-not-allowed",
                                                allowedContent: "text-slate-500 text-xs"
                                            }}
                                            onClientUploadComplete={(res) => {
                                                field.onChange(res[0].ufsUrl || res[0].url);
                                                toast.success("Banner uploaded");
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

                <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Group Name</FormLabel>
                            <FormControl>
                                <Input placeholder="e.g. SaaS Founders" {...field} />
                            </FormControl>
                            <FormDescription>
                                This is the public name of your group.
                            </FormDescription>
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
                                <Textarea
                                    placeholder="Tell people what this group is about..."
                                    className="resize-none h-32"
                                    {...field}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <FormField
                        control={form.control}
                        name="category"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Category</FormLabel>
                                <FormControl>
                                    <Input placeholder="e.g. Technology" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="type"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Privacy</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <FormControl>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select privacy type" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        <SelectItem value="Public">Public</SelectItem>
                                        <SelectItem value="Private">Private</SelectItem>
                                        <SelectItem value="Paid">Paid</SelectItem>
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>
                <div className="flex justify-end">
                    <Button type="submit" disabled={isSubmitting}>
                        {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Save Changes
                    </Button>
                </div>
            </form>
        </Form>
    );
}
