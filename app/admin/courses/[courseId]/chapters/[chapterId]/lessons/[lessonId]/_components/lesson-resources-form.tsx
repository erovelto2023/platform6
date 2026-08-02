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
    };

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
    };

    return (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-3">
            <div className="font-mono text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center justify-between">
                <span>Lesson Resources</span>
                <Button onClick={toggleEdit} variant="ghost" size="sm" className="text-orange-400 hover:text-amber-300 hover:bg-slate-800 font-mono text-xs cursor-pointer">
                    {isEditing ? (
                        <>Cancel</>
                    ) : (
                        <>
                            <PlusCircle className="h-3.5 w-3.5 mr-1.5" />
                            Add Resource
                        </>
                    )}
                </Button>
            </div>
            {!isEditing && (
                <>
                    {initialData.attachments.length === 0 && (
                        <p className="text-xs font-mono italic text-slate-500 mt-2">
                            No attachments yet
                        </p>
                    )}
                    {initialData.attachments.length > 0 && (
                        <div className="space-y-2 mt-2">
                            {initialData.attachments.map((attachment) => (
                                <div
                                    key={attachment._id}
                                    className="flex items-center justify-between p-3 w-full bg-slate-950 border border-slate-800 text-slate-200 rounded-xl font-mono text-xs"
                                >
                                    <div className="flex items-center gap-2 overflow-hidden">
                                        <File className="h-4 w-4 flex-shrink-0 text-orange-400" />
                                        <span className="line-clamp-1 truncate font-semibold text-slate-100">
                                            {attachment.title}
                                        </span>
                                    </div>
                                    {deletingId === attachment._id ? (
                                        <Loader2 className="h-4 w-4 animate-spin text-orange-400 shrink-0" />
                                    ) : (
                                        <button
                                            onClick={() => onDelete(attachment._id)}
                                            className="ml-2 text-slate-500 hover:text-rose-400 transition cursor-pointer shrink-0"
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
                <div className="space-y-4 pt-2">
                    <div className="flex items-center justify-center w-full">
                        <UploadButton
                            endpoint="lessonFile"
                            appearance={{
                                button: "bg-orange-500 text-slate-950 font-mono text-xs font-black uppercase hover:bg-orange-400",
                                allowedContent: "text-slate-400 font-mono text-xs"
                            }}
                            onClientUploadComplete={(res) => {
                                onSubmit({ url: res[0].url, title: res[0].name });
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
