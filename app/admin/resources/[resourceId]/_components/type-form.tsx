"use client";

import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Pencil } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { updateResource } from "@/lib/actions/resource.actions";
import { cn } from "@/lib/utils";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface TypeFormProps {
    initialData: {
        type: string;
    };
    resourceId: string;
};

const formSchema = z.object({
    type: z.string().min(1),
});

const options = [
    { label: "Ebook / Guide", value: "ebook" },
    { label: "Document (Word/Text)", value: "doc" },
    { label: "PDF Document", value: "pdf" },
    { label: "Audio (MP3/Sound)", value: "audio" },
    { label: "Spreadsheet (Excel/CSV)", value: "spreadsheet" },
    { label: "Archive (Zip/Rar)", value: "archive" },
    { label: "Image", value: "image" },
    { label: "Video", value: "video" },
    { label: "External Link", value: "link" },
    { label: "Generic File", value: "file" },
];

export const TypeForm = ({
    initialData,
    resourceId
}: TypeFormProps) => {
    const [isEditing, setIsEditing] = useState(false);

    const toggleEdit = () => setIsEditing((current) => !current);

    const router = useRouter();

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: initialData,
    });

    const { isSubmitting } = form.formState;

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        try {
            await updateResource(resourceId, values as any);
            toast.success("Resource updated");
            toggleEdit();
            router.refresh();
        } catch {
            toast.error("Something went wrong");
        }
    }

    const selectedOption = options.find((option) => option.value === initialData.type);

    return (
        <div className="border bg-slate-900 border-slate-800 rounded-2xl p-5 shadow-xl text-slate-100">
            <div className="font-mono font-bold text-xs uppercase tracking-wider text-slate-200 flex items-center justify-between">
                <span>Resource Type</span>
                <Button 
                    onClick={toggleEdit} 
                    variant="ghost" 
                    size="sm"
                    className="text-orange-400 hover:text-amber-300 hover:bg-slate-800 cursor-pointer h-7 text-xs font-mono font-bold"
                >
                    {isEditing ? (
                        <>Cancel</>
                    ) : (
                        <>
                            <Pencil className="h-3.5 w-3.5 mr-1.5" />
                            Edit Type
                        </>
                    )}
                </Button>
            </div>
            {!isEditing && (
                <p className={cn(
                    "text-xs font-mono font-bold text-amber-300 mt-2 bg-slate-950 p-2.5 rounded-xl border border-slate-800",
                    !initialData.type && "text-slate-500 italic"
                )}>
                    {selectedOption?.label || "No type"}
                </p>
            )}
            {isEditing && (
                <Form {...form}>
                    <form
                        onSubmit={form.handleSubmit(onSubmit)}
                        className="space-y-4 mt-3"
                    >
                        <FormField
                            control={form.control}
                            name="type"
                            render={({ field }) => (
                                <FormItem>
                                    <Select
                                        onValueChange={field.onChange}
                                        defaultValue={field.value}
                                    >
                                        <FormControl>
                                            <SelectTrigger className="bg-slate-950 border-slate-800 text-slate-100 font-mono text-xs focus:border-orange-500">
                                                <SelectValue placeholder="Select a type" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent className="bg-slate-900 border-slate-800 text-slate-100 font-mono">
                                            {options.map((option) => (
                                                <SelectItem
                                                    key={option.value}
                                                    value={option.value}
                                                >
                                                    {option.label}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <div className="flex items-center gap-x-2">
                            <Button
                                disabled={isSubmitting}
                                type="submit"
                                size="sm"
                                className="bg-orange-500 hover:bg-orange-600 text-slate-950 font-bold font-mono text-xs cursor-pointer"
                            >
                                Save Type
                            </Button>
                        </div>
                    </form>
                </Form>
            )}
        </div>
    )
}
