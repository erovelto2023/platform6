import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { getCourse } from "@/lib/actions/course.actions";
import { getProgress } from "@/lib/actions/progress.actions";
import { checkSubscription } from "@/lib/check-subscription";
import { CourseSidebar } from "./_components/course-sidebar";
import { CourseNavbar } from "./_components/course-navbar";

export default async function CourseLayout({
    children,
    params
}: {
    children: React.ReactNode;
    params: Promise<{ courseId: string }>;
}) {
    const { userId } = await auth();

    if (!userId) {
        return redirect("/");
    }

    const { courseId } = await params;
    const course = await getCourse(courseId);

    if (!course) {
        return redirect("/");
    }

    // Check if course is premium and user has subscription
    if (course.isPremium) {
        const hasSubscription = await checkSubscription();
        if (!hasSubscription) {
            return redirect("/upgrade");
        }
    }

    const progress = await getProgress(courseId);
    const progressCount = progress?.progressPercentage || 0;
    const completedLessonIds = progress?.completedLessons || [];

    return (
        <div className="h-full">
            <div className="h-[80px] md:pl-80 fixed inset-y-0 w-full z-50">
                <CourseNavbar
                    course={course}
                    progressCount={progressCount}
                    completedLessonIds={completedLessonIds}
                />
            </div>
            <div className="hidden md:flex h-full w-80 flex-col fixed inset-y-0 z-50">
                <CourseSidebar
                    course={course}
                    progressCount={progressCount}
                    completedLessonIds={completedLessonIds}
                />
            </div>
            <main className="md:pl-80 pt-[80px] h-full">
                {children}
            </main>
        </div>
    )
}
