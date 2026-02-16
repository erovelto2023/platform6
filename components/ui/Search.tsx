'use client';

import { Input } from "@/components/ui/input";
import { Search as SearchIcon } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

export function Search({ placeholder = "Search..." }: { placeholder?: string }) {
    const searchParams = useSearchParams();
    const pathname = usePathname();
    const { replace } = useRouter();

    const handleSearch = (term: string) => {
        const params = new URLSearchParams(searchParams);

        if (term) {
            params.set('query', term);
        } else {
            params.delete('query');
        }

        // Reset page to 1 on search
        params.set('page', '1');

        replace(`${pathname}?${params.toString()}`);
    };

    // Simple debounce wrapper
    const debouncedSearch = (term: string) => {
        const handler = setTimeout(() => handleSearch(term), 300);
        return () => clearTimeout(handler);
    };
    // Actually, React usage requires useEffect or a ref for debounce to persist across renders.
    // Let's just use a simple timer in the onChange.

    let debounceTimer: NodeJS.Timeout;
    const onInputChange = (term: string) => {
        clearTimeout(debounceTimer);
        debounceTimer = setTimeout(() => {
            handleSearch(term);
        }, 300);
    };

    return (
        <div className="relative flex-1 flex-shrink-0">
            <SearchIcon className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-500" />
            <Input
                className="pl-9 bg-white"
                placeholder={placeholder}
                onChange={(e) => onInputChange(e.target.value)}
                defaultValue={searchParams.get('query')?.toString()}
            />
        </div>
    );
}
