"use client";

import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";

export function MemberSearch() {
    const router = useRouter();
    const searchParams = useSearchParams();

    const [query, setQuery] = useState(searchParams.get("q") || "");
    const [role, setRole] = useState(searchParams.get("role") || "all");
    const [sort, setSort] = useState(searchParams.get("sort") || "relevance");

    useEffect(() => {
        const timer = setTimeout(() => {
            const params = new URLSearchParams(searchParams.toString());
            if (query) params.set("q", query);
            else params.delete("q");

            if (role && role !== "all") params.set("role", role);
            else params.delete("role");

            if (sort) params.set("sort", sort);

            router.push(`?${params.toString()}`);
        }, 500);

        return () => clearTimeout(timer);
    }, [query, role, sort, router, searchParams]);

    return (
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm mb-6 space-y-4 md:space-y-0 md:flex md:items-center md:gap-4">
            <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <Input
                    placeholder="Search members by name, bio, skills..."
                    className="pl-10"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                />
            </div>

            <div className="flex gap-2">
                <Select value={role} onValueChange={setRole}>
                    <SelectTrigger className="w-[140px]">
                        <SelectValue placeholder="Role" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All Roles</SelectItem>
                        <SelectItem value="student">Student</SelectItem>
                        <SelectItem value="admin">Admin</SelectItem>
                    </SelectContent>
                </Select>

                <Select value={sort} onValueChange={setSort}>
                    <SelectTrigger className="w-[160px]">
                        <SelectValue placeholder="Sort by" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="relevance">Relevance</SelectItem>
                        <SelectItem value="newest">Newest</SelectItem>
                        <SelectItem value="last_active">Recently Active</SelectItem>
                        <SelectItem value="alphabetical">A-Z</SelectItem>
                    </SelectContent>
                </Select>
            </div>
        </div>
    );
}
