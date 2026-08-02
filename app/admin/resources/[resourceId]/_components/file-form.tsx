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
        <div className="border bg-slate-900 border-slate-800 rounded-2xl p-5 shadow-xl text-slate-100">
            <div className="font-mono font-bold text-xs uppercase tracking-wider text-slate-200 flex items-center justify-between">
                <span>Resource Content (File or Link)</span>
                <Button 
                    onClick={toggleEdit} 
                    variant="ghost"
                    size="sm"
                    className="text-orange-400 hover:text-amber-300 hover:bg-slate-800 cursor-pointer h-7 text-xs font-mono font-bold"
                >
                    {isEditing && <>Cancel</>}
                    {!isEditing && !initialData.url && (
                        <>
                            <PlusCircle className="h-3.5 w-3.5 mr-1.5" />
                            Add Content
                        </>
                    )}
                    {!isEditing && initialData.url && (
                        <>
                            <Pencil className="h-3.5 w-3.5 mr-1.5" />
                            Edit
                        </>
                    )}
                </Button>
            </div>
            {!isEditing && (
                !initialData.url ? (
                    <div className="flex items-center justify-center h-40 bg-slate-950 border border-slate-800 rounded-xl mt-2">
                        <File className="h-10 w-10 text-slate-600" />
                    </div>
                ) : (
                    <div className="relative flex items-center p-3 mt-2 bg-slate-950 border border-slate-800 text-sky-400 rounded-xl">
                        {initialData.type === 'link' ? (
                            <LinkIcon className="h-4 w-4 mr-2 shrink-0 text-cyan-400" />
                        ) : (
                            <File className="h-4 w-4 mr-2 shrink-0 text-cyan-400" />
                        )}
                        <a
                            href={initialData.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs font-mono font-bold line-clamp-1 hover:underline text-cyan-300"
                        >
                            {initialData.url}
                        </a>
                    </div>
                )
            )}
            {isEditing && (
                <Tabs defaultValue="upload" className="w-full mt-3">
                    <TabsList className="grid w-full grid-cols-2 bg-slate-950 border border-slate-800">
                        <TabsTrigger value="upload" className="text-xs font-mono font-bold">Upload File</TabsTrigger>
                        <TabsTrigger value="link" className="text-xs font-mono font-bold">External Link</TabsTrigger>
                    </TabsList>
                    <TabsContent value="upload" className="space-y-4 pt-4">
                        <UploadButton
                            endpoint="courseAttachment"
                            onClientUploadComplete={(res) => {
                                onSubmit({ url: res?.[0].url || res?.[0].url });
                            }}
                            onUploadError={(error: Error) => {
                                toast.error(`${error?.message}`);
                            }}
                            appearance={{
                                button: "bg-slate-950 hover:bg-slate-800 text-orange-400 border border-slate-800 font-mono text-xs cursor-pointer",
                                allowedContent: "hidden"
                            }}
                        />
                        <div className="text-xs font-mono text-slate-400">
                            Upload a file (PDF, Zip, Image, etc.)
                        </div>
                    </TabsContent>
                    <TabsContent value="link" className="space-y-4 pt-4">
                        <div className="flex items-center gap-x-2">
                            <Input
                                value={linkUrl}
                                onChange={(e) => setLinkUrl(e.target.value)}
                                placeholder="https://example.com/resource"
                                className="bg-slate-950 border-slate-800 text-slate-100 font-mono text-xs focus:border-orange-500"
                            />
                            <Button 
                                onClick={onLinkSubmit} 
                                size="sm"
                                className="bg-orange-500 hover:bg-orange-600 text-slate-950 font-bold font-mono text-xs cursor-pointer"
                            >
                                Save
                            </Button>
                        </div>
                        <div className="text-xs font-mono text-slate-400">
                            Paste a link to an external resource (YouTube, Google Drive, Website, etc.)
                        </div>
                    </TabsContent>
                </Tabs>
            )}
        </div>
    )
}
