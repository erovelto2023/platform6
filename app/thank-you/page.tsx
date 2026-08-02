import { activateGrooveSellPurchaseFromThankYou } from "@/lib/actions/groovesell.actions";
import Link from "next/link";
import { CheckCircle2, Sparkles, ArrowRight, ShieldCheck, BookOpen, Key, UserCheck } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ThankYouPageProps {
    searchParams: Promise<{
        email?: string;
        customer_email?: string;
        first_name?: string;
        customer_first_name?: string;
        last_name?: string;
        customer_last_name?: string;
        product_id?: string;
        item_id?: string;
        product_name?: string;
        trans_id?: string;
        transaction_id?: string;
        price?: string;
        amount?: string;
    }>;
}

export default async function ThankYouPage({ searchParams }: ThankYouPageProps) {
    const params = await searchParams;

    const email = (params.email || params.customer_email || "").toLowerCase().trim();
    const firstName = params.first_name || params.customer_first_name || "";
    const lastName = params.last_name || params.customer_last_name || "";
    const productId = params.product_id || params.item_id || "groovesell_main";
    const productName = params.product_name || "K Business Academy Student Access";
    const transId = params.trans_id || params.transaction_id || `GS_TY_${Date.now()}`;
    const amount = Number(params.price || params.amount || 0);

    let activationResult = null;
    if (email) {
        activationResult = await activateGrooveSellPurchaseFromThankYou({
            email,
            firstName,
            lastName,
            productId,
            productName,
            transId,
            amount
        });
    }

    return (
        <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col items-center justify-center p-4 md:p-8 font-sans selection:bg-orange-500 selection:text-slate-950">
            <div className="max-w-2xl w-full space-y-8 bg-slate-900 border border-slate-800 p-6 md:p-10 rounded-3xl shadow-2xl relative overflow-hidden">
                {/* Glow Backdrop Accent */}
                <div className="absolute -top-24 -right-24 w-64 h-64 bg-orange-500/10 rounded-full blur-3xl pointer-events-none" />
                <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

                <div className="text-center space-y-4 relative z-10">
                    <div className="inline-flex items-center justify-center h-20 w-20 rounded-3xl bg-emerald-950 border border-emerald-700/80 text-emerald-400 mb-2 shadow-2xl">
                        <CheckCircle2 className="h-10 w-10" />
                    </div>
                    
                    <h1 className="text-3xl md:text-4xl font-black uppercase tracking-tight text-slate-100 flex items-center justify-center gap-2">
                        Welcome to <span className="bg-gradient-to-r from-orange-400 via-amber-400 to-yellow-400 bg-clip-text text-transparent">K Academy</span>
                    </h1>

                    <p className="text-slate-300 font-mono text-sm md:text-base max-w-lg mx-auto leading-relaxed">
                        Thank you for your order! Your payment was successful and your student membership has been <span className="text-emerald-400 font-bold">INSTANTLY ACTIVATED</span>.
                    </p>
                </div>

                {/* Purchase Summary Card */}
                <div className="bg-slate-950 border border-slate-800 rounded-2xl p-5 md:p-6 space-y-3 font-mono text-xs relative z-10">
                    <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
                        <span className="text-slate-400 uppercase tracking-wider font-bold">Order Status</span>
                        <span className="text-emerald-400 font-bold bg-emerald-950 border border-emerald-800 px-3 py-1 rounded-full flex items-center gap-1.5">
                            <ShieldCheck className="h-3.5 w-3.5" /> Verified & Active
                        </span>
                    </div>

                    {email && (
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 pt-1">
                            <span className="text-slate-400">Account Email:</span>
                            <span className="font-bold text-amber-300 text-sm">{email}</span>
                        </div>
                    )}

                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 pt-1">
                        <span className="text-slate-400">Access Granted:</span>
                        <span className="font-bold text-slate-100">{productName}</span>
                    </div>

                    {transId && (
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 pt-1 text-[11px]">
                            <span className="text-slate-500">Transaction Ref:</span>
                            <span className="text-slate-400">{transId}</span>
                        </div>
                    )}
                </div>

                {/* Next Steps Section */}
                <div className="space-y-4 pt-2 relative z-10">
                    <h3 className="text-xs font-mono font-bold text-orange-400 uppercase tracking-wider text-center">Next Step to Access Your Courses & Tools</h3>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <Button 
                            asChild
                            className="w-full bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-400 hover:to-amber-500 text-slate-950 font-black font-mono text-xs uppercase tracking-wider h-12 rounded-xl shadow-lg cursor-pointer flex items-center justify-center gap-2"
                        >
                            <Link href="/dashboard">
                                <BookOpen className="h-4 w-4" />
                                Go to Student Dashboard
                                <ArrowRight className="h-4 w-4 ml-1" />
                            </Link>
                        </Button>

                        <Button 
                            asChild
                            variant="outline"
                            className="w-full bg-slate-950 border-slate-800 text-slate-200 hover:bg-slate-800 hover:text-white font-mono text-xs font-bold h-12 rounded-xl cursor-pointer flex items-center justify-center gap-2"
                        >
                            <Link href={`/sign-in${email ? `?email=${encodeURIComponent(email)}` : ''}`}>
                                <Key className="h-4 w-4 text-amber-400" />
                                Sign In / Access Account
                            </Link>
                        </Button>
                    </div>
                </div>

                <div className="text-center pt-4 border-t border-slate-800/80 font-mono text-[11px] text-slate-500">
                    Need assistance? Contact support anytime at <a href="mailto:support@kbusinessacademy.com" className="text-orange-400 hover:underline font-bold">support@kbusinessacademy.com</a>
                </div>
            </div>
        </div>
    );
}
