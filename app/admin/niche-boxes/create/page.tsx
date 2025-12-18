"use client";

import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createNicheBox } from "@/lib/actions/niche.actions";

import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

const formSchema = z.object({
    title: z.string().min(1, {
        message: "Title is required",
    }),
});

export default function CreateNicheBoxPage() {
    const router = useRouter();
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            title: "",
        },
    });

    const { isSubmitting, isValid } = form.formState;

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        try {
            const response = await createNicheBox(values.title);
            if (response.success) {
                toast.success("Niche Box created");
                router.push(`/admin/niche-boxes/${response.id}`);
            } else {
                toast.error("Something went wrong");
            }
        } catch {
            toast.error("Something went wrong");
        }
    };

    return (
        <div className="max-w-5xl mx-auto flex md:items-center md:justify-center h-full p-6">
            <div className="w-full">
                <h1 className="text-2xl font-bold">Name your Niche Box</h1>
                <p className="text-sm text-slate-600">
                    What business model is this box for? e.g. "Gardening Blog" or "SaaS Starter".
                </p>
                <Form {...form}>
                    <form
                        onSubmit={form.handleSubmit(onSubmit)}
                        className="space-y-8 mt-8"
                    >
                        <FormField
                            control={form.control}
                            name="title"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Niche Title</FormLabel>
                                    <FormControl>
                                        <Input
                                            disabled={isSubmitting}
                                            placeholder="e.g. 'Gardening Business'"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormDescription>
                                        This will be the name of the business blueprint.
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <div className="flex items-center gap-x-2">
                            <Link href="/admin/niche-boxes">
                                <Button type="button" variant="ghost">
                                    Cancel
                                </Button>
                            </Link>
                            <Button type="submit" disabled={!isValid || isSubmitting}>
                                Continue
                            </Button>
                        </div>
                    </form>
                </Form>
            </div>
        </div>
    );
}
