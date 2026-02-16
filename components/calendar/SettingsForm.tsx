
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
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { updateCalendarSettings } from "@/lib/actions/business.actions";
import { useState } from "react";
import { Loader2 } from "lucide-react";
import { Separator } from "@/components/ui/separator";

const formSchema = z.object({
    slug: z.string().min(3, "Slug must be at least 3 characters").regex(/^[a-z0-9-]+$/, "Slug can only contain lowercase letters, numbers, and hyphens"),
    timezone: z.string(),
    bufferTime: z.string().transform(Number),
    slotInterval: z.string().transform(Number),
    requiresConfirmation: z.boolean(),
});

interface SettingsFormProps {
    business: any;
}

export function SettingsForm({ business }: SettingsFormProps) {
    const [isLoading, setIsLoading] = useState(false);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            slug: business.calendarSettings?.slug || business._id,
            timezone: business.calendarSettings?.timezone || "UTC",
            bufferTime: (business.calendarSettings?.bufferTime || 0).toString(),
            slotInterval: (business.calendarSettings?.slotInterval || 30).toString(),
            requiresConfirmation: business.calendarSettings?.requiresConfirmation || false,
        },
    });

    async function onSubmit(values: z.infer<typeof formSchema>) {
        setIsLoading(true);
        try {
            const res = await updateCalendarSettings(values);
            if (res.success) {
                toast.success("Settings saved successfully");
            } else {
                toast.error(res.error || "Failed to save settings");
            }
        } catch (error) {
            toast.error("An error occurred");
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">

                {/* Company Info */}
                <Card>
                    <CardHeader>
                        <CardTitle>Company Information</CardTitle>
                        <CardDescription>
                            Configure how your business appears on the booking page.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <FormField
                            control={form.control}
                            name="slug"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Booking URL Slug</FormLabel>
                                    <div className="flex rounded-md shadow-sm ring-offset-background">
                                        <span className="flex select-none items-center pl-3 text-slate-500 text-sm bg-slate-50 border border-r-0 rounded-l-md px-3 border-slate-200">
                                            {process.env.NEXT_PUBLIC_APP_URL}/book/
                                        </span>
                                        <FormControl>
                                            <Input className="rounded-l-none border-l-0" placeholder="my-business" {...field} />
                                        </FormControl>
                                    </div>
                                    <FormDescription>
                                        This will be your personalized booking URL.
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </CardContent>
                </Card>

                {/* Time Zone */}
                <Card>
                    <CardHeader>
                        <CardTitle>Time Zone</CardTitle>
                        <CardDescription>
                            This timezone will be used for all your availability and scheduling.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <FormField
                            control={form.control}
                            name="timezone"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Time Zone</FormLabel>
                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select a timezone" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            <SelectItem value="UTC">UTC</SelectItem>
                                            <SelectItem value="America/New_York">Eastern Time (ET)</SelectItem>
                                            <SelectItem value="America/Chicago">Central Time (CT)</SelectItem>
                                            <SelectItem value="America/Denver">Mountain Time (MT)</SelectItem>
                                            <SelectItem value="America/Los_Angeles">Pacific Time (PT)</SelectItem>
                                            <SelectItem value="Europe/London">London (GMT)</SelectItem>
                                            {/* Add more common timezones */}
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </CardContent>
                </Card>

                {/* Booking Preferences */}
                <Card>
                    <CardHeader>
                        <CardTitle>Booking Preferences</CardTitle>
                        <CardDescription>
                            Fine-tune how clients can book with you.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <FormField
                            control={form.control}
                            name="requiresConfirmation"
                            render={({ field }) => (
                                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4 shadow-sm">
                                    <div className="space-y-0.5">
                                        <FormLabel className="text-base">Require confirmation</FormLabel>
                                        <FormDescription>
                                            Manually approve bookings before they're confirmed.
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

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <FormField
                                control={form.control}
                                name="bufferTime"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Buffer time</FormLabel>
                                        <Select onValueChange={field.onChange} defaultValue={field.value.toString()}>
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select buffer time" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                <SelectItem value="0">No buffer</SelectItem>
                                                <SelectItem value="15">15 min</SelectItem>
                                                <SelectItem value="30">30 min</SelectItem>
                                                <SelectItem value="60">1 hour</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        <FormDescription>
                                            Add time between meetings.
                                        </FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="slotInterval"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Time Slot Intervals</FormLabel>
                                        <Select onValueChange={field.onChange} defaultValue={field.value.toString()}>
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select interval" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                <SelectItem value="15">Every 15 min</SelectItem>
                                                <SelectItem value="30">Every 30 min</SelectItem>
                                                <SelectItem value="60">Every hour</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        <FormDescription>
                                            How often slots are generated (e.g. 1:00, 1:30...)
                                        </FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                    </CardContent>
                </Card>

                <div className="flex justify-end">
                    <Button type="submit" disabled={isLoading} className="bg-indigo-600 hover:bg-indigo-700">
                        {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Save Settings
                    </Button>
                </div>
            </form>
        </Form>
    );
}
