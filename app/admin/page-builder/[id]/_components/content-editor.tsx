"use client";

import { useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ImagePicker } from "./image-picker";
import { Plus, Trash2, GripVertical, ChevronDown, ChevronRight } from "lucide-react";
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";

interface ContentEditorProps {
    content: { [key: string]: any };
    onContentChange: (content: { [key: string]: any }) => void;
}

export function ContentEditor({ content, onContentChange }: ContentEditorProps) {
    const [expandedArrays, setExpandedArrays] = useState<Set<string>>(new Set());
    const [newFieldKey, setNewFieldKey] = useState("");
    const [newFieldValue, setNewFieldValue] = useState("");
    const [showAddField, setShowAddField] = useState(false);

    const updateContent = (key: string, value: any) => {
        onContentChange({ ...content, [key]: value });
    };

    const deleteField = (key: string) => {
        const newContent = { ...content };
        delete newContent[key];
        onContentChange(newContent);
    };

    const addCustomField = () => {
        if (!newFieldKey.trim()) return;
        updateContent(newFieldKey, newFieldValue);
        setNewFieldKey("");
        setNewFieldValue("");
        setShowAddField(false);
    };

    const isImageField = (key: string, value: any) => {
        return (
            typeof value === "string" &&
            (key.toLowerCase().includes("image") ||
                key.toLowerCase().includes("logo") ||
                key.toLowerCase().includes("avatar") ||
                key.toLowerCase().includes("thumbnail") ||
                key.toLowerCase().includes("photo") ||
                key.toLowerCase().includes("picture") ||
                value.match(/\.(jpg|jpeg|png|gif|webp|svg)$/i))
        );
    };

    const isArrayField = (value: any) => {
        return Array.isArray(value);
    };

    const parseArrayValue = (value: any) => {
        if (Array.isArray(value)) return value;
        if (typeof value === "string") {
            try {
                const parsed = JSON.parse(value);
                return Array.isArray(parsed) ? parsed : [];
            } catch {
                return [];
            }
        }
        return [];
    };

    const updateArrayItem = (key: string, index: number, field: string, value: any) => {
        const array = parseArrayValue(content[key]);
        const newArray = [...array];
        newArray[index] = { ...newArray[index], [field]: value };
        updateContent(key, JSON.stringify(newArray));
    };

    const addArrayItem = (key: string) => {
        const array = parseArrayValue(content[key]);
        const template = array[0] || {};
        const newItem = Object.keys(template).reduce((acc, k) => {
            acc[k] = "";
            return acc;
        }, {} as any);
        updateContent(key, JSON.stringify([...array, newItem]));
    };

    const removeArrayItem = (key: string, index: number) => {
        const array = parseArrayValue(content[key]);
        const newArray = array.filter((_, i) => i !== index);
        updateContent(key, JSON.stringify(newArray));
    };

    const toggleArrayExpanded = (key: string) => {
        const newExpanded = new Set(expandedArrays);
        if (newExpanded.has(key)) {
            newExpanded.delete(key);
        } else {
            newExpanded.add(key);
        }
        setExpandedArrays(newExpanded);
    };

    const renderArrayEditor = (key: string, value: any) => {
        const array = parseArrayValue(value);
        const isExpanded = expandedArrays.has(key);

        return (
            <div className="space-y-2">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => toggleArrayExpanded(key)}
                            className="h-6 w-6 p-0"
                        >
                            {isExpanded ? (
                                <ChevronDown className="h-4 w-4" />
                            ) : (
                                <ChevronRight className="h-4 w-4" />
                            )}
                        </Button>
                        <Label className="text-sm capitalize mb-0">
                            {key.replace(/([A-Z])/g, " $1").trim()}
                        </Label>
                        <Badge variant="secondary" className="text-xs">
                            {array.length} items
                        </Badge>
                    </div>
                    <div className="flex gap-1">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => addArrayItem(key)}
                            className="h-7 text-xs"
                        >
                            <Plus className="h-3 w-3 mr-1" />
                            Add
                        </Button>
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => deleteField(key)}
                            className="h-7 text-xs text-destructive hover:text-destructive"
                        >
                            <Trash2 className="h-3 w-3" />
                        </Button>
                    </div>
                </div>

                {isExpanded && (
                    <div className="ml-6 space-y-3 border-l-2 border-slate-200 pl-4">
                        {array.map((item: any, index: number) => (
                            <Card key={index} className="p-3 bg-slate-50">
                                <div className="flex items-center justify-between mb-2">
                                    <div className="flex items-center gap-2">
                                        <GripVertical className="h-4 w-4 text-muted-foreground" />
                                        <span className="text-xs font-semibold">Item {index + 1}</span>
                                    </div>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => removeArrayItem(key, index)}
                                        className="h-6 text-xs text-destructive hover:text-destructive"
                                    >
                                        <Trash2 className="h-3 w-3" />
                                    </Button>
                                </div>
                                <div className="space-y-2">
                                    {Object.entries(item).map(([field, fieldValue]) => (
                                        <div key={field}>
                                            <Label className="text-xs capitalize mb-1 block">
                                                {field}
                                            </Label>
                                            {isImageField(field, fieldValue) ? (
                                                <ImagePicker
                                                    label=""
                                                    value={fieldValue as string}
                                                    onChange={(url) => updateArrayItem(key, index, field, url)}
                                                />
                                            ) : (
                                                <Input
                                                    value={fieldValue as string}
                                                    onChange={(e) => updateArrayItem(key, index, field, e.target.value)}
                                                    className="text-xs h-8"
                                                    placeholder={`Enter ${field}`}
                                                />
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </Card>
                        ))}
                    </div>
                )}
            </div>
        );
    };

    const renderField = (key: string, value: any) => {
        // Array fields (features, testimonials, plans, etc.)
        if (isArrayField(value) || (typeof value === "string" && value.startsWith("["))) {
            return renderArrayEditor(key, value);
        }

        // Image fields
        if (isImageField(key, value)) {
            return (
                <div className="flex items-start gap-2">
                    <div className="flex-1">
                        <ImagePicker
                            label={key.replace(/([A-Z])/g, " $1").trim()}
                            value={value as string}
                            onChange={(url) => updateContent(key, url)}
                        />
                    </div>
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => deleteField(key)}
                        className="mt-6 text-destructive hover:text-destructive"
                    >
                        <Trash2 className="h-4 w-4" />
                    </Button>
                </div>
            );
        }

        // Long text fields
        if (typeof value === "string" && value.length > 100) {
            return (
                <div>
                    <div className="flex items-center justify-between mb-2">
                        <Label htmlFor={key} className="text-sm capitalize">
                            {key.replace(/([A-Z])/g, " $1").trim()}
                        </Label>
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => deleteField(key)}
                            className="h-6 text-xs text-destructive hover:text-destructive"
                        >
                            <Trash2 className="h-3 w-3" />
                        </Button>
                    </div>
                    <Textarea
                        id={key}
                        value={value}
                        onChange={(e) => updateContent(key, e.target.value)}
                        rows={4}
                        className="font-mono text-sm"
                    />
                </div>
            );
        }

        // Regular text fields
        return (
            <div>
                <div className="flex items-center justify-between mb-2">
                    <Label htmlFor={key} className="text-sm capitalize">
                        {key.replace(/([A-Z])/g, " $1").trim()}
                    </Label>
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => deleteField(key)}
                        className="h-6 text-xs text-destructive hover:text-destructive"
                    >
                        <Trash2 className="h-3 w-3" />
                    </Button>
                </div>
                <Input
                    id={key}
                    value={value as string}
                    onChange={(e) => updateContent(key, e.target.value)}
                />
            </div>
        );
    };

    return (
        <ScrollArea className="h-full">
            <div className="p-4">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-lg font-semibold">Content Editor</h2>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setShowAddField(!showAddField)}
                    >
                        <Plus className="h-4 w-4 mr-2" />
                        Add Field
                    </Button>
                </div>

                {showAddField && (
                    <Card className="p-4 mb-4 bg-blue-50 border-blue-200">
                        <h3 className="font-semibold text-sm mb-3">Add Custom Field</h3>
                        <div className="space-y-3">
                            <div>
                                <Label className="text-xs">Field Name</Label>
                                <Input
                                    value={newFieldKey}
                                    onChange={(e) => setNewFieldKey(e.target.value)}
                                    placeholder="e.g., customText, extraImage"
                                    className="text-sm"
                                />
                            </div>
                            <div>
                                <Label className="text-xs">Initial Value</Label>
                                <Input
                                    value={newFieldValue}
                                    onChange={(e) => setNewFieldValue(e.target.value)}
                                    placeholder="Enter initial value"
                                    className="text-sm"
                                />
                            </div>
                            <div className="flex gap-2">
                                <Button onClick={addCustomField} size="sm" className="flex-1">
                                    Add Field
                                </Button>
                                <Button
                                    variant="outline"
                                    onClick={() => {
                                        setShowAddField(false);
                                        setNewFieldKey("");
                                        setNewFieldValue("");
                                    }}
                                    size="sm"
                                >
                                    Cancel
                                </Button>
                            </div>
                        </div>
                    </Card>
                )}

                <Card className="p-4">
                    <div className="space-y-4">
                        {Object.entries(content).length === 0 ? (
                            <div className="text-center py-8 text-muted-foreground">
                                <p className="mb-2">No content fields yet</p>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => setShowAddField(true)}
                                >
                                    <Plus className="h-4 w-4 mr-2" />
                                    Add Your First Field
                                </Button>
                            </div>
                        ) : (
                            Object.entries(content).map(([key, value]) => (
                                <div key={key}>{renderField(key, value)}</div>
                            ))
                        )}
                    </div>
                </Card>

                <div className="mt-4 p-3 bg-slate-100 rounded-lg text-xs text-muted-foreground">
                    <p className="font-semibold mb-1">💡 Tips:</p>
                    <ul className="space-y-1 ml-4 list-disc">
                        <li>Click the + button to add custom fields</li>
                        <li>Arrays (features, testimonials) are collapsible</li>
                        <li>Image fields auto-detect and show upload UI</li>
                        <li>Delete any field with the trash icon</li>
                    </ul>
                </div>
            </div>
        </ScrollArea>
    );
}
