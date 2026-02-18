"use client";

import { useVideoEditorStore } from "@/hooks/use-video-editor-store";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { Trash2, Type, Sliders, Volume2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export function VideoProperties() {
    const {
        activeClipId,
        activeTextId,
        clips,
        textClips,
        updateClip,
        updateTextClip,
        removeClip,
        removeTextClip
    } = useVideoEditorStore();

    const activeClip = clips.find(c => c.id === activeClipId);
    const activeText = textClips.find(t => t.id === activeTextId);

    if (!activeClip && !activeText) {
        return (
            <div className="h-full flex flex-col items-center justify-center p-6 text-center text-[#ABABAD]">
                <Sliders className="w-8 h-8 mb-2 opacity-20" />
                <p className="text-xs">Select a clip or text on the timeline to edit properties</p>
            </div>
        );
    }

    return (
        <div className="h-full flex flex-col">
            <div className="p-4 border-b border-[#303236] flex items-center justify-between">
                <h3 className="text-sm font-bold uppercase tracking-wider text-[#ABABAD]">
                    {activeClip ? "Media Properties" : "Text Properties"}
                </h3>
                <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-red-500 hover:bg-red-500/10"
                    onClick={() => {
                        if (activeClip) removeClip(activeClip.id);
                        if (activeText) removeTextClip(activeText.id);
                    }}
                >
                    <Trash2 className="w-4 h-4" />
                </Button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-6">
                {activeClip && (
                    <>
                        <div className="space-y-4">
                            <Label className="text-[10px] uppercase text-[#ABABAD]">Name</Label>
                            <Input
                                value={activeClip.name}
                                onChange={(e) => updateClip(activeClip.id, { name: e.target.value })}
                                className="bg-[#2C2E31] border-[#303236] text-xs h-8"
                            />
                        </div>

                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <Label className="text-[10px] uppercase text-[#ABABAD]">Volume</Label>
                                <span className="text-[10px] text-purple-500">{(activeClip.volume || 100)}%</span>
                            </div>
                            <div className="flex items-center gap-4">
                                <Volume2 className="w-4 h-4 text-[#ABABAD]" />
                                <Slider
                                    value={[activeClip.volume || 100]}
                                    max={100}
                                    step={1}
                                    onValueChange={([val]) => updateClip(activeClip.id, { volume: val })}
                                />
                            </div>
                        </div>
                    </>
                )}

                {activeText && (
                    <>
                        <div className="space-y-4">
                            <Label className="text-[10px] uppercase text-[#ABABAD]">Content</Label>
                            <Input
                                value={activeText.text}
                                onChange={(e) => updateTextClip(activeText.id, { text: e.target.value })}
                                className="bg-[#2C2E31] border-[#303236] text-xs h-8"
                            />
                        </div>

                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <Label className="text-[10px] uppercase text-[#ABABAD]">Font Size</Label>
                                <span className="text-[10px] text-purple-500">{activeText.style.fontSize}px</span>
                            </div>
                            <Slider
                                value={[activeText.style.fontSize]}
                                min={12}
                                max={120}
                                step={1}
                                onValueChange={([val]) => updateTextClip(activeText.id, {
                                    style: { ...activeText.style, fontSize: val }
                                })}
                            />
                        </div>

                        <div className="space-y-4">
                            <Label className="text-[10px] uppercase text-[#ABABAD]">Position X (%)</Label>
                            <Slider
                                value={[activeText.style.x]}
                                max={100}
                                step={1}
                                onValueChange={([val]) => updateTextClip(activeText.id, {
                                    style: { ...activeText.style, x: val }
                                })}
                            />
                        </div>

                        <div className="space-y-4">
                            <Label className="text-[10px] uppercase text-[#ABABAD]">Position Y (%)</Label>
                            <Slider
                                value={[activeText.style.y]}
                                max={100}
                                step={1}
                                onValueChange={([val]) => updateTextClip(activeText.id, {
                                    style: { ...activeText.style, y: val }
                                })}
                            />
                        </div>

                        <div className="space-y-4">
                            <Label className="text-[10px] uppercase text-[#ABABAD]">Color</Label>
                            <div className="flex gap-2 flex-wrap">
                                {['#ffffff', '#ff0000', '#00ff00', '#0000ff', '#ffff00', '#ff00ff', '#00ffff'].map(color => (
                                    <button
                                        key={color}
                                        className="w-6 h-6 rounded-full border border-white/10"
                                        style={{ backgroundColor: color }}
                                        onClick={() => updateTextClip(activeText.id, {
                                            style: { ...activeText.style, color }
                                        })}
                                    />
                                ))}
                            </div>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}
