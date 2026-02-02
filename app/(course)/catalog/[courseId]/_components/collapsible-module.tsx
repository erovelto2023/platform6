"use client";

import { useState } from "react";
import { ChevronDown, ChevronRight } from "lucide-react";
import { CourseSidebarItem } from "./course-sidebar-item";
import { cn } from "@/lib/utils";

interface CollapsibleModuleProps {
    module: any;
    courseId: string;
    completedLessonIds: string[];
    defaultOpen?: boolean;
}

export const CollapsibleModule = ({
    module,
    courseId,
    completedLessonIds,
    defaultOpen = false
}: CollapsibleModuleProps) => {
    const [isOpen, setIsOpen] = useState(defaultOpen);

    return (
        <div>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full px-6 py-4 font-medium text-sm bg-slate-50 border-b hover:bg-slate-100 transition flex items-center justify-between group"
            >
                <span className="text-left">{module.title}</span>
                {isOpen ? (
                    <ChevronDown className="h-4 w-4 text-slate-500 group-hover:text-slate-700 transition" />
                ) : (
                    <ChevronRight className="h-4 w-4 text-slate-500 group-hover:text-slate-700 transition" />
                )}
            </button>
            <div
                className={cn(
                    "overflow-hidden transition-all duration-300 ease-in-out",
                    isOpen ? "max-h-[2000px] opacity-100" : "max-h-0 opacity-0"
                )}
            >
                {module.lessons.map((lesson: any) => (
                    <CourseSidebarItem
                        key={lesson._id}
                        id={lesson._id}
                        label={lesson.title}
                        isCompleted={completedLessonIds.includes(lesson._id)}
                        courseId={courseId}
                        isLocked={!lesson.isFreePreview && false} // TODO: Add purchase check
                        chapterId={module._id}
                    />
                ))}
            </div>
        </div>
    );
};
