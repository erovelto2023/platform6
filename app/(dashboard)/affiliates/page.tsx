import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import connectToDatabase from "@/lib/db/connect";
import User from "@/lib/db/models/User";
import { getUserAffiliates } from "@/lib/actions/affiliate-user.actions";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Plus, Search } from "lucide-react";
import { Badge } from "@/components/ui/badge";

import AddCustomAffiliateModal from "./_components/add-custom-affiliate-modal";

export default async function UserAffiliatesPage() {
    const user = await currentUser();
    if (!user) return redirect("/sign-in");

    await connectToDatabase();
    const dbUser = await User.findOne({ clerkId: user.id });
    if (!dbUser) return redirect("/");

    const myAffiliates = await getUserAffiliates(dbUser._id);

    return (
        <div className="p-6 max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900">Affiliate CRM</h1>
                    <p className="text-slate-500 mt-1">Manage your partnerships and links in one place.</p>
                </div>
                <div className="flex gap-3">
                    <Link href="/affiliates/explore">
                        <Button className="bg-indigo-600 hover:bg-indigo-700">
                            <Search className="h-4 w-4 mr-2" />
                            Find Programs
                        </Button>
                    </Link>
                    <AddCustomAffiliateModal userId={dbUser._id.toString()} />
                </div>
            </div>

            {/* Stats Overview (Placeholder) */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
                <Card>
                    <CardContent className="p-4">
                        <p className="text-xs text-slate-500 font-medium uppercase">Active Partners</p>
                        <p className="text-2xl font-bold text-slate-900 mt-1">{myAffiliates.length}</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="p-4">
                        <p className="text-xs text-slate-500 font-medium uppercase">Total Clicks</p>
                        <p className="text-2xl font-bold text-slate-900 mt-1">0</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="p-4">
                        <p className="text-xs text-slate-500 font-medium uppercase">Conversions</p>
                        <p className="text-2xl font-bold text-slate-900 mt-1">0</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="p-4">
                        <p className="text-xs text-slate-500 font-medium uppercase">Est. Earnings</p>
                        <p className="text-2xl font-bold text-slate-900 mt-1">$0.00</p>
                    </CardContent>
                </Card>
            </div>

            {/* My Affiliates List */}
            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <h2 className="text-xl font-semibold text-slate-900">My Partners</h2>
                    <Link href="/affiliates/dashboard">
                        <Button variant="link" className="text-indigo-600">
                            View Dashboard &rarr;
                        </Button>
                    </Link>
                </div>

                {myAffiliates.length === 0 ? (
                    <Card className="bg-slate-50 border-dashed">
                        <CardContent className="flex flex-col items-center justify-center py-12 text-center">
                            <div className="h-12 w-12 rounded-full bg-indigo-100 flex items-center justify-center mb-4">
                                <Search className="h-6 w-6 text-indigo-600" />
                            </div>
                            <h3 className="text-lg font-medium text-slate-900">No partners yet</h3>
                            <p className="text-slate-500 max-w-sm mt-2 mb-6">
                                Start by exploring our database of high-paying affiliate programs or add your own.
                            </p>
                            <Link href="/affiliates/explore">
                                <Button>Explore Programs</Button>
                            </Link>
                        </CardContent>
                    </Card>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                        {myAffiliates.map((item: any) => (
                            <Link href={`/affiliates/${item.companyId._id}`} key={item._id} className="block h-full">
                                <Card className="hover:shadow-md transition-all h-full group">
                                    <CardContent className="p-4 flex flex-col items-center text-center gap-3">
                                        {/* Logo */}
                                        <div className="h-12 w-12 rounded-lg bg-slate-100 flex items-center justify-center font-bold text-slate-500 text-sm overflow-hidden">
                                            {item.companyId.logo ? (
                                                <img src={item.companyId.logo} alt={item.companyId.name} className="h-full w-full object-contain" />
                                            ) : (
                                                item.companyId.name[0]
                                            )}
                                        </div>

                                        {/* Info */}
                                        <div className="w-full min-w-0">
                                            <h3 className="font-semibold text-slate-900 truncate text-sm group-hover:text-indigo-600 transition-colors">
                                                {item.companyId.name}
                                            </h3>
                                            <div className="flex justify-center mt-1">
                                                <Badge variant={item.status === 'active' ? 'default' : 'secondary'} className="text-[10px] px-1.5 h-5 capitalize">
                                                    {item.status}
                                                </Badge>
                                            </div>
                                            <p className="text-xs text-slate-500 mt-2 truncate">
                                                {item.companyId.commissionRate || "N/A"}
                                            </p>
                                        </div>
                                    </CardContent>
                                </Card>
                            </Link>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
