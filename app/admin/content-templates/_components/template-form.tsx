"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Trash2, Plus, ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { createContentTemplate, updateContentTemplate, deleteContentTemplate } from "@/lib/actions/content-template.actions";
import Link from "next/link";

interface TemplateFormProps {
    initialData?: any;
    isEditing?: boolean;
}

export default function TemplateForm({ initialData, isEditing = false }: TemplateFormProps) {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState(initialData || {
        name: "",
        slug: "",
        category: "Written Content",
        subcategory: "",
        description: "",
        systemPrompt: "",
        inputs: [],
        isActive: true,
        isPremium: false
    });

    const handleAddInput = () => {
        setFormData({
            ...formData,
            inputs: [
                ...formData.inputs,
                { label: "", variableName: "", type: "text", required: true, placeholder: "", options: [] }
            ]
        });
    };

    const handleRemoveInput = (index: number) => {
        const newInputs = [...formData.inputs];
        newInputs.splice(index, 1);
        setFormData({ ...formData, inputs: newInputs });
    };

    const handleInputChange = (index: number, field: string, value: any) => {
        const newInputs = [...formData.inputs];
        newInputs[index][field] = value;
        setFormData({ ...formData, inputs: newInputs });
    };

    const handleSubmit = async () => {
        if (!formData.name || !formData.systemPrompt) {
            return toast.error("Name and System Prompt are required");
        }

        setIsLoading(true);
        try {
            if (isEditing) {
                await updateContentTemplate(initialData._id, formData);
                toast.success("Template updated");
            } else {
                await createContentTemplate(formData);
                toast.success("Template created");
                router.push("/admin/content-templates");
            }
            router.refresh();
        } catch (error) {
            toast.error("Failed to save template");
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleDelete = async () => {
        if (!confirm("Are you sure you want to delete this template?")) return;
        setIsLoading(true);
        try {
            await deleteContentTemplate(initialData._id);
            toast.success("Template deleted");
            router.push("/admin/content-templates");
        } catch (error) {
            toast.error("Failed to delete template");
        }
    };

    return (
        <div className="space-y-6 max-w-5xl mx-auto pb-20">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Link href="/admin/content-templates">
                        <Button variant="ghost" size="icon">
                            <ArrowLeft className="h-4 w-4" />
                        </Button>
                    </Link>
                    <h1 className="text-2xl font-bold">{isEditing ? `Edit: ${formData.name}` : "Create Template"}</h1>
                </div>
                {isEditing && (
                    <Button variant="destructive" size="sm" onClick={handleDelete}>
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete
                    </Button>
                )}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-6">
                    {/* Basic Info */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Basic Information</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label>Name</Label>
                                    <Input value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} />
                                </div>
                                <div className="space-y-2">
                                    <Label>Slug (Optional)</Label>
                                    <Input value={formData.slug} onChange={(e) => setFormData({ ...formData, slug: e.target.value })} placeholder="auto-generated" />
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label>Category</Label>
                                    <Input value={formData.category} onChange={(e) => setFormData({ ...formData, category: e.target.value })} />
                                </div>
                                <div className="space-y-2">
                                    <Label>Subcategory</Label>
                                    <Input value={formData.subcategory} onChange={(e) => setFormData({ ...formData, subcategory: e.target.value })} />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label>Description</Label>
                                <Textarea value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} />
                            </div>
                            <div className="flex items-center gap-8 pt-2">
                                <div className="flex items-center gap-2">
                                    <Switch checked={formData.isActive} onCheckedChange={(c) => setFormData({ ...formData, isActive: c })} />
                                    <Label>Active</Label>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Switch checked={formData.isPremium} onCheckedChange={(c) => setFormData({ ...formData, isPremium: c })} />
                                    <Label>Premium Only</Label>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* System Prompt */}
                    <Card>
                        <CardHeader>
                            <CardTitle>System Prompt</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <p className="text-sm text-slate-500">
                                This is the instruction sent to the AI. Use <code className="bg-slate-100 px-1 rounded">{"{{variableName}}"}</code> to insert user inputs.
                            </p>
                            <Textarea
                                className="min-h-[300px] font-mono text-sm"
                                value={formData.systemPrompt}
                                onChange={(e) => setFormData({ ...formData, systemPrompt: e.target.value })}
                            />
                        </CardContent>
                    </Card>
                </div>

                {/* Inputs Configuration */}
                <div className="space-y-6">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between">
                            <CardTitle>User Inputs</CardTitle>
                            <Button size="sm" variant="outline" onClick={handleAddInput}>
                                <Plus className="h-4 w-4" />
                            </Button>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            {formData.inputs.map((input: any, index: number) => (
                                <div key={index} className="p-4 border rounded-lg bg-slate-50 space-y-3 relative group">
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="absolute top-2 right-2 h-6 w-6 text-slate-400 hover:text-red-500 opacity-0 group-hover:opacity-100"
                                        onClick={() => handleRemoveInput(index)}
                                    >
                                        <Trash2 className="h-3 w-3" />
                                    </Button>

                                    <div className="space-y-1">
                                        <Label className="text-xs">Label</Label>
                                        <Input
                                            className="h-8 text-sm"
                                            value={input.label}
                                            onChange={(e) => handleInputChange(index, "label", e.target.value)}
                                            placeholder="e.g. Target Audience"
                                        />
                                    </div>
                                    <div className="space-y-1">
                                        <Label className="text-xs">Variable Name</Label>
                                        <Input
                                            className="h-8 text-sm font-mono"
                                            value={input.variableName}
                                            onChange={(e) => handleInputChange(index, "variableName", e.target.value)}
                                            placeholder="e.g. audience"
                                        />
                                    </div>
                                    <div className="grid grid-cols-2 gap-2">
                                        <div className="space-y-1">
                                            <Label className="text-xs">Type</Label>
                                            <Select
                                                value={input.type}
                                                onValueChange={(val) => handleInputChange(index, "type", val)}
                                            >
                                                <SelectTrigger className="h-8 text-sm"><SelectValue /></SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="text">Text</SelectItem>
                                                    <SelectItem value="textarea">Textarea</SelectItem>
                                                    <SelectItem value="select">Select</SelectItem>
                                                    <SelectItem value="number">Number</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                        <div className="flex items-center h-full pt-6">
                                            <Switch
                                                checked={input.required}
                                                onCheckedChange={(c) => handleInputChange(index, "required", c)}
                                            />
                                            <span className="text-xs ml-2">Required</span>
                                        </div>
                                    </div>
                                    {input.type === 'select' && (
                                        <div className="space-y-1">
                                            <Label className="text-xs">Options (comma separated)</Label>
                                            <Input
                                                className="h-8 text-sm"
                                                value={input.options?.join(", ")}
                                                onChange={(e) => handleInputChange(index, "options", e.target.value.split(",").map((s: string) => s.trim()))}
                                                placeholder="Option 1, Option 2"
                                            />
                                        </div>
                                    )}
                                </div>
                            ))}
                            {formData.inputs.length === 0 && (
                                <p className="text-sm text-slate-500 text-center py-4">No inputs defined.</p>
                            )}
                        </CardContent>
                    </Card>

                    <Button className="w-full" size="lg" onClick={handleSubmit} disabled={isLoading}>
                        {isLoading ? "Saving..." : "Save Template"}
                    </Button>
                </div>
            </div>
        </div>
    );
}
