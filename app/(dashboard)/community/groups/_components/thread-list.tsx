import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { MessageSquare, ThumbsUp, Eye, Pin } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

interface ThreadListProps {
    threads: any[];
    groupSlug: string;
}

export function ThreadList({ threads, groupSlug }: ThreadListProps) {
    if (threads.length === 0) {
        return (
            <div className="text-center py-12 bg-white rounded-xl border border-slate-200">
                <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <MessageSquare className="h-6 w-6 text-slate-400" />
                </div>
                <h3 className="text-lg font-medium text-slate-900">No threads yet</h3>
                <p className="text-slate-500">Be the first to start a conversation!</p>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            {threads.map((thread) => (
                <Link key={thread._id} href={`/community/groups/${groupSlug}/threads/${thread._id}`}>
                    <Card className="hover:shadow-md transition-shadow cursor-pointer border-slate-200">
                        <CardContent className="p-4">
                            <div className="flex gap-4">
                                {/* Author Avatar */}
                                <Avatar className="h-10 w-10 border border-slate-100">
                                    <AvatarImage src={thread.author?.avatar} />
                                    <AvatarFallback>{thread.author?.firstName?.[0]}</AvatarFallback>
                                </Avatar>

                                <div className="flex-1 min-w-0">
                                    {/* Header: Title & Badges */}
                                    <div className="flex items-start justify-between gap-2">
                                        <h3 className="font-semibold text-slate-900 truncate pr-4">
                                            {thread.title}
                                        </h3>
                                        <div className="flex items-center gap-2 shrink-0">
                                            {thread.isPinned && (
                                                <Badge variant="secondary" className="bg-amber-100 text-amber-700 hover:bg-amber-100">
                                                    <Pin className="h-3 w-3 mr-1" /> Pinned
                                                </Badge>
                                            )}
                                            <Badge variant="outline" className="text-xs font-normal text-slate-500">
                                                {thread.type}
                                            </Badge>
                                        </div>
                                    </div>

                                    {/* Preview Content */}
                                    <p className="text-sm text-slate-600 mt-1 line-clamp-2">
                                        {thread.content}
                                    </p>

                                    {/* Win Specifics */}
                                    {thread.type === 'Win' && thread.winDetails && (
                                        <div className="mt-2 flex flex-wrap gap-2">
                                            <Badge variant="secondary" className="bg-green-100 text-green-700 hover:bg-green-100 border-green-200">
                                                🏆 {thread.winDetails.type}
                                            </Badge>
                                            {thread.winDetails.metrics?.before && thread.winDetails.metrics?.after && (
                                                <Badge variant="outline" className="text-slate-600">
                                                    📈 {thread.winDetails.metrics.before} → {thread.winDetails.metrics.after}
                                                </Badge>
                                            )}
                                        </div>
                                    )}

                                    {/* Resource Specifics */}
                                    {thread.type === 'Resource' && thread.resourceDetails && (
                                        <div className="mt-2 space-y-2">
                                            <div className="flex flex-wrap gap-2">
                                                <Badge variant="secondary" className="bg-blue-100 text-blue-700 hover:bg-blue-100 border-blue-200">
                                                    📚 {thread.resourceDetails.type}
                                                </Badge>
                                                {thread.resourceDetails.category && (
                                                    <Badge variant="outline" className="text-slate-600">
                                                        🏷️ {thread.resourceDetails.category}
                                                    </Badge>
                                                )}
                                                {thread.resourceDetails.difficulty && (
                                                    <Badge variant="outline" className="text-slate-600">
                                                        📊 {thread.resourceDetails.difficulty}
                                                    </Badge>
                                                )}
                                            </div>
                                            {thread.resourceDetails.shortDescription && (
                                                <p className="text-sm text-slate-600 italic">
                                                    "{thread.resourceDetails.shortDescription}"
                                                </p>
                                            )}
                                        </div>
                                    )}

                                    {/* Footer: Meta & Stats */}
                                    <div className="flex items-center gap-4 mt-3 text-xs text-slate-500">
                                        <span className="font-medium text-slate-700">
                                            {thread.author?.firstName} {thread.author?.lastName}
                                        </span>
                                        <span>•</span>
                                        <span>{formatDistanceToNow(new Date(thread.createdAt), { addSuffix: true })}</span>

                                        <div className="flex items-center gap-4 ml-auto">
                                            <div className="flex items-center gap-1 hover:text-indigo-600 transition-colors">
                                                <MessageSquare className="h-3.5 w-3.5" />
                                                <span>{thread.replyCount}</span>
                                            </div>
                                            <div className="flex items-center gap-1 hover:text-pink-600 transition-colors">
                                                <ThumbsUp className="h-3.5 w-3.5" />
                                                <span>{thread.likes?.length || 0}</span>
                                            </div>
                                            <div className="flex items-center gap-1">
                                                <Eye className="h-3.5 w-3.5" />
                                                <span>{thread.views}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </Link>
            ))}
        </div>
    );
}
