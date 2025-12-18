"use client";

import Link from "next/link";
import { BookOpen } from "lucide-react";
import { IconBadge } from "@/components/icon-badge";
import { CourseProgress } from "@/components/course-progress";

interface CourseCardProps {
    id: string;
    title: string;
    imageUrl: string;
    chaptersLength: number;
    price: number;
    progress: number | null;
    category: string;
    description: string;
}

export const CourseCard = ({
    id,
    title,
    imageUrl,
    chaptersLength,
    price,
    progress,
    category,
    description
}: CourseCardProps) => {
    return (
        <Link href={`/courses/${id}`}>
            <div className="group hover:shadow-sm transition overflow-hidden border rounded-lg p-3 h-full">
                <div className="relative w-full aspect-video rounded-md overflow-hidden bg-slate-200">
                    {/* Image would go here, using placeholder for now if no image */}
                    {imageUrl ? (
                        <img
                            src={imageUrl}
                            alt={title}
                            className="object-cover w-full h-full"
                        />
                    ) : (
                        <div className="flex items-center justify-center h-full w-full bg-slate-100 text-slate-400">
                            No Image
                        </div>
                    )}
                </div>
                <div className="flex flex-col pt-2">
                    <div className="text-lg md:text-base font-medium group-hover:text-sky-700 transition line-clamp-2">
                        {title}
                    </div>
                    <p className="text-xs text-muted-foreground">
                        {category}
                    </p>
                    <p className="text-sm text-slate-600 line-clamp-2 mt-2">
                        {description}
                    </p>
                    <div className="my-3 flex items-center gap-x-2 text-sm md:text-xs">
                        <div className="flex items-center gap-x-1 text-slate-500">
                            <IconBadge size="sm" icon={BookOpen} />
                            <span>
                                {chaptersLength} {chaptersLength === 1 ? "Chapter" : "Chapters"}
                            </span>
                        </div>
                    </div>
                    {progress !== null && (
                        <CourseProgress
                            variant={progress === 100 ? "success" : "default"}
                            size="sm"
                            value={progress}
                        />
                    )}
                </div>
            </div>
        </Link>
    )
}
