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

    const requiredFields = [
        lesson.title,
        lesson.type === 'video' && lesson.videoUrl,
        lesson.type === 'text' && lesson.content,
        lesson.type === 'audio' && lesson.videoUrl, // Reusing videoUrl for audio
        lesson.type === 'download' && lesson.fileUrl,
    ].filter(Boolean);

    const totalFields = requiredFields.length; // This logic is slightly flawed as I'm filtering first, but for now it's just a visual indicator. 
    // Better logic:
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
        <div className="p-6">
            <div className="flex items-center justify-between">
                <div className="w-full">
                    <Link
                        href={`/admin/courses/${courseId}/chapters/${chapterId}`}
                        className="flex items-center text-sm hover:opacity-75 transition mb-6"
                    >
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        Back to chapter setup
                    </Link>
                    <div className="flex items-center justify-between w-full">
                        <div className="flex flex-col gap-y-2">
                            <h1 className="text-2xl font-medium">
                                Lesson Creation
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
                                Customize your lesson
                            </h2>
                        </div>
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
                <div className="space-y-4">
                    {lesson.type === 'video' && (
                        <div>
                            <div className="flex items-center gap-x-2">
                                <IconBadge icon={Video} />
                                <h2 className="text-xl">
                                    Add a video
                                </h2>
                            </div>
                            <LessonVideoForm
                                initialData={lesson}
                                courseId={courseId}
                                chapterId={chapterId}
                                lessonId={lessonId}
                            />
                        </div>
                    )}
                    {lesson.type === 'audio' && (
                        <div>
                            <div className="flex items-center gap-x-2">
                                <IconBadge icon={Music} />
                                <h2 className="text-xl">
                                    Add Audio
                                </h2>
                            </div>
                            <LessonAudioForm
                                initialData={lesson}
                                courseId={courseId}
                                chapterId={chapterId}
                                lessonId={lessonId}
                            />
                        </div>
                    )}
                    {lesson.type === 'text' && (
                        <div>
                            <div className="flex items-center gap-x-2">
                                <IconBadge icon={AlignLeft} />
                                <h2 className="text-xl">
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
                            <div className="flex items-center gap-x-2">
                                <IconBadge icon={File} />
                                <h2 className="text-xl">
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
                        <div className="flex items-center gap-x-2">
                            <IconBadge icon={File} />
                            <h2 className="text-xl">
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
    );
}
