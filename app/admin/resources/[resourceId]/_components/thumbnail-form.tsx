"use client";

import * as z from "zod";
import { Pencil, PlusCircle, Image as ImageIcon, X } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import Image from "next/image";

import { Button } from "@/components/ui/button";
import { UploadButton } from "@/lib/uploadthing";
import { updateResource } from "@/lib/actions/resource.actions";
import { Input } from "@/components/ui/input";

interface ThumbnailFormProps {
    initialData: {
        thumbnailUrl?: string;
    };
    resourceId: string;
}

const formSchema = z.object({
    thumbnailUrl: z.string().optional(),
});

export const ThumbnailForm = ({
    initialData,
    resourceId
}: ThumbnailFormProps) => {
    const [isEditing, setIsEditing] = useState(false);
    const [imageUrl, setImageUrl] = useState(initialData.thumbnailUrl || "");

    const toggleEdit = () => setIsEditing((current) => !current);
    const router = useRouter();

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        try {
            await updateResource(resourceId, values);
            toast.success("Resource thumbnail updated");
            toggleEdit();
            router.refresh();
        } catch {
            toast.error("Something went wrong");
        }
    };

    const handleRemove = async () => {
        try {
            await updateResource(resourceId, { thumbnailUrl: "" });
            toast.success("Thumbnail removed");
            setImageUrl("");
            router.refresh();
        } catch {
            toast.error("Something went wrong");
        }
    };

    return (
        <div className="mt-6 border bg-slate-100 rounded-md p-4">
            <div className="font-medium flex items-center justify-between">
                Resource Thumbnail / Cover Image
                <Button onClick={toggleEdit} variant="ghost" size="sm">
                    {isEditing && <>Cancel</>}
                    {!isEditing && !initialData.thumbnailUrl && (
                        <>
                            <PlusCircle className="h-4 w-4 mr-2" />
                            Add thumbnail
                        </>
                    )}
                    {!isEditing && initialData.thumbnailUrl && (
                        <>
                            <Pencil className="h-4 w-4 mr-2" />
                            Change image
                        </>
                    )}
                </Button>
            </div>
            {!isEditing && (
                !initialData.thumbnailUrl ? (
                    <div className="flex items-center justify-center h-40 bg-slate-200 rounded-md mt-2">
                        <ImageIcon className="h-10 w-10 text-slate-400" />
                    </div>
                ) : (
                    <div className="relative aspect-video mt-2 overflow-hidden rounded-md border border-slate-200 max-h-48 w-full group">
                        <img
                            src={initialData.thumbnailUrl}
                            alt="Resource thumbnail"
                            className="object-cover w-full h-full"
                        />
                        <button
                            onClick={handleRemove}
                            className="absolute top-2 right-2 p-1 bg-rose-600 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                            title="Remove Thumbnail"
                        >
                            <X className="h-4 w-4" />
                        </button>
                    </div>
                )
            )}
            {isEditing && (
                <div className="space-y-4 mt-4">
                    <UploadButton
                        endpoint="courseAttachment"
                        onClientUploadComplete={(res) => {
                            if (res?.[0]?.url) {
                                onSubmit({ thumbnailUrl: res[0].url });
                            }
                        }}
                        onUploadError={(error: Error) => {
                            toast.error(`${error?.message}`);
                        }}
                    />
                    <div className="flex items-center gap-x-2 pt-2 border-t border-slate-200">
                        <Input
                            value={imageUrl}
                            onChange={(e) => setImageUrl(e.target.value)}
                            placeholder="Or paste image URL (https://...)"
                            className="bg-white text-xs"
                        />
                        <Button
                            onClick={() => onSubmit({ thumbnailUrl: imageUrl })}
                            size="sm"
                        >
                            Save URL
                        </Button>
                    </div>
                </div>
            )}
        </div>
    );
};
