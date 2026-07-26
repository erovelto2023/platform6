"use client";

import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Pencil, PlusCircle, ImageIcon } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { updateCourse } from "@/lib/actions/course.actions";
import Image from "next/image";

import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { UploadButton } from "@/lib/uploadthing";

interface ImageFormProps {
    initialData: {
        thumbnail: string;
    };
    courseId: string;
}

const formSchema = z.object({
    thumbnail: z.string().min(1, {
        message: "Image is required",
    }),
});

export const ImageForm = ({
    initialData,
    courseId
}: ImageFormProps) => {
    const [isEditing, setIsEditing] = useState(false);

    const toggleEdit = () => setIsEditing((current) => !current);

    const router = useRouter();

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        try {
            const response = await updateCourse(courseId, values);
            if (response.success) {
                toast.success("Course updated");
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
        <div className="mt-6 border border-slate-800 bg-slate-900 rounded-3xl p-6 shadow-2xl space-y-3">
            <div className="font-bold text-slate-100 flex items-center justify-between text-xs font-mono uppercase tracking-wider">
                <span>Course Image</span>
                <Button onClick={toggleEdit} variant="ghost" className="h-8 text-cyan-400 hover:text-cyan-300 font-mono text-xs hover:bg-slate-950 rounded-xl">
                    {isEditing && (
                        <>Cancel</>
                    )}
                    {!isEditing && !initialData.thumbnail && (
                        <>
                            <PlusCircle className="h-3.5 w-3.5 mr-1.5" />
                            Add Image
                        </>
                    )}
                    {!isEditing && initialData.thumbnail && (
                        <>
                            <Pencil className="h-3.5 w-3.5 mr-1.5" />
                            Edit Image
                        </>
                    )}
                </Button>
            </div>
            {!isEditing && (
                !initialData.thumbnail ? (
                    <div className="flex flex-col items-center justify-center h-52 bg-slate-950 border border-slate-800 rounded-2xl mt-2 gap-2 text-slate-500">
                        <ImageIcon className="h-10 w-10 text-slate-600" />
                        <span className="text-xs font-mono">No Thumbnail Uploaded</span>
                    </div>
                ) : (
                    <div className="relative aspect-video mt-2 rounded-2xl overflow-hidden border border-slate-800 bg-slate-950">
                        <Image
                            alt="Upload"
                            fill
                            className="object-cover"
                            src={initialData.thumbnail}
                        />
                    </div>
                )
            )}
            {isEditing && (
                <div className="pt-2">
                    <div className="flex items-center justify-center w-full bg-slate-950 p-6 rounded-2xl border border-slate-800">
                        <UploadButton
                            endpoint="courseThumbnail"
                            appearance={{
                                button: "bg-cyan-600 hover:bg-cyan-500 text-white font-mono font-bold text-xs uppercase tracking-wider rounded-xl px-4 py-2 ut-uploading:cursor-not-allowed",
                                allowedContent: "text-slate-400 text-xs font-mono mt-2"
                            }}
                            onClientUploadComplete={(res) => {
                                onSubmit({ thumbnail: res?.[0].url });
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
