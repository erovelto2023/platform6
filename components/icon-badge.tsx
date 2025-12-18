import { LucideIcon } from "lucide-react";

interface IconBadgeProps {
    icon: LucideIcon;
    variant?: "default" | "success";
    size?: "default" | "sm";
};

export const IconBadge = ({
    icon: Icon,
    variant,
    size,
}: IconBadgeProps) => {
    return (
        <div className="bg-sky-100 p-2 rounded-full">
            <Icon className="h-8 w-8 text-sky-700" />
        </div>
    )
};
