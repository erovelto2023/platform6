import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { getCourse } from "@/lib/actions/course.actions";
import { TitleForm } from "./_components/title-form";
import { DescriptionForm } from "./_components/description-form";
import { ImageForm } from "./_components/image-form";
import { PremiumForm } from "./_components/premium-form";
import { ChaptersForm } from "./_components/chapters-form";
import { LayoutDashboard, ListChecks } from "lucide-react";
import { IconBadge } from "@/components/icon-badge";
import { Banner } from "@/components/banner";
import { CourseActions } from "./_components/course-actions";

export default async function CourseIdPage({
    params
}: {
    params: Promise<{ courseId: string }>
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

    const requiredFields = [
        course.title,
        course.description,
        course.thumbnail,
        course.modules.length > 0
    ];

    const totalFields = requiredFields.length;
    const completedFields = requiredFields.filter(Boolean).length;

    const completionText = `(${completedFields}/${totalFields})`;

    const isComplete = requiredFields.every(Boolean);

    return (
        <div className="min-h-screen bg-slate-950 text-slate-100 p-6 md:p-8 font-sans space-y-6 max-w-7xl mx-auto">
            {!course.isPublished && (
                <Banner
                    label="This course is unpublished. It will not be visible to students."
                />
            )}
            
            <div className="flex items-center justify-between border-b border-slate-800 pb-6">
                <div className="flex flex-col gap-y-1">
                    <h1 className="text-3xl font-black uppercase tracking-tight text-slate-100">
                        Course Setup
                    </h1>
                    <span className="text-xs font-mono font-bold text-slate-400">
                        Complete all required fields {completionText}
                    </span>
                </div>
                <CourseActions
                    disabled={!isComplete}
                    courseId={course._id}
                    isPublished={course.isPublished}
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 pt-4">
                <div className="space-y-6">
                    <div className="flex items-center gap-x-3 border-b border-slate-800 pb-4">
                        <IconBadge icon={LayoutDashboard} />
                        <div>
                            <h2 className="text-xl font-black text-slate-100 uppercase tracking-tight">
                                Customize Your Course
                            </h2>
                            <p className="text-xs font-mono text-slate-400">Course title, description, thumbnail, and pricing access.</p>
                        </div>
                    </div>
                    <TitleForm
                        initialData={course}
                        courseId={course._id}
                    />
                    <DescriptionForm
                        initialData={course}
                        courseId={course._id}
                    />
                    <ImageForm
                        initialData={course}
                        courseId={course._id}
                    />
                    <PremiumForm
                        initialData={course}
                        courseId={course._id}
                    />
                </div>
                <div className="space-y-6">
                    <div className="flex items-center gap-x-3 border-b border-slate-800 pb-4">
                        <IconBadge icon={ListChecks} />
                        <div>
                            <h2 className="text-xl font-black text-slate-100 uppercase tracking-tight">
                                Course Chapters & Lessons
                            </h2>
                            <p className="text-xs font-mono text-slate-400">Organize and structure course curriculum modules.</p>
                        </div>
                    </div>
                    <ChaptersForm
                        initialData={course}
                        courseId={course._id}
                    />
                </div>
            </div>
        </div>
    );
}
