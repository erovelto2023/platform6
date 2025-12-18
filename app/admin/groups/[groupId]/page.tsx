import { currentUser } from "@clerk/nextjs/server";
import { redirect, notFound } from "next/navigation";
import connectToDatabase from "@/lib/db/connect";
import User from "@/lib/db/models/User";
import { getGroupById, getGroupMembers, getGroupMember } from "@/lib/actions/group.actions";
import { EditGroupForm } from "./_components/edit-group-form";
import { MemberManagement } from "./_components/member-management";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

interface AdminGroupPageProps {
    params: Promise<{ groupId: string }>;
}

export default async function AdminGroupPage({ params }: AdminGroupPageProps) {
    const { groupId } = await params;
    const user = await currentUser();
    if (!user) return redirect("/sign-in");

    await connectToDatabase();
    const dbUser = await User.findOne({ clerkId: user.id });
    if (!dbUser) return redirect("/");

    // Check if user is a system admin OR a group admin
    const member = await getGroupMember(groupId, dbUser._id.toString());
    const isGroupAdmin = member?.role === "Admin";
    const isSystemAdmin = dbUser.role === "admin";

    if (!isGroupAdmin && !isSystemAdmin) {
        return redirect("/");
    }

    const group = await getGroupById(groupId);
    if (!group) return notFound();

    const members = await getGroupMembers(groupId);

    return (
        <div className="max-w-5xl mx-auto py-10 px-6">
            <div className="mb-8">
                <Link
                    href={`/community/groups/${group.slug}`}
                    className="inline-flex items-center text-sm text-slate-500 hover:text-slate-900 transition-colors mb-4"
                >
                    <ArrowLeft className="h-4 w-4 mr-1" />
                    Back to Group
                </Link>
                <h1 className="text-3xl font-bold text-slate-900">Manage Group: {group.name}</h1>
                <p className="text-slate-500 mt-2">Update settings and manage members.</p>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                <Tabs defaultValue="settings" className="w-full">
                    <div className="border-b border-slate-200 px-6 pt-4">
                        <TabsList className="mb-4">
                            <TabsTrigger value="settings">Settings</TabsTrigger>
                            <TabsTrigger value="members">Members ({members.length})</TabsTrigger>
                        </TabsList>
                    </div>

                    <div className="p-6">
                        <TabsContent value="settings" className="mt-0">
                            <div className="max-w-2xl">
                                <EditGroupForm group={group} />
                            </div>
                        </TabsContent>

                        <TabsContent value="members" className="mt-0">
                            <MemberManagement groupId={groupId} members={members} />
                        </TabsContent>
                    </div>
                </Tabs>
            </div>
        </div>
    );
}
