"use client";

import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { getAmazonSettings, updateAmazonSettings } from "@/lib/actions/amazon.actions";

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
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

import { Switch } from "@/components/ui/switch";

const formSchema = z.object({
    accessKey: z.string().min(0),
    secretKey: z.string().min(0),
    partnerTag: z.string().min(0),
    region: z.string().min(1),
    isMockMode: z.boolean().default(false),
});

export default function SettingsPage() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(true);

    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            accessKey: "",
            secretKey: "",
            partnerTag: "",
            region: "US",
            isMockMode: false,
        },
    });

    useEffect(() => {
        const fetchSettings = async () => {
            try {
                const settings = await getAmazonSettings();
                if (settings) {
                    form.reset({
                        accessKey: settings.accessKey || "",
                        secretKey: settings.secretKey || "",
                        partnerTag: settings.partnerTag || "",
                        region: settings.region || "US",
                        isMockMode: settings.isMockMode || false,
                    });
                }
            } catch {
                toast.error("Failed to load settings");
            } finally {
                setIsLoading(false);
            }
        };
        fetchSettings();
    }, [form]);

    const { isSubmitting, isValid } = form.formState;

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        try {
            await updateAmazonSettings(values);
            toast.success("Settings updated");
            router.refresh();
        } catch {
            toast.error("Something went wrong");
        }
    }

    if (isLoading) {
        return <div className="p-6">Loading settings...</div>;
    }

    return (
        <div className="p-6 max-w-2xl">
            <div className="flex flex-col gap-y-2 mb-6">
                <h1 className="text-3xl font-bold">Settings</h1>
                <p className="text-muted-foreground">
                    Configure your Amazon Product Advertising API credentials.
                </p>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>API Credentials</CardTitle>
                    <CardDescription>
                        You can find these in your Amazon Associates account under Tools &gt; Product Advertising API.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Form {...form}>
                        <form
                            onSubmit={form.handleSubmit(onSubmit)}
                            className="space-y-4"
                        >
                            <FormField
                                control={form.control}
                                name="accessKey"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Access Key</FormLabel>
                                        <FormControl>
                                            <Input
                                                disabled={isSubmitting}
                                                placeholder="AKIA..."
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="secretKey"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Secret Key</FormLabel>
                                        <FormControl>
                                            <Input
                                                disabled={isSubmitting}
                                                type="password"
                                                placeholder="Secret key..."
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="partnerTag"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Partner Tag (Tracking ID)</FormLabel>
                                        <FormControl>
                                            <Input
                                                disabled={isSubmitting}
                                                placeholder="example-20"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormDescription>
                                            Your default affiliate tracking ID.
                                        </FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="region"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Default Region</FormLabel>
                                        <Select
                                            onValueChange={field.onChange}
                                            defaultValue={field.value}
                                        >
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select a region" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                <SelectItem value="US">United States (US)</SelectItem>
                                                <SelectItem value="UK">United Kingdom (UK)</SelectItem>
                                                <SelectItem value="CA">Canada (CA)</SelectItem>
                                                <SelectItem value="DE">Germany (DE)</SelectItem>
                                                <SelectItem value="FR">France (FR)</SelectItem>
                                                <SelectItem value="JP">Japan (JP)</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="isMockMode"
                                render={({ field }) => (
                                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                                        <div className="space-y-0.5">
                                            <FormLabel className="text-base">
                                                Mock Mode (Dev)
                                            </FormLabel>
                                            <FormDescription>
                                                Use mock data instead of calling the real Amazon API. Useful for testing or if your API access is restricted.
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

                            <div className="flex items-center gap-x-2 mt-6">
                                <Button
                                    disabled={isSubmitting}
                                    type="submit"
                                >
                                    Save Settings
                                </Button>
                            </div>
                        </form>
                    </Form>
                </CardContent>
            </Card>
        </div>
    );
}
