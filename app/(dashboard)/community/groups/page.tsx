import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import connectToDatabase from "@/lib/db/connect";
import User from "@/lib/db/models/User";
import { getGroups } from "@/lib/actions/group.actions";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users, MessageSquare, Globe, Lock, DollarSign } from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";

export default async function CommunityGroupsPage() {
    const user = await currentUser();
    if (!user) return redirect("/sign-in");

    await connectToDatabase();
    const dbUser = await User.findOne({ clerkId: user.id });
    if (!dbUser) return redirect("/");

    const groups = await getGroups({ status: "Active" });

    return (
        <div className="max-w-6xl mx-auto p-6 space-y-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-slate-900">Community Groups</h1>
                    <p className="text-slate-600 mt-1">Discover and join micro-communities tailored to your interests.</p>
                </div>
                {/* Search/Filter could go here */}
            </div>

            {groups.length === 0 ? (
                <div className="text-center py-16 bg-white rounded-xl border border-slate-200 shadow-sm">
                    <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Users className="h-8 w-8 text-slate-400" />
                    </div>
                    <h3 className="text-lg font-semibold text-slate-900 mb-2">No Groups Found</h3>
                    <p className="text-slate-500 max-w-md mx-auto">
                        There are no active groups yet. Check back soon!
                    </p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {groups.map((group: any) => (
                        <Card key={group._id} className="flex flex-col hover:shadow-lg transition-shadow duration-200 border-slate-200 overflow-hidden">
                            <div className="h-32 bg-gradient-to-r from-indigo-500 to-purple-600 relative">
                                {group.bannerUrl && (
                                    <img src={group.bannerUrl} alt={group.name} className="w-full h-full object-cover" />
                                )}
                                <div className="absolute top-4 right-4">
                                    <Badge variant="secondary" className="bg-white/90 text-slate-900 shadow-sm backdrop-blur-sm">
                                        {group.type === 'Public' && <Globe className="h-3 w-3 mr-1" />}
                                        {group.type === 'Private' && <Lock className="h-3 w-3 mr-1" />}
                                        {group.type === 'Paid' && <DollarSign className="h-3 w-3 mr-1" />}
                                        {group.type}
                                    </Badge>
                                </div>
                            </div>
                            <CardHeader className="pb-2 relative">
                                <div className="w-16 h-16 bg-white rounded-xl shadow-md border-4 border-white absolute -top-8 left-6 flex items-center justify-center overflow-hidden">
                                    {group.imageUrl ? (
                                        <img src={group.imageUrl} alt={group.name} className="w-full h-full object-cover" />
                                    ) : (
                                        <div className="w-full h-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold text-xl">
                                            {group.name[0]}
                                        </div>
                                    )}
                                </div>
                                <div className="pt-8">
                                    <CardTitle className="text-xl font-bold text-slate-900 line-clamp-1">
                                        {group.name}
                                    </CardTitle>
                                    <p className="text-sm text-slate-500 mt-1">{group.category}</p>
                                </div>
                            </CardHeader>
                            <CardContent className="flex-1">
                                <p className="text-slate-600 text-sm line-clamp-3 mb-4">
                                    {group.description}
                                </p>
                                <div className="flex items-center gap-4 text-sm text-slate-500">
                                    <div className="flex items-center gap-1">
                                        <Users className="h-4 w-4" />
                                        <span>{group.memberCount} members</span>
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <MessageSquare className="h-4 w-4" />
                                        <span>{group.threadCount} posts</span>
                                    </div>
                                </div>
                            </CardContent>
                            <CardFooter className="pt-0 pb-6">
                                <Link href={`/community/groups/${group.slug}`} className="w-full">
                                    <Button className="w-full bg-indigo-600 hover:bg-indigo-700">
                                        View Group
                                    </Button>
                                </Link>
                            </CardFooter>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
}
