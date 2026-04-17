import { getPartnerStats, getPartnerLinks, getPartnerNetwork, getPartnerPayouts } from "@/lib/actions/partner.actions";
import { PartnerStats } from "./_components/partner-stats";
import { ReferralLinks } from "./_components/referral-links";
import { PartnerNetwork } from "./_components/partner-network";
import { PayoutSettings } from "./_components/payout-settings";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatPrice } from "@/lib/format";
import { format } from "date-fns";
import { Wallet, Info } from "lucide-react";

export default async function PartnerDashboardPage() {
    const stats = await getPartnerStats();
    const links = await getPartnerLinks();
    const network = await getPartnerNetwork();
    const payouts = await getPartnerPayouts();

    if (!stats) {
        return (
            <div className="p-6 text-center">
                <h2 className="text-xl font-bold">Partner Account Not Found</h2>
                <p>Please contact support if you believe this is an error.</p>
            </div>
        );
    }

    return (
        <div className="p-6 space-y-12 max-w-7xl mx-auto">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-4xl font-black text-slate-900 tracking-tight">Partner Program</h1>
                    <p className="text-slate-500 mt-1">Manage referrals, track earnings, and grow your network.</p>
                </div>
                <div className="bg-amber-50 border border-amber-200 p-3 rounded-lg flex items-center gap-3 text-amber-800 max-w-sm">
                    <Info className="h-5 w-5 shrink-0" />
                    <p className="text-xs">
                        Min. payout threshold: <span className="font-bold">$10.00</span>. Commissions are held for <span className="font-bold">30 days</span> to protect against refunds.
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
                    <Card className="hover:shadow-md transition-shadow">
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-lg">Payout History</CardTitle>
                            <Wallet className="h-5 w-5 text-indigo-600" />
                        </CardHeader>
                        <CardContent>
                            {payouts.length === 0 ? (
                                <div className="text-center py-8 text-muted-foreground border border-dashed rounded-lg bg-slate-50/50">
                                    <p className="text-sm">No payouts yet.</p>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    {payouts.map((payout: any) => (
                                        <div key={payout._id} className="flex justify-between items-center p-3 rounded-lg bg-slate-50 border group hover:border-indigo-200 transition-colors">
                                            <div>
                                                <p className="text-sm font-bold text-slate-900">{formatPrice(payout.amount)}</p>
                                                <p className="text-[10px] text-slate-500 uppercase font-mono tracking-tight">
                                                    {format(new Date(payout.createdAt), "MMM d, yyyy")}
                                                </p>
                                            </div>
                                            <div className={`px-2 py-1 rounded text-[10px] font-bold uppercase ${
                                                payout.status === 'completed' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'
                                            }`}>
                                                {payout.status}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                            
                            <div className="mt-8 pt-6 border-t">
                                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Earnings Breakdown</h4>
                                <div className="space-y-3">
                                    <div className="flex justify-between text-sm">
                                        <span className="text-slate-500">Gross Commissions</span>
                                        <span className="font-medium">{formatPrice(stats.totalEarnings)}</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-slate-500">Pending (Safety Period)</span>
                                        <span className="text-amber-600 font-medium">-{formatPrice(stats.pendingEarnings)}</span>
                                    </div>
                                    <div className="flex justify-between text-sm pt-2 border-t font-bold">
                                        <span>Current Balance</span>
                                        <span className="text-indigo-600">{formatPrice(stats.availableBalance)}</span>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                    
                    <Card className="bg-gradient-to-br from-slate-800 to-slate-900 text-slate-300 border-none overflow-hidden relative">
                        <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
                            <Info size={120} />
                        </div>
                        <CardHeader>
                            <CardTitle className="text-white">Partner Policy</CardTitle>
                        </CardHeader>
                        <CardContent className="text-sm space-y-4 relative z-10">
                            <p>
                                <span className="text-white font-bold">Lifetime Lock:</span> Once a user signs up via your link, they are your customer for life. You receive 45% on every purchase they ever make.
                            </p>
                            <p>
                                <span className="text-white font-bold">Last-Click wins:</span> If a user clicks multiple links before signing up, the last partner gets the attribution.
                            </p>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
