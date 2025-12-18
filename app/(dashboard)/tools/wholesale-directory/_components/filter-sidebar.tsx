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
            const params = new URLSearchParams(searchParams.toString());
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
        <div className="w-64 flex-shrink-0 space-y-6 pr-4 border-r border-slate-200 h-full overflow-y-auto hidden md:block">
            {/* Supplier Type */}
            <div className="space-y-3">
                <h3 className="font-semibold text-sm text-slate-900">Supplier Type</h3>
                <RadioGroup
                    defaultValue={searchParams.get("type") || "All"}
                    onValueChange={(val) => handleFilterChange("type", val === "All" ? "" : val)}
                >
                    <div className="flex items-center space-x-2">
                        <RadioGroupItem value="All" id="type-all" />
                        <Label htmlFor="type-all">Show Both</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                        <RadioGroupItem value="Dropshipper" id="type-dropship" />
                        <Label htmlFor="type-dropship">Dropshippers Only</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                        <RadioGroupItem value="Light Bulk" id="type-bulk" />
                        <Label htmlFor="type-bulk">Light Bulk Only</Label>
                    </div>
                </RadioGroup>
            </div>

            {/* Sales Channels */}
            <div className="space-y-3">
                <h3 className="font-semibold text-sm text-slate-900">Allows Sales On</h3>
                <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                        <Checkbox
                            id="channel-amazon"
                            checked={searchParams.get("channel") === "Amazon"}
                            onCheckedChange={(checked) => handleFilterChange("channel", checked ? "Amazon" : "")}
                        />
                        <Label htmlFor="channel-amazon">Amazon</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                        <Checkbox
                            id="channel-ebay"
                            checked={searchParams.get("channel") === "eBay"}
                            onCheckedChange={(checked) => handleFilterChange("channel", checked ? "eBay" : "")}
                        />
                        <Label htmlFor="channel-ebay">eBay</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                        <Checkbox
                            id="channel-store"
                            checked={searchParams.get("channel") === "Online Store"}
                            onCheckedChange={(checked) => handleFilterChange("channel", checked ? "Online Store" : "")}
                        />
                        <Label htmlFor="channel-store">Online Store</Label>
                    </div>
                </div>
            </div>

            {/* Location */}
            <div className="space-y-3">
                <h3 className="font-semibold text-sm text-slate-900">Supplier Location</h3>
                <RadioGroup
                    defaultValue={searchParams.get("location") || "Any"}
                    onValueChange={(val) => handleFilterChange("location", val === "Any" ? "" : val)}
                >
                    <div className="flex items-center space-x-2">
                        <RadioGroupItem value="Any" id="loc-any" />
                        <Label htmlFor="loc-any">Any Location</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                        <RadioGroupItem value="USA" id="loc-usa" />
                        <Label htmlFor="loc-usa">USA Only</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                        <RadioGroupItem value="Canada" id="loc-canada" />
                        <Label htmlFor="loc-canada">Canada Only</Label>
                    </div>
                </RadioGroup>
            </div>

            {/* Categories */}
            <div className="space-y-3">
                <h3 className="font-semibold text-sm text-slate-900">Browse by Category</h3>
                <Accordion type="single" collapsible className="w-full">
                    <AccordionItem value="categories" className="border-none">
                        <AccordionTrigger className="py-2 text-sm hover:no-underline">All Categories</AccordionTrigger>
                        <AccordionContent>
                            <div className="space-y-1 pl-2">
                                {WHOLESALE_CATEGORIES.map(cat => (
                                    <Button
                                        key={cat}
                                        variant="ghost"
                                        size="sm"
                                        className={`w-full justify-start h-8 px-2 text-sm ${searchParams.get("category") === cat ? "bg-slate-100 font-medium" : "text-slate-600"}`}
                                        onClick={() => handleFilterChange("category", cat === searchParams.get("category") ? "" : cat)}
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
