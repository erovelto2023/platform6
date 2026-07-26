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
        <div className="bg-slate-900 border border-slate-800 p-2.5 rounded-2xl text-cyan-400 shadow-md">
            <Icon className="h-6 w-6 text-cyan-400" />
        </div>
    );
};
