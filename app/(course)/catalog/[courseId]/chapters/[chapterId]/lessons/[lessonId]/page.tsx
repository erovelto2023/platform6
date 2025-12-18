import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

import { getLesson, getModule } from "@/lib/actions/lesson.actions";
import { getCourse } from "@/lib/actions/course.actions";
import { getProgress } from "@/lib/actions/progress.actions";
import { VideoPlayer } from "./_components/video-player";
import { LessonCompleteButton } from "./_components/lesson-complete-button";
import { Separator } from "@/components/ui/separator";
import { File, Download, Music } from "lucide-react";
import { Button } from "@/components/ui/button";

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

    const course = await getCourse(courseId);
    const lesson = await getLesson(courseId, chapterId, lessonId);
    const progress = await getProgress(courseId);

    if (!course || !lesson) {
        return redirect("/");
    }

    const isLocked = !lesson.isFreePreview && false; // TODO: Add purchase check
    const isCompleted = progress?.completedLessons?.includes(lessonId);

    // Logic to find next lesson
    let nextLessonId = null;
    let nextChapterId = null;

    // Find current module index
    const currentModuleIndex = course.modules.findIndex((m: any) => m._id === chapterId);
    const currentModule = course.modules[currentModuleIndex];

    // Find current lesson index in module
    const currentLessonIndex = currentModule.lessons.findIndex((l: any) => l._id === lessonId);

    if (currentLessonIndex < currentModule.lessons.length - 1) {
        // Next lesson is in same module
        nextLessonId = currentModule.lessons[currentLessonIndex + 1]._id;
        nextChapterId = chapterId;
    } else if (currentModuleIndex < course.modules.length - 1) {
        // Next lesson is in next module
        const nextModule = course.modules[currentModuleIndex + 1];
        if (nextModule.lessons.length > 0) {
            nextLessonId = nextModule.lessons[0]._id;
            nextChapterId = nextModule._id;
        }
    }

    return (
        <div>
            <div className="flex flex-col max-w-4xl mx-auto pb-20">
                <div className="p-4">
                    {/* Media Section */}
                    {(lesson.type === 'video' || lesson.type === 'audio') && (
                        <VideoPlayer
                            videoUrl={lesson.videoUrl}
                            isLocked={isLocked}
                        />
                    )}
                </div>

                <div className="p-4 flex flex-col md:flex-row items-center justify-between mt-4">
                    <h2 className="text-2xl font-semibold mb-2">
                        {lesson.title}
                    </h2>
                    <LessonCompleteButton
                        courseId={courseId}
                        lessonId={lessonId}
                        isCompleted={isCompleted}
                        nextLessonId={nextLessonId}
                        nextChapterId={nextChapterId}
                    />
                </div>
                <Separator />

                <div className="p-4 space-y-6">
                    {/* Download Section */}
                    {lesson.type === 'download' && lesson.fileUrl && (
                        <div className="bg-sky-50 border border-sky-100 rounded-lg p-6 flex flex-col items-center justify-center text-center gap-y-4">
                            <div className="h-12 w-12 bg-sky-100 rounded-full flex items-center justify-center text-sky-600">
                                <Download className="h-6 w-6" />
                            </div>
                            <div>
                                <h3 className="text-lg font-medium text-sky-900">Download Lesson Material</h3>
                                <p className="text-sm text-sky-700 mt-1">
                                    Click the button below to download the file for this lesson.
                                </p>
                            </div>
                            <a href={lesson.fileUrl} target="_blank" rel="noopener noreferrer">
                                <Button className="w-full md:w-auto">
                                    Download File
                                </Button>
                            </a>
                        </div>
                    )}

                    {/* Text Content */}
                    {lesson.content && (
                        <div className="text-slate-700 leading-relaxed whitespace-pre-wrap">
                            {lesson.content}
                        </div>
                    )}

                    {/* Attachments */}
                    {lesson.attachments && lesson.attachments.length > 0 && (
                        <div>
                            <h3 className="text-lg font-medium mb-2">Attachments</h3>
                            <div className="flex flex-col gap-y-2">
                                {lesson.attachments.map((attachment: any) => (
                                    <a
                                        key={attachment._id}
                                        href={attachment.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center p-3 w-full bg-sky-100 border-sky-200 border text-sky-700 rounded-md hover:underline"
                                    >
                                        <File className="h-4 w-4 mr-2 flex-shrink-0" />
                                        <p className="text-xs line-clamp-1">
                                            {attachment.title}
                                        </p>
                                    </a>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
