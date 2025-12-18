"use client";

import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

interface CourseProgressProps {
    value: number;
    variant?: "default" | "success";
    size?: "default" | "sm";
}

const colorByVariant = {
    default: "text-sky-700",
    success: "text-emerald-700",
}

const sizeByVariant = {
    default: "text-sm",
    sm: "text-xs",
}

export const CourseProgress = ({
    value,
    variant = "default",
    size = "default",
}: CourseProgressProps) => {
    return (
        <div>
            <Progress
                className="h-2"
                indicatorClassName={cn(
                    variant === "success" ? "bg-emerald-700" : "bg-sky-700",
                )}
                value={value}
            />
            <p className={cn(
                "font-medium mt-2 text-slate-700",
                colorByVariant[variant],
                sizeByVariant[size],
            )}>
                {Math.round(value)}% Complete
            </p>
        </div>
    )
}
