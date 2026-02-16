'use client';

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

interface FilterProps {
    paramName: string;
    options: { label: string; value: string }[];
    placeholder?: string;
    defaultValue?: string;
}

export function Filter({ paramName, options, placeholder = "Filter", defaultValue }: FilterProps) {
    const searchParams = useSearchParams();
    const pathname = usePathname();
    const { replace } = useRouter();

    const currentValue = searchParams.get(paramName) || defaultValue;

    const handleFilter = (value: string) => {
        const params = new URLSearchParams(searchParams);

        if (value && value !== 'all') {
            params.set(paramName, value);
        } else {
            params.delete(paramName);
        }

        // Reset page
        params.set('page', '1');

        replace(`${pathname}?${params.toString()}`);
    };

    return (
        <Select
            value={currentValue}
            onValueChange={handleFilter}
        >
            <SelectTrigger className="w-[180px] bg-white">
                <SelectValue placeholder={placeholder} />
            </SelectTrigger>
            <SelectContent>
                <SelectItem value="all">All</SelectItem>
                {options.map((opt) => (
                    <SelectItem key={opt.value} value={opt.value}>
                        {opt.label}
                    </SelectItem>
                ))}
            </SelectContent>
        </Select>
    );
}
