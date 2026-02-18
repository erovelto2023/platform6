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
        <div className="mt-6 border bg-slate-100 rounded-md p-4">
            <div className="font-medium flex items-center justify-between">
                Course image
                <Button onClick={toggleEdit} variant="ghost">
                    {isEditing && (
                        <>Cancel</>
                    )}
                    {!isEditing && !initialData.thumbnail && (
                        <>
                            <PlusCircle className="h-4 w-4 mr-2" />
                            Add an image
                        </>
                    )}
                    {!isEditing && initialData.thumbnail && (
                        <>
                            <Pencil className="h-4 w-4 mr-2" />
                            Edit image
                        </>
                    )}
                </Button>
            </div>
            {!isEditing && (
                !initialData.thumbnail ? (
                    <div className="flex items-center justify-center h-60 bg-slate-200 rounded-md mt-2">
                        <ImageIcon className="h-10 w-10 text-slate-500" />
                    </div>
                ) : (
                    <div className="relative aspect-video mt-2">
                        <Image
                            alt="Upload"
                            fill
                            className="object-cover rounded-md"
                            src={initialData.thumbnail}
                        />
                    </div>
                )
            )}
            {isEditing && (
                <div>
                    <div className="flex items-center justify-center w-full">
                        <UploadButton
                            endpoint="courseThumbnail"
                            appearance={{
                                button: "bg-slate-900 text-white hover:bg-slate-800 ut-uploading:cursor-not-allowed",
                                allowedContent: "text-slate-500"
                            }}
                            onClientUploadComplete={(res) => {
                                onSubmit({ thumbnail: res[0].ufsUrl || res[0].url });
                            }}
                            onUploadError={(error: Error) => {
                                toast.error(`${error?.message}`);
                            }}
                        />
                    </div>
                    <div className="text-xs text-muted-foreground mt-4">
                        16:9 aspect ratio recommended
                    </div>
                </div>
            )}
        </div>
    )
}
