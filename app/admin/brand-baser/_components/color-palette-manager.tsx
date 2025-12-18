"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { updateBrandBase } from "@/lib/actions/brand-baser.actions";
import { toast } from "sonner";
import { Plus, Trash2, Copy, Check, Palette } from "lucide-react";

interface ColorPaletteManagerProps {
    brandBase: any;
}

const PRESET_PALETTES = [
    {
        name: "Ocean Blue",
        colors: ["#0EA5E9", "#0284C7", "#0369A1", "#075985", "#0C4A6E"],
    },
    {
        name: "Forest Green",
        colors: ["#10B981", "#059669", "#047857", "#065F46", "#064E3B"],
    },
    {
        name: "Sunset Orange",
        colors: ["#F97316", "#EA580C", "#C2410C", "#9A3412", "#7C2D12"],
    },
    {
        name: "Royal Purple",
        colors: ["#A855F7", "#9333EA", "#7E22CE", "#6B21A8", "#581C87"],
    },
    {
        name: "Modern Grayscale",
        colors: ["#1F2937", "#374151", "#4B5563", "#6B7280", "#9CA3AF"],
    },
];

export const ColorPaletteManager = ({ brandBase }: ColorPaletteManagerProps) => {
    const router = useRouter();
    const [colors, setColors] = useState<string[]>(brandBase.brandColors || []);
    const [newColor, setNewColor] = useState("#6366F1");
    const [isSaving, setIsSaving] = useState(false);
    const [copiedColor, setCopiedColor] = useState<string | null>(null);

    const handleAddColor = () => {
        if (colors.includes(newColor)) {
            toast.error("This color is already in your palette");
            return;
        }
        setColors([...colors, newColor]);
    };

    const handleRemoveColor = (index: number) => {
        setColors(colors.filter((_, i) => i !== index));
    };

    const handleSave = async () => {
        setIsSaving(true);
        try {
            const result = await updateBrandBase(brandBase._id, {
                brandColors: colors,
            });

            if (result.success) {
                toast.success("Brand colors saved!");
                router.refresh();
            } else {
                toast.error(result.error || "Failed to save");
            }
        } catch (error) {
            toast.error("Failed to save");
        } finally {
            setIsSaving(false);
        }
    };

    const handleCopyColor = (color: string) => {
        navigator.clipboard.writeText(color);
        setCopiedColor(color);
        toast.success("Color copied!");
        setTimeout(() => setCopiedColor(null), 2000);
    };

    const handleApplyPreset = (presetColors: string[]) => {
        setColors(presetColors);
        toast.success("Preset applied!");
    };

    return (
        <div className="space-y-6">
            {/* Current Palette */}
            <Card>
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <CardTitle>Your Brand Colors</CardTitle>
                        <Button onClick={handleSave} disabled={isSaving}>
                            {isSaving ? "Saving..." : "Save Changes"}
                        </Button>
                    </div>
                </CardHeader>
                <CardContent>
                    {colors.length === 0 ? (
                        <div className="text-center py-12 border-2 border-dashed rounded-lg">
                            <Palette className="h-12 w-12 text-slate-400 mx-auto mb-3" />
                            <p className="text-slate-600 mb-4">No colors in your palette yet</p>
                            <p className="text-sm text-slate-500">
                                Add colors below or choose from a preset palette
                            </p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                            {colors.map((color, index) => (
                                <div
                                    key={index}
                                    className="group relative rounded-lg overflow-hidden border-2 border-slate-200 hover:border-slate-300 transition"
                                >
                                    <div
                                        className="h-32 w-full"
                                        style={{ backgroundColor: color }}
                                    />
                                    <div className="p-3 bg-white">
                                        <div className="flex items-center justify-between">
                                            <span className="text-sm font-mono font-medium">{color}</span>
                                            <div className="flex gap-1">
                                                <button
                                                    onClick={() => handleCopyColor(color)}
                                                    className="p-1 hover:bg-slate-100 rounded transition"
                                                    title="Copy color"
                                                >
                                                    {copiedColor === color ? (
                                                        <Check className="h-4 w-4 text-emerald-600" />
                                                    ) : (
                                                        <Copy className="h-4 w-4 text-slate-600" />
                                                    )}
                                                </button>
                                                <button
                                                    onClick={() => handleRemoveColor(index)}
                                                    className="p-1 hover:bg-rose-50 rounded transition"
                                                    title="Remove color"
                                                >
                                                    <Trash2 className="h-4 w-4 text-rose-600" />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Add New Color */}
            <Card>
                <CardHeader>
                    <CardTitle>Add New Color</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="flex gap-4 items-end">
                        <div className="flex-1 space-y-2">
                            <Label htmlFor="newColor">Color Picker</Label>
                            <div className="flex gap-3">
                                <Input
                                    id="newColor"
                                    type="color"
                                    value={newColor}
                                    onChange={(e) => setNewColor(e.target.value)}
                                    className="w-20 h-12 cursor-pointer"
                                />
                                <Input
                                    type="text"
                                    value={newColor}
                                    onChange={(e) => setNewColor(e.target.value)}
                                    placeholder="#6366F1"
                                    className="flex-1 font-mono"
                                />
                            </div>
                        </div>
                        <Button onClick={handleAddColor}>
                            <Plus className="h-4 w-4 mr-2" />
                            Add Color
                        </Button>
                    </div>
                </CardContent>
            </Card>

            {/* Preset Palettes */}
            <Card>
                <CardHeader>
                    <CardTitle>Preset Palettes</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        {PRESET_PALETTES.map((preset, index) => (
                            <div
                                key={index}
                                className="flex items-center justify-between p-4 border rounded-lg hover:border-slate-300 transition"
                            >
                                <div className="flex-1">
                                    <h4 className="font-semibold mb-2">{preset.name}</h4>
                                    <div className="flex gap-2">
                                        {preset.colors.map((color, colorIndex) => (
                                            <div
                                                key={colorIndex}
                                                className="w-10 h-10 rounded-md border-2 border-white shadow-sm"
                                                style={{ backgroundColor: color }}
                                                title={color}
                                            />
                                        ))}
                                    </div>
                                </div>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => handleApplyPreset(preset.colors)}
                                >
                                    Apply
                                </Button>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>

            {/* Tips */}
            <Card className="bg-indigo-50 border-indigo-200">
                <CardContent className="p-6">
                    <h3 className="font-semibold mb-2">💡 Color Palette Tips</h3>
                    <ul className="text-sm space-y-1 text-slate-700">
                        <li>• Use 3-5 primary colors for a cohesive brand identity</li>
                        <li>• Include both light and dark variations for flexibility</li>
                        <li>• Test your colors for accessibility and contrast</li>
                        <li>• Copy hex codes to use in your designs and marketing materials</li>
                    </ul>
                </CardContent>
            </Card>
        </div>
    );
};
