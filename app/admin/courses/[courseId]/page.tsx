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
        <>
            {!course.isPublished && (
                <Banner
                    label="This course is unpublished. It will not be visible to the students."
                />
            )}
            <div className="p-6">
                <div className="flex items-center justify-between">
                    <div className="flex flex-col gap-y-2">
                        <h1 className="text-2xl font-medium">
                            Course setup
                        </h1>
                        <span className="text-sm text-slate-700">
                            Complete all fields {completionText}
                        </span>
                    </div>
                    <CourseActions
                        disabled={!isComplete}
                        courseId={course._id}
                        isPublished={course.isPublished}
                    />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-16">
                    <div>
                        <div className="flex items-center gap-x-2">
                            <IconBadge icon={LayoutDashboard} />
                            <h2 className="text-xl">
                                Customize your course
                            </h2>
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
                        <div>
                            <div className="flex items-center gap-x-2">
                                <IconBadge icon={ListChecks} />
                                <h2 className="text-xl">
                                    Course chapters
                                </h2>
                            </div>
                            <ChaptersForm
                                initialData={course}
                                courseId={course._id}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
