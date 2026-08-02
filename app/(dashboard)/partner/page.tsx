import { getPartnerStats, getPartnerLinks, getPartnerNetwork, getPartnerPayouts } from "@/lib/actions/partner.actions";
import { PartnerStats } from "./_components/partner-stats";
import { ReferralLinks } from "./_components/referral-links";
import { PartnerNetwork } from "./_components/partner-network";
import { PayoutSettings } from "./_components/payout-settings";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatPrice } from "@/lib/format";
import { format } from "date-fns";
import { Wallet, Info, Sparkles } from "lucide-react";

import { getUserRole } from "@/lib/roles";
import { redirect } from "next/navigation";

export default async function PartnerDashboardPage() {
    const userRole = await getUserRole();
    if (userRole !== 'admin') {
        redirect("/dashboard");
    }

    const stats = await getPartnerStats();
    const links = await getPartnerLinks();
    const network = await getPartnerNetwork();
    const payouts = await getPartnerPayouts();

    if (!stats) {
        return (
            <div className="p-6 text-center text-slate-100 font-mono">
                <h2 className="text-xl font-bold text-orange-400">Partner Account Not Found</h2>
                <p className="text-slate-400 text-xs mt-1">Please contact support if you believe this is an error.</p>
            </div>
        );
    }

    return (
        <div className="p-6 space-y-8 max-w-7xl mx-auto text-slate-100">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl md:text-4xl font-black text-slate-100 uppercase tracking-tight flex items-center gap-3">
                        <Sparkles className="h-8 w-8 text-orange-400" />
                        Partner <span className="bg-gradient-to-r from-orange-400 via-amber-400 to-yellow-400 bg-clip-text text-transparent">Program</span>
                    </h1>
                    <p className="text-xs font-mono text-slate-400 mt-1">Manage referrals, track earnings, and grow your affiliate network.</p>
                </div>
                <div className="bg-amber-950/60 border border-amber-800/80 p-3 rounded-2xl flex items-center gap-3 text-amber-300 max-w-md">
                    <Info className="h-5 w-5 shrink-0 text-amber-400" />
                    <p className="text-xs font-mono">
                        Min. payout threshold: <span className="font-bold text-amber-400">$10.00</span>. Commissions held for <span className="font-bold text-amber-400">30 days</span> to protect against refunds.
                    </p>
                </div>
            </div>

            {/* Stats Overview */}
            <PartnerStats 
                totalSignups={stats.totalSignups}
                totalEarnings={stats.totalEarnings}
                pendingEarnings={stats.pendingEarnings}
                availableBalance={stats.availableBalance}
            />

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column - Links & History */}
                <div className="lg:col-span-2 space-y-8">
                    <ReferralLinks 
                        links={links} 
                        affiliateCode={stats.partnerAccount.affiliateCode} 
                    />
                    
                    <PartnerNetwork referrals={network} />
                </div>

                {/* Right Column - Payout History & Earnings Detail */}
                <div className="space-y-8">
                    <PayoutSettings 
                        initialEmail={stats.partnerAccount.payoutEmail}
                        initialMethod={stats.partnerAccount.payoutMethod}
                    />

                    <Card className="bg-slate-900 border border-slate-800 shadow-xl">
                        <CardHeader className="flex flex-row items-center justify-between pb-2 border-b border-slate-800/80">
                            <CardTitle className="text-sm font-mono font-bold text-slate-100 uppercase tracking-wider">Payout History</CardTitle>
                            <Wallet className="h-4 w-4 text-orange-400" />
                        </CardHeader>
                        <CardContent className="pt-4">
                            {payouts.length === 0 ? (
                                <div className="text-center py-8 text-slate-400 border border-dashed border-slate-800 rounded-2xl bg-slate-950/40">
                                    <p className="text-xs font-mono">No payouts yet.</p>
                                </div>
                            ) : (
                                <div className="space-y-3">
                                    {payouts.map((payout: any) => (
                                        <div key={payout._id} className="flex justify-between items-center p-3 rounded-xl bg-slate-950 border border-slate-800">
                                            <div>
                                                <p className="text-xs font-bold text-slate-100 font-mono">{formatPrice(payout.amount)}</p>
                                                <p className="text-[10px] text-slate-400 uppercase font-mono">
                                                    {format(new Date(payout.createdAt), "MMM d, yyyy")}
                                                </p>
                                            </div>
                                            <div className={`px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase ${
                                                payout.status === 'completed' ? 'bg-emerald-950 border border-emerald-800 text-emerald-400' : 'bg-amber-950 border border-amber-800 text-amber-400'
                                            }`}>
                                                {payout.status}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                            
                            <div className="mt-6 pt-5 border-t border-slate-800">
                                <h4 className="text-xs font-mono font-bold text-orange-400 uppercase tracking-wider mb-3">Earnings Breakdown</h4>
                                <div className="space-y-2.5 font-mono text-xs">
                                    <div className="flex justify-between">
                                        <span className="text-slate-400">Gross Commissions</span>
                                        <span className="font-bold text-slate-100">{formatPrice(stats.totalEarnings)}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-slate-400">Pending (Safety Period)</span>
                                        <span className="text-amber-400 font-bold">-{formatPrice(stats.pendingEarnings)}</span>
                                    </div>
                                    <div className="flex justify-between pt-2 border-t border-slate-800/80 font-bold">
                                        <span className="text-slate-200">Current Balance</span>
                                        <span className="text-emerald-400 text-sm">{formatPrice(stats.availableBalance)}</span>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                    
                    <Card className="bg-slate-900 border border-slate-800 shadow-xl overflow-hidden relative">
                        <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none text-orange-400">
                            <Info size={120} />
                        </div>
                        <CardHeader className="border-b border-slate-800/80 pb-3">
                            <CardTitle className="text-sm font-mono font-bold text-orange-400 uppercase tracking-wider">Partner Policy</CardTitle>
                        </CardHeader>
                        <CardContent className="text-xs font-mono space-y-3 pt-4 text-slate-300 leading-relaxed relative z-10">
                            <p>
                                <span className="text-amber-400 font-bold">Lifetime Lock:</span> Once a user signs up via your link, they are your customer for life. You receive 45% on every purchase they ever make.
                            </p>
                            <p>
                                <span className="text-amber-400 font-bold">Last-Click wins:</span> If a user clicks multiple links before signing up, the last partner gets the attribution.
                            </p>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
