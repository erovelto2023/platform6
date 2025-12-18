import { getCourses } from "@/lib/actions/course.actions";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BookOpen, CircleDollarSign } from "lucide-react";
import Image from "next/image";

export default async function CoursesPage() {
    const courses = await getCourses();
    const publishedCourses = courses.filter((course: any) => course.isPublished); // Assuming we add isPublished later, or just show all for now

    return (
        <div className="p-6 space-y-6">
            <div className="flex flex-col gap-y-2">
                <h1 className="text-3xl font-bold">Courses</h1>
                <p className="text-muted-foreground">
                    Master the skills you need to succeed.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {courses.length === 0 ? (
                    <div className="col-span-full text-center text-muted-foreground mt-10">
                        No courses available yet.
                    </div>
                ) : (
                    courses.map((course: any) => (
                        <Link href={`/catalog/${course._id}`} key={course._id}>
                            <Card className="hover:shadow-lg transition cursor-pointer h-full border-slate-200 overflow-hidden group">
                                <div className="relative w-full aspect-video rounded-t-md overflow-hidden bg-slate-200">
                                    {course.thumbnail ? (
                                        <Image
                                            fill
                                            className="object-cover"
                                            alt={course.title}
                                            src={course.thumbnail}
                                        />
                                    ) : (
                                        <div className="flex items-center justify-center h-full w-full bg-slate-200">
                                            <BookOpen className="h-10 w-10 text-slate-400" />
                                        </div>
                                    )}
                                </div>
                                <CardHeader>
                                    <CardTitle className="line-clamp-1 group-hover:text-sky-700 transition">
                                        {course.title}
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="flex items-center justify-between text-sm text-slate-500 mb-2">
                                        <Badge variant="secondary" className="bg-slate-100 text-slate-700">
                                            {course.modules?.length || 0} Chapters
                                        </Badge>
                                    </div>
                                    <p className="text-sm text-slate-600 line-clamp-2">
                                        {course.description}
                                    </p>
                                </CardContent>
                            </Card>
                        </Link>
                    ))
                )}
            </div>
        </div>
    );
}
