import { currentUser } from "@clerk/nextjs/server";
import { redirect, notFound } from "next/navigation";
import connectToDatabase from "@/lib/db/connect";
import User from "@/lib/db/models/User";
import { getGroup, getThreads, getGroupMember, getGroupMembers } from "@/lib/actions/group.actions";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Users, Globe, Lock, DollarSign, Settings } from "lucide-react";
import Link from "next/link";
import { JoinGroupButton } from "../_components/join-group-button";
import { CreateThreadDialog } from "../_components/create-thread-dialog";
import { ThreadList } from "../_components/thread-list";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { GroupSurveysList } from "../_components/group-surveys-list";
import { GroupPollsList } from "../_components/group-polls-list";
import { ResourceFilters } from "../_components/resource-filters";

interface GroupPageProps {
    params: Promise<{ slug: string }>;
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function GroupPage({ params, searchParams }: GroupPageProps) {
    const { slug } = await params;
    const resolvedSearchParams = await searchParams;
    const user = await currentUser();
    if (!user) return redirect("/sign-in");

    await connectToDatabase();
    const dbUser = await User.findOne({ clerkId: user.id });
    if (!dbUser) return redirect("/");

    const group = await getGroup(slug);
    if (!group) return notFound();

    const member = await getGroupMember(group._id, dbUser._id.toString());
    const isMember = !!member;
    const isAdmin = member?.role === "Admin";

    const discussionThreads = await getThreads(group._id, 10, 0, { type: 'Discussion' });
    const questionThreads = await getThreads(group._id, 10, 0, { type: 'Question' });
    const announcementThreads = await getThreads(group._id, 10, 0, { type: 'Announcement' });
    // Resource Filtering
    const resourceFilter: any = { type: 'Resource' };
    const rType = typeof resolvedSearchParams.resourceType === 'string' ? resolvedSearchParams.resourceType : undefined;
    const rDiff = typeof resolvedSearchParams.difficulty === 'string' ? resolvedSearchParams.difficulty : undefined;
    const rPrice = typeof resolvedSearchParams.pricing === 'string' ? resolvedSearchParams.pricing : undefined;
    const rQuery = typeof resolvedSearchParams.q === 'string' ? resolvedSearchParams.q : undefined;

    if (rType) resourceFilter['resourceDetails.type'] = rType;
    if (rDiff) resourceFilter['resourceDetails.difficulty'] = rDiff;
    if (rPrice) resourceFilter['resourceDetails.pricing'] = rPrice;
    if (rQuery) {
        resourceFilter.$or = [
            { title: { $regex: rQuery, $options: 'i' } },
            { content: { $regex: rQuery, $options: 'i' } },
            { 'resourceDetails.shortDescription': { $regex: rQuery, $options: 'i' } },
            { 'resourceDetails.tags': { $regex: rQuery, $options: 'i' } }
        ];
    }

    const resourceThreads = await getThreads(group._id, 10, 0, resourceFilter);
    const winThreads = await getThreads(group._id, 10, 0, { type: 'Win' });
    const groupMembers = await getGroupMembers(group._id);

    return (
        <div className="max-w-6xl mx-auto pb-10">
            {/* Group Header */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden mb-6">
                {/* Banner */}
                <div className="h-48 md:h-64 bg-gradient-to-r from-indigo-600 to-violet-600 relative">
                    {group.bannerUrl && (
                        <img src={group.bannerUrl} alt={group.name} className="w-full h-full object-cover" />
                    )}

                    {/* Admin Settings Button */}
                    {isAdmin && (
                        <Link href={`/admin/groups/${group._id}`} className="absolute top-4 right-4">
                            <Button variant="secondary" size="sm" className="bg-white/90 backdrop-blur-sm">
                                <Settings className="h-4 w-4 mr-2" />
                                Manage Group
                            </Button>
                        </Link>
                    )}
                </div>

                {/* Info Bar */}
                <div className="px-6 pb-6 relative">
                    <div className="flex flex-col md:flex-row items-start md:items-end -mt-12 md:-mt-16 gap-6">
                        {/* Group Icon */}
                        <div className="w-24 h-24 md:w-32 md:h-32 bg-white rounded-2xl shadow-md border-4 border-white flex items-center justify-center overflow-hidden shrink-0">
                            {group.imageUrl ? (
                                <img src={group.imageUrl} alt={group.name} className="w-full h-full object-cover" />
                            ) : (
                                <div className="w-full h-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold text-3xl">
                                    {group.name[0]}
                                </div>
                            )}
                        </div>

                        {/* Text Info */}
                        <div className="flex-1 pt-2 md:pt-0 md:pb-2">
                            <div className="flex items-center gap-3 mb-1">
                                <h1 className="text-2xl md:text-3xl font-bold text-slate-900">{group.name}</h1>
                                <Badge variant="secondary" className="bg-slate-100 text-slate-600">
                                    {group.type === 'Public' && <Globe className="h-3 w-3 mr-1" />}
                                    {group.type === 'Private' && <Lock className="h-3 w-3 mr-1" />}
                                    {group.type === 'Paid' && <DollarSign className="h-3 w-3 mr-1" />}
                                    {group.type}
                                </Badge>
                            </div>
                            <p className="text-slate-600 max-w-2xl">{group.description}</p>

                            <div className="flex items-center gap-4 mt-3 text-sm text-slate-500">
                                <div className="flex items-center gap-1">
                                    <Users className="h-4 w-4" />
                                    <span>{group.memberCount} members</span>
                                </div>
                                <span>•</span>
                                <span>{group.category}</span>
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="flex gap-3 md:pb-2 w-full md:w-auto">
                            <JoinGroupButton
                                groupId={group._id}
                                userId={dbUser._id.toString()}
                                isMember={isMember}
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                {/* Left Sidebar (Optional - could be rules, related groups, etc) */}
                <div className="hidden lg:block lg:col-span-1 space-y-6">
                    <div className="bg-white rounded-lg border border-slate-200 p-4">
                        <h3 className="font-semibold text-slate-900 mb-2">About</h3>
                        <p className="text-sm text-slate-600 mb-4">
                            {group.description}
                        </p>
                        <div className="text-xs text-slate-500">
                            Created {new Date(group.createdAt).toLocaleDateString()}
                        </div>
                    </div>
                </div>

                {/* Center Feed */}
                <div className="lg:col-span-3">
                    <div className="flex items-center justify-between mb-6">
                        <div className="flex-1"></div>
                    </div>

                    <Tabs defaultValue="discussions" className="w-full">
                        <div className="mb-6">
                            <TabsList className="flex flex-wrap h-auto">
                                <TabsTrigger value="discussions">Discussions</TabsTrigger>
                                <TabsTrigger value="questions">Questions</TabsTrigger>
                                <TabsTrigger value="wins">Wins</TabsTrigger>
                                <TabsTrigger value="announcements">Announcements</TabsTrigger>
                                <TabsTrigger value="resources">Resources</TabsTrigger>
                                <TabsTrigger value="surveys">Surveys</TabsTrigger>
                                <TabsTrigger value="polls">Polls</TabsTrigger>
                                <TabsTrigger value="about">About</TabsTrigger>
                                <TabsTrigger value="members">Members</TabsTrigger>
                            </TabsList>
                        </div>

                        <TabsContent value="discussions" className="space-y-6">
                            <div className="flex justify-end">
                                {isMember && (
                                    <CreateThreadDialog
                                        groupId={group._id}
                                        groupSlug={group.slug}
                                        userId={dbUser._id.toString()}
                                        forcedType="Discussion"
                                    />
                                )}
                            </div>
                            <ThreadList threads={discussionThreads} groupSlug={group.slug} />
                        </TabsContent>

                        <TabsContent value="questions" className="space-y-6">
                            <div className="flex justify-end">
                                {isMember && (
                                    <CreateThreadDialog
                                        groupId={group._id}
                                        groupSlug={group.slug}
                                        userId={dbUser._id.toString()}
                                        forcedType="Question"
                                    />
                                )}
                            </div>
                            <ThreadList threads={questionThreads} groupSlug={group.slug} />
                        </TabsContent>

                        <TabsContent value="wins" className="space-y-6">
                            <div className="flex justify-end">
                                {isMember && (
                                    <CreateThreadDialog
                                        groupId={group._id}
                                        groupSlug={group.slug}
                                        userId={dbUser._id.toString()}
                                        forcedType="Win"
                                    />
                                )}
                            </div>
                            <ThreadList threads={winThreads} groupSlug={group.slug} />
                        </TabsContent>

                        <TabsContent value="announcements" className="space-y-6">
                            <div className="flex justify-end">
                                {isMember && (isAdmin) && (
                                    <CreateThreadDialog
                                        groupId={group._id}
                                        groupSlug={group.slug}
                                        userId={dbUser._id.toString()}
                                        forcedType="Announcement"
                                    />
                                )}
                            </div>
                            <ThreadList threads={announcementThreads} groupSlug={group.slug} />
                        </TabsContent>

                        <TabsContent value="resources" className="space-y-6">
                            <ResourceFilters />
                            <div className="flex justify-end">
                                {isMember && (
                                    <CreateThreadDialog
                                        groupId={group._id}
                                        groupSlug={group.slug}
                                        userId={dbUser._id.toString()}
                                        forcedType="Resource"
                                    />
                                )}
                            </div>
                            <ThreadList threads={resourceThreads} groupSlug={group.slug} />
                        </TabsContent>

                        <TabsContent value="surveys">
                            <GroupSurveysList
                                groupId={group._id}
                                groupSlug={group.slug}
                                isAdmin={isAdmin}
                                userId={dbUser._id.toString()}
                            />
                        </TabsContent>

                        <TabsContent value="polls">
                            <GroupPollsList
                                groupId={group._id}
                                groupSlug={group.slug}
                                userId={dbUser._id.toString()}
                            />
                        </TabsContent>

                        <TabsContent value="about">
                            <div className="bg-white rounded-lg border border-slate-200 p-6 space-y-6">
                                <div>
                                    <h3 className="text-lg font-semibold text-slate-900 mb-2">About this Group</h3>
                                    <p className="text-slate-600 leading-relaxed whitespace-pre-wrap">
                                        {group.description}
                                    </p>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6 border-t border-slate-100">
                                    <div>
                                        <h4 className="font-medium text-slate-900 mb-2">Group Info</h4>
                                        <dl className="space-y-2 text-sm">
                                            <div className="flex justify-between">
                                                <dt className="text-slate-500">Created</dt>
                                                <dd className="text-slate-900">{new Date(group.createdAt).toLocaleDateString()}</dd>
                                            </div>
                                            <div className="flex justify-between">
                                                <dt className="text-slate-500">Category</dt>
                                                <dd className="text-slate-900">{group.category}</dd>
                                            </div>
                                            <div className="flex justify-between">
                                                <dt className="text-slate-500">Privacy</dt>
                                                <dd className="text-slate-900">{group.type}</dd>
                                            </div>
                                        </dl>
                                    </div>
                                    <div>
                                        <h4 className="font-medium text-slate-900 mb-2">Stats</h4>
                                        <dl className="space-y-2 text-sm">
                                            <div className="flex justify-between">
                                                <dt className="text-slate-500">Members</dt>
                                                <dd className="text-slate-900">{group.memberCount}</dd>
                                            </div>
                                            <div className="flex justify-between">
                                                <dt className="text-slate-500">Threads</dt>
                                                <dd className="text-slate-900">{group.threadCount}</dd>
                                            </div>
                                        </dl>
                                    </div>
                                </div>
                            </div>
                        </TabsContent>

                        <TabsContent value="members">
                            <div className="bg-white rounded-lg border border-slate-200 overflow-hidden">
                                <div className="p-4 border-b border-slate-100 bg-slate-50/50">
                                    <h3 className="font-semibold text-slate-900">Members ({groupMembers.length})</h3>
                                </div>
                                <div className="divide-y divide-slate-100">
                                    {groupMembers.map((member: any) => (
                                        <div key={member._id} className="p-4 flex items-center justify-between hover:bg-slate-50 transition-colors">
                                            <div className="flex items-center gap-3">
                                                <Avatar className="h-10 w-10 border border-slate-100">
                                                    <AvatarImage src={member.user?.avatar} />
                                                    <AvatarFallback>{member.user?.firstName?.[0]}</AvatarFallback>
                                                </Avatar>
                                                <div>
                                                    <div className="font-medium text-slate-900 flex items-center gap-2">
                                                        {member.user?.firstName} {member.user?.lastName}
                                                        {member.role === 'Admin' && (
                                                            <Badge variant="secondary" className="text-[10px] h-5 px-1.5 bg-indigo-100 text-indigo-700 hover:bg-indigo-100">
                                                                Admin
                                                            </Badge>
                                                        )}
                                                    </div>
                                                    <div className="text-xs text-slate-500">
                                                        Joined {new Date(member.createdAt).toLocaleDateString()}
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <div className="text-sm font-medium text-slate-900">
                                                    {member.postCount} Posts
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </TabsContent>
                    </Tabs>
                </div>
            </div>
        </div>
    );
}
