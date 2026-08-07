"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BoardGameSpaceConfig, SpaceShape, SpaceCategory, SpaceType } from "@/lib/board-game-space-types";
import { updateBoardGameSpace, extractSpaceConfig } from "@/lib/board-game-space-renderer";
import * as fabric from "fabric";
import { Palette, Type, Zap, Settings, Save, RotateCcw } from "lucide-react";
import { toast } from "sonner";

interface SpaceConfigPanelProps {
    selectedObject: fabric.Group | null;
    fabricCanvasRef: React.MutableRefObject<fabric.Canvas | null>;
    onUpdate?: () => void;
}

export const SpaceConfigPanel: React.FC<SpaceConfigPanelProps> = ({
    selectedObject,
    fabricCanvasRef,
    onUpdate,
}) => {
    const [config, setConfig] = useState<BoardGameSpaceConfig | null>(null);
    const [activeTab, setActiveTab] = useState<"appearance" | "content" | "behavior" | "metadata">("appearance");

    // Load config from selected object
    useEffect(() => {
        if (selectedObject) {
            const spaceConfig = extractSpaceConfig(selectedObject);
            if (spaceConfig) {
                setConfig(spaceConfig);
            }
        } else {
            setConfig(null);
        }
    }, [selectedObject]);

    // Update config
    const updateConfig = (updates: Partial<BoardGameSpaceConfig>) => {
        if (!config) return;
        const newConfig = { ...config, ...updates };
        setConfig(newConfig);
    };

    // Apply changes to canvas
    const applyChanges = () => {
        if (!config || !selectedObject) return;
        
        try {
            updateBoardGameSpace(selectedObject, config);
            toast.success("Space updated successfully!");
            onUpdate?.();
        } catch (error) {
            console.error("Error updating space:", error);
            toast.error("Failed to update space");
        }
    };

    // Reset to default
    const resetToDefault = () => {
        if (!config) return;
        
        const defaultConfig: BoardGameSpaceConfig = {
            appearance: {
                shape: "rounded",
                size: 56,
                fill: "#e2e8f0",
                border: { color: "#64748b", width: 2, style: "solid" },
                cornerRadius: 12,
                shadow: { enabled: true, color: "rgba(0,0,0,0.18)", blur: 4, offsetX: 0, offsetY: 2 },
                opacity: 1,
            },
            content: {},
            behavior: { action: "none" },
            metadata: config.metadata,
        };
        
        setConfig(defaultConfig);
        toast.info("Reset to default configuration");
    };

    if (!config) {
        return (
            <div className="p-4 text-center text-sm text-slate-500 dark:text-slate-400">
                Select a board game space to configure
            </div>
        );
    }

    return (
        <div className="space-y-4">
            {/* Header */}
            <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">Space Configuration</h3>
                <div className="flex gap-1">
                    <Button size="sm" variant="ghost" onClick={resetToDefault} className="h-7 w-7 p-0">
                        <RotateCcw className="w-3.5 h-3.5" />
                    </Button>
                    <Button size="sm" onClick={applyChanges} className="h-7 px-2 text-xs">
                        <Save className="w-3 h-3 mr-1" /> Apply
                    </Button>
                </div>
            </div>

            {/* Tabs */}
            <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as any)} className="w-full">
                <TabsList className="grid grid-cols-4 w-full h-8">
                    <TabsTrigger value="appearance" className="text-[10px] gap-1">
                        <Palette className="w-3 h-3" /> Look
                    </TabsTrigger>
                    <TabsTrigger value="content" className="text-[10px] gap-1">
                        <Type className="w-3 h-3" /> Text
                    </TabsTrigger>
                    <TabsTrigger value="behavior" className="text-[10px] gap-1">
                        <Zap className="w-3 h-3" /> Action
                    </TabsTrigger>
                    <TabsTrigger value="metadata" className="text-[10px] gap-1">
                        <Settings className="w-3 h-3" /> Info
                    </TabsTrigger>
                </TabsList>

                {/* Appearance Tab */}
                <TabsContent value="appearance" className="space-y-3 mt-3">
                    <div className="space-y-1.5">
                        <Label className="text-[10px] font-bold">Shape</Label>
                        <Select
                            value={config.appearance.shape}
                            onValueChange={(v) => updateConfig({ appearance: { ...config.appearance, shape: v as SpaceShape } })}
                        >
                            <SelectTrigger className="h-8 text-xs">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="square">Square</SelectItem>
                                <SelectItem value="rounded">Rounded</SelectItem>
                                <SelectItem value="circle">Circle</SelectItem>
                                <SelectItem value="hexagon">Hexagon</SelectItem>
                                <SelectItem value="diamond">Diamond</SelectItem>
                                <SelectItem value="star">Star</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-1.5">
                        <Label className="text-[10px] font-bold">Size: {config.appearance.size}px</Label>
                        <Slider
                            value={[config.appearance.size]}
                            onValueChange={([v]) => updateConfig({ appearance: { ...config.appearance, size: v } })}
                            min={32}
                            max={128}
                            step={4}
                            className="h-6"
                        />
                    </div>

                    <div className="space-y-1.5">
                        <Label className="text-[10px] font-bold">Fill Color</Label>
                        <div className="flex gap-2">
                            <Input
                                type="color"
                                value={config.appearance.fill}
                                onChange={(e) => updateConfig({ appearance: { ...config.appearance, fill: e.target.value } })}
                                className="h-8 w-12 p-0 border-0"
                            />
                            <Input
                                type="text"
                                value={config.appearance.fill}
                                onChange={(e) => updateConfig({ appearance: { ...config.appearance, fill: e.target.value } })}
                                className="h-8 text-xs flex-1"
                            />
                        </div>
                    </div>

                    <div className="space-y-1.5">
                        <Label className="text-[10px] font-bold">Border Color</Label>
                        <div className="flex gap-2">
                            <Input
                                type="color"
                                value={config.appearance.border.color}
                                onChange={(e) => updateConfig({ appearance: { ...config.appearance, border: { ...config.appearance.border, color: e.target.value } } })}
                                className="h-8 w-12 p-0 border-0"
                            />
                            <Input
                                type="text"
                                value={config.appearance.border.color}
                                onChange={(e) => updateConfig({ appearance: { ...config.appearance, border: { ...config.appearance.border, color: e.target.value } } })}
                                className="h-8 text-xs flex-1"
                            />
                        </div>
                    </div>

                    <div className="space-y-1.5">
                        <Label className="text-[10px] font-bold">Border Width: {config.appearance.border.width}px</Label>
                        <Slider
                            value={[config.appearance.border.width]}
                            onValueChange={([v]) => updateConfig({ appearance: { ...config.appearance, border: { ...config.appearance.border, width: v } } })}
                            min={0}
                            max={8}
                            step={0.5}
                            className="h-6"
                        />
                    </div>

                    <div className="space-y-1.5">
                        <Label className="text-[10px] font-bold">Border Style</Label>
                        <Select
                            value={config.appearance.border.style}
                            onValueChange={(v) => updateConfig({ appearance: { ...config.appearance, border: { ...config.appearance.border, style: v as any } } })}
                        >
                            <SelectTrigger className="h-8 text-xs">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="solid">Solid</SelectItem>
                                <SelectItem value="dashed">Dashed</SelectItem>
                                <SelectItem value="dotted">Dotted</SelectItem>
                                <SelectItem value="double">Double</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-1.5">
                        <Label className="text-[10px] font-bold">Corner Radius: {config.appearance.cornerRadius}px</Label>
                        <Slider
                            value={[config.appearance.cornerRadius]}
                            onValueChange={([v]) => updateConfig({ appearance: { ...config.appearance, cornerRadius: v } })}
                            min={0}
                            max={32}
                            step={2}
                            className="h-6"
                        />
                    </div>

                    <div className="space-y-1.5">
                        <Label className="text-[10px] font-bold">Opacity: {Math.round(config.appearance.opacity * 100)}%</Label>
                        <Slider
                            value={[config.appearance.opacity * 100]}
                            onValueChange={([v]) => updateConfig({ appearance: { ...config.appearance, opacity: v / 100 } })}
                            min={0}
                            max={100}
                            step={5}
                            className="h-6"
                        />
                    </div>

                    <div className="space-y-1.5">
                        <div className="flex items-center justify-between">
                            <Label className="text-[10px] font-bold">Shadow</Label>
                            <Switch
                                checked={config.appearance.shadow.enabled}
                                onCheckedChange={(checked) => updateConfig({ appearance: { ...config.appearance, shadow: { ...config.appearance.shadow, enabled: checked } } })}
                            />
                        </div>
                    </div>

                    <div className="space-y-1.5">
                        <Label className="text-[10px] font-bold">Icon/Emoji</Label>
                        <Input
                            value={config.appearance.emoji || config.appearance.icon || ""}
                            onChange={(e) => updateConfig({ appearance: { ...config.appearance, emoji: e.target.value, icon: e.target.value } })}
                            placeholder="🎲"
                            className="h-8 text-xs"
                        />
                    </div>
                </TabsContent>

                {/* Content Tab */}
                <TabsContent value="content" className="space-y-3 mt-3">
                    <div className="space-y-1.5">
                        <Label className="text-[10px] font-bold">Title</Label>
                        <Input
                            value={config.content.title || ""}
                            onChange={(e) => updateConfig({ content: { ...config.content, title: e.target.value } })}
                            placeholder="START"
                            className="h-8 text-xs"
                        />
                    </div>

                    <div className="space-y-1.5">
                        <Label className="text-[10px] font-bold">Subtitle</Label>
                        <Input
                            value={config.content.subtitle || ""}
                            onChange={(e) => updateConfig({ content: { ...config.content, subtitle: e.target.value } })}
                            placeholder="Bonus space"
                            className="h-8 text-xs"
                        />
                    </div>

                    <div className="space-y-1.5">
                        <Label className="text-[10px] font-bold">Description</Label>
                        <Textarea
                            value={config.content.description || ""}
                            onChange={(e) => updateConfig({ content: { ...config.content, description: e.target.value } })}
                            placeholder="Move forward 2 spaces"
                            className="text-xs min-h-[60px]"
                        />
                    </div>

                    <div className="space-y-1.5">
                        <Label className="text-[10px] font-bold">Number</Label>
                        <Input
                            type="number"
                            value={config.content.number || ""}
                            onChange={(e) => updateConfig({ content: { ...config.content, number: e.target.value ? parseInt(e.target.value) : undefined } })}
                            placeholder="1"
                            className="h-8 text-xs"
                        />
                    </div>

                    <div className="space-y-1.5">
                        <Label className="text-[10px] font-bold">Letter</Label>
                        <Input
                            value={config.content.letter || ""}
                            onChange={(e) => updateConfig({ content: { ...config.content, letter: e.target.value } })}
                            placeholder="A"
                            maxLength={1}
                            className="h-8 text-xs"
                        />
                    </div>
                </TabsContent>

                {/* Behavior Tab */}
                <TabsContent value="behavior" className="space-y-3 mt-3">
                    <div className="space-y-1.5">
                        <Label className="text-[10px] font-bold">Action</Label>
                        <Input
                            value={config.behavior.action}
                            onChange={(e) => updateConfig({ behavior: { ...config.behavior, action: e.target.value } })}
                            placeholder="move-forward"
                            className="h-8 text-xs"
                        />
                    </div>

                    <div className="space-y-1.5">
                        <Label className="text-[10px] font-bold">Trigger</Label>
                        <Select
                            value={config.behavior.trigger || "land"}
                            onValueChange={(v) => updateConfig({ behavior: { ...config.behavior, trigger: v as any } })}
                        >
                            <SelectTrigger className="h-8 text-xs">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="land">When Landed On</SelectItem>
                                <SelectItem value="pass">When Passed</SelectItem>
                                <SelectItem value="both">Both</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-1.5">
                        <Label className="text-[10px] font-bold">Value</Label>
                        <Input
                            type="number"
                            value={config.behavior.value || ""}
                            onChange={(e) => updateConfig({ behavior: { ...config.behavior, value: e.target.value ? parseInt(e.target.value) : undefined } })}
                            placeholder="5"
                            className="h-8 text-xs"
                        />
                        <p className="text-[9px] text-slate-500">For movement amounts, points, etc.</p>
                    </div>

                    <div className="space-y-1.5">
                        <Label className="text-[10px] font-bold">Linked Question</Label>
                        <Input
                            value={config.behavior.linkedQuestion || ""}
                            onChange={(e) => updateConfig({ behavior: { ...config.behavior, linkedQuestion: e.target.value } })}
                            placeholder="question-id"
                            className="h-8 text-xs"
                        />
                    </div>

                    <div className="space-y-1.5">
                        <Label className="text-[10px] font-bold">Linked Worksheet</Label>
                        <Input
                            value={config.behavior.linkedWorksheet || ""}
                            onChange={(e) => updateConfig({ behavior: { ...config.behavior, linkedWorksheet: e.target.value } })}
                            placeholder="worksheet-id"
                            className="h-8 text-xs"
                        />
                    </div>
                </TabsContent>

                {/* Metadata Tab */}
                <TabsContent value="metadata" className="space-y-3 mt-3">
                    <div className="space-y-1.5">
                        <Label className="text-[10px] font-bold">Category</Label>
                        <Select
                            value={config.metadata.category}
                            onValueChange={(v) => updateConfig({ metadata: { ...config.metadata, category: v as SpaceCategory } })}
                        >
                            <SelectTrigger className="h-8 text-xs">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="basic">Basic</SelectItem>
                                <SelectItem value="movement">Movement</SelectItem>
                                <SelectItem value="turn-based">Turn-Based</SelectItem>
                                <SelectItem value="dice">Dice</SelectItem>
                                <SelectItem value="question">Question</SelectItem>
                                <SelectItem value="educational">Educational</SelectItem>
                                <SelectItem value="reward">Reward</SelectItem>
                                <SelectItem value="penalty">Penalty</SelectItem>
                                <SelectItem value="card">Card</SelectItem>
                                <SelectItem value="challenge">Challenge</SelectItem>
                                <SelectItem value="mini-game">Mini-Game</SelectItem>
                                <SelectItem value="story">Story</SelectItem>
                                <SelectItem value="adventure">Adventure</SelectItem>
                                <SelectItem value="rpg">RPG</SelectItem>
                                <SelectItem value="economy">Economy</SelectItem>
                                <SelectItem value="team">Team</SelectItem>
                                <SelectItem value="random">Random</SelectItem>
                                <SelectItem value="collection">Collection</SelectItem>
                                <SelectItem value="time-based">Time-Based</SelectItem>
                                <SelectItem value="interactive">Interactive</SelectItem>
                                <SelectItem value="special">Special</SelectItem>
                                <SelectItem value="decorative">Decorative</SelectItem>
                                <SelectItem value="custom">Custom</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-1.5">
                        <Label className="text-[10px] font-bold">Type</Label>
                        <Input
                            value={config.metadata.type}
                            onChange={(e) => updateConfig({ metadata: { ...config.metadata, type: e.target.value as SpaceType } })}
                            className="h-8 text-xs"
                        />
                    </div>

                    <div className="space-y-1.5">
                        <Label className="text-[10px] font-bold">Difficulty</Label>
                        <Select
                            value={config.metadata.difficulty || "medium"}
                            onValueChange={(v) => updateConfig({ metadata: { ...config.metadata, difficulty: v as any } })}
                        >
                            <SelectTrigger className="h-8 text-xs">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="easy">Easy</SelectItem>
                                <SelectItem value="medium">Medium</SelectItem>
                                <SelectItem value="hard">Hard</SelectItem>
                                <SelectItem value="expert">Expert</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-1.5">
                        <Label className="text-[10px] font-bold">Subject</Label>
                        <Input
                            value={config.metadata.subject || ""}
                            onChange={(e) => updateConfig({ metadata: { ...config.metadata, subject: e.target.value } })}
                            placeholder="Math"
                            className="h-8 text-xs"
                        />
                    </div>

                    <div className="space-y-1.5">
                        <Label className="text-[10px] font-bold">Grade Level</Label>
                        <Input
                            value={config.metadata.gradeLevel || ""}
                            onChange={(e) => updateConfig({ metadata: { ...config.metadata, gradeLevel: e.target.value } })}
                            placeholder="3-5"
                            className="h-8 text-xs"
                        />
                    </div>

                    <div className="space-y-1.5">
                        <Label className="text-[10px] font-bold">Theme</Label>
                        <Input
                            value={config.metadata.theme || ""}
                            onChange={(e) => updateConfig({ metadata: { ...config.metadata, theme: e.target.value } })}
                            placeholder="Adventure"
                            className="h-8 text-xs"
                        />
                    </div>

                    <div className="space-y-1.5">
                        <Label className="text-[10px] font-bold">Notes</Label>
                        <Textarea
                            value={config.metadata.notes || ""}
                            onChange={(e) => updateConfig({ metadata: { ...config.metadata, notes: e.target.value } })}
                            placeholder="Additional notes..."
                            className="text-xs min-h-[60px]"
                        />
                    </div>
                </TabsContent>
            </Tabs>
        </div>
    );
};
