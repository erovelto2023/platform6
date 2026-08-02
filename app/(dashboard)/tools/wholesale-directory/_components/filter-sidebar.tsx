"use client";

import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Button } from "@/components/ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback } from "react";

import { WHOLESALE_CATEGORIES } from "@/lib/constants/wholesale";

export function FilterSidebar() {
    const router = useRouter();
    const searchParams = useSearchParams();

    const createQueryString = useCallback(
        (name: string, value: string) => {
            const params = new URLSearchParams(searchParams?.toString() || "");
            if (value === null || value === "") {
                params.delete(name);
            } else {
                params.set(name, value);
            }
            return params.toString();
        },
        [searchParams]
    );

    const handleFilterChange = (name: string, value: string) => {
        router.push(`?${createQueryString(name, value)}`);
    };

    return (
        <div className="w-64 flex-shrink-0 space-y-6 pr-4 border-r border-slate-800/80 h-full overflow-y-auto hidden md:block text-slate-200">
            {/* Supplier Type */}
            <div className="space-y-3 bg-slate-900/80 border border-slate-800 p-4 rounded-2xl">
                <h3 className="font-bold text-xs font-mono uppercase tracking-wider text-orange-400">Supplier Type</h3>
                <RadioGroup
                    defaultValue={searchParams?.get("type") || "All"}
                    onValueChange={(val) => handleFilterChange("type", val === "All" ? "" : val)}
                    className="space-y-2"
                >
                    <div className="flex items-center space-x-2">
                        <RadioGroupItem value="All" id="type-all" className="border-slate-600 text-orange-500" />
                        <Label htmlFor="type-all" className="text-xs text-slate-200 cursor-pointer font-medium hover:text-white">Show Both</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                        <RadioGroupItem value="Dropshipper" id="type-dropship" className="border-slate-600 text-orange-500" />
                        <Label htmlFor="type-dropship" className="text-xs text-slate-200 cursor-pointer font-medium hover:text-white">Dropshippers Only</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                        <RadioGroupItem value="Light Bulk" id="type-bulk" className="border-slate-600 text-orange-500" />
                        <Label htmlFor="type-bulk" className="text-xs text-slate-200 cursor-pointer font-medium hover:text-white">Light Bulk Only</Label>
                    </div>
                </RadioGroup>
            </div>

            {/* Sales Channels */}
            <div className="space-y-3 bg-slate-900/80 border border-slate-800 p-4 rounded-2xl">
                <h3 className="font-bold text-xs font-mono uppercase tracking-wider text-orange-400">Allows Sales On</h3>
                <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                        <Checkbox
                            id="channel-amazon"
                            checked={searchParams?.get("channel") === "Amazon"}
                            onCheckedChange={(checked) => handleFilterChange("channel", checked ? "Amazon" : "")}
                            className="border-slate-600 data-[state=checked]:bg-orange-500 data-[state=checked]:border-orange-500"
                        />
                        <Label htmlFor="channel-amazon" className="text-xs text-slate-200 cursor-pointer font-medium hover:text-white">Amazon</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                        <Checkbox
                            id="channel-ebay"
                            checked={searchParams?.get("channel") === "eBay"}
                            onCheckedChange={(checked) => handleFilterChange("channel", checked ? "eBay" : "")}
                            className="border-slate-600 data-[state=checked]:bg-orange-500 data-[state=checked]:border-orange-500"
                        />
                        <Label htmlFor="channel-ebay" className="text-xs text-slate-200 cursor-pointer font-medium hover:text-white">eBay</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                        <Checkbox
                            id="channel-store"
                            checked={searchParams?.get("channel") === "Online Store"}
                            onCheckedChange={(checked) => handleFilterChange("channel", checked ? "Online Store" : "")}
                            className="border-slate-600 data-[state=checked]:bg-orange-500 data-[state=checked]:border-orange-500"
                        />
                        <Label htmlFor="channel-store" className="text-xs text-slate-200 cursor-pointer font-medium hover:text-white">Online Store</Label>
                    </div>
                </div>
            </div>

            {/* Location */}
            <div className="space-y-3 bg-slate-900/80 border border-slate-800 p-4 rounded-2xl">
                <h3 className="font-bold text-xs font-mono uppercase tracking-wider text-orange-400">Supplier Location</h3>
                <RadioGroup
                    defaultValue={searchParams?.get("location") || "Any"}
                    onValueChange={(val) => handleFilterChange("location", val === "Any" ? "" : val)}
                    className="space-y-2"
                >
                    <div className="flex items-center space-x-2">
                        <RadioGroupItem value="Any" id="loc-any" className="border-slate-600 text-orange-500" />
                        <Label htmlFor="loc-any" className="text-xs text-slate-200 cursor-pointer font-medium hover:text-white">Any Location</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                        <RadioGroupItem value="USA" id="loc-usa" className="border-slate-600 text-orange-500" />
                        <Label htmlFor="loc-usa" className="text-xs text-slate-200 cursor-pointer font-medium hover:text-white">USA Only</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                        <RadioGroupItem value="Canada" id="loc-canada" className="border-slate-600 text-orange-500" />
                        <Label htmlFor="loc-canada" className="text-xs text-slate-200 cursor-pointer font-medium hover:text-white">Canada Only</Label>
                    </div>
                </RadioGroup>
            </div>

            {/* Categories */}
            <div className="space-y-3 bg-slate-900/80 border border-slate-800 p-4 rounded-2xl">
                <h3 className="font-bold text-xs font-mono uppercase tracking-wider text-orange-400">Browse by Category</h3>
                <Accordion type="single" collapsible className="w-full">
                    <AccordionItem value="categories" className="border-none">
                        <AccordionTrigger className="py-1.5 text-xs text-slate-300 font-mono hover:no-underline hover:text-amber-400">All Categories</AccordionTrigger>
                        <AccordionContent>
                            <div className="space-y-1 pt-2">
                                {WHOLESALE_CATEGORIES.map(cat => (
                                    <Button
                                        key={cat}
                                        variant="ghost"
                                        size="sm"
                                        className={`w-full justify-start h-7 px-2 text-xs font-mono transition-all ${
                                            searchParams?.get("category") === cat
                                                ? "bg-orange-500/20 text-orange-400 font-bold border border-orange-500/40"
                                                : "text-slate-400 hover:text-slate-100 hover:bg-slate-800/60"
                                        }`}
                                        onClick={() => handleFilterChange("category", cat === searchParams?.get("category") ? "" : cat)}
                                    >
                                        {cat}
                                    </Button>
                                ))}
                            </div>
                        </AccordionContent>
                    </AccordionItem>
                </Accordion>
            </div>
        </div>
    );
}
