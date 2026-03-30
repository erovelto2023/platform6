'use client';

import React from 'react';
import { Input } from "@/components/ui/input";
import { Search as SearchIcon } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

export function Search({ placeholder = "Search..." }: { placeholder?: string }) {
    const searchParams = useSearchParams();
    const pathname = usePathname();
    const { replace } = useRouter();

    const handleSearch = (term: string) => {
        const params = new URLSearchParams(searchParams?.toString() || "");

        if (term) {
            params.set('query', term);
        } else {
            params.delete('query');
        }

        // Reset page to 1 on search
        params.set('page', '1');

        if (pathname) {
            replace(`${pathname}?${params.toString()}`);
        }
    };

    // Simple debounce wrapper
    const debouncedSearch = (term: string) => {
        const handler = setTimeout(() => handleSearch(term), 300);
        return () => clearTimeout(handler);
    };
    // Actually, React usage requires useEffect or a ref for debounce to persist across renders.
    // Let's just use a simple timer in the onChange.

    const timerRef = React.useRef<NodeJS.Timeout>(null);

    const onInputChange = (term: string) => {
        if (timerRef.current) {
            clearTimeout(timerRef.current);
        }
        timerRef.current = setTimeout(() => {
            handleSearch(term);
        }, 500);
    };

    React.useEffect(() => {
        return () => {
            if (timerRef.current) clearTimeout(timerRef.current);
        };
    }, []);

    return (
        <div className="relative flex-1 flex-shrink-0">
            <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
            <Input
                className="pl-10 bg-slate-900 border-slate-800 text-white placeholder:text-slate-500 rounded-xl h-12 focus:ring-sky-500/20"
                placeholder={placeholder}
                onChange={(e) => onInputChange(e.target.value)}
                defaultValue={searchParams?.get('query')?.toString()}
            />
        </div>
    );
}
