"use client";

import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Pencil, PlusCircle, File, Loader2, X } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { updateLesson } from "@/lib/actions/lesson.actions";
import { UploadButton } from "@/lib/uploadthing";

import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface LessonAttachmentFormProps {
    initialData: {
        fileUrl?: string;
        fileName?: string;
    };
    courseId: string;
    chapterId: string;
    lessonId: string;
}

const formSchema = z.object({
    fileUrl: z.string().min(1),
    fileName: z.string().optional(),
});

export const LessonAttachmentForm = ({
    initialData,
    courseId,
    chapterId,
    lessonId
}: LessonAttachmentFormProps) => {
    const [isEditing, setIsEditing] = useState(false);
    const [deletingId, setDeletingId] = useState<string | null>(null);

    const toggleEdit = () => setIsEditing((current) => !current);

    const router = useRouter();

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        try {
            await updateLesson(courseId, chapterId, lessonId, values);
            toast.success("File attached");
            toggleEdit();
            router.refresh();
        } catch {
            toast.error("Something went wrong");
        }
    }

    return (
        <div className="mt-6 border bg-slate-100 rounded-md p-4">
            <div className="font-medium flex items-center justify-between">
                Lesson File
                <Button onClick={toggleEdit} variant="ghost">
                    {isEditing && (
                        <>Cancel</>
                    )}
                    {!isEditing && !initialData.fileUrl && (
                        <>
                            <PlusCircle className="h-4 w-4 mr-2" />
                            Add a file
                        </>
                    )}
                    {!isEditing && initialData.fileUrl && (
                        <>
                            <Pencil className="h-4 w-4 mr-2" />
                            Edit file
                        </>
                    )}
                </Button>
            </div>
            {!isEditing && (
                !initialData.fileUrl ? (
                    <div className="flex items-center justify-center h-60 bg-slate-200 rounded-md mt-2 italic text-slate-500">
                        No file uploaded
                    </div>
                ) : (
                    <div className="flex items-center p-3 w-full bg-sky-100 border-sky-200 border text-sky-700 rounded-md mt-2">
                        <File className="h-4 w-4 mr-2 flex-shrink-0" />
                        <p className="text-xs line-clamp-1">
                            {initialData.fileName || initialData.fileUrl}
                        </p>
                    </div>
                )
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
                                onSubmit({ fileUrl: res[0].url, fileName: res[0].name });
                            }}
                            onUploadError={(error: Error) => {
                                toast.error(`${error?.message}`);
                            }}
                        />
                    </div>
                    <div className="text-xs text-muted-foreground mt-4">
                        Upload the file for this lesson
                    </div>
                </div>
            )}
        </div>
    )
}
