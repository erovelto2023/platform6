import Link from "next/link";
import { Button } from "@/components/ui/button";
import { PlusCircle, Pencil, BookOpen, ExternalLink } from "lucide-react";
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
import { CourseLinkModal } from "./_components/course-link-modal";

export default async function CoursesPage() {
    const courses = await getCourses();

    return (
        <div className="p-6 md:p-8 bg-slate-950 min-h-screen text-slate-100 font-sans space-y-6 max-w-6xl mx-auto selection:bg-orange-500 selection:text-slate-950">
            <div className="flex items-center justify-between border-b border-slate-800 pb-6">
                <div>
                    <h1 className="text-2xl md:text-3xl font-black uppercase tracking-tight text-slate-100 flex items-center gap-2 font-mono">
                        <BookOpen className="h-7 w-7 text-orange-400" />
                        Course Management
                    </h1>
                    <p className="text-xs font-mono text-slate-400 mt-1">
                        Create, edit, and get embed link code for your courses.
                    </p>
                </div>
                <Link href="/admin/courses/create">
                    <Button className="bg-orange-500 hover:bg-orange-600 text-slate-950 font-black font-mono text-xs uppercase tracking-wider flex items-center gap-2 cursor-pointer shadow-lg">
                        <PlusCircle className="h-4 w-4" />
                        New Course
                    </Button>
                </Link>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl">
                <Table>
                    <TableHeader className="bg-slate-950 border-b border-slate-800">
                        <TableRow className="border-slate-800 hover:bg-transparent">
                            <TableHead className="font-mono text-xs font-bold uppercase text-slate-400 py-4">Course Title</TableHead>
                            <TableHead className="font-mono text-xs font-bold uppercase text-slate-400">Pricing Tier</TableHead>
                            <TableHead className="font-mono text-xs font-bold uppercase text-slate-400">Status</TableHead>
                            <TableHead className="text-right font-mono text-xs font-bold uppercase text-slate-400 pr-6">Actions & Embed Links</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody className="divide-y divide-slate-800/80 font-mono text-xs">
                        {courses.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={4} className="text-center h-32 text-slate-500">
                                    No courses found. Click <span className="text-orange-400 font-bold">New Course</span> above to create your first course.
                                </TableCell>
                            </TableRow>
                        ) : (
                            courses.map((course: any) => {
                                const isFree = !course.isPremium && (!course.price || course.price === 0);
                                return (
                                    <TableRow key={course._id} className="border-slate-800/80 hover:bg-slate-950/60 transition-colors">
                                        <TableCell className="font-bold text-slate-100 py-4">
                                            <div className="flex flex-col">
                                                <span className="text-sm font-bold text-slate-100 font-sans">{course.title}</span>
                                                <span className="text-[11px] text-slate-500 font-mono font-normal">ID: {course._id}</span>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            {isFree ? (
                                                <span className="text-[11px] font-mono font-bold text-emerald-400 bg-emerald-950 border border-emerald-800 px-2.5 py-1 rounded-full uppercase">
                                                    Free Course
                                                </span>
                                            ) : (
                                                <span className="text-[11px] font-mono font-bold text-amber-400 bg-amber-950 border border-amber-800 px-2.5 py-1 rounded-full uppercase">
                                                    {course.price ? `$${course.price}` : "Student VIP"}
                                                </span>
                                            )}
                                        </TableCell>
                                        <TableCell>
                                            {course.isPublished ? (
                                                <Badge className="bg-emerald-600 text-slate-950 font-bold uppercase text-[10px]">Published</Badge>
                                            ) : (
                                                <Badge variant="secondary" className="bg-slate-800 text-slate-400 font-bold uppercase text-[10px]">Draft</Badge>
                                            )}
                                        </TableCell>
                                        <TableCell className="text-right pr-6">
                                            <div className="flex items-center justify-end gap-2">
                                                {/* GET LINK CODE MODAL */}
                                                <CourseLinkModal courseId={course._id.toString()} courseTitle={course.title} />

                                                {/* PREVIEW LINK */}
                                                <a 
                                                    href={`/catalog/${course._id}`} 
                                                    target="_blank" 
                                                    rel="noopener noreferrer"
                                                    className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition"
                                                    title="Preview Course"
                                                >
                                                    <ExternalLink className="h-4 w-4" />
                                                </a>

                                                {/* EDIT BUTTON */}
                                                <Link href={`/admin/courses/${course._id}`}>
                                                    <Button variant="ghost" size="sm" className="text-slate-300 hover:text-white hover:bg-slate-800 font-mono text-xs">
                                                        <Pencil className="h-3.5 w-3.5 mr-1" />
                                                        Edit
                                                    </Button>
                                                </Link>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                );
                            })
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}
