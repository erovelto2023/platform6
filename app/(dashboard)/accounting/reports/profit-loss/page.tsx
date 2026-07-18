import Link from "next/link";
import { getInvoices } from "@/lib/actions/invoice.actions";
import { getExpenses } from "@/lib/actions/expense.actions";
import { getOrCreateBusiness } from "@/lib/actions/business.actions";
import { getBills } from "@/lib/actions/bill.actions";
import { getVendorCredits } from "@/lib/actions/vendor-credit.actions";
import { formatCurrency } from "@/lib/utils";
import { TrendingUp, TrendingDown, ChevronLeft } from "lucide-react";
import PrintButton from "@/components/accounting/PrintButton";

export default async function ProfitLossReportPage({
    searchParams,
}: {
    searchParams: Promise<{ from?: string; to?: string; method?: string }>;
}) {
    const params = await searchParams;
    const today = new Date();
    const yearStart = new Date(today.getFullYear(), 0, 1);
    const fromDate = params.from ? new Date(params.from) : yearStart;
    const toDate = params.to ? new Date(params.to) : today;
    const method = params.method || "cash";

    const { data: business } = await getOrCreateBusiness();
    const { data: invoices } = await getInvoices();
    const { data: expenses } = await getExpenses();
    const { data: bills } = await getBills();
    const { data: vendorCredits } = await getVendorCredits();

    const invoiceList: any[] = invoices || [];
    const expenseList: any[] = expenses || [];
    const billList: any[] = bills || [];
    const creditList: any[] = vendorCredits || [];

    const filteredInvoices = invoiceList.filter(i => {
        const d = new Date(i.date);
        const inRange = d >= fromDate && d <= toDate;
        if (!inRange) return false;

        if (method === "cash") {
            return i.status === 'paid';
        } else {
            return i.status !== 'draft';
        }
    });

    const rawExpenses: { category: string; amount: number; date: Date }[] = [];

    // Simple expenses (always cash/bank or cash method matching)
    expenseList.forEach((e: any) => {
        rawExpenses.push({
            category: e.category || 'Uncategorized Expense',
            amount: e.amount,
            date: new Date(e.date)
        });
    });

    // Bills
    billList.forEach((b: any) => {
        const inScope = method === 'cash' ? b.status === 'paid' : true;
        if (inScope) {
            b.items.forEach((item: any) => {
                rawExpenses.push({
                    category: item.category || 'Uncategorized Expense',
                    amount: item.amount,
                    date: new Date(b.billDate)
                });
            });
        }
    });

    // Vendor Credits
    creditList.forEach((c: any) => {
        c.items.forEach((item: any) => {
            rawExpenses.push({
                category: item.category || 'Uncategorized Expense',
                amount: -item.amount,
                date: new Date(c.paymentDate)
            });
        });
    });

    const filteredExpenses = rawExpenses.filter(e => {
        return e.date >= fromDate && e.date <= toDate;
    });

    const totalIncome = filteredInvoices.reduce((s, i) => s + i.total, 0);
    const totalExpenses = filteredExpenses.reduce((s, e) => s + e.amount, 0);
    const netProfit = totalIncome - totalExpenses;
    const margin = totalIncome > 0 ? ((netProfit / totalIncome) * 100).toFixed(1) : "0.0";

    // Income by client
    const incomeByClient: Record<string, number> = {};
    filteredInvoices.forEach(i => {
        const name = i.clientId?.name || "Unknown";
        incomeByClient[name] = (incomeByClient[name] || 0) + i.total;
    });

    // Expense by category
    const expByCategory: Record<string, number> = {};
    filteredExpenses.forEach(e => {
        expByCategory[e.category] = (expByCategory[e.category] || 0) + e.amount;
    });

    return (
        <div className="min-h-screen bg-[#07090e] p-6 space-y-6">
            <Link href="/accounting" className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-slate-200 transition-colors w-fit mb-4">
                <ChevronLeft className="w-3.5 h-3.5" /> Back to Accounting
            </Link>
            {/* Filter bar */}
            <div className="bg-[#0d1117] border border-slate-800/80 rounded-2xl p-4">
                <div className="flex flex-wrap items-center gap-4">
                    <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">Report Period</div>
                    <form className="flex flex-wrap items-center gap-3">
                        <div className="flex items-center gap-2">
                            <label className="text-xs text-slate-500 font-bold">From</label>
                            <input type="date" name="from" defaultValue={fromDate.toISOString().split("T")[0]}
                                className="bg-slate-800 border border-slate-700 text-white text-xs rounded-lg px-2 py-1.5 focus:outline-none focus:border-indigo-500" />
                        </div>
                        <div className="flex items-center gap-2">
                            <label className="text-xs text-slate-500 font-bold">To</label>
                            <input type="date" name="to" defaultValue={toDate.toISOString().split("T")[0]}
                                className="bg-slate-800 border border-slate-700 text-white text-xs rounded-lg px-2 py-1.5 focus:outline-none focus:border-indigo-500" />
                        </div>
                        <div className="flex items-center gap-2">
                            <label className="text-xs text-slate-500 font-bold">Accounting Method</label>
                            <select name="method" defaultValue={method}
                                className="bg-slate-800 border border-slate-700 text-white text-xs rounded-lg px-2 py-1.5 focus:outline-none focus:border-indigo-500">
                                <option value="cash">Cash</option>
                                <option value="accrual">Accrual</option>
                            </select>
                        </div>
                        <button type="submit" className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-lg transition-all">
                            Run Report
                        </button>
                    </form>
                    <div className="ml-auto flex gap-2">
                        <PrintButton />
                        <Link href="/accounting/reports" className="text-xs text-slate-500 hover:text-slate-300 px-3 py-1.5 font-bold">
                            ← Reports
                        </Link>
                    </div>
                </div>
            </div>

            {/* Report Header */}
            <div className="bg-[#0d1117] border border-slate-800/80 rounded-2xl p-8">
                <div className="text-center mb-8">
                    <h1 className="text-xl font-black text-white">{business?.name || "K Business Academy"}</h1>
                    <p className="text-slate-400 font-bold mt-1">Profit and Loss</p>
                    <p className="text-slate-500 text-sm mt-0.5">
                        {fromDate.toLocaleDateString()} – {toDate.toLocaleDateString()} · {method === "cash" ? "Cash" : "Accrual"} Basis
                    </p>
                </div>

                {totalIncome === 0 && totalExpenses === 0 ? (
                    <div className="text-center py-10 border border-slate-800 rounded-xl text-slate-500 text-sm">
                        <TrendingUp className="w-8 h-8 mx-auto mb-2 opacity-20" />
                        Your selection doesn't have any info. Change your selection or start a new search.
                    </div>
                ) : (
                    <div className="max-w-2xl mx-auto space-y-6">
                        {/* INCOME */}
                        <div>
                            <div className="flex justify-between items-center py-2 border-b-2 border-slate-700 mb-2">
                                <span className="text-xs font-extrabold text-slate-400 uppercase tracking-widest">Income</span>
                                <span className="text-xs font-extrabold text-slate-400 uppercase tracking-widest">Total</span>
                            </div>
                            {Object.entries(incomeByClient).map(([client, amt]) => (
                                <div key={client} className="flex justify-between py-1.5 px-2 hover:bg-slate-800/30 rounded">
                                    <span className="text-sm text-slate-300">{client}</span>
                                    <span className="text-sm text-emerald-400 font-bold">{formatCurrency(amt)}</span>
                                </div>
                            ))}
                            {filteredInvoices.length === 0 && (
                                <div className="px-2 py-1.5 text-sm text-slate-400">No income in this period</div>
                            )}
                            <div className="flex justify-between py-2 px-2 border-t border-slate-800/80 mt-1">
                                <span className="text-sm font-black text-white">Total Income</span>
                                <span className="text-sm font-black text-emerald-400">{formatCurrency(totalIncome)}</span>
                            </div>
                        </div>

                        {/* GROSS PROFIT */}
                        <div className="flex justify-between py-2 px-3 bg-emerald-500/5 border border-emerald-500/10 rounded-xl">
                            <span className="text-sm font-bold text-white">Gross Profit</span>
                            <span className="text-sm font-extrabold text-emerald-400">{formatCurrency(totalIncome)}</span>
                        </div>

                        {/* EXPENSES */}
                        <div>
                            <div className="flex justify-between items-center py-2 border-b-2 border-slate-700 mb-2">
                                <span className="text-xs font-extrabold text-slate-400 uppercase tracking-widest">Expenses</span>
                                <span className="text-xs font-extrabold text-slate-400 uppercase tracking-widest">Total</span>
                            </div>
                            {Object.entries(expByCategory).map(([cat, amt]) => (
                                <div key={cat} className="flex justify-between py-1.5 px-2 hover:bg-slate-800/30 rounded">
                                    <span className="text-sm text-slate-300 capitalize">{cat}</span>
                                    <span className="text-sm text-rose-400 font-bold">{formatCurrency(amt)}</span>
                                </div>
                            ))}
                            {filteredExpenses.length === 0 && (
                                <div className="px-2 py-1.5 text-sm text-slate-400">No expenses in this period</div>
                            )}
                            <div className="flex justify-between py-2 px-2 border-t border-slate-800/80 mt-1">
                                <span className="text-sm font-black text-white">Total Expenses</span>
                                <span className="text-sm font-black text-rose-400">{formatCurrency(totalExpenses)}</span>
                            </div>
                        </div>

                        {/* NET INCOME */}
                        <div className={`flex justify-between py-4 px-5 rounded-2xl border ${netProfit >= 0 ? "bg-emerald-500/10 border-emerald-500/20" : "bg-rose-500/10 border-rose-500/20"}`}>
                            <div>
                                <p className="text-base font-black text-white">Net Income</p>
                                <p className="text-xs text-slate-500 mt-0.5">{margin}% profit margin</p>
                            </div>
                            <span className={`text-2xl font-black ${netProfit >= 0 ? "text-emerald-400" : "text-rose-400"}`}>
                                {formatCurrency(netProfit)}
                            </span>
                        </div>

                        <p className="text-center text-[10px] text-slate-400">
                            {method === "cash" ? "Cash basis" : "Accrual basis"} · Generated {today.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric", hour: "2-digit", minute: "2-digit", timeZoneName: "short" })}
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}
