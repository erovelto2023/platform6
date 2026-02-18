"use client";

import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { File, Loader2, PlusCircle, Trash, X } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { addDownload, removeDownload } from "@/lib/actions/niche.actions";
import { UploadButton } from "@/lib/uploadthing";
import { toast } from "sonner";

import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

interface DownloadsFormProps {
    initialData: {
        downloads: any[];
    };
    nicheId: string;
}

const formSchema = z.object({
    title: z.string().min(1),
    url: z.string().min(1),
    type: z.string().min(1),
});

export const DownloadsForm = ({
    initialData,
    nicheId
}: DownloadsFormProps) => {
    const [isCreating, setIsCreating] = useState(false);
    const [isDeletingId, setIsDeletingId] = useState<string | null>(null);

    const toggleCreating = () => setIsCreating((current) => !current);

    const router = useRouter();

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            title: "",
            url: "",
            type: "PDF",
        },
    });

    const { isSubmitting, isValid } = form.formState;

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        try {
            const response = await addDownload(nicheId, values);
            if (response.success) {
                toast.success("Download added");
                form.reset();
                toggleCreating();
                router.refresh();
            } else {
                toast.error("Something went wrong");
            }
        } catch {
            toast.error("Something went wrong");
        }
    }

    const onDelete = async (id: string) => {
        try {
            setIsDeletingId(id);
            await removeDownload(nicheId, id);
            toast.success("Download removed");
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
                Downloads / Assets
                <Button onClick={toggleCreating} variant="ghost">
                    {isCreating ? (
                        <>Cancel</>
                    ) : (
                        <>
                            <PlusCircle className="h-4 w-4 mr-2" />
                            Add asset
                        </>
                    )}
                </Button>
            </div>
            {isCreating && (
                <div>
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
                                                placeholder="Asset Title (e.g. Business Plan)"
                                                {...field}
                                            />
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
                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select type" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                <SelectItem value="PDF">PDF</SelectItem>
                                                <SelectItem value="Template">Template</SelectItem>
                                                <SelectItem value="Other">Other</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="url"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormControl>
                                            <div className="flex items-center gap-x-2">
                                                <Input
                                                    disabled={isSubmitting}
                                                    placeholder="File URL"
                                                    {...field}
                                                />
                                            </div>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <div className="text-xs text-muted-foreground">
                                Or upload a file directly:
                            </div>
                            <div className="flex items-center justify-center w-full">
                                <UploadButton
                                    endpoint="nicheDownload"
                                    appearance={{
                                        button: "bg-slate-900 text-white hover:bg-slate-800 ut-uploading:cursor-not-allowed",
                                        allowedContent: "text-slate-500"
                                    }}
                                    onClientUploadComplete={(res) => {
                                        form.setValue("url", res[0].ufsUrl || res[0].url);
                                        if (!form.getValues("title")) {
                                            form.setValue("title", res[0].name);
                                        }
                                        toast.success("File uploaded");
                                    }}
                                    onUploadError={(error: Error) => {
                                        toast.error(`${error?.message}`);
                                    }}
                                />
                            </div>
                            <Button
                                disabled={!isValid || isSubmitting}
                                type="submit"
                            >
                                Save Asset
                            </Button>
                        </form>
                    </Form>
                </div>
            )}
            {!isCreating && (
                <div className="space-y-2 mt-4">
                    {initialData.downloads.length === 0 && (
                        <p className="text-sm text-slate-500 italic">No downloads added yet.</p>
                    )}
                    {initialData.downloads.map((item) => (
                        <div
                            key={item._id}
                            className="flex items-center p-3 w-full bg-slate-200 border-slate-200 border text-slate-700 rounded-md"
                        >
                            <File className="h-4 w-4 mr-2 flex-shrink-0" />
                            <p className="text-xs line-clamp-1 w-full">
                                {item.title} ({item.type})
                            </p>
                            {isDeletingId === item._id ? (
                                <div className="ml-auto">
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                </div>
                            ) : (
                                <button
                                    onClick={() => onDelete(item._id)}
                                    className="ml-auto hover:opacity-75 transition"
                                >
                                    <X className="h-4 w-4" />
                                </button>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}
