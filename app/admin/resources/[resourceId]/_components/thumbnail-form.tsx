"use client";

import * as z from "zod";
import { Pencil, PlusCircle, Image as ImageIcon, X } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

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
        <div className="border bg-slate-900 border-slate-800 rounded-2xl p-5 shadow-xl text-slate-100">
            <div className="font-mono font-bold text-xs uppercase tracking-wider text-slate-200 flex items-center justify-between">
                <span>Resource Cover / Thumbnail</span>
                <Button 
                    onClick={toggleEdit} 
                    variant="ghost" 
                    size="sm"
                    className="text-orange-400 hover:text-amber-300 hover:bg-slate-800 cursor-pointer h-7 text-xs font-mono font-bold"
                >
                    {isEditing && <>Cancel</>}
                    {!isEditing && !initialData.thumbnailUrl && (
                        <>
                            <PlusCircle className="h-3.5 w-3.5 mr-1.5" />
                            Add Thumbnail
                        </>
                    )}
                    {!isEditing && initialData.thumbnailUrl && (
                        <>
                            <Pencil className="h-3.5 w-3.5 mr-1.5" />
                            Change Image
                        </>
                    )}
                </Button>
            </div>
            {!isEditing && (
                !initialData.thumbnailUrl ? (
                    <div className="flex items-center justify-center h-40 bg-slate-950 border border-slate-800 rounded-xl mt-2">
                        <ImageIcon className="h-10 w-10 text-slate-600" />
                    </div>
                ) : (
                    <div className="relative aspect-video mt-2 overflow-hidden rounded-xl border border-slate-800 max-h-48 w-full group">
                        <img
                            src={initialData.thumbnailUrl}
                            alt="Resource thumbnail"
                            className="object-cover w-full h-full"
                        />
                        <button
                            onClick={handleRemove}
                            className="absolute top-2 right-2 p-1.5 bg-rose-950/80 border border-rose-700 text-rose-300 rounded-full opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                            title="Remove Thumbnail"
                        >
                            <X className="h-4 w-4" />
                        </button>
                    </div>
                )
            )}
            {isEditing && (
                <div className="space-y-4 mt-3">
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
                        appearance={{
                            button: "bg-slate-950 hover:bg-slate-800 text-orange-400 border border-slate-800 font-mono text-xs cursor-pointer",
                            allowedContent: "hidden"
                        }}
                    />
                    <div className="flex items-center gap-x-2 pt-2 border-t border-slate-800">
                        <Input
                            value={imageUrl}
                            onChange={(e) => setImageUrl(e.target.value)}
                            placeholder="Or paste image URL (https://...)"
                            className="bg-slate-950 border-slate-800 text-slate-100 font-mono text-xs focus:border-orange-500"
                        />
                        <Button
                            onClick={() => onSubmit({ thumbnailUrl: imageUrl })}
                            size="sm"
                            className="bg-orange-500 hover:bg-orange-600 text-slate-950 font-bold font-mono text-xs cursor-pointer"
                        >
                            Save URL
                        </Button>
                    </div>
                </div>
            )}
        </div>
    );
};
