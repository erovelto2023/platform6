"use client";

import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ThemeEditor } from "./theme-editor";

interface SectionStyle {
    backgroundColor?: string;
    textColor?: string;
    padding?: string;
    margin?: string;
    fontSize?: string;
    fontWeight?: string;
    textAlign?: "left" | "center" | "right";
    borderRadius?: string;
    maxWidth?: string;
}

interface StyleEditorProps {
    style: SectionStyle;
    onStyleChange: (style: SectionStyle) => void;
}

export function StyleEditor({ style, onStyleChange }: StyleEditorProps) {
    const updateStyle = (key: keyof SectionStyle, value: string) => {
        onStyleChange({ ...style, [key]: value });
    };

    const applyTheme = (theme: any) => {
        onStyleChange({
            ...style,
            backgroundColor: theme.colors.background,
            textColor: theme.colors.text,
            padding: theme.spacing.sectionPadding,
            maxWidth: theme.spacing.containerMaxWidth,
        });
    };

    return (
        <ScrollArea className="h-full">
            <div className="p-4">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-lg font-semibold">Style Editor</h2>
                    <ThemeEditor onApplyTheme={applyTheme} />
                </div>

                <div className="space-y-4">
                    <Card className="p-4">
                        <h3 className="font-medium mb-3 text-sm">Colors</h3>
                        <div className="space-y-3">
                            <div>
                                <Label htmlFor="bg-color" className="text-sm mb-2 block">
                                    Background
                                </Label>
                                <div className="flex gap-2">
                                    <Input
                                        id="bg-color"
                                        type="color"
                                        value={style.backgroundColor || "#ffffff"}
                                        onChange={(e) => updateStyle("backgroundColor", e.target.value)}
                                        className="w-20 h-10 p-1 cursor-pointer"
                                    />
                                    <Input
                                        type="text"
                                        value={style.backgroundColor || "#ffffff"}
                                        onChange={(e) => updateStyle("backgroundColor", e.target.value)}
                                        placeholder="#ffffff"
                                    />
                                </div>
                            </div>
                            <div>
                                <Label htmlFor="text-color" className="text-sm mb-2 block">
                                    Text Color
                                </Label>
                                <div className="flex gap-2">
                                    <Input
                                        id="text-color"
                                        type="color"
                                        value={style.textColor || "#000000"}
                                        onChange={(e) => updateStyle("textColor", e.target.value)}
                                        className="w-20 h-10 p-1 cursor-pointer"
                                    />
                                    <Input
                                        type="text"
                                        value={style.textColor || "#000000"}
                                        onChange={(e) => updateStyle("textColor", e.target.value)}
                                        placeholder="#000000"
                                    />
                                </div>
                            </div>
                        </div>
                    </Card>

                    <Card className="p-4">
                        <h3 className="font-medium mb-3 text-sm">Spacing</h3>
                        <div className="space-y-3">
                            <div>
                                <Label htmlFor="padding" className="text-sm mb-2 block">
                                    Padding
                                </Label>
                                <Input
                                    id="padding"
                                    value={style.padding || ""}
                                    onChange={(e) => updateStyle("padding", e.target.value)}
                                    placeholder="4rem 1.5rem"
                                />
                            </div>
                            <div>
                                <Label htmlFor="margin" className="text-sm mb-2 block">
                                    Margin
                                </Label>
                                <Input
                                    id="margin"
                                    value={style.margin || ""}
                                    onChange={(e) => updateStyle("margin", e.target.value)}
                                    placeholder="0"
                                />
                            </div>
                        </div>
                    </Card>

                    <Card className="p-4">
                        <h3 className="font-medium mb-3 text-sm">Typography</h3>
                        <div className="space-y-3">
                            <div>
                                <Label htmlFor="font-size" className="text-sm mb-2 block">
                                    Font Size
                                </Label>
                                <Input
                                    id="font-size"
                                    value={style.fontSize || ""}
                                    onChange={(e) => updateStyle("fontSize", e.target.value)}
                                    placeholder="1rem"
                                />
                            </div>
                            <div>
                                <Label htmlFor="font-weight" className="text-sm mb-2 block">
                                    Font Weight
                                </Label>
                                <Input
                                    id="font-weight"
                                    value={style.fontWeight || ""}
                                    onChange={(e) => updateStyle("fontWeight", e.target.value)}
                                    placeholder="400"
                                />
                            </div>
                            <div>
                                <Label htmlFor="text-align" className="text-sm mb-2 block">
                                    Text Align
                                </Label>
                                <Select
                                    value={style.textAlign || "left"}
                                    onValueChange={(value) => updateStyle("textAlign", value as any)}
                                >
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="left">Left</SelectItem>
                                        <SelectItem value="center">Center</SelectItem>
                                        <SelectItem value="right">Right</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                    </Card>

                    <Card className="p-4">
                        <h3 className="font-medium mb-3 text-sm">Other</h3>
                        <div className="space-y-3">
                            <div>
                                <Label htmlFor="border-radius" className="text-sm mb-2 block">
                                    Border Radius
                                </Label>
                                <Input
                                    id="border-radius"
                                    value={style.borderRadius || ""}
                                    onChange={(e) => updateStyle("borderRadius", e.target.value)}
                                    placeholder="0.5rem"
                                />
                            </div>
                            <div>
                                <Label htmlFor="max-width" className="text-sm mb-2 block">
                                    Max Width
                                </Label>
                                <Input
                                    id="max-width"
                                    value={style.maxWidth || ""}
                                    onChange={(e) => updateStyle("maxWidth", e.target.value)}
                                    placeholder="1200px"
                                />
                            </div>
                        </div>
                    </Card>
                </div>
            </div>
        </ScrollArea>
    );
}
