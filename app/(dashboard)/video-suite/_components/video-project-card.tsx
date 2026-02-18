"use client";

import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import { Film, MoreVertical, Play, Clock, FileVideo, Trash2 } from "lucide-react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { deleteVideoProject } from "@/lib/actions/video.actions";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface VideoProjectCardProps {
    project: any;
}

export function VideoProjectCard({ project }: VideoProjectCardProps) {
    const handleDelete = async (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();

        if (confirm("Are you sure you want to delete this project?")) {
            try {
                const res = await deleteVideoProject(project._id);
                if (res.success) {
                    toast.success("Project deleted");
                } else {
                    toast.error(res.error || "Failed to delete project");
                }
            } catch (error) {
                toast.error("Something went wrong");
            }
        }
    };

    const statusColors: any = {
        draft: "bg-blue-500/10 text-blue-500 border-blue-500/20",
        rendering: "bg-yellow-500/10 text-yellow-500 border-yellow-500/20",
        completed: "bg-green-500/10 text-green-500 border-green-500/20",
        failed: "bg-red-500/10 text-red-500 border-red-500/20",
    };

    return (
        <Link href={`/video-suite/${project._id}`}>
            <div className="group bg-[#1A1D21] border border-[#303236] rounded-xl overflow-hidden hover:border-purple-500/50 transition-all duration-300 flex flex-col h-full shadow-lg hover:shadow-purple-500/5">
                {/* Thumbnail Placeholder */}
                <div className="aspect-video bg-[#0B0D0F] relative flex items-center justify-center overflow-hidden">
                    {project.exportUrl ? (
                        <video
                            src={project.exportUrl}
                            className="w-full h-full object-cover"
                            muted
                            onMouseEnter={(e) => e.currentTarget.play()}
                            onMouseLeave={(e) => {
                                e.currentTarget.pause();
                                e.currentTarget.currentTime = 0;
                            }}
                        />
                    ) : (
                        <div className="flex flex-col items-center gap-2 text-[#303236] group-hover:text-[#ABABAD] transition-colors">
                            <FileVideo className="w-12 h-12" />
                            <span className="text-[10px] uppercase font-bold tracking-widest">No Preview</span>
                        </div>
                    )}

                    <div className="absolute top-3 left-3">
                        <span className={cn(
                            "px-2 py-0.5 rounded-full text-[10px] font-bold border uppercase tracking-wider",
                            statusColors[project.status] || statusColors.draft
                        )}>
                            {project.status}
                        </span>
                    </div>

                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <div className="w-12 h-12 rounded-full bg-purple-600 flex items-center justify-center text-white scale-90 group-hover:scale-100 transition-transform">
                            <Play className="w-6 h-6 fill-current" />
                        </div>
                    </div>
                </div>

                {/* Info */}
                <div className="p-4 flex-1 flex flex-col">
                    <div className="flex items-start justify-between mb-2">
                        <h3 className="font-bold text-white truncate group-hover:text-purple-400 transition-colors">
                            {project.title}
                        </h3>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild onClick={(e) => e.preventDefault()}>
                                <Button variant="ghost" size="icon" className="h-8 w-8 text-[#ABABAD] hover:text-white">
                                    <MoreVertical className="w-4 h-4" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="bg-[#1A1D21] border-[#303236] text-white">
                                <DropdownMenuItem
                                    className="text-red-500 focus:text-red-500 focus:bg-red-500/10 gap-2"
                                    onClick={handleDelete}
                                >
                                    <Trash2 className="w-4 h-4" />
                                    Delete Project
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>

                    <div className="mt-auto flex items-center justify-between text-[#ABABAD] text-xs">
                        <div className="flex items-center gap-1.5 font-medium">
                            <Clock className="w-3 h-3" />
                            {formatDistanceToNow(new Date(project.updatedAt), { addSuffix: true })}
                        </div>
                        <div className="flex items-center gap-1.5 font-bold text-[#606060]">
                            {project.clips.length} CLIPS
                        </div>
                    </div>
                </div>
            </div>
        </Link>
    );
}
