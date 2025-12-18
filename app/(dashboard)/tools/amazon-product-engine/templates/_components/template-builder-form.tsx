"use client";

import { useState, useEffect } from "react";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";

export interface TemplateConfig {
    showImage: boolean;
    showTitle: boolean;
    showPrice: boolean;
    showRating: boolean;
    showButton: boolean;
    buttonText: string;
    buttonColor: string;
    backgroundColor: string;
    borderColor: string;
    borderRadius: number;
    shadow: string;
}

interface TemplateBuilderFormProps {
    config: TemplateConfig;
    onChange: (config: TemplateConfig) => void;
}

export const TemplateBuilderForm = ({ config, onChange }: TemplateBuilderFormProps) => {

    const updateConfig = (key: keyof TemplateConfig, value: any) => {
        onChange({ ...config, [key]: value });
    };

    return (
        <div className="space-y-6 border rounded-lg p-4 bg-slate-50">
            <div className="space-y-4">
                <h3 className="font-medium text-sm text-slate-900">Elements</h3>
                <div className="grid grid-cols-2 gap-4">
                    <div className="flex items-center justify-between">
                        <Label htmlFor="showImage">Image</Label>
                        <Switch
                            id="showImage"
                            checked={config.showImage}
                            onCheckedChange={(v: boolean) => updateConfig("showImage", v)}
                        />
                    </div>
                    <div className="flex items-center justify-between">
                        <Label htmlFor="showTitle">Title</Label>
                        <Switch
                            id="showTitle"
                            checked={config.showTitle}
                            onCheckedChange={(v: boolean) => updateConfig("showTitle", v)}
                        />
                    </div>
                    <div className="flex items-center justify-between">
                        <Label htmlFor="showPrice">Price</Label>
                        <Switch
                            id="showPrice"
                            checked={config.showPrice}
                            onCheckedChange={(v: boolean) => updateConfig("showPrice", v)}
                        />
                    </div>
                    <div className="flex items-center justify-between">
                        <Label htmlFor="showRating">Rating</Label>
                        <Switch
                            id="showRating"
                            checked={config.showRating}
                            onCheckedChange={(v: boolean) => updateConfig("showRating", v)}
                        />
                    </div>
                    <div className="flex items-center justify-between">
                        <Label htmlFor="showButton">Button</Label>
                        <Switch
                            id="showButton"
                            checked={config.showButton}
                            onCheckedChange={(v: boolean) => updateConfig("showButton", v)}
                        />
                    </div>
                </div>
            </div>

            <div className="space-y-4">
                <h3 className="font-medium text-sm text-slate-900">Styling</h3>

                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label>Background</Label>
                        <Select
                            value={config.backgroundColor}
                            onValueChange={(v: string) => updateConfig("backgroundColor", v)}
                        >
                            <SelectTrigger>
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="bg-white">White</SelectItem>
                                <SelectItem value="bg-slate-50">Light Gray</SelectItem>
                                <SelectItem value="bg-yellow-50">Light Yellow</SelectItem>
                                <SelectItem value="bg-blue-50">Light Blue</SelectItem>
                                <SelectItem value="bg-slate-900 text-white">Dark Mode</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-2">
                        <Label>Border Color</Label>
                        <Select
                            value={config.borderColor}
                            onValueChange={(v: string) => updateConfig("borderColor", v)}
                        >
                            <SelectTrigger>
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="border-slate-200">Light Gray</SelectItem>
                                <SelectItem value="border-slate-300">Medium Gray</SelectItem>
                                <SelectItem value="border-orange-200">Orange</SelectItem>
                                <SelectItem value="border-blue-200">Blue</SelectItem>
                                <SelectItem value="border-transparent">None</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-2">
                        <Label>Shadow</Label>
                        <Select
                            value={config.shadow}
                            onValueChange={(v: string) => updateConfig("shadow", v)}
                        >
                            <SelectTrigger>
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="shadow-none">None</SelectItem>
                                <SelectItem value="shadow-sm">Small</SelectItem>
                                <SelectItem value="shadow-md">Medium</SelectItem>
                                <SelectItem value="shadow-lg">Large</SelectItem>
                                <SelectItem value="shadow-xl">Extra Large</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-2">
                        <Label>Button Color</Label>
                        <Select
                            value={config.buttonColor}
                            onValueChange={(v: string) => updateConfig("buttonColor", v)}
                        >
                            <SelectTrigger>
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="bg-yellow-400 hover:bg-yellow-500 text-slate-900">Amazon Yellow</SelectItem>
                                <SelectItem value="bg-orange-500 hover:bg-orange-600 text-white">Orange</SelectItem>
                                <SelectItem value="bg-blue-600 hover:bg-blue-700 text-white">Blue</SelectItem>
                                <SelectItem value="bg-slate-900 hover:bg-slate-800 text-white">Black</SelectItem>
                                <SelectItem value="bg-green-600 hover:bg-green-700 text-white">Green</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                <div className="space-y-2">
                    <Label>Border Radius ({config.borderRadius}px)</Label>
                    <Slider
                        value={[config.borderRadius]}
                        max={24}
                        step={2}
                        onValueChange={(v: number[]) => updateConfig("borderRadius", v[0])}
                    />
                </div>

                {config.showButton && (
                    <div className="space-y-2">
                        <Label>Button Text</Label>
                        <Input
                            value={config.buttonText}
                            onChange={(e) => updateConfig("buttonText", e.target.value)}
                        />
                    </div>
                )}
            </div>
        </div>
    );
};

export const generateHtmlFromConfig = (config: TemplateConfig) => {
    // Map radius number to tailwind class approximation
    const radiusMap: Record<number, string> = {
        0: "rounded-none",
        2: "rounded-sm",
        4: "rounded",
        6: "rounded-md",
        8: "rounded-lg",
        12: "rounded-xl",
        16: "rounded-2xl",
        24: "rounded-3xl"
    };

    const radiusClass = radiusMap[config.borderRadius] || "rounded-lg";

    return `<div class="p-6 border ${config.borderColor} ${radiusClass} ${config.shadow} ${config.backgroundColor} max-w-sm flex flex-col gap-4">
  ${config.showImage ? `<div class="relative w-full h-48 flex items-center justify-center bg-white/50 rounded-md p-2">
    <img src="{{image}}" alt="{{title}}" class="max-h-full max-w-full object-contain mix-blend-multiply" />
  </div>` : ''}
  
  ${config.showTitle ? `<h3 class="font-bold text-lg leading-tight line-clamp-2">${config.backgroundColor.includes('text-white') ? '{{title}}' : '<span class="text-slate-900">{{title}}</span>'}</h3>` : ''}
  
  <div class="flex items-center justify-between mt-auto">
    <div class="flex flex-col">
      ${config.showPrice ? `<span class="text-2xl font-bold ${config.backgroundColor.includes('text-white') ? 'text-white' : 'text-slate-900'}">{{price}}</span>` : ''}
      ${config.showRating ? `<div class="flex items-center gap-1 text-sm ${config.backgroundColor.includes('text-white') ? 'text-slate-300' : 'text-slate-500'}">
        <span class="text-yellow-400">★★★★☆</span>
        <span>{{rating}}</span>
      </div>` : ''}
    </div>
    
    ${config.showButton ? `<a href="{{link}}" target="_blank" rel="nofollow" class="${config.buttonColor} px-4 py-2 rounded-lg font-medium transition-colors text-center shadow-sm">
      ${config.buttonText}
    </a>` : ''}
  </div>
</div>`;
};
