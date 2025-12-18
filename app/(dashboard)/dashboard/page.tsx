import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRight, BookOpen, Trophy, Zap } from "lucide-react";
import Link from "next/link";
import { getDashboardCourses } from "@/lib/actions/course.actions";
import { getNicheBoxes } from "@/lib/actions/niche.actions";
import { CourseCard } from "@/components/course-card";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export default async function DashboardPage() {
    const { userId } = await auth();
    if (!userId) return redirect("/");

    const { completedCourses, coursesInProgress } = await getDashboardCourses();
    const nicheBoxes = await getNicheBoxes();

    return (
        <div className="p-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="bg-gradient-to-br from-indigo-500 to-purple-600 text-white border-none">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-lg font-medium">Active Courses</CardTitle>
                        <BookOpen className="h-5 w-5 opacity-75" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold">{coursesInProgress.length}</div>
                        <p className="text-xs opacity-75 mt-1">In progress</p>
                    </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-emerald-500 to-teal-600 text-white border-none">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-lg font-medium">Niche Boxes</CardTitle>
                        <Zap className="h-5 w-5 opacity-75" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold">{nicheBoxes.length}</div>
                        <p className="text-xs opacity-75 mt-1">Unlocked businesses</p>
                    </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-orange-500 to-pink-600 text-white border-none">
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
                <h2 className="text-xl font-semibold">Recommended Niches</h2>
                {nicheBoxes.length === 0 ? (
                    <div className="text-center py-10 text-muted-foreground border rounded-md bg-slate-50">
                        <p>No niche boxes available yet.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {nicheBoxes.slice(0, 3).map((niche) => (
                            <Link href={`/niche-catalog/${niche._id}`} key={niche._id}>
                                <Card className="hover:shadow-lg transition cursor-pointer h-full border-slate-200">
                                    <CardHeader>
                                        <CardTitle className="line-clamp-1">{niche.title}</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <p className="text-sm text-slate-600 line-clamp-2 mb-4">
                                            {niche.description || "No description available."}
                                        </p>
                                        <div className="flex items-center gap-x-4 text-sm text-slate-500">
                                            <div className="flex items-center gap-x-1">
                                                <BookOpen className="h-4 w-4" />
                                                <span>{niche.keywords?.length || 0} Keywords</span>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            </Link>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
