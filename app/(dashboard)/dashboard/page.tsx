import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRight, BookOpen, Trophy, Zap } from "lucide-react";
import Link from "next/link";
import { getDashboardCourses } from "@/lib/actions/course.actions";
import { CourseCard } from "@/components/course-card";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { getUserRole } from "@/lib/roles";
import { getPageBySlug } from "@/lib/actions/page-builder.actions";
import { CustomHTMLRenderer } from "@/components/CustomHTMLRenderer";
import { PuckRenderer } from "@/components/PuckRenderer";
import { generateThemeCSS, defaultTheme } from "@/lib/theme-config";

export default async function DashboardPage() {
    const { userId } = await auth();
    if (!userId) return redirect("/");

    const userRole = await getUserRole();

    if (userRole === 'free') {
        const freePage = await getPageBySlug("free-dashboard");
        if (freePage) {
            const themeCSS = generateThemeCSS({ ...defaultTheme, ...(freePage.theme || {}) } as any);
            return (
                <div className="min-h-screen bg-white text-slate-900">
                    <style dangerouslySetInnerHTML={{ __html: themeCSS }} />
                    {freePage.headerCode && (
                        <div dangerouslySetInnerHTML={{ __html: freePage.headerCode }} />
                    )}
                    {freePage.bodyCode && (
                        <div dangerouslySetInnerHTML={{ __html: freePage.bodyCode }} />
                    )}
                    <div className="custom-html-wrapper-dashboard">
                        <style dangerouslySetInnerHTML={{ __html: `
                            .custom-html-wrapper-dashboard {
                                all: revert;
                            }
                        `}} />
                        {freePage.sections?.map((section: any, index: number) => {
                            if (section.templateId === 'puck-blocks' && section.customHTML) {
                                try {
                                    const data = JSON.parse(section.customHTML);
                                    return (
                                        <div key={section._id || index}>
                                            <PuckRenderer data={data} />
                                        </div>
                                    );
                                } catch (e) {
                                    return null;
                                }
                            } else if (section.customHTML) {
                                return (
                                    <CustomHTMLRenderer 
                                        key={section._id || index}
                                        className="custom-html-wrapper-dashboard"
                                        html={section.customHTML}
                                    />
                                );
                            }
                            return null;
                        })}
                    </div>
                    {freePage.footerCode && (
                        <div dangerouslySetInnerHTML={{ __html: freePage.footerCode }} />
                    )}
                </div>
            );
        }

        // Render fallback beautiful premium default free dashboard if no "free-dashboard" exists yet
        return (
            <div className="p-8 lg:p-12 max-w-5xl mx-auto space-y-8 font-sans">
                {/* Header Welcome Card */}
                <div className="relative rounded-3xl p-8 overflow-hidden border border-slate-800 bg-slate-900/60 backdrop-blur-xl text-white">
                    <div className="absolute top-[-50%] right-[-20%] w-96 h-96 bg-indigo-500/10 rounded-full blur-[100px] pointer-events-none" />
                    <span className="text-[10px] font-extrabold uppercase tracking-widest px-3 py-1 rounded-md bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                        Free Member Dashboard
                    </span>
                    <h1 className="text-3xl font-black mt-4 mb-2 tracking-tight">
                        Welcome to KBusiness Academy!
                    </h1>
                    <p className="text-slate-400 text-sm max-w-2xl leading-relaxed">
                        Here is your free workspace where you can access introductory training modules, exclusive tools, and community templates. Get started below!
                    </p>
                    
                    {/* Admin Instructions Banner */}
                    <div className="mt-8 p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-200 text-xs">
                        <span className="font-bold">Creator Notice:</span> You can fully customize this Free Dashboard! Simply go to the <Link href="/admin/page-builder" className="underline font-bold hover:text-amber-100">Page Builder</Link>, create a new page, set its slug to <code className="bg-amber-950/40 px-1.5 py-0.5 rounded text-white font-mono">free-dashboard</code>, design it, and publish it. It will instantly replace this placeholder.
                    </div>
                </div>

                {/* Free Giveaways & Catalog Preview Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm space-y-4">
                        <div className="w-12 h-12 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600">
                            <Zap className="w-6 h-6" />
                        </div>
                        <h3 className="text-lg font-bold text-slate-900">Free Content & Giveaways</h3>
                        <p className="text-slate-500 text-sm leading-relaxed">
                            Upgrade to Premium to unlock our full curriculum, professional writing automated modules, niche boxes, and interactive group chats.
                        </p>
                        <Link href="/upgrade" className="inline-flex items-center gap-2 text-indigo-600 hover:text-indigo-700 text-sm font-bold transition-all">
                            Upgrade to Premium now <ArrowRight className="w-4 h-4" />
                        </Link>
                    </div>

                    <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm space-y-4">
                        <div className="w-12 h-12 rounded-xl bg-orange-50 flex items-center justify-center text-orange-600">
                            <BookOpen className="w-6 h-6" />
                        </div>
                        <h3 className="text-lg font-bold text-slate-900">Browse Free Libraries</h3>
                        <p className="text-slate-500 text-sm leading-relaxed">
                            Discover public guides and vocabulary terms in our community glossary to power up your storytelling skills.
                        </p>
                        <Link href="/glossary" className="inline-flex items-center gap-2 text-orange-600 hover:text-orange-700 text-sm font-bold transition-all">
                            Explore Glossary <ArrowRight className="w-4 h-4" />
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    const { completedCourses, coursesInProgress } = await getDashboardCourses();

    return (
        <div className="p-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="bg-gradient-to-br from-indigo-500 to-sky-600 text-white border-none">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-lg font-medium">Active Courses</CardTitle>
                        <BookOpen className="h-5 w-5 opacity-75" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold">{coursesInProgress.length}</div>
                        <p className="text-xs opacity-75 mt-1">In progress</p>
                    </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-orange-500 to-indigo-600 text-white border-none">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-lg font-medium">Completed</CardTitle>
                        <Trophy className="h-5 w-5 opacity-75" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold">{completedCourses.length}</div>
                        <p className="text-xs opacity-75 mt-1">Courses finished</p>
                    </CardContent>
                </Card>
            </div>

            <div className="space-y-4">
                <h2 className="text-xl font-semibold">My Courses</h2>
                {coursesInProgress.length === 0 && completedCourses.length === 0 ? (
                    <div className="text-center py-10 text-muted-foreground border rounded-md bg-slate-50">
                        <p>No courses started yet.</p>
                        <Link href="/courses" className="text-indigo-600 hover:underline mt-2 inline-block">
                            Browse Catalog <ArrowRight className="inline h-4 w-4 ml-1" />
                        </Link>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        {[...coursesInProgress, ...completedCourses].map((course) => (
                            <CourseCard
                                key={course._id}
                                id={course._id}
                                title={course.title}
                                imageUrl={course.thumbnail!}
                                chaptersLength={course.modules?.length || 0}
                                price={course.price}
                                progress={course.progress}
                                category="Course"
                                description={course.description}
                            />
                        ))}
                    </div>
                )}
            </div>

            <div className="space-y-4">
                <h2 className="text-xl font-semibold">Business Resources</h2>
                    <div className="text-center py-10 text-muted-foreground border rounded-md bg-slate-50">
                        <p>Access our premium library of templates, blueprints, and materials.</p>
                        <Link href="/resources" className="text-indigo-600 hover:underline mt-2 inline-block font-medium">
                            Explore Resources <ArrowRight className="inline h-4 w-4 ml-1" />
                        </Link>
                    </div>
            </div>
        </div>
    );
}
