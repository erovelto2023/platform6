import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { getLesson } from "@/lib/actions/lesson.actions";
import Link from "next/link";
import { ArrowLeft, Eye, LayoutDashboard, Video, File, AlignLeft, Music } from "lucide-react";
import { IconBadge } from "@/components/icon-badge";
import { LessonTitleForm } from "./_components/lesson-title-form";
import { LessonVideoForm } from "./_components/lesson-video-form";
import { LessonTypeForm } from "./_components/lesson-type-form";
import { LessonDescriptionForm } from "./_components/lesson-description-form";
import { LessonAttachmentForm } from "./_components/lesson-attachment-form";
import { LessonAudioForm } from "./_components/lesson-audio-form";
import { LessonResourcesForm } from "./_components/lesson-resources-form";
import { VideoPlayer } from "@/app/(course)/catalog/[courseId]/chapters/[chapterId]/lessons/[lessonId]/_components/video-player";

export default async function LessonIdPage({
    params
}: {
    params: Promise<{ courseId: string; chapterId: string; lessonId: string }>
}) {
    const { userId } = await auth();

    if (!userId) {
        return redirect("/");
    }

    const { courseId, chapterId, lessonId } = await params;
    const lesson = await getLesson(courseId, chapterId, lessonId);

    if (!lesson) {
        return redirect("/");
    }

    let totalRequired = 2; // Title + Content
    let completedCount = 0;
    if (lesson.title) completedCount++;

    if (lesson.type === 'video' || lesson.type === 'audio') {
        if (lesson.videoUrl) completedCount++;
    } else if (lesson.type === 'text') {
        if (lesson.content) completedCount++;
    } else if (lesson.type === 'download') {
        if (lesson.fileUrl) completedCount++;
    }

    const completionText = `(${completedCount}/${totalRequired})`;

    return (
        <div className="p-6 md:p-8 bg-slate-950 min-h-screen text-slate-100 font-sans selection:bg-orange-500 selection:text-slate-950">
            <div className="max-w-6xl mx-auto space-y-8">
                <div className="flex items-center justify-between border-b border-slate-800 pb-6">
                    <div className="w-full space-y-2">
                        <Link
                            href={`/admin/courses/${courseId}/chapters/${chapterId}`}
                            className="inline-flex items-center text-xs font-mono font-bold text-orange-400 hover:text-amber-300 transition"
                        >
                            <ArrowLeft className="h-4 w-4 mr-2" />
                            Back to Chapter Setup
                        </Link>
                        <div className="flex items-center justify-between w-full pt-1">
                            <div className="flex flex-col gap-y-1">
                                <h1 className="text-2xl md:text-3xl font-black text-slate-100 uppercase tracking-tight">
                                    Lesson Editor
                                </h1>
                                <span className="text-xs font-mono text-slate-400">
                                    Complete all required fields <span className="text-amber-400 font-bold">{completionText}</span>
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-6">
                        <div>
                            <div className="flex items-center gap-x-2 mb-4">
                                <IconBadge icon={LayoutDashboard} />
                                <h2 className="text-lg font-mono font-bold text-slate-100 uppercase tracking-wider">
                                    Customize Your Lesson
                                </h2>
                            </div>
                            <div className="space-y-4">
                                <LessonTitleForm
                                    initialData={lesson}
                                    courseId={courseId}
                                    chapterId={chapterId}
                                    lessonId={lessonId}
                                />
                                <LessonTypeForm
                                    initialData={lesson}
                                    courseId={courseId}
                                    chapterId={chapterId}
                                    lessonId={lessonId}
                                />
                            </div>
                        </div>
                    </div>

                    <div className="space-y-6">
                        {lesson.type === 'video' && (
                            <div>
                                <div className="flex items-center gap-x-2 mb-4">
                                    <IconBadge icon={Video} />
                                    <h2 className="text-lg font-mono font-bold text-slate-100 uppercase tracking-wider">
                                        Add a Video
                                    </h2>
                                </div>
                                <LessonVideoForm
                                    initialData={lesson}
                                    courseId={courseId}
                                    chapterId={chapterId}
                                    lessonId={lessonId}
                                />
                                {lesson.videoUrl && (
                                    <div className="mt-4 bg-slate-900 border border-slate-800 rounded-2xl p-4">
                                        <div className="flex items-center gap-x-2 mb-2">
                                            <IconBadge icon={Eye} variant="success" />
                                            <h3 className="text-sm font-mono font-bold text-slate-200">
                                                Video Preview
                                            </h3>
                                        </div>
                                        <VideoPlayer
                                            videoUrl={lesson.videoUrl}
                                            isLocked={false}
                                        />
                                    </div>
                                )}
                            </div>
                        )}

                        {lesson.type === 'audio' && (
                            <div>
                                <div className="flex items-center gap-x-2 mb-4">
                                    <IconBadge icon={Music} />
                                    <h2 className="text-lg font-mono font-bold text-slate-100 uppercase tracking-wider">
                                        Add Audio
                                    </h2>
                                </div>
                                <LessonAudioForm
                                    initialData={lesson}
                                    courseId={courseId}
                                    chapterId={chapterId}
                                    lessonId={lessonId}
                                />
                                {lesson.videoUrl && (
                                    <div className="mt-4 bg-slate-900 border border-slate-800 rounded-2xl p-4">
                                        <div className="flex items-center gap-x-2 mb-2">
                                            <IconBadge icon={Eye} variant="success" />
                                            <h3 className="text-sm font-mono font-bold text-slate-200">
                                                Audio Preview
                                            </h3>
                                        </div>
                                        <VideoPlayer
                                            videoUrl={lesson.videoUrl}
                                            isLocked={false}
                                        />
                                    </div>
                                )}
                            </div>
                        )}

                        {lesson.type === 'text' && (
                            <div>
                                <div className="flex items-center gap-x-2 mb-4">
                                    <IconBadge icon={AlignLeft} />
                                    <h2 className="text-lg font-mono font-bold text-slate-100 uppercase tracking-wider">
                                        Lecture Content
                                    </h2>
                                </div>
                                <LessonDescriptionForm
                                    initialData={lesson}
                                    courseId={courseId}
                                    chapterId={chapterId}
                                    lessonId={lessonId}
                                />
                            </div>
                        )}

                        {lesson.type === 'download' && (
                            <div>
                                <div className="flex items-center gap-x-2 mb-4">
                                    <IconBadge icon={File} />
                                    <h2 className="text-lg font-mono font-bold text-slate-100 uppercase tracking-wider">
                                        Downloadable File
                                    </h2>
                                </div>
                                <LessonAttachmentForm
                                    initialData={lesson}
                                    courseId={courseId}
                                    chapterId={chapterId}
                                    lessonId={lessonId}
                                />
                            </div>
                        )}

                        <div>
                            <div className="flex items-center gap-x-2 mb-4">
                                <IconBadge icon={File} />
                                <h2 className="text-lg font-mono font-bold text-slate-100 uppercase tracking-wider">
                                    Resources & Attachments
                                </h2>
                            </div>
                            <LessonResourcesForm
                                initialData={lesson}
                                courseId={courseId}
                                chapterId={chapterId}
                                lessonId={lessonId}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
