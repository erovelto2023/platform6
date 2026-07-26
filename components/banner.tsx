import { AlertTriangle, CheckCircleIcon } from "lucide-react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const bannerVariants = cva(
    "border text-center p-4 text-xs font-mono font-bold flex items-center w-full shadow-lg rounded-2xl",
    {
        variants: {
            variant: {
                warning: "bg-amber-950/90 border-amber-800 text-amber-300",
                success: "bg-emerald-950/90 border-emerald-800 text-emerald-300",
            }
        },
        defaultVariants: {
            variant: "warning",
        }
    }
);

interface BannerProps extends VariantProps<typeof bannerVariants> {
    label: string;
};

const iconMap = {
    warning: AlertTriangle,
    success: CheckCircleIcon,
};

export const Banner = ({
    label,
    variant,
}: BannerProps) => {
    const Icon = iconMap[variant || "warning"];

    return (
        <div className={cn(bannerVariants({ variant }))}>
            <Icon className="h-4 w-4 mr-2.5 shrink-0" />
            <span>{label}</span>
        </div>
    );
};
