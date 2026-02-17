"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
    Bookmark,
    CheckCircle2,
    ThumbsUp,
    Star,
    Pencil,
    Loader2
} from "lucide-react";
import {
    toggleThreadSave,
    toggleThreadCompletion,
    toggleThreadHelpful,
    rateThread,
    saveThreadNote
} from "@/lib/actions/engagement.actions";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";

interface ThreadEngagementProps {
    threadId: string;
    userId: string;
    initialActivity: any;
    isResource: boolean;
}

export function ThreadEngagement({ threadId, userId, initialActivity, isResource }: ThreadEngagementProps) {
    const pathname = usePathname() || "";
    const [activity, setActivity] = useState(initialActivity || {});
    const [isLoading, setIsLoading] = useState<string | null>(null);
    const [note, setNote] = useState(initialActivity?.personalNotes || "");
    const [isEditingNote, setIsEditingNote] = useState(false);

    const handleSave = async () => {
        setIsLoading("save");
        try {
            const res = await toggleThreadSave(threadId, userId, pathname);
            setActivity({ ...activity, isSaved: res.isSaved });
            toast.success(res.isSaved ? "Saved to library" : "Removed from library");
        } catch (error) {
            toast.error("Something went wrong");
        } finally {
            setIsLoading(null);
        }
    };

    const handleComplete = async () => {
        setIsLoading("complete");
        try {
            const res = await toggleThreadCompletion(threadId, userId, pathname);
            setActivity({ ...activity, isCompleted: res.isCompleted });
            toast.success(res.isCompleted ? "Marked as complete" : "Marked as incomplete");
        } catch (error) {
            toast.error("Something went wrong");
        } finally {
            setIsLoading(null);
        }
    };

    const handleHelpful = async () => {
        setIsLoading("helpful");
        try {
            const res = await toggleThreadHelpful(threadId, userId, pathname);
            setActivity({ ...activity, isHelpful: res.isHelpful });
        } catch (error) {
            toast.error("Something went wrong");
        } finally {
            setIsLoading(null);
        }
    };

    const handleRate = async (rating: number) => {
        try {
            const res = await rateThread(threadId, userId, rating, pathname);
            setActivity({ ...activity, rating: res.rating });
            toast.success("Rating submitted");
        } catch (error) {
            toast.error("Failed to submit rating");
        }
    };

    const handleSaveNote = async () => {
        setIsLoading("note");
        try {
            await saveThreadNote(threadId, userId, note, pathname);
            setActivity({ ...activity, personalNotes: note });
            setIsEditingNote(false);
            toast.success("Note saved");
        } catch (error) {
            toast.error("Failed to save note");
        } finally {
            setIsLoading(null);
        }
    };

    return (
        <div className="bg-white rounded-xl border border-slate-200 p-6 space-y-6">
            <div className="flex flex-wrap items-center gap-4 justify-between">
                <div className="flex gap-2">
                    {/* Mark as Complete (Prominent for Resources) */}
                    {isResource && (
                        <Button
                            variant={activity.isCompleted ? "default" : "outline"}
                            className={cn(
                                activity.isCompleted ? "bg-green-600 hover:bg-green-700" : "border-slate-300"
                            )}
                            onClick={handleComplete}
                            disabled={!!isLoading}
                        >
                            {isLoading === "complete" ? (
                                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                            ) : (
                                <CheckCircle2 className="h-4 w-4 mr-2" />
                            )}
                            {activity.isCompleted ? "Completed" : "Mark Complete"}
                        </Button>
                    )}

                    {/* Save / Bookmark */}
                    <Button
                        variant={activity.isSaved ? "secondary" : "outline"}
                        className={cn(
                            activity.isSaved ? "bg-indigo-50 text-indigo-700 border-indigo-200" : "border-slate-300"
                        )}
                        onClick={handleSave}
                        disabled={!!isLoading}
                    >
                        <Bookmark className={cn("h-4 w-4 mr-2", activity.isSaved && "fill-current")} />
                        {activity.isSaved ? "Saved" : "Save"}
                    </Button>

                    {/* Helpful */}
                    <Button
                        variant={activity.isHelpful ? "secondary" : "ghost"}
                        className={cn(
                            activity.isHelpful && "bg-amber-50 text-amber-700"
                        )}
                        onClick={handleHelpful}
                        disabled={!!isLoading}
                    >
                        <ThumbsUp className={cn("h-4 w-4 mr-2", activity.isHelpful && "fill-current")} />
                        Helpful
                    </Button>
                </div>

                {/* Rating */}
                {isResource && (
                    <div className="flex items-center gap-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                            <button
                                key={star}
                                onClick={() => handleRate(star)}
                                className="focus:outline-none transition-transform hover:scale-110"
                            >
                                <Star
                                    className={cn(
                                        "h-6 w-6",
                                        (activity.rating || 0) >= star
                                            ? "text-yellow-400 fill-current"
                                            : "text-slate-200"
                                    )}
                                />
                            </button>
                        ))}
                    </div>
                )}
            </div>

            {/* Personal Notes */}
            <div className="border-t border-slate-100 pt-4">
                <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium text-slate-900 flex items-center gap-2">
                        <Pencil className="h-4 w-4 text-slate-400" />
                        Personal Notes
                    </h4>
                    {!isEditingNote && activity.personalNotes && (
                        <Button variant="ghost" size="sm" onClick={() => setIsEditingNote(true)}>
                            Edit
                        </Button>
                    )}
                </div>

                {isEditingNote || !activity.personalNotes ? (
                    <div className="space-y-2">
                        <Textarea
                            placeholder="Add your private notes here..."
                            value={note}
                            onChange={(e) => setNote(e.target.value)}
                            className="min-h-[100px]"
                        />
                        <div className="flex justify-end gap-2">
                            {activity.personalNotes && (
                                <Button variant="ghost" size="sm" onClick={() => {
                                    setNote(activity.personalNotes);
                                    setIsEditingNote(false);
                                }}>
                                    Cancel
                                </Button>
                            )}
                            <Button size="sm" onClick={handleSaveNote} disabled={isLoading === "note"}>
                                {isLoading === "note" && <Loader2 className="h-3 w-3 animate-spin mr-2" />}
                                Save Note
                            </Button>
                        </div>
                    </div>
                ) : (
                    <div className="bg-slate-50 p-4 rounded-lg text-slate-700 text-sm whitespace-pre-wrap border border-slate-100">
                        {activity.personalNotes}
                    </div>
                )}
            </div>
        </div>
    );
}
