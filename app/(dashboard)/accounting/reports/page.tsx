import { BackButton } from "@/components/accounting/BackButton";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { BookOpen } from "lucide-react";
import { getInvoices } from "@/lib/actions/invoice.actions";
import { getExpenses } from "@/lib/actions/expense.actions";
import { formatCurrency } from "@/lib/utils";
import { TrendingUp, TrendingDown, DollarSign } from "lucide-react";
import { FinancialChart } from "@/components/accounting/FinancialChart";

export default async function ReportsPage() {
    const { data: invoices } = await getInvoices();
    const { data: expenses } = await getExpenses();

    const invoiceList = invoices || [];
    const expenseList = expenses || [];

    // Calculate totals
    const totalIncome = invoiceList
        .filter((inv: any) => inv.status === 'paid')
        .reduce((sum: number, inv: any) => sum + inv.total, 0);

    const totalExpenses = expenseList
        .reduce((sum: number, exp: any) => sum + exp.amount, 0);

    const netProfit = totalIncome - totalExpenses;

    // Group expenses by category
    const expensesByCategory = expenseList.reduce((acc: any, exp: any) => {
        acc[exp.category] = (acc[exp.category] || 0) + exp.amount;
        return acc;
    }, {});

    // Prepare chart data (Monthly aggregation for last 6 months)
    const monthlyData: Record<string, { income: number; expenses: number; order: number }> = {};
    const today = new Date();

    // Initialize last 6 months
    for (let i = 5; i >= 0; i--) {
        const d = new Date(today.getFullYear(), today.getMonth() - i, 1);
        const monthName = d.toLocaleString('default', { month: 'short' });
        monthlyData[monthName] = { income: 0, expenses: 0, order: i };
    }

    // Aggregate Income
    invoiceList.forEach((inv: any) => {
        if (inv.status === 'paid') {
            const d = new Date(inv.date);
            const monthName = d.toLocaleString('default', { month: 'short' });
            if (monthlyData[monthName]) {
                monthlyData[monthName].income += inv.total;
            }
        }
    });

    // Aggregate Expenses
    expenseList.forEach((exp: any) => {
        const d = new Date(exp.date);
        const monthName = d.toLocaleString('default', { month: 'short' });
        if (monthlyData[monthName]) {
            monthlyData[monthName].expenses += exp.amount;
        }
    });

    const chartData = Object.entries(monthlyData)
        .sort(([, a], [, b]) => b.order - a.order) // Actually we initialized in order, but object keys iteration order isn't guaranteed. Wait.
        // Better to just map the initialized months.
        // Let's rely on the fact we only populated keys we care about.
        // Actually, simple sort index is safer.
        .map(([name, data]) => ({
            name,
            income: data.income,
            expenses: data.expenses,
            order: data.order
        }))
        .sort((a, b) => a.order - b.order) // wait, i=5 is 5 months ago (largest diff). i=0 is today. 
    // Logic: i=5 (5 months ago).. i=0 (this month). 
    // So we want to sort by 'order' descending? No.
    // i=5 is Jan (if today June). i=0 is June.
    // We want Jan -> June.
    // My loop: i=5 (Jan), i=4 (Feb)...
    // monthlyData['Jan'] = { order: 5 }
    // monthlyData['Jun'] = { order: 0 }
    // We want Jan first. So verify loop order.
    // Actually simpler: just generate the array directly relative to now.
    // Let's rewrite the aggregation slightly for robustness

    const chartDataArray = [];
    for (let i = 5; i >= 0; i--) {
        const d = new Date(today.getFullYear(), today.getMonth() - i, 1);
        const monthName = d.toLocaleString('default', { month: 'short' });

        // Calculate totals for this specific month/year to handle year rollover correctly
        const monthIncome = invoiceList
            .filter((inv: any) => {
                if (inv.status !== 'paid') return false;
                const invDate = new Date(inv.date);
                return invDate.getMonth() === d.getMonth() && invDate.getFullYear() === d.getFullYear();
            })
            .reduce((sum: number, inv: any) => sum + inv.total, 0);

        const monthExpenses = expenseList
            .filter((exp: any) => {
                const expDate = new Date(exp.date);
                return expDate.getMonth() === d.getMonth() && expDate.getFullYear() === d.getFullYear();
            })
            .reduce((sum: number, exp: any) => sum + exp.amount, 0);

        chartDataArray.push({
            name: monthName,
            income: monthIncome,
            expenses: monthExpenses
        });
    }


    return (
        <div className="p-6 space-y-6 bg-slate-50 min-h-screen">
            <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <BackButton href="/accounting" />
                    <div className="mt-4">
                        <h1 className="text-3xl font-bold tracking-tight text-slate-900">Financial Reports</h1>
                        <p className="text-muted-foreground">View your business performance and financial health.</p>
                    </div>
                </div>
                <Link href="/accounting/ledger">
                    <Button variant="outline">
                        <BookOpen className="mr-2 h-4 w-4" />
                        General Ledger
                    </Button>
                </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <Link href="/accounting/reports/trial-balance">
                    <Card className="hover:bg-slate-50 transition cursor-pointer border-slate-200">
                        <CardHeader>
                            <CardTitle className="text-lg">Trial Balance</CardTitle>
                            <CardDescription>View balances for all your accounts.</CardDescription>
                        </CardHeader>
                    </Card>
                </Link>
                <Link href="/accounting/reports/aging">
                    <Card className="hover:bg-slate-50 transition cursor-pointer border-slate-200">
                        <CardHeader>
                            <CardTitle className="text-lg">Aging Report</CardTitle>
                            <CardDescription>See which invoices are overdue.</CardDescription>
                        </CardHeader>
                    </Card>
                </Link>
            </div>

            {/* Chart */}
            <FinancialChart data={chartDataArray} />

            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="border-l-4 border-l-green-500 shadow-sm">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-slate-500">Total Income</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-slate-900">{formatCurrency(totalIncome)}</div>
                    </CardContent>
                </Card>

                <Card className="border-l-4 border-l-red-500 shadow-sm">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-slate-500">Total Expenses</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-slate-900">{formatCurrency(totalExpenses)}</div>
                    </CardContent>
                </Card>

                <Card className={`border-l-4 shadow-sm ${netProfit >= 0 ? 'border-l-blue-500' : 'border-l-orange-500'}`}>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-slate-500">Net Profit</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className={`text-2xl font-bold ${netProfit >= 0 ? 'text-blue-600' : 'text-orange-600'}`}>
                            {formatCurrency(netProfit)}
                        </div>
                    </CardContent>
                </Card>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Profit and Loss Summary */}
                <Card className="shadow-sm">
                    <CardHeader>
                        <CardTitle>Profit & Loss Statement</CardTitle>
                        <CardDescription>Summary of income minus expenses</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            <div className="flex justify-between items-center py-2 border-b border-slate-100">
                                <span className="font-medium text-slate-700 flex items-center gap-2">
                                    <TrendingUp className="h-4 w-4 text-green-500" /> Income
                                </span>
                                <span className="text-green-600 font-medium">{formatCurrency(totalIncome)}</span>
                            </div>
                            <div className="flex justify-between items-center py-2 border-b border-slate-100">
                                <span className="font-medium text-slate-700 flex items-center gap-2">
                                    <TrendingDown className="h-4 w-4 text-red-500" /> Expenses
                                </span>
                                <span className="text-red-600 font-medium">{formatCurrency(totalExpenses)}</span>
                            </div>
                            <div className="flex justify-between items-center py-3 bg-slate-50 px-4 rounded-lg mt-4">
                                <span className="font-bold text-slate-900">Net Profit</span>
                                <span className={`font-bold ${netProfit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                    {formatCurrency(netProfit)}
                                </span>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Expense Breakdown */}
                <Card className="shadow-sm">
                    <CardHeader>
                        <CardTitle>Expense Breakdown</CardTitle>
                        <CardDescription>Expenses by category</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {Object.keys(expensesByCategory).length > 0 ? (
                                Object.entries(expensesByCategory).map(([category, amount]: [string, any]) => (
                                    <div key={category} className="space-y-1">
                                        <div className="flex justify-between text-sm">
                                            <span className="font-medium text-slate-700">{category}</span>
                                            <span className="text-slate-600">{formatCurrency(amount)}</span>
                                        </div>
                                        <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                                            <div
                                                className="h-full bg-red-400 rounded-full"
                                                style={{ width: `${(amount / totalExpenses) * 100}%` }}
                                            />
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="text-center py-8 text-muted-foreground">
                                    No expenses recorded yet.
                                </div>
                            )}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
