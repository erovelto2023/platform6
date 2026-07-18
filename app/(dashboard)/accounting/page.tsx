import Link from "next/link";
import { getInvoices } from "@/lib/actions/invoice.actions";
import { getExpenses } from "@/lib/actions/expense.actions";
import { getOrCreateBusiness, getActiveBusinessId } from "@/lib/actions/business.actions";
import { getBills } from "@/lib/actions/bill.actions";
import { getVendorCredits } from "@/lib/actions/vendor-credit.actions";
import { formatCurrency } from "@/lib/utils";
import { BusinessInitializer } from "@/components/accounting/BusinessInitializer";
import { Plus, ArrowUpRight, ArrowDownRight, DollarSign, TrendingUp, FileText,
    CreditCard, BarChart3, Package, Wallet, BookOpen, Truck, Key, Users,
    AlertTriangle, CheckCircle2, Clock, ChevronRight, Receipt, PieChart,
    Building2, Layers, Activity, ShieldCheck, RotateCcw, ChevronLeft } from "lucide-react";

export default async function AccountingDashboard() {
    const businessData = await getOrCreateBusiness();
    const business = businessData.data;
    const activeBusinessId = await getActiveBusinessId();

    const invoicesData = await getInvoices();
    const expensesData = await getExpenses();
    const billsData = await getBills();
    const creditsData = await getVendorCredits();

    const invoices: any[] = invoicesData.data || [];
    const expenses: any[] = expensesData.data || [];
    const bills: any[] = billsData.data || [];
    const credits: any[] = creditsData.data || [];

    // ── KPI Calculations ────────────────────────────────────
    const totalRevenue = invoices.filter(i => i.status === "paid").reduce((s, i) => s + i.total, 0);
    const pendingRevenue = invoices.filter(i => ["sent", "overdue"].includes(i.status)).reduce((s, i) => s + i.total, 0);
    const overdueRevenue = invoices.filter(i => i.status === "overdue").reduce((s, i) => s + i.total, 0);
    
    // Cash basis expenses: simple expenses + paid bills - vendor credits
    const totalPaidBills = bills.filter(b => b.status === "paid").reduce((s, b) => s + b.total, 0);
    const totalCredits = credits.reduce((s, c) => s + c.total, 0);
    const totalExpenses = expenses.reduce((s, e) => s + e.amount, 0) + totalPaidBills - totalCredits;

    const netIncome = totalRevenue - totalExpenses;
    const profitMargin = totalRevenue > 0 ? ((netIncome / totalRevenue) * 100).toFixed(1) : "0.0";

    // Invoice counts
    const draftCount = invoices.filter(i => i.status === "draft").length;
    const sentCount = invoices.filter(i => i.status === "sent").length;
    const overdueCount = invoices.filter(i => i.status === "overdue").length;
    const paidCount = invoices.filter(i => i.status === "paid").length;

    // Expense by category (Cash Basis)
    const expenseByCategory: Record<string, number> = {};
    expenses.forEach(e => {
        const cat = e.category || 'Uncategorized';
        expenseByCategory[cat] = (expenseByCategory[cat] || 0) + e.amount;
    });
    bills.filter(b => b.status === "paid").forEach(b => {
        b.items.forEach((item: any) => {
            const cat = item.category || 'Uncategorized';
            expenseByCategory[cat] = (expenseByCategory[cat] || 0) + item.amount;
        });
    });
    credits.forEach(c => {
        c.items.forEach((item: any) => {
            const cat = item.category || 'Uncategorized';
            expenseByCategory[cat] = (expenseByCategory[cat] || 0) - item.amount;
        });
    });
    const topCategories = Object.entries(expenseByCategory)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5);

    // Recent combined activity
    const recentActivity = [
        ...invoices.slice(0, 6).map(inv => ({
            id: inv._id, type: "invoice" as const,
            label: `Invoice #${inv.invoiceNumber}`,
            sub: inv.clientId?.name || "Unknown Client",
            amount: inv.total, date: inv.date, status: inv.status,
        })),
        ...expenses.slice(0, 4).map(exp => ({
            id: exp._id, type: "expense" as const,
            label: exp.vendor || "Expense",
            sub: exp.category,
            amount: -exp.amount, date: exp.date, status: "paid" as const,
        })),
    ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).slice(0, 8);

    // Monthly cash flow (last 6 months)
    const now = new Date();
    const months = Array.from({ length: 6 }, (_, i) => {
        const d = new Date(now.getFullYear(), now.getMonth() - (5 - i), 1);
        return { label: d.toLocaleString("default", { month: "short" }), month: d.getMonth(), year: d.getFullYear() };
    });
    const cashFlow = months.map(m => {
        const rev = invoices.filter(inv => {
            const d = new Date(inv.date);
            return d.getMonth() === m.month && d.getFullYear() === m.year && inv.status === "paid";
        }).reduce((s, i) => s + i.total, 0);

        const expSimple = expenses.filter(e => {
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

    const statusConfig: Record<string, { label: string; cls: string }> = {
        paid: { label: "Paid", cls: "bg-emerald-500/15 text-emerald-400 border border-emerald-500/20" },
        sent: { label: "Sent", cls: "bg-blue-500/15 text-blue-400 border border-blue-500/20" },
        overdue: { label: "Overdue", cls: "bg-rose-500/15 text-rose-400 border border-rose-500/20" },
        draft: { label: "Draft", cls: "bg-slate-700 text-slate-400" },
    };

    const modules = [
        { label: "Invoices", href: "/accounting/invoices", icon: FileText, color: "text-blue-400", bg: "bg-blue-500/10", border: "border-blue-500/20", count: invoices.length },
        { label: "Estimates", href: "/accounting/estimates", icon: FileText, color: "text-violet-400", bg: "bg-violet-500/10", border: "border-violet-500/20" },
        { label: "Sales Receipts", href: "/accounting/sales-receipts", icon: Receipt, color: "text-teal-400", bg: "bg-teal-500/10", border: "border-teal-500/20" },
        { label: "Receive Payment", href: "/accounting/receive-payment", icon: DollarSign, color: "text-emerald-400", bg: "bg-emerald-500/10", border: "border-emerald-500/20" },
        { label: "Statements", href: "/accounting/statements", icon: FileText, color: "text-pink-400", bg: "bg-pink-500/10", border: "border-pink-500/20" },
        { label: "Bills (AP)", href: "/accounting/bills", icon: Building2, color: "text-amber-400", bg: "bg-amber-500/10", border: "border-amber-500/20" },
        { label: "Vendor Credits", href: "/accounting/vendor-credits", icon: RotateCcw, color: "text-cyan-400", bg: "bg-cyan-500/10", border: "border-cyan-500/20" },
        { label: "Expenses", href: "/accounting/expenses", icon: CreditCard, color: "text-rose-400", bg: "bg-rose-500/10", border: "border-rose-500/20", count: expenses.length },
        { label: "Clients", href: "/accounting/clients", icon: Users, color: "text-sky-400", bg: "bg-sky-500/10", border: "border-sky-500/20" },
        { label: "Vendors", href: "/accounting/vendors", icon: Truck, color: "text-indigo-400", bg: "bg-indigo-500/10", border: "border-indigo-500/20" },
        { label: "Products", href: "/accounting/products", icon: Package, color: "text-orange-400", bg: "bg-orange-500/10", border: "border-orange-500/20" },
        { label: "Accounts", href: "/accounting/accounts", icon: Wallet, color: "text-cyan-400", bg: "bg-cyan-500/10", border: "border-cyan-500/20" },
        { label: "Journal", href: "/accounting/journal", icon: Layers, color: "text-purple-400", bg: "bg-purple-500/10", border: "border-purple-500/20" },
        { label: "Ledger", href: "/accounting/ledger", icon: BookOpen, color: "text-teal-400", bg: "bg-teal-500/10", border: "border-teal-500/20" },
        { label: "Reports", href: "/accounting/reports", icon: BarChart3, color: "text-emerald-400", bg: "bg-emerald-500/10", border: "border-emerald-500/20" },
        { label: "Logins", href: "/accounting/credentials", icon: ShieldCheck, color: "text-slate-400", bg: "bg-slate-700/50", border: "border-slate-700" },
    ];

    return (
        <div className="min-h-screen bg-[#07090e] p-6 space-y-6">
            <BusinessInitializer businessId={business._id} activeBusinessId={activeBusinessId} />

            {/* ── Header ── */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <div className="flex items-center gap-2 text-xs text-slate-500 font-bold uppercase tracking-widest mb-1">
                        <Building2 className="w-3.5 h-3.5" />
                        {business?.name || "My Business"} · Accounting
                    </div>
                    <h1 className="text-2xl font-black text-white">Financial Overview</h1>
                    <p className="text-slate-500 text-sm mt-0.5">
                        {new Date().toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric" })}
                    </p>
                </div>
                <div className="flex gap-2 flex-wrap">
                    <Link href="/accounting/invoices/new"
                        className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-bold rounded-xl transition-all shadow-lg shadow-indigo-500/20">
                        <Plus className="w-4 h-4" /> New Invoice
                    </Link>
                    <Link href="/accounting/expenses/new"
                        className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-sm font-bold rounded-xl border border-slate-700 transition-all">
                        <Plus className="w-4 h-4" /> Add Expense
                    </Link>
                </div>
            </div>

            {/* ── Module Navigation ── */}
            <div>
                <h2 className="text-sm font-black text-slate-500 uppercase tracking-widest mb-4">Accounting Modules</h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
                    {modules.map(m => (
                        <Link key={m.href} href={m.href}
                            className={`group flex flex-col items-center justify-center gap-2 p-4 rounded-2xl border ${m.border} ${m.bg} hover:scale-[1.03] transition-all duration-200`}>
                            <m.icon className={`w-6 h-6 ${m.color} group-hover:scale-110 transition-transform`} />
                            <span className="text-xs font-bold text-slate-300 group-hover:text-white transition-colors">{m.label}</span>
                            {m.count !== undefined && (
                                <span className="text-[9px] font-extrabold text-slate-500">{m.count} records</span>
                            )}
                        </Link>
                    ))}
                </div>
            </div>

            {/* ── KPI Strip ── */}
            <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
                {[
                    { label: "Total Revenue", value: formatCurrency(totalRevenue), icon: DollarSign, color: "text-emerald-400", bg: "bg-emerald-500/10", change: "+collected", up: true },
                    { label: "Total Expenses", value: formatCurrency(totalExpenses), icon: CreditCard, color: "text-rose-400", bg: "bg-rose-500/10", change: "all time", up: false },
                    { label: "Net Income", value: formatCurrency(netIncome), icon: TrendingUp, color: netIncome >= 0 ? "text-emerald-400" : "text-rose-400", bg: netIncome >= 0 ? "bg-emerald-500/10" : "bg-rose-500/10", change: `${profitMargin}% margin`, up: netIncome >= 0 },
                    { label: "Awaiting Payment", value: formatCurrency(pendingRevenue), icon: Clock, color: "text-amber-400", bg: "bg-amber-500/10", change: `${sentCount} invoices`, up: true },
                    { label: "Overdue", value: formatCurrency(overdueRevenue), icon: AlertTriangle, color: "text-rose-400", bg: "bg-rose-500/10", change: `${overdueCount} invoices`, up: false },
                ].map(k => (
                    <div key={k.label} className="bg-[#0d1117] border border-slate-800/80 rounded-2xl p-5">
                        <div className="flex items-center justify-between mb-3">
                            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">{k.label}</span>
                            <div className={`p-2 rounded-xl ${k.bg}`}>
                                <k.icon className={`w-4 h-4 ${k.color}`} />
                            </div>
                        </div>
                        <div className={`text-xl font-black ${k.color}`}>{k.value}</div>
                        <div className="flex items-center gap-1 mt-1 text-[10px] text-slate-500 font-bold">
                            {k.up ? <ArrowUpRight className="w-3 h-3 text-emerald-500" /> : <ArrowDownRight className="w-3 h-3 text-rose-500" />}
                            {k.change}
                        </div>
                    </div>
                ))}
            </div>

            {/* ── Invoice Status Swimlane ── */}
            <div className="bg-[#0d1117] border border-slate-800/80 rounded-2xl p-5">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-sm font-black text-white uppercase tracking-widest flex items-center gap-2">
                        <Activity className="w-4 h-4 text-indigo-400" /> Invoice Pipeline
                    </h2>
                    <Link href="/accounting/invoices" className="text-xs text-indigo-400 hover:text-indigo-300 font-bold flex items-center gap-1">
                        View All <ChevronRight className="w-3.5 h-3.5" />
                    </Link>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {[
                        { label: "Draft", count: draftCount, icon: FileText, color: "text-slate-400", bg: "bg-slate-800", bar: "bg-slate-600" },
                        { label: "Sent", count: sentCount, icon: Clock, color: "text-blue-400", bg: "bg-blue-500/10", bar: "bg-blue-500" },
                        { label: "Overdue", count: overdueCount, icon: AlertTriangle, color: "text-rose-400", bg: "bg-rose-500/10", bar: "bg-rose-500" },
                        { label: "Paid", count: paidCount, icon: CheckCircle2, color: "text-emerald-400", bg: "bg-emerald-500/10", bar: "bg-emerald-500" },
                    ].map(s => (
                        <div key={s.label} className={`rounded-xl p-4 ${s.bg} border border-white/5`}>
                            <div className="flex items-center gap-2 mb-2">
                                <s.icon className={`w-4 h-4 ${s.color}`} />
                                <span className={`text-xs font-bold ${s.color}`}>{s.label}</span>
                            </div>
                            <div className="text-2xl font-black text-white">{s.count}</div>
                            <div className={`h-1 rounded-full mt-2 ${s.bar}`} style={{ width: `${invoices.length ? (s.count / invoices.length) * 100 : 0}%`, minWidth: "4px" }} />
                        </div>
                    ))}
                </div>
            </div>

            {/* ── Main Grid ── */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                {/* Cash Flow Chart */}
                <div className="lg:col-span-2 bg-[#0d1117] border border-slate-800/80 rounded-2xl p-5">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-sm font-black text-white uppercase tracking-widest flex items-center gap-2">
                            <BarChart3 className="w-4 h-4 text-emerald-400" /> Cash Flow — Last 6 Months
                        </h2>
                        <div className="flex items-center gap-4 text-[10px] font-bold">
                            <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-sm bg-emerald-500 inline-block" />Revenue</span>
                            <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-sm bg-rose-500 inline-block" />Expenses</span>
                        </div>
                    </div>
                    <div className="flex items-end gap-3 h-36">
                        {cashFlow.map(m => (
                            <div key={m.label} className="flex-1 flex flex-col items-center gap-1">
                                <div className="w-full flex items-end gap-1 h-28">
                                    <div className="flex-1 rounded-t-md bg-emerald-500/80 transition-all"
                                        style={{ height: `${(m.rev / maxBar) * 100}%`, minHeight: m.rev > 0 ? "4px" : "0" }}
                                        title={formatCurrency(m.rev)} />
                                    <div className="flex-1 rounded-t-md bg-rose-500/80 transition-all"
                                        style={{ height: `${(m.exp / maxBar) * 100}%`, minHeight: m.exp > 0 ? "4px" : "0" }}
                                        title={formatCurrency(m.exp)} />
                                </div>
                                <span className="text-[9px] text-slate-500 font-bold uppercase">{m.label}</span>
                            </div>
                        ))}
                    </div>
                    {cashFlow.every(m => m.rev === 0 && m.exp === 0) && (
                        <p className="text-center text-slate-400 text-xs mt-4">No transactions recorded yet.</p>
                    )}
                </div>

                {/* Expense Breakdown */}
                <div className="bg-[#0d1117] border border-slate-800/80 rounded-2xl p-5">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-sm font-black text-white uppercase tracking-widest flex items-center gap-2">
                            <PieChart className="w-4 h-4 text-rose-400" /> Expense Breakdown
                        </h2>
                        <Link href="/accounting/expenses" className="text-xs text-indigo-400 hover:text-indigo-300 font-bold flex items-center gap-1">
                            View All <ChevronRight className="w-3.5 h-3.5" />
                        </Link>
                    </div>
                    {topCategories.length === 0 ? (
                        <div className="text-center py-8 text-slate-400 text-xs">No expenses recorded.</div>
                    ) : (
                        <div className="space-y-3">
                            {topCategories.map(([cat, amt]) => (
                                <div key={cat}>
                                    <div className="flex items-center justify-between mb-1">
                                        <span className="text-xs font-bold text-slate-300 capitalize truncate max-w-[120px]">{cat}</span>
                                        <span className="text-xs font-extrabold text-rose-400">{formatCurrency(amt)}</span>
                                    </div>
                                    <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden">
                                        <div className="h-full bg-gradient-to-r from-rose-600 to-rose-400 rounded-full"
                                            style={{ width: `${(amt / totalExpenses) * 100}%` }} />
                                    </div>
                                    <span className="text-[9px] text-slate-400 font-bold">
                                        {((amt / totalExpenses) * 100).toFixed(1)}% of total
                                    </span>
                                </div>
                            ))}
                        </div>
                    )}
                    <div className="mt-4 pt-4 border-t border-slate-800/80">
                        <div className="flex justify-between text-xs font-bold">
                            <span className="text-slate-500">Total Expenses</span>
                            <span className="text-rose-400">{formatCurrency(totalExpenses)}</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* ── Recent Activity ── */}
            <div className="bg-[#0d1117] border border-slate-800/80 rounded-2xl p-5">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-sm font-black text-white uppercase tracking-widest flex items-center gap-2">
                        <Receipt className="w-4 h-4 text-slate-400" /> Recent Transactions
                    </h2>
                    <Link href="/accounting/reports" className="text-xs text-indigo-400 hover:text-indigo-300 font-bold flex items-center gap-1">
                        Full Report <ChevronRight className="w-3.5 h-3.5" />
                    </Link>
                </div>
                {recentActivity.length === 0 ? (
                    <div className="text-center py-10 text-slate-400 text-xs">No transactions recorded yet.</div>
                ) : (
                    <div className="space-y-1">
                        {recentActivity.map(item => {
                            const sc = statusConfig[item.status] || statusConfig.draft;
                            return (
                                <div key={item.id}
                                    className="flex items-center justify-between py-3 px-3 rounded-xl hover:bg-slate-800/40 transition-all">
                                    <div className="flex items-center gap-3 min-w-0">
                                        <div className={`p-2 rounded-lg shrink-0 ${item.type === "invoice" ? "bg-blue-500/10" : "bg-rose-500/10"}`}>
                                            {item.type === "invoice"
                                                ? <FileText className="w-3.5 h-3.5 text-blue-400" />
                                                : <CreditCard className="w-3.5 h-3.5 text-rose-400" />}
                                        </div>
                                        <div className="min-w-0">
                                            <p className="text-sm font-bold text-white truncate">{item.label}</p>
                                            <p className="text-[10px] text-slate-500 truncate">{item.sub} · {new Date(item.date).toLocaleDateString()}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3 shrink-0 ml-4">
                                        <span className={`text-[9px] px-2 py-0.5 rounded font-extrabold uppercase ${sc.cls}`}>{sc.label}</span>
                                        <span className={`text-sm font-extrabold ${item.amount >= 0 ? "text-emerald-400" : "text-rose-400"}`}>
                                            {item.amount >= 0 ? "+" : ""}{formatCurrency(Math.abs(item.amount))}
                                        </span>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>



            {/* ── P&L Summary Row ── */}
            <div className="bg-gradient-to-r from-indigo-950/60 to-slate-900 border border-indigo-500/20 rounded-2xl p-5">
                <h2 className="text-sm font-black text-indigo-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                    <TrendingUp className="w-4 h-4" /> Profit & Loss Summary
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="space-y-2">
                        <p className="text-xs text-slate-500 font-bold uppercase">Gross Revenue</p>
                        <p className="text-2xl font-black text-emerald-400">{formatCurrency(totalRevenue)}</p>
                        <p className="text-[10px] text-slate-400">{paidCount} paid invoices</p>
                    </div>
                    <div className="space-y-2">
                        <p className="text-xs text-slate-500 font-bold uppercase">Total Expenses</p>
                        <p className="text-2xl font-black text-rose-400">({formatCurrency(totalExpenses)})</p>
                        <p className="text-[10px] text-slate-400">{expenses.length} expense records</p>
                    </div>
                    <div className="space-y-2 border-t md:border-t-0 md:border-l border-slate-800 md:pl-6 pt-4 md:pt-0">
                        <p className="text-xs text-slate-500 font-bold uppercase">Net Income</p>
                        <p className={`text-3xl font-black ${netIncome >= 0 ? "text-emerald-400" : "text-rose-400"}`}>
                            {formatCurrency(netIncome)}
                        </p>
                        <p className="text-[10px] text-slate-400">{profitMargin}% profit margin</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
