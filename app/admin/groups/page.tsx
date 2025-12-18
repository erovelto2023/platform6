import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Users, MessageSquare, Settings } from "lucide-react";
import { getGroups } from "@/lib/actions/group.actions";
import { format } from "date-fns";

export default async function AdminGroupsPage() {
    const groups = await getGroups();

    return (
        <div className="p-6 space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Group Management</h1>
                    <p className="text-slate-600 mt-1">Create and manage community groups.</p>
                </div>
                <Link href="/admin/groups/create">
                    <Button>
                        <Plus className="h-4 w-4 mr-2" />
                        Create Group
                    </Button>
                </Link>
            </div>

            {groups.length === 0 ? (
                <Card className="border-2 border-dashed">
                    <CardContent className="py-16 text-center">
                        <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Users className="h-8 w-8 text-indigo-600" />
                        </div>
                        <h3 className="text-lg font-semibold mb-2">No Groups Yet</h3>
                        <p className="text-slate-600 mb-6 max-w-md mx-auto">
                            Create your first group to start building micro-communities.
                        </p>
                        <Link href="/admin/groups/create">
                            <Button size="lg">
                                <Plus className="h-4 w-4 mr-2" />
                                Create First Group
                            </Button>
                        </Link>
                    </CardContent>
                </Card>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {groups.map((group: any) => (
                        <Card key={group._id} className="hover:shadow-md transition">
                            <CardHeader className="pb-3">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <CardTitle className="text-lg font-bold">{group.name}</CardTitle>
                                        <div className="flex items-center gap-2 mt-1">
                                            <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${group.type === 'Public' ? 'bg-emerald-100 text-emerald-700' :
                                                    group.type === 'Private' ? 'bg-amber-100 text-amber-700' :
                                                        'bg-slate-100 text-slate-700'
                                                }`}>
                                                {group.type}
                                            </span>
                                            <span className="text-xs text-slate-500">
                                                {group.category}
                                            </span>
                                        </div>
                                    </div>
                                    <Link href={`/admin/groups/${group._id}`}>
                                        <Button variant="ghost" size="icon" className="h-8 w-8">
                                            <Settings className="h-4 w-4 text-slate-500" />
                                        </Button>
                                    </Link>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <p className="text-sm text-slate-600 mb-4 line-clamp-2">
                                    {group.description}
                                </p>

                                <div className="flex items-center justify-between text-sm text-slate-500 pt-4 border-t">
                                    <div className="flex items-center gap-4">
                                        <div className="flex items-center gap-1">
                                            <Users className="h-4 w-4" />
                                            <span>{group.memberCount}</span>
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <MessageSquare className="h-4 w-4" />
                                            <span>{group.threadCount}</span>
                                        </div>
                                    </div>
                                    <span>{format(new Date(group.createdAt), "MMM d, yyyy")}</span>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
}
