import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { getUserRole } from "@/lib/roles";

import { getLesson, getModule } from "@/lib/actions/lesson.actions";
import { getCourse } from "@/lib/actions/course.actions";
import { getProgress } from "@/lib/actions/progress.actions";
import { VideoPlayer } from "./_components/video-player";
import { LessonCompleteButton } from "./_components/lesson-complete-button";
import { Separator } from "@/components/ui/separator";
import { File, Download, Music, Lock, Key, ArrowRight, ShieldAlert } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default async function LessonIdPage({
    params
}: {
    params: Promise<{ courseId: string; chapterId: string; lessonId: string }>
}) {
    const { userId } = await auth();
    const { courseId, chapterId, lessonId } = await params;

    const course = await getCourse(courseId);
    const lesson = await getLesson(courseId, chapterId, lessonId);

    if (!course || !lesson) {
        return redirect("/");
    }

    const role = userId ? await getUserRole() : "free";

    // Determine if course is free or paid
    const isFreeCourse = !course.isPremium && (!course.price || course.price === 0);
    const isFreeLesson = Boolean(lesson.isFreePreview || isFreeCourse);

    const hasFullAccess = role === "admin" || role === "student";
    const isLocked = !hasFullAccess && !isFreeLesson;

    const progress = userId ? await getProgress(courseId) : null;
    const isCompleted = progress?.completedLessons?.includes(lessonId) || false;

    // Logic to find next lesson
    let nextLessonId = null;
    let nextChapterId = null;

    const currentModuleIndex = course.modules?.findIndex((m: any) => m._id === chapterId) ?? -1;
    if (currentModuleIndex !== -1 && course.modules?.[currentModuleIndex]) {
        const currentModule = course.modules[currentModuleIndex];
        const currentLessonIndex = currentModule.lessons?.findIndex((l: any) => l._id === lessonId) ?? -1;

        if (currentLessonIndex !== -1 && currentLessonIndex < currentModule.lessons.length - 1) {
            nextLessonId = currentModule.lessons[currentLessonIndex + 1]._id;
            nextChapterId = chapterId;
        } else if (currentModuleIndex < course.modules.length - 1) {
            const nextModule = course.modules[currentModuleIndex + 1];
            if (nextModule.lessons?.length > 0) {
                nextLessonId = nextModule.lessons[0]._id;
                nextChapterId = nextModule._id;
            }
        }
    }

    return (
        <div className="bg-slate-950 min-h-screen text-slate-100 font-sans selection:bg-orange-500 selection:text-slate-950">
            <div className="flex flex-col max-w-5xl mx-auto p-4 md:p-8 pb-20 space-y-6">
                
                {/* LOCKED CONTENT OVERLAY SCREEN FOR PAID COURSES */}
                {isLocked ? (
                    <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 md:p-12 text-center shadow-2xl space-y-6 my-6 relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none text-orange-400">
                            <Lock size={180} />
                        </div>

                        <div className="inline-flex items-center justify-center h-16 w-16 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-400 mx-auto">
                            <Lock size={32} />
                        </div>

                        <div className="max-w-xl mx-auto space-y-2">
                            <span className="text-xs font-mono font-bold text-orange-400 uppercase tracking-widest bg-orange-500/10 px-3 py-1 rounded-full border border-orange-500/20">
                                STUDENT MEMBERSHIP REQUIRED
                            </span>
                            <h2 className="text-2xl md:text-4xl font-black uppercase text-slate-100 tracking-tight pt-2">
                                {course.title} is Locked
                            </h2>
                            <p className="text-sm font-mono text-slate-300 leading-relaxed pt-1">
                                This premium course is exclusive to Student All-Access Members. Upgrade your membership or sign in to unlock all lessons, downloads, and resources.
                            </p>
                        </div>

                        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4 max-w-md mx-auto">
                            <Button 
                                asChild
                                className="w-full bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-400 hover:to-amber-500 text-slate-950 font-black font-mono text-xs uppercase tracking-wider h-12 rounded-xl shadow-lg cursor-pointer flex items-center justify-center gap-2"
                            >
                                <Link href="/my-products">
                                    <ShieldAlert className="h-4 w-4" />
                                    Upgrade to Student Membership
                                    <ArrowRight className="h-4 w-4 ml-1" />
                                </Link>
                            </Button>

                            {!userId && (
                                <Button 
                                    asChild
                                    variant="outline"
                                    className="w-full bg-slate-950 border-slate-800 text-slate-200 hover:bg-slate-800 hover:text-white font-mono text-xs font-bold h-12 rounded-xl cursor-pointer flex items-center justify-center gap-2"
                                >
                                    <Link href={`/sign-in?redirect_url=/catalog/${courseId}/chapters/${chapterId}/lessons/${lessonId}`}>
                                        <Key className="h-4 w-4 text-amber-400" />
                                        Sign In to Access
                                    </Link>
                                </Button>
                            )}
                        </div>
                    </div>
                ) : (
                    <>
                        {/* Media Section */}
                        {(lesson.type === 'video' || lesson.type === 'audio') && (
                            <div className="rounded-2xl overflow-hidden border border-slate-800 shadow-2xl bg-slate-900">
                                <VideoPlayer
                                    videoUrl={lesson.videoUrl}
                                    isLocked={false}
                                />
                            </div>
                        )}

                        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pt-2">
                            <div>
                                <span className="text-[10px] font-mono font-bold uppercase tracking-widest px-2.5 py-1 rounded-md bg-emerald-950 text-emerald-400 border border-emerald-800">
                                    {isFreeCourse ? "Free Course Lesson" : "Student Masterclass"}
                                </span>
                                <h1 className="text-2xl md:text-3xl font-black text-slate-100 tracking-tight mt-2">
                                    {lesson.title}
                                </h1>
                            </div>
                            
                            {userId && (
                                <LessonCompleteButton
                                    courseId={courseId}
                                    lessonId={lessonId}
                                    isCompleted={isCompleted}
                                    nextLessonId={nextLessonId}
                                    nextChapterId={nextChapterId}
                                />
                            )}
                        </div>
                        
                        <Separator className="bg-slate-800" />

                        {/* Lecture Content Text */}
                        {lesson.type === 'text' && lesson.content && (
                            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 md:p-8 space-y-4 shadow-xl">
                                <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-orange-400">Lesson Material</h3>
                                <div className="text-sm font-sans text-slate-200 leading-relaxed whitespace-pre-wrap">
                                    {lesson.content}
                                </div>
                            </div>
                        )}

                        {/* Download Section */}
                        {lesson.type === 'download' && lesson.fileUrl && (
                            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 flex flex-col items-center justify-center text-center gap-y-4 shadow-xl">
                                <div className="h-14 w-14 bg-orange-500/20 border border-orange-500/30 rounded-2xl flex items-center justify-center text-orange-400">
                                    <Download className="h-7 w-7" />
                                </div>
                                <div className="max-w-md space-y-1">
                                    <h3 className="text-lg font-bold text-slate-100 font-mono">Download Lesson Resource</h3>
                                    <p className="text-xs font-mono text-slate-400">
                                        Click the button below to download the material for this lesson.
                                    </p>
                                </div>
                                <a
                                    href={lesson.fileUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-orange-500 hover:bg-orange-400 text-slate-950 font-black font-mono text-xs uppercase tracking-wider transition shadow-lg"
                                >
                                    <File className="h-4 w-4" />
                                    Download {lesson.fileName || "File"}
                                </a>
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
}
