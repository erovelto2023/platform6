import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRight, BookOpen, Trophy, Zap } from "lucide-react";
import Link from "next/link";
import { getDashboardCourses } from "@/lib/actions/course.actions";
import { CourseCard } from "@/components/course-card";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { getUserRole } from "@/lib/roles";

export default async function DashboardPage() {
    const { userId } = await auth();
    if (!userId) return redirect("/");

    const userRole = await getUserRole();
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
                {userRole === 'free' ? (
                    <div className="text-center py-10 border rounded-md bg-slate-100 flex flex-col items-center">
                        <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center mb-3">
                            <Zap className="h-6 w-6 text-amber-600" />
                        </div>
                        <p className="text-muted-foreground max-w-sm mx-auto mb-4">
                            Premium business resources, templates, and spreadsheets are available to Student members.
                        </p>
                        <Link href="/upgrade" className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition font-medium">
                            Upgrade to Unlock
                        </Link>
                    </div>
                ) : (
                    <div className="text-center py-10 text-muted-foreground border rounded-md bg-slate-50">
                        <p>Business resources coming soon.</p>
                        <Link href="/business-resources" className="text-indigo-600 hover:underline mt-2 inline-block">
                            Explore Resources <ArrowRight className="inline h-4 w-4 ml-1" />
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
}
