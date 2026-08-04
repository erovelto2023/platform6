"use client";

import React, { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { FolderOpen, Trash2, Clock, FileText, Loader2, Sparkles } from "lucide-react";
import { loadWorkbookProjectsList, loadWorkbookProject, deleteWorkbookProject } from "@/lib/workbook-api";
import { useWorksheetStore } from "@/lib/worksheet-store";
import toast from "react-hot-toast";

interface WorksheetProjectsModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSelectProject: (projectId: string, projectData: any) => void;
}

export const WorksheetProjectsModal: React.FC<WorksheetProjectsModalProps> = ({
    isOpen,
    onClose,
    onSelectProject,
}) => {
    const [projects, setProjects] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [deletingId, setDeletingId] = useState<string | null>(null);

    const fetchProjects = async () => {
        try {
            setIsLoading(true);
            const list = await loadWorkbookProjectsList();
            setProjects(list);
        } catch (err) {
            console.error("Failed to load projects:", err);
            toast.error("Could not load project list.");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (isOpen) {
            fetchProjects();
        }
    }, [isOpen]);

    const handleOpenProject = async (id: string) => {
        try {
            toast.loading("Loading project...", { id: "load-proj" });
            const data = await loadWorkbookProject(id);
            if (data && data.project) {
                onSelectProject(id, data.project);
                toast.success("Project loaded successfully!", { id: "load-proj" });
                onClose();
            }
        } catch (err) {
            console.error("Error opening project:", err);
            toast.error("Failed to open project.", { id: "load-proj" });
        }
    };

    const handleDeleteProject = async (e: React.MouseEvent, id: string) => {
        e.stopPropagation();
        if (!confirm("Are you sure you want to delete this project?")) return;
        try {
            setDeletingId(id);
            await deleteWorkbookProject(id);
            setProjects((prev) => prev.filter((p) => p.id !== id));
            toast.success("Project deleted.");
        } catch (err) {
            console.error("Delete error:", err);
            toast.error("Failed to delete project.");
        } finally {
            setDeletingId(null);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-2xl bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 shadow-2xl rounded-2xl p-6">
                <DialogHeader className="pb-4 border-b border-slate-100 dark:border-slate-800">
                    <DialogTitle className="text-base font-bold flex items-center gap-2 text-slate-800 dark:text-slate-100">
                        <FolderOpen className="w-5 h-5 text-indigo-500" /> My Saved Workbook Projects
                    </DialogTitle>
                    <DialogDescription className="text-xs text-slate-500">
                        Select a saved project to resume editing on the canvas.
                    </DialogDescription>
                </DialogHeader>

                <div className="py-4 max-h-[60vh] overflow-y-auto">
                    {isLoading ? (
                        <div className="flex flex-col items-center justify-center py-12 text-slate-400 gap-2">
                            <Loader2 className="w-6 h-6 animate-spin text-indigo-500" />
                            <span className="text-xs font-medium">Fetching saved projects...</span>
                        </div>
                    ) : projects.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-12 text-center text-slate-400">
                            <FileText className="w-10 h-10 mb-2 opacity-30" />
                            <p className="text-xs font-semibold">No saved projects yet</p>
                            <p className="text-[11px] text-slate-400 mt-1">Create your first worksheet and click &quot;Save Project&quot; in the header!</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            {projects.map((p) => (
                                <div
                                    key={p.id}
                                    onClick={() => handleOpenProject(p.id)}
                                    className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/50 hover:border-indigo-500 hover:shadow-md transition-all cursor-pointer group flex flex-col justify-between"
                                >
                                    <div className="flex items-start justify-between gap-2 mb-2">
                                        <div className="flex items-center gap-2">
                                            <div className="w-8 h-8 rounded-lg bg-indigo-50 dark:bg-indigo-950/50 flex items-center justify-center text-indigo-500 font-bold text-xs shrink-0">
                                                {p.pageCount || 1}p
                                            </div>
                                            <div>
                                                <h4 className="text-xs font-bold text-slate-800 dark:text-slate-100 group-hover:text-indigo-600 transition-colors line-clamp-1">
                                                    {p.name}
                                                </h4>
                                                <span className="text-[10px] text-slate-400 flex items-center gap-1 mt-0.5">
                                                    <Clock className="w-3 h-3" />
                                                    {new Date(p.lastModified).toLocaleDateString(undefined, {
                                                        month: "short",
                                                        day: "numeric",
                                                        hour: "2-digit",
                                                        minute: "2-digit",
                                                    })}
                                                </span>
                                            </div>
                                        </div>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="h-7 w-7 text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-lg shrink-0 opacity-0 group-hover:opacity-100 transition-opacity"
                                            onClick={(e) => handleDeleteProject(e, p.id)}
                                            disabled={deletingId === p.id}
                                        >
                                            <Trash2 className="w-3.5 h-3.5" />
                                        </Button>
                                    </div>

                                    <div className="flex items-center justify-between pt-2 border-t border-slate-200/60 dark:border-slate-800/60 text-[10px]">
                                        <span className="text-slate-400 font-medium">{p.pageCount} Pages</span>
                                        <span className="text-indigo-600 dark:text-indigo-400 font-bold group-hover:underline">
                                            Open Project →
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    );
};
