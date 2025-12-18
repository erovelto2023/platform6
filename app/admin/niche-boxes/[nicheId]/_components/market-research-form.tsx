"use client";

import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Loader2, Pencil } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { updateNicheBox } from "@/lib/actions/niche.actions";

import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface MarketResearchFormProps {
    initialData: {
        marketResearch?: {
            demographics?: {
                ageRange?: string;
                income?: string;
                location?: string;
            };
            avatar?: {
                description?: string;
            };
        };
    };
    nicheId: string;
}

const formSchema = z.object({
    ageRange: z.string().optional(),
    income: z.string().optional(),
    location: z.string().optional(),
    avatarDescription: z.string().optional(),
});

export const MarketResearchForm = ({
    initialData,
    nicheId
}: MarketResearchFormProps) => {
    const [isEditing, setIsEditing] = useState(false);

    const toggleEdit = () => setIsEditing((current) => !current);

    const router = useRouter();

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            ageRange: initialData.marketResearch?.demographics?.ageRange || "",
            income: initialData.marketResearch?.demographics?.income || "",
            location: initialData.marketResearch?.demographics?.location || "",
            avatarDescription: initialData.marketResearch?.avatar?.description || "",
        },
    });

    const { isSubmitting, isValid } = form.formState;

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        try {
            const marketResearch = {
                ...initialData.marketResearch,
                demographics: {
                    ...initialData.marketResearch?.demographics,
                    ageRange: values.ageRange,
                    income: values.income,
                    location: values.location,
                },
                avatar: {
                    ...initialData.marketResearch?.avatar,
                    description: values.avatarDescription,
                }
            };

            await updateNicheBox(nicheId, { marketResearch });

            toast.success("Market research updated");
            toggleEdit();
            router.refresh();
        } catch {
            toast.error("Something went wrong");
        }
    }

    return (
        <div className="mt-6 border bg-slate-100 rounded-md p-4">
            <div className="font-medium flex items-center justify-between">
                Market Research & Avatar
                <Button onClick={toggleEdit} variant="ghost">
                    {isEditing ? (
                        <>Cancel</>
                    ) : (
                        <>
                            <Pencil className="h-4 w-4 mr-2" />
                            Edit
                        </>
                    )}
                </Button>
            </div>
            {!isEditing && (
                <div className="text-sm mt-2 space-y-2">
                    <p className="text-slate-500">
                        <span className="font-semibold text-slate-700">Age Range:</span> {initialData.marketResearch?.demographics?.ageRange || "Not set"}
                    </p>
                    <p className="text-slate-500">
                        <span className="font-semibold text-slate-700">Income:</span> {initialData.marketResearch?.demographics?.income || "Not set"}
                    </p>
                    <p className="text-slate-500">
                        <span className="font-semibold text-slate-700">Avatar:</span> {initialData.marketResearch?.avatar?.description || "Not set"}
                    </p>
                </div>
            )}
            {isEditing && (
                <Form {...form}>
                    <form
                        onSubmit={form.handleSubmit(onSubmit)}
                        className="space-y-4 mt-4"
                    >
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <FormField
                                control={form.control}
                                name="ageRange"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Age Range</FormLabel>
                                        <FormControl>
                                            <Input
                                                disabled={isSubmitting}
                                                placeholder="e.g. 25-45"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="income"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Income Level</FormLabel>
                                        <FormControl>
                                            <Input
                                                disabled={isSubmitting}
                                                placeholder="e.g. $50k - $100k"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                        <FormField
                            control={form.control}
                            name="avatarDescription"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Customer Avatar Description</FormLabel>
                                    <FormControl>
                                        <Textarea
                                            disabled={isSubmitting}
                                            placeholder="Describe the ideal customer..."
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <div className="flex items-center gap-x-2">
                            <Button
                                disabled={!isValid || isSubmitting}
                                type="submit"
                            >
                                Save
                            </Button>
                        </div>
                    </form>
                </Form>
            )}
        </div>
    )
}
