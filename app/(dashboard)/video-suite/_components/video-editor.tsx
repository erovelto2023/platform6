"use client";

import { useEffect, useState, useRef } from "react";
import { useVideoEditorStore } from "@/hooks/use-video-editor-store";
import { VideoTimeline } from "@/app/(dashboard)/video-suite/_components/video-timeline";
import { VideoPreview } from "@/app/(dashboard)/video-suite/_components/video-preview";
import { VideoAssets } from "@/app/(dashboard)/video-suite/_components/video-assets";
import { Button } from "@/components/ui/button";
import {
    ChevronLeft,
    Save,
    PlayCircle,
    Settings,
    Share2,
    Download,
    Loader2
} from "lucide-react";
import Link from "next/link";
import { updateVideoProject, renderVideoProject } from "@/lib/actions/video.actions";
import { toast } from "sonner";

interface VideoEditorProps {
    initialProject: any;
    currentUser: any;
}

export function VideoEditor({ initialProject, currentUser }: VideoEditorProps) {
    const {
        setProject,
        project,
        clips,
        setCurrentTime,
        currentTime
    } = useVideoEditorStore();

    const playerRef = useRef<any>(null);
    const [duration, setDuration] = useState(0);
    const [isSaving, setIsSaving] = useState(false);
    const [isExporting, setIsExporting] = useState(false);

    useEffect(() => {
        setProject(initialProject);
    }, [initialProject, setProject]);

    const handleSave = async () => {
        if (!project) return;
        setIsSaving(true);
        try {
            const res = await updateVideoProject(project._id, {
                clips: clips,
                title: project.title
            });
            if (res.success) {
                toast.success("Project saved");
            } else {
                toast.error(res.error || "Failed to save");
            }
        } catch (error) {
            toast.error("Save failed");
        } finally {
            setIsSaving(false);
        }
    };

    const handleExport = async () => {
        if (!project) return;
        setIsExporting(true);
        toast.info("Starting FFmpeg render on VPS...");

        try {
            const res = await renderVideoProject(project._id) as any;
            if (res.success) {
                toast.success("Render complete! Video is ready.");
                // Refresh project to get exportUrl
                setProject({ ...project, status: 'completed', exportUrl: res.data.url });
            } else {
                toast.error(res.error || "Render failed");
            }
        } catch (error) {
            toast.error("Export process failed. Check FFmpeg installation.");
        } finally {
            setIsExporting(false);
        }
    };

    if (!project) return null;

    return (
        <div className="flex flex-col h-full bg-[#0B0D0F] text-white select-none">
            {/* Toolbar */}
            <div className="h-14 px-4 flex items-center justify-between border-b border-[#303236] bg-[#1A1D21]">
                <div className="flex items-center gap-4">
                    <Link href="/video-suite">
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-[#ABABAD] hover:text-white">
                            <ChevronLeft className="w-5 h-5" />
                        </Button>
                    </Link>
                    <div className="h-4 w-[1px] bg-[#303236]" />
                    <div className="flex flex-col">
                        <span className="text-xs font-bold text-white leading-tight">
                            {project.title}
                        </span>
                        <span className="text-[10px] text-[#ABABAD]">Project ID: {project._id.slice(-6).toUpperCase()}</span>
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    <Button
                        variant="ghost"
                        size="sm"
                        className="text-[#ABABAD] hover:text-white gap-2"
                        onClick={handleSave}
                        disabled={isSaving}
                    >
                        {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                        Save
                    </Button>
                    <Button
                        size="sm"
                        className="bg-purple-600 hover:bg-purple-700 text-white gap-2 px-4 shadow-lg shadow-purple-600/20"
                        onClick={handleExport}
                        disabled={isExporting}
                    >
                        {isExporting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
                        Export MP4
                    </Button>
                    <div className="h-4 w-[1px] bg-[#303236] mx-2" />
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-[#ABABAD] hover:text-white">
                        <Settings className="w-4 h-4" />
                    </Button>
                </div>
            </div>

            {/* Main Content Area */}
            <div className="flex-1 flex overflow-hidden">
                {/* Left Sidebar: Assets */}
                <div className="w-[300px] border-r border-[#303236] flex flex-col bg-[#1A1D21]">
                    <VideoAssets />
                </div>

                {/* Center: Preview */}
                <div className="flex-1 flex flex-col bg-black">
                    <VideoPreview />
                </div>
            </div>

            {/* Bottom: Timeline */}
            <div className="h-[300px] border-t border-[#303236] bg-[#1A1D21]">
                <VideoTimeline />
            </div>
        </div>
    );
}
