"use client";

import { useRouter, usePathname, useSearchParams } from "next/navigation";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { useState } from "react";

export function ResourceFilters() {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    const [search, setSearch] = useState(searchParams?.get("q") || "");

    const updateUrl = (key: string, value: string | null) => {
        const params = new URLSearchParams(searchParams?.toString() || "");
        if (value) {
            params.set(key, value);
        } else {
            params.delete(key);
        }
        router.push(`${pathname}?${params.toString()}`);
    };

    const handleSearch = () => {
        updateUrl("q", search);
    };

    return (
        <div className="flex flex-col md:flex-row gap-4 mb-6 p-4 bg-white rounded-lg border border-slate-200">
            {/* Search */}
            <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <Input
                    placeholder="Search resources..."
                    className="pl-9"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    onKeyDown={(e) => {
                        if (e.key === 'Enter') handleSearch();
                    }}
                    onBlur={handleSearch}
                />
            </div>

            <div className="flex gap-4">
                {/* Type Filter */}
                <Select
                    value={searchParams?.get("resourceType") || "all"}
                    onValueChange={(val) => updateUrl("resourceType", val === "all" ? null : val)}
                >
                    <SelectTrigger className="w-[140px]">
                        <SelectValue placeholder="Type" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All Types</SelectItem>
                        <SelectItem value="Link">Link</SelectItem>
                        <SelectItem value="File">File</SelectItem>
                        <SelectItem value="Video">Video</SelectItem>
                        <SelectItem value="Audio">Audio</SelectItem>
                        <SelectItem value="Document">Document</SelectItem>
                        <SelectItem value="Tool">Tool</SelectItem>
                        <SelectItem value="Template">Template</SelectItem>
                        <SelectItem value="Checklist">Checklist</SelectItem>
                        <SelectItem value="Course">Course</SelectItem>
                        <SelectItem value="Lesson">Lesson</SelectItem>
                    </SelectContent>
                </Select>

                {/* Difficulty Filter */}
                <Select
                    value={searchParams?.get("difficulty") || "all"}
                    onValueChange={(val) => updateUrl("difficulty", val === "all" ? null : val)}
                >
                    <SelectTrigger className="w-[140px]">
                        <SelectValue placeholder="Difficulty" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">Any Difficulty</SelectItem>
                        <SelectItem value="Beginner">Beginner</SelectItem>
                        <SelectItem value="Intermediate">Intermediate</SelectItem>
                        <SelectItem value="Advanced">Advanced</SelectItem>
                    </SelectContent>
                </Select>

                {/* Pricing Filter */}
                <Select
                    value={searchParams?.get("pricing") || "all"}
                    onValueChange={(val) => updateUrl("pricing", val === "all" ? null : val)}
                >
                    <SelectTrigger className="w-[140px]">
                        <SelectValue placeholder="Pricing" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">Any Pricing</SelectItem>
                        <SelectItem value="Free">Free</SelectItem>
                        <SelectItem value="Freemium">Freemium</SelectItem>
                        <SelectItem value="Paid">Paid</SelectItem>
                    </SelectContent>
                </Select>
            </div>
        </div>
    );
}
