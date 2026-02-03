"use client";

import * as z from "zod";
import { Pencil, PlusCircle, File, Link as LinkIcon } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { UploadButton } from "@/lib/uploadthing";
import { updateResource } from "@/lib/actions/resource.actions";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface FileFormProps {
    initialData: {
        url?: string;
        type?: string;
    };
    resourceId: string;
};

const formSchema = z.object({
    url: z.string().min(1, {
        message: "URL or File is required",
    }),
});

export const FileForm = ({
    initialData,
    resourceId
}: FileFormProps) => {
    const [isEditing, setIsEditing] = useState(false);
    const [linkUrl, setLinkUrl] = useState(initialData.url || "");

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

    const onLinkSubmit = () => {
        if (!linkUrl) return;
        onSubmit({ url: linkUrl });
    }

    return (
        <div className="mt-6 border bg-slate-100 rounded-md p-4">
            <div className="font-medium flex items-center justify-between">
                Resource content (File or Link)
                <Button onClick={toggleEdit} variant="ghost">
                    {isEditing && (
                        <>Cancel</>
                    )}
                    {!isEditing && !initialData.url && (
                        <>
                            <PlusCircle className="h-4 w-4 mr-2" />
                            Add content
                        </>
                    )}
                    {!isEditing && initialData.url && (
                        <>
                            <Pencil className="h-4 w-4 mr-2" />
                            Edit
                        </>
                    )}
                </Button>
            </div>
            {!isEditing && (
                !initialData.url ? (
                    <div className="flex items-center justify-center h-60 bg-slate-200 rounded-md">
                        <File className="h-10 w-10 text-slate-500" />
                    </div>
                ) : (
                    <div className="relative flex items-center p-3 mt-2 bg-sky-100 border-sky-200 border text-sky-700 rounded-md">
                        {initialData.type === 'link' ? (
                            <LinkIcon className="h-4 w-4 mr-2 flex-shrink-0" />
                        ) : (
                            <File className="h-4 w-4 mr-2 flex-shrink-0" />
                        )}
                        <a
                            href={initialData.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs line-clamp-1 hover:underline"
                        >
                            {initialData.url}
                        </a>
                    </div>
                )
            )}
            {isEditing && (
                <Tabs defaultValue="upload" className="w-full">
                    <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger value="upload">Upload File</TabsTrigger>
                        <TabsTrigger value="link">External Link</TabsTrigger>
                    </TabsList>
                    <TabsContent value="upload" className="space-y-4 pt-4">
                        <UploadButton
                            endpoint="courseAttachment"
                            onClientUploadComplete={(res) => {
                                onSubmit({ url: res?.[0].url });
                            }}
                            onUploadError={(error: Error) => {
                                toast.error(`${error?.message}`);
                            }}
                        />
                        <div className="text-xs text-muted-foreground">
                            Upload a file (PDF, Zip, Image, etc.)
                        </div>
                    </TabsContent>
                    <TabsContent value="link" className="space-y-4 pt-4">
                        <div className="flex items-center gap-x-2">
                            <Input
                                value={linkUrl}
                                onChange={(e) => setLinkUrl(e.target.value)}
                                placeholder="https://example.com/resource"
                                className="bg-white"
                            />
                            <Button onClick={onLinkSubmit} size="sm">
                                Save
                            </Button>
                        </div>
                        <div className="text-xs text-muted-foreground">
                            Paste a link to an external resource (YouTube, Google Drive, Website, etc.)
                        </div>
                    </TabsContent>
                </Tabs>
            )}
        </div>
    )
}
