import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import connectToDatabase from "@/lib/db/connect";
import User from "@/lib/db/models/User";
import { getUserAffiliates } from "@/lib/actions/affiliate-user.actions";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { 
    Plus, 
    Search, 
    Link as LinkIcon, 
    DollarSign, 
    TrendingUp, 
    Users, 
    MousePointerClick, 
    ArrowRight, 
    Sparkles, 
    ExternalLink,
    Building2,
    CheckCircle2
} from "lucide-react";
import AddCustomAffiliateModal from "./_components/add-custom-affiliate-modal";

export default async function UserAffiliatesPage() {
    const user = await currentUser();
    if (!user) return redirect("/sign-in");

    await connectToDatabase();
    const dbUser = await User.findOne({ clerkId: user.id });
    if (!dbUser) return redirect("/");

    const myAffiliates = await getUserAffiliates(dbUser._id);

    return (
        <div className="min-h-screen bg-slate-950 text-slate-100 p-4 md:p-8 font-sans selection:bg-blue-500 selection:text-slate-950">
            <div className="max-w-7xl mx-auto space-y-8">
                
                {/* HERO HEADER */}
                <div className="relative rounded-3xl p-8 md:p-10 overflow-hidden border border-slate-800 bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900 shadow-2xl space-y-6">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10 font-mono">
                        <div className="space-y-3 max-w-3xl">
                            <span className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest px-3.5 py-1.5 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20">
                                <LinkIcon className="h-4 w-4" /> AFFILIATE CRM & PARTNER VAULT
                            </span>
                            <h1 className="text-3xl md:text-5xl font-black tracking-tight text-slate-100 uppercase">
                                Affiliate <span className="bg-gradient-to-r from-blue-400 via-indigo-400 to-cyan-400 bg-clip-text text-transparent">Partner Hub</span>
                            </h1>
                            <p className="text-slate-300 text-sm leading-relaxed font-sans">
                                Organize, track, and scale your high-ticket affiliate partnerships, custom referral links, and commission rates in one place.
                            </p>
                        </div>

                        <div className="flex flex-wrap items-center gap-3 shrink-0">
                            <Link href="/affiliates/explore">
                                <Button className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-mono text-xs font-bold uppercase tracking-wider h-11 px-5 rounded-xl shadow-lg flex items-center gap-2 cursor-pointer">
                                    <Search className="h-4 w-4" />
                                    Explore Catalog
                                </Button>
                            </Link>
                            <AddCustomAffiliateModal userId={dbUser._id.toString()} />
                        </div>
                    </div>
                </div>

                {/* METRICS STATS OVERVIEW */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 font-mono">
                    <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-xl space-y-2">
                        <div className="flex items-center justify-between">
                            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Active Partners</span>
                            <Users className="h-5 w-5 text-blue-400" />
                        </div>
                        <p className="text-3xl font-black text-slate-100">{myAffiliates.length}</p>
                        <p className="text-[10px] text-slate-500">Tracked in your vault</p>
                    </div>

                    <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-xl space-y-2">
                        <div className="flex items-center justify-between">
                            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Total Clicks</span>
                            <MousePointerClick className="h-5 w-5 text-indigo-400" />
                        </div>
                        <p className="text-3xl font-black text-slate-100">0</p>
                        <p className="text-[10px] text-slate-500">Tracked outbound links</p>
                    </div>

                    <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-xl space-y-2">
                        <div className="flex items-center justify-between">
                            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Conversions</span>
                            <TrendingUp className="h-5 w-5 text-emerald-400" />
                        </div>
                        <p className="text-3xl font-black text-slate-100">0%</p>
                        <p className="text-[10px] text-slate-500">Click-to-lead ratio</p>
                    </div>

                    <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-xl space-y-2">
                        <div className="flex items-center justify-between">
                            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Est. Earnings</span>
                            <DollarSign className="h-5 w-5 text-amber-400" />
                        </div>
                        <p className="text-3xl font-black text-slate-100">$0.00</p>
                        <p className="text-[10px] text-slate-500">Lifetime payouts</p>
                    </div>
                </div>

                {/* MY PARTNERS SECTION */}
                <div className="space-y-6 font-mono">
                    <div className="flex items-center justify-between">
                        <h2 className="text-xl font-black uppercase text-slate-100 tracking-tight flex items-center gap-2">
                            <Building2 className="h-5 w-5 text-blue-400" />
                            My Partner Companies ({myAffiliates.length})
                        </h2>

                        <Link href="/affiliates/dashboard">
                            <Button variant="ghost" size="sm" className="text-xs text-blue-400 hover:text-blue-300 font-bold uppercase tracking-wider flex items-center gap-1">
                                View Full Dashboard <ArrowRight className="h-3.5 w-3.5" />
                            </Button>
                        </Link>
                    </div>

                    {myAffiliates.length === 0 ? (
                        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-12 text-center shadow-2xl space-y-4 font-mono">
                            <div className="h-16 w-16 rounded-2xl bg-blue-950 border border-blue-800 flex items-center justify-center mx-auto text-blue-400">
                                <LinkIcon className="h-8 w-8" />
                            </div>
                            <div className="space-y-1">
                                <h3 className="text-lg font-bold text-slate-200 uppercase">No Affiliate Partners Added Yet</h3>
                                <p className="text-xs text-slate-400 max-w-md mx-auto">
                                    Explore our high-paying affiliate program directory or manually add custom partners.
                                </p>
                            </div>

                            <div className="flex justify-center gap-3 pt-2">
                                <Link href="/affiliates/explore">
                                    <Button className="bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs uppercase px-5 rounded-xl">
                                        Explore Directory
                                    </Button>
                                </Link>
                                <AddCustomAffiliateModal userId={dbUser._id.toString()} />
                            </div>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                            {myAffiliates.map((item: any) => (
                                <Link href={`/affiliates/${item.companyId._id}`} key={item._id} className="block h-full group">
                                    <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-xl h-full flex flex-col justify-between hover:border-blue-500/50 transition-all space-y-4">
                                        <div className="space-y-3">
                                            {/* LOGO */}
                                            <div className="h-14 w-14 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-center font-black text-blue-400 text-xl overflow-hidden mx-auto shadow-md">
                                                {item.companyId.logo ? (
                                                    <img src={item.companyId.logo} alt={item.companyId.name} className="h-full w-full object-contain p-2" />
                                                ) : (
                                                    item.companyId.name[0]?.toUpperCase()
                                                )}
                                            </div>

                                            {/* COMPANY INFO */}
                                            <div className="text-center space-y-1">
                                                <h3 className="font-bold text-slate-100 text-sm group-hover:text-blue-400 transition-colors truncate">
                                                    {item.companyId.name}
                                                </h3>
                                                
                                                <span className="inline-block text-[10px] font-bold text-emerald-400 bg-emerald-950 border border-emerald-800 px-2.5 py-0.5 rounded-full uppercase">
                                                    {item.status || "active"}
                                                </span>
                                            </div>
                                        </div>

                                        {/* COMMISSION RATE */}
                                        <div className="pt-3 border-t border-slate-800/80 text-center">
                                            <span className="text-[10px] text-slate-400 block uppercase">Commission Rate</span>
                                            <span className="text-xs font-bold text-amber-400 truncate block">
                                                {item.companyId.commissionRate || "Custom Terms"}
                                            </span>
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    )}
                </div>

            </div>
        </div>
    );
}
