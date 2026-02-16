import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, ArrowUpRight, ArrowDownRight, DollarSign, TrendingUp, Users, FileText, CreditCard, BarChart3 } from "lucide-react";
import Link from "next/link";
import { getInvoices } from "@/lib/actions/invoice.actions";
import { getExpenses } from "@/lib/actions/expense.actions";
import { getOrCreateBusiness, getActiveBusinessId } from "@/lib/actions/business.actions";
import { formatCurrency } from "@/lib/utils";
import { BusinessInitializer } from "@/components/accounting/BusinessInitializer";

export default async function AccountingDashboard() {
    const businessData = await getOrCreateBusiness();
    const business = businessData.data;
    const activeBusinessId = await getActiveBusinessId();

    const invoicesData = await getInvoices();
    const expensesData = await getExpenses();

    const invoices = invoicesData.data || [];
    const expenses = expensesData.data || [];

    // Calculate generic stats
    const totalRevenue = invoices
        .filter((inv: any) => inv.status === 'paid')
        .reduce((sum: number, inv: any) => sum + inv.total, 0);

    const pendingRevenue = invoices
        .filter((inv: any) => inv.status === 'sent' || inv.status === 'overdue')
        .reduce((sum: number, inv: any) => sum + inv.total, 0);

    const totalExpenses = expenses
        .reduce((sum: number, exp: any) => sum + exp.amount, 0);

    const netIncome = totalRevenue - totalExpenses;

    // Recent activity (combine invoices and expenses, sort by date)
    const recentInvoices = invoices.slice(0, 5).map((inv: any) => ({
        id: inv._id,
        type: 'invoice',
        description: `Invoice #${inv.invoiceNumber} - ${inv.clientId?.name || 'Unknown Client'}`,
        amount: inv.total,
        date: inv.date,
        status: inv.status
    }));

    const recentExpenses = expenses.slice(0, 5).map((exp: any) => ({
        id: exp._id,
        type: 'expense',
        description: `Expense - ${exp.vendor} (${exp.category})`,
        amount: -exp.amount,
        date: exp.date,
        status: 'paid'
    }));

    const recentActivity = [...recentInvoices, ...recentExpenses]
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
        .slice(0, 5);

    return (
        <div className="p-6 space-y-6 bg-slate-50 min-h-screen">
            <BusinessInitializer businessId={business._id} activeBusinessId={activeBusinessId} />
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-slate-900">Accounting Dashboard</h1>
                    <p className="text-muted-foreground">Overview of your business finances.</p>
                </div>
                <div className="flex gap-2">
                    <Link href="/accounting/invoices/new">
                        <Button className="bg-blue-600 hover:bg-blue-700">
                            <Plus className="mr-2 h-4 w-4" /> New Invoice
                        </Button>
                    </Link>
                    <Link href="/accounting/expenses/new">
                        <Button variant="outline" className="border-slate-300">
                            <Plus className="mr-2 h-4 w-4" /> Add Expense
                        </Button>
                    </Link>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <Card className="border-slate-200 shadow-sm">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                        <DollarSign className="h-4 w-4 text-green-600" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{formatCurrency(totalRevenue)}</div>
                        <p className="text-xs text-muted-foreground flex items-center mt-1">
                            <ArrowUpRight className="h-3 w-3 text-green-500 mr-1" />
                            Collected this year
                        </p>
                    </CardContent>
                </Card>

                <Card className="border-slate-200 shadow-sm">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Expenses</CardTitle>
                        <CreditCard className="h-4 w-4 text-red-600" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{formatCurrency(totalExpenses)}</div>
                        <p className="text-xs text-muted-foreground flex items-center mt-1">
                            <ArrowDownRight className="h-3 w-3 text-red-500 mr-1" />
                            Total expenses
                        </p>
                    </CardContent>
                </Card>

                <Card className="border-slate-200 shadow-sm">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Net Income</CardTitle>
                        <TrendingUp className="h-4 w-4 text-blue-600" />
                    </CardHeader>
                    <CardContent>
                        <div className={`text-2xl font-bold ${netIncome >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                            {formatCurrency(netIncome)}
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">
                            Revenue minus expenses
                        </p>
                    </CardContent>
                </Card>

                <Card className="border-slate-200 shadow-sm">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Pending Invoices</CardTitle>
                        <FileText className="h-4 w-4 text-orange-600" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{formatCurrency(pendingRevenue)}</div>
                        <p className="text-xs text-muted-foreground mt-1">
                            Unpaid invoices
                        </p>
                    </CardContent>
                </Card>
            </div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                {/* Recent Activity */}
                <Card className="col-span-1 lg:col-span-2 border-slate-200 shadow-sm">
                    <CardHeader>
                        <CardTitle>Recent Activity</CardTitle>
                        <CardDescription>Your latest financial transactions.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {recentActivity.length > 0 ? (
                                recentActivity.map((item) => (
                                    <div key={item.id} className="flex items-center justify-between border-b border-slate-100 pb-4 last:border-0 last:pb-0">
                                        <div className="flex items-center gap-4">
                                            <div className={`p-2 rounded-full ${item.type === 'invoice' ? 'bg-blue-100 text-blue-600' : 'bg-red-100 text-red-600'}`}>
                                                {item.type === 'invoice' ? <FileText className="h-4 w-4" /> : <CreditCard className="h-4 w-4" />}
                                            </div>
                                            <div>
                                                <p className="text-sm font-medium text-slate-900">{item.description}</p>
                                                <p className="text-xs text-slate-500">{new Date(item.date).toLocaleDateString()}</p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className={`text-sm font-medium ${item.type === 'invoice' ? 'text-green-600' : 'text-red-600'}`}>
                                                {item.type === 'invoice' ? '+' : ''}{formatCurrency(item.amount)}
                                            </p>
                                            <p className="text-xs text-slate-500 capitalize">{item.status}</p>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="text-center py-8 text-muted-foreground">
                                    No recent activity found.
                                </div>
                            )}
                        </div>

                        <div className="mt-4 pt-4 border-t border-slate-100 flex justify-center">
                            <Link href="/accounting/reports" className="text-sm text-blue-600 hover:text-blue-700 font-medium">
                                View All Transactions
                            </Link>
                        </div>
                    </CardContent>
                </Card>

                {/* Quick Links / Status */}
                <div className="space-y-6">
                    <Card className="border-slate-200 shadow-sm">
                        <CardHeader>
                            <CardTitle>Quick Access</CardTitle>
                        </CardHeader>
                        <CardContent className="grid grid-cols-2 gap-4">
                            <Link href="/accounting/invoices" className="flex flex-col items-center justify-center p-4 bg-slate-50 hover:bg-slate-100 rounded-lg transition border border-slate-200">
                                <FileText className="h-6 w-6 text-blue-600 mb-2" />
                                <span className="text-sm font-medium">Invoices</span>
                            </Link>
                            <Link href="/accounting/expenses" className="flex flex-col items-center justify-center p-4 bg-slate-50 hover:bg-slate-100 rounded-lg transition border border-slate-200">
                                <CreditCard className="h-6 w-6 text-red-600 mb-2" />
                                <span className="text-sm font-medium">Expenses</span>
                            </Link>
                            <Link href="/accounting/clients" className="flex flex-col items-center justify-center p-4 bg-slate-50 hover:bg-slate-100 rounded-lg transition border border-slate-200">
                                <Users className="h-6 w-6 text-purple-600 mb-2" />
                                <span className="text-sm font-medium">Clients</span>
                            </Link>
                            <Link href="/accounting/reports" className="flex flex-col items-center justify-center p-4 bg-slate-50 hover:bg-slate-100 rounded-lg transition border border-slate-200">
                                <BarChart3 className="h-6 w-6 text-green-600 mb-2" />
                                <span className="text-sm font-medium">Reports</span>
                            </Link>
                            <Link href="/accounting/journal" className="flex flex-col items-center justify-center p-4 bg-slate-50 hover:bg-slate-100 rounded-lg transition border border-slate-200 col-span-2 md:col-span-1">
                                <FileText className="h-6 w-6 text-slate-600 mb-2" />
                                <span className="text-sm font-medium">Journal</span>
                            </Link>
                        </CardContent>
                    </Card>

                    <Card className="bg-gradient-to-br from-blue-600 to-indigo-700 text-white border-0 shadow-md">
                        <CardHeader>
                            <CardTitle className="text-white">Pro Tip</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-sm text-blue-100 mb-4">
                                Connect your business bank account to automatically import transactions and save time on data entry.
                            </p>
                            <Button size="sm" variant="secondary" className="w-full bg-white text-blue-700 hover:bg-blue-50">
                                Coming Soon
                            </Button>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
