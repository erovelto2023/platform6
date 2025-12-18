import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

import { getCourse } from "@/lib/actions/course.actions";
import { getProgress } from "@/lib/actions/progress.actions";
import { CourseSidebarItem } from "./course-sidebar-item";
import { CourseProgress } from "@/components/course-progress";

interface CourseSidebarProps {
    course: any; // Type properly later
    progressCount: number; // Percentage
    completedLessonIds: string[];
}

export const CourseSidebar = async ({
    course,
    progressCount,
    completedLessonIds
}: CourseSidebarProps) => {
    const { userId } = await auth();

    if (!userId) {
        return redirect("/");
    }

    return (
        <div className="h-full border-r flex flex-col overflow-y-auto shadow-sm">
            <div className="p-8 flex flex-col border-b">
                <h1 className="font-semibold">
                    {course.title}
                </h1>
                {progressCount !== null && (
                    <div className="mt-10">
                        <CourseProgress
                            variant={progressCount === 100 ? "success" : "default"}
                            value={progressCount}
                        />
                    </div>
                )}
            </div>
            <div className="flex flex-col w-full">
                {course.modules.map((module: any) => (
                    <div key={module._id}>
                        <div className="px-6 py-4 font-medium text-sm bg-slate-50 border-b">
                            {module.title}
                        </div>
                        {module.lessons.map((lesson: any) => (
                            <CourseSidebarItem
                                key={lesson._id}
                                id={lesson._id}
                                label={lesson.title}
                                isCompleted={completedLessonIds.includes(lesson._id)}
                                courseId={course._id}
                                isLocked={!lesson.isFreePreview && false} // TODO: Add purchase check
                                chapterId={module._id}
                            />
                        ))}
                    </div>
                ))}
            </div>
        </div>
    )
}
