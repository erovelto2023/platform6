"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { createSectionTemplate } from "@/lib/actions/section-template.actions";
import { toast } from "sonner";
import { ArrowLeft, Plus, Trash } from "lucide-react";
import Link from "next/link";

export default function CreateSectionTemplatePage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: "",
        category: "Other",
        structure: "",
        editableFields: [] as any[]
    });

    const categories = ["Hero", "Features", "Content", "CTA", "Testimonials", "Pricing", "FAQ", "Footer", "Header", "Other"];

    const addField = () => {
        setFormData(prev => ({
            ...prev,
            editableFields: [...prev.editableFields, { key: "", label: "", selector: "" }]
        }));
    };

    const updateField = (index: number, field: string, value: string) => {
        const newFields = [...formData.editableFields];
        newFields[index] = { ...newFields[index], [field]: value };
        setFormData(prev => ({ ...prev, editableFields: newFields }));
    };

    const removeField = (index: number) => {
        setFormData(prev => ({
            ...prev,
            editableFields: prev.editableFields.filter((_, i) => i !== index)
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const result = await createSectionTemplate(formData);
            if (result.success) {
                toast.success("Template created successfully");
                router.push("/admin/section-templates");
            } else {
                toast.error("Failed to create template: " + result.error);
            }
        } catch (error) {
            toast.error("An error occurred");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            <div className="flex items-center gap-4">
                <Link href="/admin/section-templates">
                    <Button variant="ghost" size="icon">
                        <ArrowLeft className="h-4 w-4" />
                    </Button>
                </Link>
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">Create Section Template</h1>
                    <p className="text-muted-foreground">
                        Define the HTML structure and editable fields for your new section.
                    </p>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8">
                <Card>
                    <CardContent className="pt-6 space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label>Template Name</Label>
                                <Input
                                    required
                                    value={formData.name}
                                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                                    placeholder="e.g., Modern Hero V2"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>Category</Label>
                                <Select
                                    value={formData.category}
                                    onValueChange={v => setFormData({ ...formData, category: v })}
                                >
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {categories.map(c => (
                                            <SelectItem key={c} value={c}>{c}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label>HTML Structure</Label>
                            <p className="text-xs text-slate-500">
                                Use Tailwind CSS classes. Add <code>data-id="field_key"</code> attributes to elements you want to be editable by AI.
                            </p>
                            <Textarea
                                required
                                className="font-mono text-xs min-h-[300px]"
                                value={formData.structure}
                                onChange={e => setFormData({ ...formData, structure: e.target.value })}
                                placeholder={`<section class="py-12 bg-white">\n  <h2 data-id="headline" class="text-3xl font-bold">Headline</h2>\n</section>`}
                            />
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="pt-6 space-y-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <h3 className="font-semibold">Editable Fields</h3>
                                <p className="text-sm text-slate-500">Map your <code>data-id</code> attributes to human-readable labels.</p>
                            </div>
                            <Button type="button" variant="outline" size="sm" onClick={addField}>
                                <Plus className="h-4 w-4 mr-2" />
                                Add Field
                            </Button>
                        </div>

                        <div className="space-y-3">
                            {formData.editableFields.map((field, index) => (
                                <div key={index} className="flex gap-3 items-start p-3 bg-slate-50 rounded-lg border">
                                    <div className="flex-1 space-y-1">
                                        <Label className="text-xs">Field Key (data-id)</Label>
                                        <Input
                                            value={field.key}
                                            onChange={e => updateField(index, "key", e.target.value)}
                                            placeholder="headline"
                                            className="h-8"
                                        />
                                    </div>
                                    <div className="flex-1 space-y-1">
                                        <Label className="text-xs">Label</Label>
                                        <Input
                                            value={field.label}
                                            onChange={e => updateField(index, "label", e.target.value)}
                                            placeholder="Main Headline"
                                            className="h-8"
                                        />
                                    </div>
                                    <div className="flex-1 space-y-1">
                                        <Label className="text-xs">CSS Selector</Label>
                                        <Input
                                            value={field.selector}
                                            onChange={e => updateField(index, "selector", e.target.value)}
                                            placeholder="[data-id='headline']"
                                            className="h-8"
                                        />
                                    </div>
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="icon"
                                        className="mt-6 text-red-500 hover:text-red-600"
                                        onClick={() => removeField(index)}
                                    >
                                        <Trash className="h-4 w-4" />
                                    </Button>
                                </div>
                            ))}
                            {formData.editableFields.length === 0 && (
                                <div className="text-center py-8 text-slate-400 text-sm">
                                    No editable fields defined.
                                </div>
                            )}
                        </div>
                    </CardContent>
                </Card>

                <div className="flex justify-end gap-4">
                    <Link href="/admin/section-templates">
                        <Button type="button" variant="ghost">Cancel</Button>
                    </Link>
                    <Button type="submit" disabled={loading}>
                        {loading ? "Creating..." : "Create Template"}
                    </Button>
                </div>
            </form>
        </div>
    );
}
