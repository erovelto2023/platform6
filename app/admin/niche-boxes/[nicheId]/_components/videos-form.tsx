"use client";

import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Loader2, PlusCircle, Trash, Video } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { addVideo, removeVideo } from "@/lib/actions/niche.actions";

import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface VideosFormProps {
    initialData: {
        videos: any[];
    };
    nicheId: string;
}

const formSchema = z.object({
    title: z.string().min(1),
    url: z.string().min(1),
});

export const VideosForm = ({
    initialData,
    nicheId
}: VideosFormProps) => {
    const [isCreating, setIsCreating] = useState(false);
    const [isDeletingId, setIsDeletingId] = useState<string | null>(null);

    const toggleCreating = () => setIsCreating((current) => !current);

    const router = useRouter();

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            title: "",
            url: "",
        },
    });

    const { isSubmitting, isValid } = form.formState;

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        try {
            const response = await addVideo(nicheId, values);
            if (response.success) {
                toast.success("Video added");
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
            await removeVideo(nicheId, id);
            toast.success("Video removed");
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
                Videos
                <Button onClick={toggleCreating} variant="ghost">
                    {isCreating ? (
                        <>Cancel</>
                    ) : (
                        <>
                            <PlusCircle className="h-4 w-4 mr-2" />
                            Add video
                        </>
                    )}
                </Button>
            </div>
            {isCreating && (
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
                                            placeholder="Video title"
                                            {...field}
                                        />
                                    </FormControl>
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
                                        <Input
                                            disabled={isSubmitting}
                                            placeholder="Video URL (e.g. YouTube, Vimeo)"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <Button
                            disabled={!isValid || isSubmitting}
                            type="submit"
                        >
                            Add
                        </Button>
                    </form>
                </Form>
            )}
            {!isCreating && (
                <div className="space-y-2 mt-4">
                    {(!initialData.videos || initialData.videos.length === 0) && (
                        <p className="text-sm text-slate-500 italic">No videos added yet.</p>
                    )}
                    {initialData.videos && initialData.videos.map((video) => (
                        <div
                            key={video._id}
                            className="flex items-center p-3 w-full bg-slate-200 border-slate-200 border text-slate-700 rounded-md"
                        >
                            <Video className="h-4 w-4 mr-2 flex-shrink-0" />
                            <p className="text-xs line-clamp-1 w-full">
                                {video.title}
                            </p>
                            {isDeletingId === video._id ? (
                                <div className="ml-auto">
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                </div>
                            ) : (
                                <button
                                    onClick={() => onDelete(video._id)}
                                    className="ml-auto hover:opacity-75 transition"
                                >
                                    <Trash className="h-4 w-4 text-red-500" />
                                </button>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}
