"use client";

import { CheckCircle, Lock, PlayCircle } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";

import { cn } from "@/lib/utils";

interface CourseSidebarItemProps {
    label: string;
    id: string;
    isCompleted: boolean;
    courseId: string;
    isLocked: boolean;
    chapterId: string; // We need chapterId to construct the URL correctly
}

export const CourseSidebarItem = ({
    label,
    id,
    isCompleted,
    courseId,
    isLocked,
    chapterId
}: CourseSidebarItemProps) => {
    const pathname = usePathname();
    const router = useRouter();

    const Icon = isLocked ? Lock : (isCompleted ? CheckCircle : PlayCircle);

    // URL structure: /courses/[courseId]/chapters/[chapterId]/lessons/[lessonId]
    // Wait, my previous structure was just /courses/[courseId] for the detail page.
    // I need to define the player route. Let's use:
    // /courses/[courseId]/chapters/[chapterId]/lessons/[lessonId]

    const isActive = pathname?.includes(id);

    const onClick = () => {
        router.push(`/catalog/${courseId}/chapters/${chapterId}/lessons/${id}`);
    }

    return (
        <button
            onClick={onClick}
            type="button"
            className={cn(
                "flex items-center gap-x-2 text-zinc-400 text-sm font-[500] pl-6 transition-all hover:text-zinc-200 hover:bg-zinc-800/50",
                isActive && "text-white bg-zinc-800/50 hover:bg-zinc-800/50 hover:text-white",
                isCompleted && "text-emerald-400 hover:text-emerald-300",
                isCompleted && isActive && "bg-emerald-500/10",
            )}
        >
            <div className="flex items-center gap-x-2 py-4">
                <Icon
                    size={22}
                    className={cn(
                        "text-zinc-500",
                        isActive && "text-zinc-300",
                        isCompleted && "text-emerald-500"
                    )}
                />
                {label}
            </div>
            <div
                className={cn(
                    "ml-auto opacity-0 border-2 border-slate-700 h-full transition-all",
                    isActive && "opacity-100",
                    isCompleted && "border-emerald-700"
                )}
            />
        </button>
    )
}
