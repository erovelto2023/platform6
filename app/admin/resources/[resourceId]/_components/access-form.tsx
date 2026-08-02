"use client";

import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Pencil, ShieldAlert, Users } from "lucide-react";
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface AccessFormProps {
    initialData: {
        access?: string;
    };
    resourceId: string;
}

const formSchema = z.object({
    access: z.enum(["user", "admin"]),
});

export const AccessForm = ({
    initialData,
    resourceId
}: AccessFormProps) => {
    const [isEditing, setIsEditing] = useState(false);

    const toggleEdit = () => setIsEditing((current) => !current);

    const router = useRouter();

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            access: (initialData.access as "user" | "admin") || "user",
        },
    });

    const { isSubmitting } = form.formState;

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        try {
            await updateResource(resourceId, values);
            toast.success("Access permissions updated");
            toggleEdit();
            router.refresh();
        } catch {
            toast.error("Something went wrong");
        }
    };

    const isUserAccess = (initialData.access || "user") === "user";

    return (
        <div className="border bg-slate-900 border-slate-800 rounded-2xl p-5 shadow-xl text-slate-100">
            <div className="font-mono font-bold text-xs uppercase tracking-wider text-slate-200 flex items-center justify-between">
                <span>Access Level (User vs Admin)</span>
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
                            Edit Access
                        </>
                    )}
                </Button>
            </div>
            {!isEditing && (
                <div className="flex items-center gap-x-2 mt-2">
                    {isUserAccess ? (
                        <div className="flex items-center gap-1.5 bg-emerald-950/80 text-emerald-400 border border-emerald-800 px-3 py-1.5 rounded-xl text-xs font-mono font-bold">
                            <Users className="h-3.5 w-3.5" />
                            User / Student Accessible
                        </div>
                    ) : (
                        <div className="flex items-center gap-1.5 bg-rose-950/80 text-rose-400 border border-rose-800 px-3 py-1.5 rounded-xl text-xs font-mono font-bold">
                            <ShieldAlert className="h-3.5 w-3.5" />
                            Admin Only (Hidden from Students)
                        </div>
                    )}
                </div>
            )}
            {isEditing && (
                <Form {...form}>
                    <form
                        onSubmit={form.handleSubmit(onSubmit)}
                        className="space-y-4 mt-3"
                    >
                        <FormField
                            control={form.control}
                            name="access"
                            render={({ field }) => (
                                <FormItem>
                                    <Select
                                        onValueChange={field.onChange}
                                        defaultValue={field.value}
                                    >
                                        <FormControl>
                                            <SelectTrigger className="bg-slate-950 border-slate-800 text-slate-100 font-mono text-xs focus:border-orange-500">
                                                <SelectValue placeholder="Select access scope" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent className="bg-slate-900 border-slate-800 text-slate-100 font-mono">
                                            <SelectItem value="user">
                                                User / Student Accessible (Ebooks, Public Downloads)
                                            </SelectItem>
                                            <SelectItem value="admin">
                                                Admin Only (Internal platform files, restricted)
                                            </SelectItem>
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
                                Save Access
                            </Button>
                        </div>
                    </form>
                </Form>
            )}
        </div>
    );
};
