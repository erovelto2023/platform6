import Link from "next/link";
import { getInvoices } from "@/lib/actions/invoice.actions";
import { getExpenses } from "@/lib/actions/expense.actions";
import { getBills } from "@/lib/actions/bill.actions";
import { getVendorCredits } from "@/lib/actions/vendor-credit.actions";
import { formatCurrency } from "@/lib/utils";
import { TrendingUp, TrendingDown, DollarSign, BarChart3, FileText,
    BookOpen, AlertTriangle, ChevronRight, Printer, ChevronLeft } from "lucide-react";

const REPORT_LINKS = [
    { label: "Profit & Loss", href: "/accounting/reports/profit-loss", icon: TrendingUp, color: "text-emerald-400", bg: "bg-emerald-500/10", border: "border-emerald-500/20", desc: "Income vs Expenses summary" },
    { label: "Balance Sheet", href: "/accounting/reports/trial-balance", icon: BarChart3, color: "text-blue-400", bg: "bg-blue-500/10", border: "border-blue-500/20", desc: "Assets, liabilities & equity" },
    { label: "Accounts Receivable Aging", href: "/accounting/reports/aging", icon: AlertTriangle, color: "text-amber-400", bg: "bg-amber-500/10", border: "border-amber-500/20", desc: "Overdue invoice tracking" },
    { label: "Trial Balance", href: "/accounting/reports/trial-balance", icon: BookOpen, color: "text-violet-400", bg: "bg-violet-500/10", border: "border-violet-500/20", desc: "Account debit/credit summary" },
    { label: "Expense Report", href: "/accounting/expenses", icon: TrendingDown, color: "text-rose-400", bg: "bg-rose-500/10", border: "border-rose-500/20", desc: "All expenses by category" },
    { label: "Accounts Payable", href: "/accounting/bills", icon: FileText, color: "text-indigo-400", bg: "bg-indigo-500/10", border: "border-indigo-500/20", desc: "Bills owed to vendors" },
];

export default async function ReportsPage() {
    const { data: invoices } = await getInvoices();
    const { data: expenses } = await getExpenses();
    const billsResult = await getBills();
    const bills: any[] = billsResult.data || [];
    const creditsResult = await getVendorCredits();
    const credits: any[] = creditsResult.data || [];

    const invoiceList: any[] = invoices || [];
    const expenseList: any[] = expenses || [];

    const today = new Date();
    const yearStart = new Date(today.getFullYear(), 0, 1);

    // P&L (Cash Basis by default on dashboard overview)
    const totalIncome = invoiceList.filter(i => i.status === 'paid').reduce((s, i) => s + i.total, 0);
    
    // Cash basis expenses: simple expenses + paid bills - vendor credits
    const totalPaidBills = bills.filter(b => b.status === 'paid').reduce((s, b) => s + b.total, 0);
    const totalCredits = credits.reduce((s, c) => s + c.total, 0);
    const totalExpenses = expenseList.reduce((s, e) => s + e.amount, 0) + totalPaidBills - totalCredits;

    const netProfit = totalIncome - totalExpenses;
    const margin = totalIncome > 0 ? ((netProfit / totalIncome) * 100).toFixed(1) : "0.0";

    // AP (total unpaid bills minus vendor credits)
    const rawAP = bills.filter(b => b.status !== 'paid').reduce((s, b) => s + b.total, 0);
    const totalAP = Math.max(0, rawAP - totalCredits);
    const overdueAP = bills.filter(b => b.status === 'overdue').reduce((s, b) => s + b.total, 0);

    // Monthly chart
    const months = Array.from({ length: 6 }, (_, i) => {
        const d = new Date(today.getFullYear(), today.getMonth() - (5 - i), 1);
        return { label: d.toLocaleString("default", { month: "short" }), month: d.getMonth(), year: d.getFullYear() };
    });
    const cashFlow = months.map(m => {
        const rev = invoiceList.filter(i => {
            const d = new Date(i.date);
            return i.status === 'paid' && d.getMonth() === m.month && d.getFullYear() === m.year;
        }).reduce((s, i) => s + i.total, 0);

        const expSimple = expenseList.filter(e => {
            const d = new Date(e.date);
            return d.getMonth() === m.month && d.getFullYear() === m.year;
        }).reduce((s, e) => s + e.amount, 0);

        const expBills = bills.filter(b => {
            const d = new Date(b.billDate);
            return b.status === "paid" && d.getMonth() === m.month && d.getFullYear() === m.year;
        }).reduce((s, b) => s + b.total, 0);

        const creditRefunds = credits.filter(c => {
            const d = new Date(c.paymentDate);
            return d.getMonth() === m.month && d.getFullYear() === m.year;
        }).reduce((s, c) => s + c.total, 0);

        const exp = expSimple + expBills - creditRefunds;

        return { ...m, rev, exp };
    });
    const maxBar = Math.max(...cashFlow.map(m => Math.max(m.rev, m.exp)), 1);

    // Expense by category
    const byCategory: Record<string, number> = {};
    expenseList.forEach(e => { byCategory[e.category] = (byCategory[e.category] || 0) + e.amount; });
    const topCategories = Object.entries(byCategory).sort((a, b) => b[1] - a[1]).slice(0, 8);

    // Income by month (YTD)
    const ytdInvoices = invoiceList.filter(i => i.status === 'paid' && new Date(i.date) >= yearStart);

    return (
        <div className="min-h-screen bg-[#07090e] p-6 space-y-6">
            <Link href="/accounting" className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-slate-200 transition-colors w-fit mb-4">
                <ChevronLeft className="w-3.5 h-3.5" /> Back to Accounting
            </Link>
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <div className="text-xs text-slate-500 font-bold uppercase tracking-widest mb-1">Reports & Analytics</div>
                    <h1 className="text-2xl font-black text-white">Financial Reports</h1>
                    <p className="text-slate-500 text-sm mt-0.5">
                        {yearStart.toLocaleDateString()} – {today.toLocaleDateString()} · Cash Basis
                    </p>
                </div>
                <div className="flex gap-2">
                    <Link href="/accounting/reports/profit-loss"
                        className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-bold rounded-xl transition-all shadow-lg shadow-emerald-500/20">
                        <TrendingUp className="w-4 h-4" /> P&L Report
                    </Link>
                    <Link href="/accounting"
                        className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 text-sm font-bold rounded-xl transition-all">
                        ← Back
                    </Link>
                </div>
            </div>

            {/* KPI strip */}
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                {[
                    { label: "Total Income", value: formatCurrency(totalIncome), color: "text-emerald-400" },
                    { label: "Total Expenses", value: formatCurrency(totalExpenses), color: "text-rose-400" },
                    { label: "Net Profit", value: formatCurrency(netProfit), color: netProfit >= 0 ? "text-emerald-400" : "text-rose-400" },
                    { label: "Profit Margin", value: `${margin}%`, color: "text-blue-400" },
                    { label: "Accounts Payable", value: formatCurrency(totalAP), color: "text-amber-400" },
                ].map(k => (
                    <div key={k.label} className="bg-[#0d1117] border border-slate-800/80 rounded-2xl p-4">
                        <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">{k.label}</p>
                        <p className={`text-xl font-black ${k.color}`}>{k.value}</p>
                    </div>
                ))}
            </div>

            {/* Report shortcuts */}
            <div>
                <h2 className="text-xs font-black text-slate-500 uppercase tracking-widest mb-3">Standard Reports</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {REPORT_LINKS.map((r, idx) => (
                        <Link key={`${r.href}-${idx}`} href={r.href}
                            className={`flex items-center gap-3 p-4 bg-[#0d1117] border ${r.border} rounded-2xl hover:scale-[1.02] transition-all group`}>
                            <div className={`p-2 rounded-xl ${r.bg}`}>
                                <r.icon className={`w-4 h-4 ${r.color}`} />
                            </div>
                            <div className="min-w-0">
                                <p className="text-sm font-bold text-white truncate">{r.label}</p>
                                <p className="text-[10px] text-slate-500 truncate">{r.desc}</p>
                            </div>
                            <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-slate-400 ml-auto shrink-0" />
                        </Link>
                    ))}
                </div>
            </div>

            {/* Cash Flow Chart */}
            <div className="bg-[#0d1117] border border-slate-800/80 rounded-2xl p-5">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-sm font-black text-white flex items-center gap-2">
                        <BarChart3 className="w-4 h-4 text-indigo-400" /> Cash Flow — Last 6 Months
                    </h2>
                    <div className="flex items-center gap-4 text-[10px] font-bold text-slate-500">
                        <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-sm bg-emerald-500 inline-block" />Revenue</span>
                        <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-sm bg-rose-500 inline-block" />Expenses</span>
                    </div>
                </div>
                <div className="flex items-end gap-4 h-40">
                    {cashFlow.map(m => (
                        <div key={m.label} className="flex-1 flex flex-col items-center gap-1">
                            <div className="w-full flex items-end gap-0.5 h-32">
                                <div className="flex-1 rounded-t-md bg-emerald-500/80 transition-all"
                                    style={{ height: `${(m.rev / maxBar) * 100}%`, minHeight: m.rev > 0 ? "4px" : "0" }}
                                    title={formatCurrency(m.rev)} />
                                <div className="flex-1 rounded-t-md bg-rose-500/80 transition-all"
                                    style={{ height: `${(m.exp / maxBar) * 100}%`, minHeight: m.exp > 0 ? "4px" : "0" }}
                                    title={formatCurrency(m.exp)} />
                            </div>
                            <span className="text-[9px] text-slate-500 font-bold uppercase">{m.label}</span>
                            <div className="text-center">
                                <div className="text-[8px] text-emerald-500 font-bold">{m.rev > 0 ? formatCurrency(m.rev) : ""}</div>
                                <div className="text-[8px] text-rose-500 font-bold">{m.exp > 0 ? `(${formatCurrency(m.exp)})` : ""}</div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* P&L Table + Expense Breakdown */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* P&L Statement */}
                <div className="bg-[#0d1117] border border-slate-800/80 rounded-2xl overflow-hidden">
                    <div className="flex items-center justify-between px-5 py-4 border-b border-slate-800/80">
                        <h2 className="text-sm font-black text-white">Profit & Loss Statement</h2>
                        <Link href="/accounting/reports/profit-loss"
                            className="text-xs text-indigo-400 hover:text-indigo-300 font-bold flex items-center gap-1">
                            Full Report <ChevronRight className="w-3.5 h-3.5" />
                        </Link>
                    </div>
                    <div className="p-5 space-y-1">
                        {/* Income section */}
                        <div className="text-[9px] font-extrabold text-slate-500 uppercase tracking-widest py-2">Income</div>
                        <div className="flex justify-between py-2 border-b border-slate-800/40 px-2">
                            <span className="text-sm text-slate-300">Sales / Services</span>
                            <span className="text-sm font-bold text-emerald-400">{formatCurrency(totalIncome)}</span>
                        </div>
                        <div className="flex justify-between py-2 px-2">
                            <span className="text-sm font-bold text-white">Total Income</span>
                            <span className="text-sm font-extrabold text-emerald-400">{formatCurrency(totalIncome)}</span>
                        </div>

                        {/* Expenses section */}
                        <div className="text-[9px] font-extrabold text-slate-500 uppercase tracking-widest py-2 mt-3">Cost of Expenses</div>
                        {topCategories.slice(0, 5).map(([cat, amt]) => (
                            <div key={cat} className="flex justify-between py-1.5 px-2">
                                <span className="text-sm text-slate-400 capitalize">{cat}</span>
                                <span className="text-sm text-rose-400">({formatCurrency(amt)})</span>
                            </div>
                        ))}
                        <div className="flex justify-between py-2 border-t border-slate-800/80 px-2 mt-1">
                            <span className="text-sm font-bold text-white">Total Expenses</span>
                            <span className="text-sm font-extrabold text-rose-400">({formatCurrency(totalExpenses)})</span>
                        </div>

                        {/* Net */}
                        <div className={`flex justify-between py-3 px-3 rounded-xl mt-2 ${netProfit >= 0 ? "bg-emerald-500/10" : "bg-rose-500/10"}`}>
                            <span className="text-sm font-black text-white">Net Income</span>
                            <span className={`text-lg font-black ${netProfit >= 0 ? "text-emerald-400" : "text-rose-400"}`}>
                                {formatCurrency(netProfit)}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Expense Breakdown */}
                <div className="bg-[#0d1117] border border-slate-800/80 rounded-2xl p-5">
                    <h2 className="text-sm font-black text-white mb-4">Expense Breakdown by Category</h2>
                    {topCategories.length === 0 ? (
                        <div className="text-center py-10 text-slate-400 text-xs">No expenses recorded.</div>
                    ) : (
                        <div className="space-y-3">
                            {topCategories.map(([cat, amt]) => (
                                <div key={cat}>
                                    <div className="flex items-center justify-between mb-1">
                                        <span className="text-xs font-bold text-slate-300 capitalize">{cat}</span>
                                        <div className="text-right">
                                            <span className="text-xs font-extrabold text-rose-400">{formatCurrency(amt)}</span>
                                            <span className="text-[9px] text-slate-400 ml-2">{((amt / totalExpenses) * 100).toFixed(1)}%</span>
                                        </div>
                                    </div>
                                    <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden">
                                        <div className="h-full bg-gradient-to-r from-rose-700 to-rose-400 rounded-full"
                                            style={{ width: `${(amt / totalExpenses) * 100}%` }} />
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                    <div className="mt-4 pt-4 border-t border-slate-800/80 flex justify-between text-xs font-bold">
                        <span className="text-slate-500">Total Expenses</span>
                        <span className="text-rose-400">{formatCurrency(totalExpenses)}</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
