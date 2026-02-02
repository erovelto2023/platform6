"use client";

import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Pencil, PlusCircle, Music } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { updateLesson } from "@/lib/actions/lesson.actions";
import { UploadButton } from "@/lib/uploadthing";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormMessage,
} from "@/components/ui/form";
import { toast } from "sonner";

interface LessonAudioFormProps {
    initialData: {
        videoUrl: string; // Reusing videoUrl for audio
    };
    courseId: string;
    chapterId: string;
    lessonId: string;
}

const formSchema = z.object({
    videoUrl: z.string().min(1),
});

export const LessonAudioForm = ({
    initialData,
    courseId,
    chapterId,
    lessonId
}: LessonAudioFormProps) => {
    const [isEditing, setIsEditing] = useState(false);

    const toggleEdit = () => setIsEditing((current) => !current);

    const router = useRouter();

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            videoUrl: initialData.videoUrl || "",
        },
    });

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        try {
            const response = await updateLesson(courseId, chapterId, lessonId, values);
            if (response.success) {
                toast.success("Lesson updated");
                toggleEdit();
                router.refresh();
            } else {
                toast.error("Something went wrong");
            }
        } catch {
            toast.error("Something went wrong");
        }
    }

    return (
        <div className="mt-6 border bg-slate-100 rounded-md p-4">
            <div className="font-medium flex items-center justify-between">
                Lesson Audio
                <Button onClick={toggleEdit} variant="ghost">
                    {isEditing && (
                        <>Cancel</>
                    )}
                    {!isEditing && !initialData.videoUrl && (
                        <>
                            <PlusCircle className="h-4 w-4 mr-2" />
                            Add audio
                        </>
                    )}
                    {!isEditing && initialData.videoUrl && (
                        <>
                            <Pencil className="h-4 w-4 mr-2" />
                            Edit audio
                        </>
                    )}
                </Button>
            </div>
            {!isEditing && (
                !initialData.videoUrl ? (
                    <div className="flex items-center justify-center h-60 bg-slate-200 rounded-md mt-2">
                        <Music className="h-10 w-10 text-slate-500" />
                    </div>
                ) : (
                    <div className="mt-2 p-3 bg-white rounded-md border">
                        <p className="text-sm text-slate-600 break-all">{initialData.videoUrl}</p>
                    </div>
                )
            )}
            {isEditing && (
                <div>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 mb-4">
                            <FormField
                                control={form.control}
                                name="videoUrl"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormControl>
                                            <div className="flex items-center gap-x-2">
                                                <Input
                                                    disabled={false}
                                                    placeholder="Paste Audio URL"
                                                    {...field}
                                                />
                                                <Button type="submit" size="sm">Save</Button>
                                            </div>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </form>
                    </Form>
                    <div className="text-xs text-muted-foreground mb-4">
                        OR upload an audio file directly:
                    </div>
                    <div className="flex items-center justify-center w-full">
                        <UploadButton
                            endpoint="courseAttachment"
                            appearance={{
                                button: "bg-slate-900 text-white hover:bg-slate-800 ut-uploading:cursor-not-allowed",
                                allowedContent: "text-slate-500"
                            }}
                            onClientUploadComplete={(res) => {
                                onSubmit({ videoUrl: res[0].url });
                            }}
                            onUploadError={(error: Error) => {
                                toast.error(`${error?.message}`);
                            }}
                        />
                    </div>
                    <div className="text-xs text-muted-foreground mt-4">
                        Upload this lesson&apos;s audio
                    </div>
                </div>
            )}
        </div>
    )
}
