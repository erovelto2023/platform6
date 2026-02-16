"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, Plus, Calendar as CalendarIcon, FileText, Video, Mail, Share2, CheckCircle2, Circle } from "lucide-react";
import { updateContentPost } from "@/lib/actions/content.actions";
import { toast } from "sonner";
import { format } from "date-fns";
import { ContentWizard } from "@/components/content/ContentWizard";

interface KanbanBoardProps {
    posts: any[];
    campaigns?: any[];
    offers?: any[];
}

const COLUMNS = [
    { id: "idea", title: "Ideas", color: "bg-slate-100 border-slate-200" },
    { id: "draft", title: "In Progress", color: "bg-blue-50 border-blue-100" },
    { id: "review", title: "Review", color: "bg-purple-50 border-purple-100" },
    { id: "scheduled", title: "Scheduled", color: "bg-amber-50 border-amber-100" },
    { id: "published", title: "Published", color: "bg-green-50 border-green-100" }
];

export function KanbanBoard({ posts }: KanbanBoardProps) {
    const router = useRouter();
    const [optimisticPosts, setOptimisticPosts] = useState(posts);

    const handleStatusChange = async (postId: string, newStatus: string) => {
        // Optimistic update
        const updatedPosts = optimisticPosts.map(p =>
            p._id === postId ? { ...p, status: newStatus } : p
        );
        setOptimisticPosts(updatedPosts);

        try {
            await updateContentPost(postId, { status: newStatus });
            toast.success("Status updated");
        } catch (error) {
            toast.error("Failed to update status");
            // Revert
            setOptimisticPosts(posts);
        }
    };

    const getIcon = (type: string) => {
        switch (type) {
            case "blog": return <FileText className="h-4 w-4" />;
            case "video": return <Video className="h-4 w-4" />;
            case "email": return <Mail className="h-4 w-4" />;
            default: return <Share2 className="h-4 w-4" />;
        }
    };

    return (
        <div className="flex h-full gap-4 overflow-x-auto pb-4">
            {COLUMNS.map(col => {
                const colPosts = optimisticPosts.filter(p => p.status === col.id);

                return (
                    <div key={col.id} className={`flex-shrink-0 w-80 flex flex-col rounded-xl border ${col.color} h-full max-h-[calc(100vh-250px)]`}>
                        <div className="p-4 flex items-center justify-between border-b border-black/5 bg-white/50 rounded-t-xl">
                            <h3 className="font-semibold text-slate-700 flex items-center gap-2">
                                {col.id === 'published' ? <CheckCircle2 className="h-4 w-4 text-green-600" /> : <Circle className="h-4 w-4 text-slate-400" />}
                                {col.title}
                            </h3>
                            <Badge variant="secondary" className="bg-white/80">{colPosts.length}</Badge>
                        </div>

                        <div className="p-3 space-y-3 overflow-y-auto flex-1">
                            {colPosts.map(post => (
                                <Card
                                    key={post._id}
                                    className="cursor-pointer hover:shadow-md transition-all border-slate-200 bg-white group"
                                    onClick={() => router.push(`/tools/content-planner/edit/${post._id}`)}
                                >
                                    <CardContent className="p-4 space-y-3">
                                        <div className="flex justify-between items-start gap-2">
                                            <Badge variant="outline" className="capitalize text-[10px] px-1.5 py-0.5 h-auto">
                                                {getIcon(post.contentType)}
                                                <span className="ml-1">{post.contentType}</span>
                                            </Badge>
                                            <Button variant="ghost" size="icon" className="h-6 w-6 -mt-1 -mr-2 opacity-0 group-hover:opacity-100">
                                                <MoreHorizontal className="h-3 w-3" />
                                            </Button>
                                        </div>

                                        <h4 className="font-medium text-sm leading-snug text-slate-800 line-clamp-2">
                                            {post.title}
                                        </h4>

                                        <div className="flex items-center justify-between text-xs text-slate-500 pt-2 border-t border-slate-50">
                                            <div className="flex items-center gap-1">
                                                <CalendarIcon className="h-3 w-3" />
                                                {post.scheduledFor ? format(new Date(post.scheduledFor), 'MMM d') : 'Unscheduled'}
                                            </div>

                                            {/* Quick Move Actions */}
                                            <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                                {col.id !== 'idea' && (
                                                    <button
                                                        onClick={(e) => { e.stopPropagation(); handleStatusChange(post._id, COLUMNS[COLUMNS.findIndex(c => c.id === col.id) - 1].id); }}
                                                        className="hover:bg-slate-100 p-1 rounded"
                                                        title="Move Back"
                                                    >
                                                        ←
                                                    </button>
                                                )}
                                                {col.id !== 'published' && (
                                                    <button
                                                        onClick={(e) => { e.stopPropagation(); handleStatusChange(post._id, COLUMNS[COLUMNS.findIndex(c => c.id === col.id) + 1].id); }}
                                                        className="hover:bg-slate-100 p-1 rounded"
                                                        title="Move Forward"
                                                    >
                                                        →
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}

                            <ContentWizard
                                trigger={
                                    <Button
                                        variant="ghost"
                                        className="w-full text-slate-500 border-2 border-dashed border-slate-200 hover:border-slate-300 hover:bg-slate-50"
                                    >
                                        <Plus className="h-4 w-4 mr-2" />
                                        Add {col.title.slice(0, -1)}
                                    </Button>
                                }
                                defaultStatus={col.id}
                                campaigns={posts.length > 0 && posts[0].userId ? [] : []} // quick fix, improved below
                                offers={[]}
                            />
                        </div>
                    </div>
                );
            })}
        </div>
    );
}
