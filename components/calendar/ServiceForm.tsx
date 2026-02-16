
"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { createCalendarService, updateCalendarService } from "@/lib/actions/calendar-service.actions";
import { useState } from "react";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

const serviceFormSchema = z.object({
    name: z.string().min(1, "Name is required"),
    description: z.string().optional(),
    duration: z.coerce.number().min(1, "Duration must be at least 1 minute"),
    price: z.coerce.number().min(0, "Price must be positive"),
    slug: z.string().optional(),
    isActive: z.boolean().default(true),
});

interface ServiceFormProps {
    initialData?: any;
}

export function ServiceForm({ initialData }: ServiceFormProps) {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);

    const form = useForm<z.infer<typeof serviceFormSchema>>({
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        resolver: zodResolver(serviceFormSchema) as any,
        defaultValues: {
            name: initialData?.name || "",
            description: initialData?.description || "",
            duration: initialData?.duration || 30,
            price: initialData?.price || 0,
            slug: initialData?.slug || "",
            isActive: initialData?.isActive ?? true,
        },
    });

    async function onSubmit(values: z.infer<typeof serviceFormSchema>) {
        setIsLoading(true);
        try {
            let res;
            if (initialData?._id) {
                res = await updateCalendarService(initialData._id, values);
            } else {
                res = await createCalendarService(values);
            }

            if (res.success) {
                toast.success(initialData ? "Service updated" : "Service created");
                router.push('/calendar/services');
                router.refresh();
            } else {
                toast.error(res.error || "Failed to save service");
            }
        } catch (error) {
            toast.error("An error occurred");
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 max-w-2xl bg-white p-6 rounded-lg border border-slate-200">
                <div className="grid gap-6">
                    <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Service Name</FormLabel>
                                <FormControl>
                                    <Input placeholder="e.g. 30 Minute Consultation" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <div className="grid grid-cols-2 gap-4">
                        <FormField
                            control={form.control}
                            name="duration"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Duration (Minutes)</FormLabel>
                                    <FormControl>
                                        <Input type="number" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="price"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Price</FormLabel>
                                    <FormControl>
                                        <Input type="number" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>

                    <FormField
                        control={form.control}
                        name="description"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Description</FormLabel>
                                <FormControl>
                                    <Textarea placeholder="What's included in this service?" className="resize-none" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="slug"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>URL Slug (Optional)</FormLabel>
                                <FormControl>
                                    <Input placeholder="consultation-30" {...field} />
                                </FormControl>
                                <FormDescription>Custom URL segment for booking link.</FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="isActive"
                        render={({ field }) => (
                            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                                <div className="space-y-0.5">
                                    <FormLabel className="text-base">Active</FormLabel>
                                    <FormDescription>
                                        Available for booking.
                                    </FormDescription>
                                </div>
                                <FormControl>
                                    <Switch
                                        checked={field.value}
                                        onCheckedChange={field.onChange}
                                    />
                                </FormControl>
                            </FormItem>
                        )}
                    />
                </div>

                <div className="flex justify-end gap-4">
                    <Button type="button" variant="outline" onClick={() => router.back()}>
                        Cancel
                    </Button>
                    <Button type="submit" disabled={isLoading} className="bg-indigo-600 hover:bg-indigo-700">
                        {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Save Service
                    </Button>
                </div>
            </form>
        </Form>
    );
}
