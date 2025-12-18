import { getCourse } from "@/lib/actions/course.actions";
import { redirect } from "next/navigation";

export default async function CourseIdPage({
    params
}: {
    params: Promise<{ courseId: string }>
}) {
    const { courseId } = await params;
    const course = await getCourse(courseId);

    if (!course) {
        return redirect("/");
    }

    // Find the first lesson
    const firstModule = course.modules?.[0];
    const firstLesson = firstModule?.lessons?.[0];

    if (!firstModule || !firstLesson) {
        // If no lessons, just stay here or redirect to dashboard? 
        // For now, let's redirect to dashboard if empty
        return redirect("/");
    }

    return redirect(`/catalog/${courseId}/chapters/${firstModule._id}/lessons/${firstLesson._id}`);
}
