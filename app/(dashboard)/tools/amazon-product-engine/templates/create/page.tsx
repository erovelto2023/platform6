"use client";

import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { createAmazonTemplate } from "@/lib/actions/amazon.actions";
import { useState, useEffect } from "react";

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
import { Textarea } from "@/components/ui/textarea";
import { TemplatePreview } from "../_components/template-preview";
import { PRESET_TEMPLATES } from "../_components/preset-templates";
import { Card, CardContent } from "@/components/ui/card";
import { TemplateBuilderForm, TemplateConfig, generateHtmlFromConfig } from "../_components/template-builder-form";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const formSchema = z.object({
    name: z.string().min(1, "Name is required"),
    type: z.string().min(1, "Type is required"),
    content: z.string().min(1, "Content is required"),
});

export default function CreateTemplatePage() {
    const router = useRouter();
    const [mode, setMode] = useState<"code" | "builder">("builder");

    // Builder State
    const [builderConfig, setBuilderConfig] = useState<TemplateConfig>({
        showImage: true,
        showTitle: true,
        showPrice: true,
        showRating: true,
        showButton: true,
        buttonText: "Buy on Amazon",
        buttonColor: "bg-yellow-400 hover:bg-yellow-500 text-slate-900",
        backgroundColor: "bg-white",
        borderColor: "border-slate-200",
        borderRadius: 8,
        shadow: "shadow-sm"
    });

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
            type: "box",
            content: generateHtmlFromConfig(builderConfig),
        },
    });

    const { isSubmitting, isValid } = form.formState;
    const watchedContent = form.watch("content");

    // Update form content when builder config changes
    useEffect(() => {
        if (mode === "builder") {
            const html = generateHtmlFromConfig(builderConfig);
            form.setValue("content", html);
        }
    }, [builderConfig, mode, form]);

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        try {
            const response = await createAmazonTemplate(values.name, values.content, values.type);
            if (response.success) {
                toast.success("Template created");
                router.push("/tools/amazon-product-engine/templates");
            } else {
                toast.error("Something went wrong");
            }
        } catch {
            toast.error("Something went wrong");
        }
    }

    const loadPreset = (preset: typeof PRESET_TEMPLATES[0]) => {
        setMode("code"); // Switch to code mode for presets as they might be complex
        form.setValue("name", preset.name);
        form.setValue("type", preset.type);
        form.setValue("content", preset.content);
        toast.success(`Loaded "${preset.name}" preset`);
    };

    return (
        <div className="p-6 max-w-6xl mx-auto">
            <div className="flex flex-col gap-y-2 mb-6">
                <h1 className="text-3xl font-bold">Create Template</h1>
                <p className="text-muted-foreground">
                    Design your product display using the visual builder or custom HTML.
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="space-y-6">
                    <Form {...form}>
                        <form
                            onSubmit={form.handleSubmit(onSubmit)}
                            className="space-y-6"
                        >
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <FormField
                                    control={form.control}
                                    name="name"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Template Name</FormLabel>
                                            <FormControl>
                                                <Input
                                                    disabled={isSubmitting}
                                                    placeholder="e.g. Modern Product Box"
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="type"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Template Type</FormLabel>
                                            <Select
                                                onValueChange={field.onChange}
                                                defaultValue={field.value}
                                            >
                                                <FormControl>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Select type" />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    <SelectItem value="box">Product Box</SelectItem>
                                                    <SelectItem value="list">List Item</SelectItem>
                                                    <SelectItem value="table">Comparison Table</SelectItem>
                                                    <SelectItem value="widget">Sidebar Widget</SelectItem>
                                                </SelectContent>
                                            </Select>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>

                            <Tabs value={mode} onValueChange={(v) => setMode(v as any)} className="w-full">
                                <TabsList className="grid w-full grid-cols-2">
                                    <TabsTrigger value="builder">Visual Builder</TabsTrigger>
                                    <TabsTrigger value="code">Code Editor</TabsTrigger>
                                </TabsList>
                                <TabsContent value="builder" className="mt-4">
                                    <TemplateBuilderForm
                                        config={builderConfig}
                                        onChange={setBuilderConfig}
                                    />
                                </TabsContent>
                                <TabsContent value="code" className="mt-4">
                                    <Card>
                                        <CardContent className="p-4 space-y-4">
                                            <div className="grid grid-cols-2 gap-2 mb-4">
                                                {PRESET_TEMPLATES.map((preset, index) => (
                                                    <Button
                                                        key={index}
                                                        variant="outline"
                                                        size="sm"
                                                        className="justify-start h-auto py-2 px-3 text-left whitespace-normal"
                                                        onClick={() => loadPreset(preset)}
                                                        type="button"
                                                    >
                                                        <div className="flex flex-col items-start">
                                                            <span className="font-medium text-xs">{preset.name}</span>
                                                            <span className="text-[10px] text-muted-foreground capitalize">{preset.type}</span>
                                                        </div>
                                                    </Button>
                                                ))}
                                            </div>
                                            <FormField
                                                control={form.control}
                                                name="content"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>HTML Content</FormLabel>
                                                        <FormControl>
                                                            <Textarea
                                                                disabled={isSubmitting}
                                                                className="font-mono min-h-[400px] text-xs"
                                                                {...field}
                                                            />
                                                        </FormControl>
                                                        <FormDescription>
                                                            Available placeholders: {"{{title}}, {{image}}, {{price}}, {{rating}}, {{link}}, {{asin}}"}
                                                        </FormDescription>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                        </CardContent>
                                    </Card>
                                </TabsContent>
                            </Tabs>

                            <div className="flex items-center gap-x-2">
                                <Button
                                    disabled={!isValid || isSubmitting}
                                    type="submit"
                                >
                                    Create Template
                                </Button>
                            </div>
                        </form>
                    </Form>
                </div>

                <div className="space-y-6">
                    <div className="sticky top-6">
                        <TemplatePreview content={watchedContent} />
                        <div className="mt-4 p-4 bg-blue-50 text-blue-800 rounded-lg text-sm border border-blue-100">
                            <p className="font-bold mb-1">💡 Pro Tip:</p>
                            <p>
                                Use the <strong>Visual Builder</strong> for quick designs. Switch to the <strong>Code Editor</strong> for full control or to use presets.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
