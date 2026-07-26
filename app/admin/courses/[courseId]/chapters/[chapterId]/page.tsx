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
        <div className="min-h-screen bg-slate-950 text-slate-100 p-6 md:p-8 font-sans space-y-6 max-w-7xl mx-auto">
            <div className="flex items-center justify-between border-b border-slate-800 pb-6">
                <div className="w-full">
                    <Link
                        href={`/admin/courses/${courseId}`}
                        className="flex items-center text-xs font-mono font-bold text-cyan-400 hover:text-cyan-300 transition mb-4 w-fit"
                    >
                        <ArrowLeft className="h-4 w-4 mr-1.5" />
                        Back to Course Setup
                    </Link>
                    <div className="flex items-center justify-between w-full">
                        <div className="flex flex-col gap-y-1">
                            <h1 className="text-3xl font-black uppercase tracking-tight text-slate-100">
                                Chapter Setup
                            </h1>
                            <span className="text-xs font-mono font-bold text-slate-400">
                                Complete all fields {completionText}
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 pt-4">
                <div className="space-y-6">
                    <div className="flex items-center gap-x-3 border-b border-slate-800 pb-4">
                        <IconBadge icon={LayoutDashboard} />
                        <div>
                            <h2 className="text-xl font-black text-slate-100 uppercase tracking-tight">
                                Customize Your Chapter
                            </h2>
                            <p className="text-xs font-mono text-slate-400">Manage chapter title and configuration.</p>
                        </div>
                    </div>
                    <ChapterTitleForm
                        initialData={moduleData}
                        courseId={courseId}
                        chapterId={chapterId}
                    />
                </div>
                <div className="space-y-6">
                    <div className="flex items-center gap-x-3 border-b border-slate-800 pb-4">
                        <IconBadge icon={Video} />
                        <div>
                            <h2 className="text-xl font-black text-slate-100 uppercase tracking-tight">
                                Chapter Lessons & Content
                            </h2>
                            <p className="text-xs font-mono text-slate-400">Add and arrange lessons within this chapter.</p>
                        </div>
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
