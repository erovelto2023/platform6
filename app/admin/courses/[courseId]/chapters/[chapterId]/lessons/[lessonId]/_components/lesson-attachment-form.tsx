"use client";

import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Pencil, PlusCircle, File } from "lucide-react";
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
    };

    return (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-3">
            <div className="font-mono text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center justify-between">
                <span>Lesson File</span>
                <Button onClick={toggleEdit} variant="ghost" size="sm" className="text-orange-400 hover:text-amber-300 hover:bg-slate-800 font-mono text-xs cursor-pointer">
                    {isEditing && (
                        <>Cancel</>
                    )}
                    {!isEditing && !initialData.fileUrl && (
                        <>
                            <PlusCircle className="h-3.5 w-3.5 mr-1.5" />
                            Add File
                        </>
                    )}
                    {!isEditing && initialData.fileUrl && (
                        <>
                            <Pencil className="h-3.5 w-3.5 mr-1.5" />
                            Edit File
                        </>
                    )}
                </Button>
            </div>
            {!isEditing && (
                !initialData.fileUrl ? (
                    <div className="flex flex-col items-center justify-center h-48 bg-slate-950 border border-slate-800 rounded-xl mt-2 text-slate-500 font-mono text-xs">
                        <File className="h-10 w-10 text-slate-600 mb-2" />
                        <span>No file uploaded</span>
                    </div>
                ) : (
                    <div className="flex items-center p-3 w-full bg-slate-950 border-slate-800 border text-amber-400 rounded-xl font-mono text-xs mt-2">
                        <File className="h-4 w-4 mr-2 flex-shrink-0 text-orange-400" />
                        <p className="line-clamp-1 break-all">
                            {initialData.fileName || initialData.fileUrl}
                        </p>
                    </div>
                )
            )}
            {isEditing && (
                <div className="space-y-4 pt-2">
                    <div className="flex items-center justify-center w-full">
                        <UploadButton
                            endpoint="lessonFile"
                            appearance={{
                                button: "bg-orange-500 text-slate-950 font-mono text-xs font-black uppercase hover:bg-orange-400",
                                allowedContent: "text-slate-400 font-mono text-xs"
                            }}
                            onClientUploadComplete={(res) => {
                                onSubmit({ fileUrl: res[0].url, fileName: res[0].name });
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
