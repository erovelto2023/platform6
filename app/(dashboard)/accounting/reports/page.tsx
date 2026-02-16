import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { getInvoices } from "@/lib/actions/invoice.actions";
import { getExpenses } from "@/lib/actions/expense.actions";
import { formatCurrency } from "@/lib/utils";
import { TrendingUp, TrendingDown, DollarSign } from "lucide-react";

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

    return (
        <div className="p-6 space-y-6 bg-slate-50 min-h-screen">
            <div className="mb-8">
                <h1 className="text-3xl font-bold tracking-tight text-slate-900">Financial Reports</h1>
                <p className="text-muted-foreground">View your business performance and financial health.</p>
            </div>

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
