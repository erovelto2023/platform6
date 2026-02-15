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
        return (
            <div className="flex flex-col items-center justify-center h-full p-6 text-center">
                <h1 className="text-2xl font-bold mb-2">No content available</h1>
                <p className="text-muted-foreground">
                    This course does not have any lessons yet. Check back later!
                </p>
            </div>
        );
    }

    return redirect(`/catalog/${courseId}/chapters/${firstModule._id}/lessons/${firstLesson._id}`);
}
