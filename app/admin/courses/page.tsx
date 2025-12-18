import Link from "next/link";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import { getCourses } from "@/lib/actions/course.actions";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

export default async function CoursesPage() {
    const courses = await getCourses();

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold">Courses</h1>
                <Link href="/admin/courses/create">
                    <Button>
                        <PlusCircle className="h-4 w-4 mr-2" />
                        New Course
                    </Button>
                </Link>
            </div>

            <div className="border rounded-md">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Title</TableHead>
                            <TableHead>Price</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {courses.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={4} className="text-center h-24 text-muted-foreground">
                                    No courses found.
                                </TableCell>
                            </TableRow>
                        ) : (
                            courses.map((course: any) => (
                                <TableRow key={course._id}>
                                    <TableCell className="font-medium">{course.title}</TableCell>
                                    <TableCell>
                                        {course.price ? `$${course.price}` : "Free"}
                                    </TableCell>
                                    <TableCell>
                                        {course.isPublished ? (
                                            <Badge className="bg-emerald-500">Published</Badge>
                                        ) : (
                                            <Badge variant="secondary">Draft</Badge>
                                        )}
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <Link href={`/admin/courses/${course._id}`}>
                                            <Button variant="ghost" size="sm">
                                                Edit
                                            </Button>
                                        </Link>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}
