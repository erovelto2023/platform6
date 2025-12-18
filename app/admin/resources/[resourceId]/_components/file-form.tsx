"use client";

import * as z from "zod";
import { Pencil, PlusCircle, File } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { UploadButton } from "@/lib/uploadthing";
import { updateResource } from "@/lib/actions/resource.actions";

interface FileFormProps {
    initialData: {
        fileUrl?: string;
    };
    resourceId: string;
};

const formSchema = z.object({
    fileUrl: z.string().min(1, {
        message: "File is required",
    }),
});

export const FileForm = ({
    initialData,
    resourceId
}: FileFormProps) => {
    const [isEditing, setIsEditing] = useState(false);

    const toggleEdit = () => setIsEditing((current) => !current);

    const router = useRouter();

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        try {
            await updateResource(resourceId, values);
            toast.success("Resource updated");
            toggleEdit();
            router.refresh();
        } catch {
            toast.error("Something went wrong");
        }
    }

    return (
        <div className="mt-6 border bg-slate-100 rounded-md p-4">
            <div className="font-medium flex items-center justify-between">
                Resource file
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
                    <div className="flex items-center justify-center h-60 bg-slate-200 rounded-md">
                        <File className="h-10 w-10 text-slate-500" />
                    </div>
                ) : (
                    <div className="relative flex items-center p-3 mt-2 bg-sky-100 border-sky-200 border text-sky-700 rounded-md">
                        <File className="h-4 w-4 mr-2 flex-shrink-0" />
                        <a
                            href={initialData.fileUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs line-clamp-1 hover:underline"
                        >
                            {initialData.fileUrl}
                        </a>
                    </div>
                )
            )}
            {isEditing && (
                <div>
                    <UploadButton
                        endpoint="courseAttachment"
                        onClientUploadComplete={(res) => {
                            onSubmit({ fileUrl: res?.[0].url });
                        }}
                        onUploadError={(error: Error) => {
                            toast.error(`${error?.message}`);
                        }}
                    />
                    <div className="text-xs text-muted-foreground mt-4">
                        Add anything your students might need to complete the course.
                    </div>
                </div>
            )}
        </div>
    )
}
