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

    const { isSubmitting, isValid } = form.formState;

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
        <div className="mt-6 border bg-slate-100 rounded-md p-4">
            <div className="font-medium flex items-center justify-between">
                Access Level (User vs Admin)
                <Button onClick={toggleEdit} variant="ghost" size="sm">
                    {isEditing ? (
                        <>Cancel</>
                    ) : (
                        <>
                            <Pencil className="h-4 w-4 mr-2" />
                            Edit access
                        </>
                    )}
                </Button>
            </div>
            {!isEditing && (
                <div className="flex items-center gap-x-2 mt-2">
                    {isUserAccess ? (
                        <div className="flex items-center gap-1.5 bg-emerald-100 text-emerald-800 border border-emerald-300 px-2.5 py-1 rounded-md text-xs font-semibold">
                            <Users className="h-3.5 w-3.5" />
                            User / Student Accessible
                        </div>
                    ) : (
                        <div className="flex items-center gap-1.5 bg-rose-100 text-rose-800 border border-rose-300 px-2.5 py-1 rounded-md text-xs font-semibold">
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
                        className="space-y-4 mt-4"
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
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select access scope" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
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
