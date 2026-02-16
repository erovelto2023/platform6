'use client';

import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";

interface BackButtonProps {
    href?: string;
    label?: string;
}

export function BackButton({ href, label = "Back" }: BackButtonProps) {
    const router = useRouter();

    const handleClick = () => {
        if (href) {
            router.push(href);
        } else {
            router.back();
        }
    };

    return (
        <Button
            variant="ghost"
            onClick={handleClick}
            className="flex items-center gap-2 text-slate-500 hover:text-slate-900 px-0 hover:bg-transparent"
        >
            <ArrowLeft className="h-4 w-4" />
            {label}
        </Button>
    );
}
