import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { getModule } from "@/lib/actions/lesson.actions";
import Link from "next/link";
import { ArrowLeft, Eye, LayoutDashboard, Video } from "lucide-react";
import { IconBadge } from "@/components/icon-badge";
import { ChapterTitleForm } from "./_components/chapter-title-form";
import { LessonsForm } from "./_components/lessons-form";

export default async function ChapterIdPage({
    params
}: {
    params: Promise<{ courseId: string; chapterId: string }>
}) {
    const { userId } = await auth();

    if (!userId) {
        return redirect("/");
    }

    const { courseId, chapterId } = await params;
    const moduleData = await getModule(courseId, chapterId);

    if (!moduleData) {
        return redirect("/");
    }

    const requiredFields = [
        moduleData.title,
        moduleData.lessons.length > 0,
    ];

    const totalFields = requiredFields.length;
    const completedFields = requiredFields.filter(Boolean).length;

    const completionText = `(${completedFields}/${totalFields})`;

    return (
        <div className="p-6">
            <div className="flex items-center justify-between">
                <div className="w-full">
                    <Link
                        href={`/admin/courses/${courseId}`}
                        className="flex items-center text-sm hover:opacity-75 transition mb-6"
                    >
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        Back to course setup
                    </Link>
                    <div className="flex items-center justify-between w-full">
                        <div className="flex flex-col gap-y-2">
                            <h1 className="text-2xl font-medium">
                                Chapter Creation
                            </h1>
                            <span className="text-sm text-slate-700">
                                Complete all fields {completionText}
                            </span>
                        </div>
                    </div>
                </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-16">
                <div className="space-y-4">
                    <div>
                        <div className="flex items-center gap-x-2">
                            <IconBadge icon={LayoutDashboard} />
                            <h2 className="text-xl">
                                Customize your chapter
                            </h2>
                        </div>
                        <ChapterTitleForm
                            initialData={moduleData}
                            courseId={courseId}
                            chapterId={chapterId}
                        />
                    </div>
                </div>
                <div>
                    <div className="flex items-center gap-x-2">
                        <IconBadge icon={Video} />
                        <h2 className="text-xl">
                            Add a video
                        </h2>
                    </div>
                    <LessonsForm
                        initialData={moduleData}
                        courseId={courseId}
                        chapterId={chapterId}
                    />
                </div>
            </div>
        </div>
    );
}
