import { Menu } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

import { CourseSidebar } from "./course-sidebar";
import { Navbar } from "@/components/dashboard/navbar"; // Reusing main navbar for user button

interface CourseMobileSidebarProps {
    course: any;
    progressCount: number;
    completedLessonIds: string[];
}

export const CourseMobileSidebar = ({
    course,
    progressCount,
    completedLessonIds
}: CourseMobileSidebarProps) => {
    return (
        <Sheet>
            <SheetTrigger className="md:hidden pr-4 hover:opacity-75 transition">
                <Menu />
            </SheetTrigger>
            <SheetContent side="left" className="p-0 bg-white w-72">
                <CourseSidebar
                    course={course}
                    progressCount={progressCount}
                    completedLessonIds={completedLessonIds}
                />
            </SheetContent>
        </Sheet>
    )
}
