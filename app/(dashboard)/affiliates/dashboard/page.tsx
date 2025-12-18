import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import connectToDatabase from "@/lib/db/connect";
import User from "@/lib/db/models/User";
import { getUserAffiliates } from "@/lib/actions/affiliate-user.actions";
import PartnersDashboardClient from "./_components/partners-dashboard-client";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default async function PartnersDashboardPage() {
    const user = await currentUser();
    if (!user) return redirect("/sign-in");

    await connectToDatabase();
    const dbUser = await User.findOne({ clerkId: user.id });
    if (!dbUser) return redirect("/");

    const myAffiliates = await getUserAffiliates(dbUser._id);

    return (
        <div className="p-6 max-w-7xl mx-auto">
            <div className="mb-8">
                <Link href="/affiliates">
                    <Button variant="ghost" className="mb-4 pl-0 hover:pl-2 transition-all">
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        Back to Overview
                    </Button>
                </Link>
                <h1 className="text-3xl font-bold text-slate-900">Partners Dashboard</h1>
                <p className="text-slate-500 mt-1">Search, filter, and manage all your affiliate partnerships.</p>
            </div>

            <PartnersDashboardClient initialPartners={myAffiliates} />
        </div>
    );
}
