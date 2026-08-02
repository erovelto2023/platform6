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
        videoUrl: string;
    };
    courseId: string;
    chapterId: string;
    lessonId: string;
}

const formSchema = z.object({
    videoUrl: z.string().min(1, { message: "Audio URL is required" }),
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
                toast.success("Lesson audio updated");
                toggleEdit();
                router.refresh();
            } else {
                toast.error("Something went wrong");
            }
        } catch {
            toast.error("Something went wrong");
        }
    };

    return (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-3">
            <div className="font-mono text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center justify-between">
                <span>Lesson Audio</span>
                <Button onClick={toggleEdit} variant="ghost" size="sm" className="text-orange-400 hover:text-amber-300 hover:bg-slate-800 font-mono text-xs cursor-pointer">
                    {isEditing && (
                        <>Cancel</>
                    )}
                    {!isEditing && !initialData.videoUrl && (
                        <>
                            <PlusCircle className="h-3.5 w-3.5 mr-1.5" />
                            Add Audio
                        </>
                    )}
                    {!isEditing && initialData.videoUrl && (
                        <>
                            <Pencil className="h-3.5 w-3.5 mr-1.5" />
                            Edit Audio
                        </>
                    )}
                </Button>
            </div>
            {!isEditing && (
                !initialData.videoUrl ? (
                    <div className="flex flex-col items-center justify-center h-48 bg-slate-950 border border-slate-800 rounded-xl mt-2 text-slate-500">
                        <Music className="h-10 w-10 text-slate-600 mb-2" />
                        <span className="font-mono text-xs">No audio uploaded yet</span>
                    </div>
                ) : (
                    <div className="mt-2 p-3 bg-slate-950 rounded-xl border border-slate-800">
                        <p className="text-xs font-mono text-amber-400 break-all">{initialData.videoUrl}</p>
                    </div>
                )
            )}
            {isEditing && (
                <div className="space-y-4 pt-2">
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                            <FormField
                                control={form.control}
                                name="videoUrl"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormControl>
                                            <div className="flex items-center gap-x-2">
                                                <Input
                                                    placeholder="Paste Audio URL"
                                                    className="bg-slate-950 border-slate-800 text-slate-100 placeholder:text-slate-500 font-mono text-xs focus:border-orange-500"
                                                    {...field}
                                                />
                                                <Button type="submit" size="sm" className="bg-orange-500 hover:bg-orange-600 text-slate-950 font-black font-mono text-xs uppercase">
                                                    Save
                                                </Button>
                                            </div>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </form>
                    </Form>
                    <div className="text-xs font-mono text-slate-400 border-t border-slate-800 pt-3">
                        OR upload an audio file directly:
                    </div>
                    <div className="flex items-center justify-center w-full">
                        <UploadButton
                            endpoint="courseAttachment"
                            appearance={{
                                button: "bg-orange-500 text-slate-950 font-mono text-xs font-black uppercase hover:bg-orange-400",
                                allowedContent: "text-slate-400 font-mono text-xs"
                            }}
                            onClientUploadComplete={(res) => {
                                onSubmit({ videoUrl: res[0].url });
                            }}
                            onUploadError={(error: Error) => {
                                toast.error(`${error?.message}`);
                            }}
                        />
                    </div>
                </div>
            )}
        </div>
    );
};
