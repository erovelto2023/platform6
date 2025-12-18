import { currentUser } from "@clerk/nextjs/server";
import { redirect, notFound } from "next/navigation";
import connectToDatabase from "@/lib/db/connect";
import User from "@/lib/db/models/User";
import { getThread, getReplies, getGroupMember } from "@/lib/actions/group.actions";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, MessageSquare, ThumbsUp, Eye, Pin, MoreHorizontal, CheckCircle2 } from "lucide-react";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import { ReplyForm } from "../../../_components/reply-form";
import { ReplyList } from "../../../_components/reply-list";
import { PollDisplay } from "../../../_components/poll-display";
import { ResourceDisplay } from "../../../_components/resource-display";
import { getUserThreadActivity } from "@/lib/actions/engagement.actions";
import { ThreadEngagement } from "../../../_components/thread-engagement";
import { ThreadActionsMenu } from "../../../_components/thread-actions-menu";

interface ThreadPageProps {
    params: Promise<{ slug: string; threadId: string }>;
}

export default async function ThreadPage({ params }: ThreadPageProps) {
    const { slug, threadId } = await params;
    const user = await currentUser();
    if (!user) return redirect("/sign-in");

    await connectToDatabase();
    const dbUser = await User.findOne({ clerkId: user.id });
    if (!dbUser) return redirect("/");

    const thread = await getThread(threadId);
    if (!thread) return notFound();

    const replies = await getReplies(threadId);

    // Check membership to allow replying
    const member = await getGroupMember(thread.group, dbUser._id.toString());
    const isMember = !!member;

    const initialActivity = await getUserThreadActivity(threadId, dbUser._id.toString());

    return (
        <div className="max-w-4xl mx-auto pb-10">
            {/* Back Navigation */}
            <div className="mb-6">
                <Link
                    href={`/community/groups/${slug}`}
                    className="inline-flex items-center text-sm text-slate-500 hover:text-slate-900 transition-colors"
                >
                    <ArrowLeft className="h-4 w-4 mr-1" />
                    Back to Group
                </Link>
            </div>

            {/* Main Thread Content */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden mb-8">
                <div className="p-6 md:p-8">
                    {/* Header */}
                    <div className="flex items-start justify-between gap-4 mb-6">
                        <div className="flex gap-4">
                            <Avatar className="h-12 w-12 border border-slate-100">
                                <AvatarImage src={thread.author?.avatar} />
                                <AvatarFallback>{thread.author?.firstName?.[0]}</AvatarFallback>
                            </Avatar>
                            <div>
                                <h1 className="text-xl md:text-2xl font-bold text-slate-900 leading-tight">
                                    {thread.type === "Announcement" && (
                                        <span className="mr-2 text-indigo-600">📢</span>
                                    )}
                                    {thread.title}
                                </h1>
                                <div className="flex items-center gap-2 mt-1 text-sm text-slate-500">
                                    <span className="font-medium text-slate-700">
                                        {thread.author?.firstName} {thread.author?.lastName}
                                    </span>
                                    <span>•</span>
                                    <span>{formatDistanceToNow(new Date(thread.createdAt), { addSuffix: true })}</span>
                                    {thread.isPinned && (
                                        <Badge variant="secondary" className="ml-2 bg-amber-100 text-amber-700 hover:bg-amber-100">
                                            <Pin className="h-3 w-3 mr-1" /> Pinned
                                        </Badge>
                                    )}
                                    <Badge
                                        variant="outline"
                                        className={
                                            thread.type === "Announcement"
                                                ? "ml-2 text-xs font-normal bg-indigo-50 text-indigo-700 border-indigo-200"
                                                : "ml-2 text-xs font-normal"
                                        }
                                    >
                                        {thread.type}
                                    </Badge>
                                    {thread.question?.isSolved && (
                                        <Badge variant="secondary" className="ml-2 bg-emerald-100 text-emerald-700 hover:bg-emerald-100">
                                            <CheckCircle2 className="h-3 w-3 mr-1" /> Solved
                                        </Badge>
                                    )}
                                </div>
                            </div>
                        </div>

                        <ThreadActionsMenu
                            threadId={thread._id}
                            groupSlug={slug}
                            isAuthor={thread.author._id.toString() === dbUser._id.toString()}
                            isAdmin={member?.role === "Admin" || member?.role === "Moderator"}
                            isPinned={thread.isPinned}
                        />
                    </div>

                    {/* Content */}
                    <div className="prose prose-slate max-w-none mb-8 text-slate-800">
                        <p className="whitespace-pre-wrap">{thread.content}</p>
                    </div>

                    {/* Poll Display */}
                    {thread.type === "Poll" && thread.poll && (
                        <PollDisplay
                            threadId={thread._id}
                            poll={thread.poll}
                            userId={dbUser._id.toString()}
                            groupSlug={slug}
                            isMember={isMember}
                        />
                    )}

                    {/* Resource Display */}
                    {thread.type === "Resource" && (thread.resourceDetails || thread.resource) && (
                        <ResourceDisplay resource={thread.resourceDetails || thread.resource} />
                    )}

                    {/* Engagement Actions */}
                    {isMember && (
                        <div className="my-6">
                            <ThreadEngagement
                                threadId={thread._id}
                                userId={dbUser._id.toString()}
                                initialActivity={initialActivity}
                                isResource={thread.type === "Resource"}
                            />
                        </div>
                    )}

                    {/* Footer Stats */}
                    <div className="flex items-center gap-6 pt-6 border-t border-slate-100 text-sm text-slate-500">
                        <div className="flex items-center gap-2">
                            <MessageSquare className="h-4 w-4" />
                            <span>{replies.length} Replies</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <ThumbsUp className="h-4 w-4" />
                            <span>{thread.likes?.length || 0} Likes</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Eye className="h-4 w-4" />
                            <span>{thread.views} Views</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Replies Section */}
            <div className="space-y-8">
                <h3 className="text-lg font-semibold text-slate-900 px-1">
                    Replies ({replies.length})
                </h3>

                {/* Reply List */}
                <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 md:p-8">
                    <ReplyList
                        replies={replies}
                        isQuestion={thread.type === "Question"}
                        isAuthor={thread.author._id.toString() === dbUser._id.toString()}
                        threadId={thread._id}
                        groupSlug={slug}
                    />

                    {replies.length === 0 && (
                        <div className="text-center py-8 text-slate-500 italic">
                            No replies yet. Be the first to share your thoughts!
                        </div>
                    )}
                </div>

                {/* Reply Form */}
                {isMember ? (
                    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 md:p-8 sticky bottom-6">
                        <ReplyForm
                            threadId={thread._id}
                            groupSlug={slug}
                            userId={dbUser._id.toString()}
                            userAvatar={dbUser.avatar || dbUser.imageUrl}
                            userInitials={dbUser.firstName?.[0]}
                        />
                    </div>
                ) : (
                    <div className="bg-slate-50 rounded-xl border border-slate-200 p-8 text-center">
                        <p className="text-slate-600 mb-4">You must be a member of this group to reply.</p>
                        <Link href={`/community/groups/${slug}`}>
                            <Button>Join Group to Reply</Button>
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
}
