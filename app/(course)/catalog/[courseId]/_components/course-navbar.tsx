import { Navbar } from "@/components/dashboard/navbar";
import { CourseMobileSidebar } from "./course-mobile-sidebar";
import { UserButton } from "@clerk/nextjs";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";
import { ClientWrapper } from "@/components/client-wrapper";

interface CourseNavbarProps {
    course: any;
    progressCount: number;
    completedLessonIds: string[];
}

export const CourseNavbar = ({
    course,
    progressCount,
    completedLessonIds
}: CourseNavbarProps) => {
    return (
        <div className="p-4 border-b border-zinc-800 h-full flex items-center bg-zinc-950 shadow-sm text-white">
            <ClientWrapper>
                <CourseMobileSidebar
                    course={course}
                    progressCount={progressCount}
                    completedLessonIds={completedLessonIds}
                />
            </ClientWrapper>
            <div className="flex items-center justify-between w-full">
                <div className="hidden md:block">
                    {/* Maybe breadcrumbs here? */}
                </div>
                <div className="flex gap-x-2 ml-auto">
                    <Link href="/catalog">
                        <Button size="sm" variant="ghost" className="text-zinc-300 hover:text-white hover:bg-zinc-800">
                            <LogOut className="h-4 w-4 mr-2" />
                            Exit
                        </Button>
                    </Link>
                    <ClientWrapper>
                        <UserButton />
                    </ClientWrapper>
                </div>
            </div>
        </div>
    )
}
