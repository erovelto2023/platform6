"use client";

import { useEffect } from "react";
import { useVideoEditorStore } from "@/hooks/use-video-editor-store";
import { OpenVideoEditor } from "./open-video-editor";

interface VideoEditorProps {
    initialProject: any;
    currentUser: any;
}

export function VideoEditor({ initialProject, currentUser }: VideoEditorProps) {
    const {
        setProject,
        project,
    } = useVideoEditorStore();

    useEffect(() => {
        setProject(initialProject);
    }, [initialProject, setProject]);

    if (!project) return null;

    return (
        <div className="flex flex-col h-full bg-[#0B0D0F] text-white select-none">
            <OpenVideoEditor initialData={project.studioData} />
        </div>
    );
}
