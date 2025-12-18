"use client";

import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Pencil, PlusCircle, File, Loader2, X } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { addAttachment, removeAttachment } from "@/lib/actions/lesson.actions";
import { UploadButton } from "@/lib/uploadthing";

import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface LessonResourcesFormProps {
    initialData: {
        attachments: { title: string; url: string; _id: string }[];
    };
    courseId: string;
    chapterId: string;
    lessonId: string;
}

const formSchema = z.object({
    url: z.string().min(1),
    title: z.string().optional(),
});

export const LessonResourcesForm = ({
    initialData,
    courseId,
    chapterId,
    lessonId
}: LessonResourcesFormProps) => {
    const [isEditing, setIsEditing] = useState(false);
    const [deletingId, setDeletingId] = useState<string | null>(null);

    const toggleEdit = () => setIsEditing((current) => !current);

    const router = useRouter();

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        try {
            await addAttachment(courseId, chapterId, lessonId, values.url, values.title);
            toast.success("Attachment added");
            toggleEdit();
            router.refresh();
        } catch {
            toast.error("Something went wrong");
        }
    }

    const onDelete = async (id: string) => {
        try {
            setDeletingId(id);
            await removeAttachment(courseId, chapterId, lessonId, id);
            toast.success("Attachment deleted");
            router.refresh();
        } catch {
            toast.error("Something went wrong");
        } finally {
            setDeletingId(null);
        }
    }

    return (
        <div className="mt-6 border bg-slate-100 rounded-md p-4">
            <div className="font-medium flex items-center justify-between">
                Lesson Resources
                <Button onClick={toggleEdit} variant="ghost">
                    {isEditing && (
                        <>Cancel</>
                    )}
                    {!isEditing && (
                        <>
                            <PlusCircle className="h-4 w-4 mr-2" />
                            Add a file
                        </>
                    )}
                </Button>
            </div>
            {!isEditing && (
                <>
                    {initialData.attachments.length === 0 && (
                        <p className="text-sm mt-2 text-slate-500 italic">
                            No attachments yet
                        </p>
                    )}
                    {initialData.attachments.length > 0 && (
                        <div className="space-y-2 mt-2">
                            {initialData.attachments.map((attachment) => (
                                <div
                                    key={attachment._id}
                                    className="flex items-center p-3 w-full bg-sky-100 border-sky-200 border text-sky-700 rounded-md"
                                >
                                    <File className="h-4 w-4 mr-2 flex-shrink-0" />
                                    <p className="text-xs line-clamp-1 w-full">
                                        {attachment.title}
                                    </p>
                                    {deletingId === attachment._id && (
                                        <div>
                                            <Loader2 className="h-4 w-4 animate-spin" />
                                        </div>
                                    )}
                                    {deletingId !== attachment._id && (
                                        <button
                                            onClick={() => onDelete(attachment._id)}
                                            className="ml-auto hover:opacity-75 transition"
                                        >
                                            <X className="h-4 w-4" />
                                        </button>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </>
            )}
            {isEditing && (
                <div>
                    <div className="flex items-center justify-center w-full">
                        <UploadButton
                            endpoint="lessonFile"
                            appearance={{
                                button: "bg-slate-900 text-white hover:bg-slate-800 ut-uploading:cursor-not-allowed",
                                allowedContent: "text-slate-500"
                            }}
                            onClientUploadComplete={(res) => {
                                onSubmit({ url: res[0].url, title: res[0].name });
                            }}
                            onUploadError={(error: Error) => {
                                toast.error(`${error?.message}`);
                            }}
                        />
                    </div>
                    <div className="text-xs text-muted-foreground mt-4">
                        Add anything your students might need to complete the lesson.
                    </div>
                </div>
            )}
        </div>
    )
}
