import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Plus, Search, CreditCard, MoreHorizontal } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ExpenseRowActions } from "@/components/accounting/ExpenseRowActions";
import { BackButton } from "@/components/accounting/BackButton";
import { getExpenses } from "@/lib/actions/expense.actions";
import { formatCurrency } from "@/lib/utils";

export default async function ExpensesPage() {
    const { data: expenses } = await getExpenses();

    return (
        <div className="p-6 space-y-6 bg-slate-50 min-h-screen">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <BackButton href="/accounting" />
                    <div className="mt-4">
                        <h1 className="text-3xl font-bold tracking-tight text-slate-900">Expenses</h1>
                        <p className="text-muted-foreground">Track and categorize your business expenses.</p>
                    </div>
                </div>
                <Link href="/accounting/expenses/new">
                    <Button className="bg-red-600 hover:bg-red-700 text-white">
                        <Plus className="mr-2 h-4 w-4" /> Add Expense
                    </Button>
                </Link>
            </div>

            <div className="bg-white rounded-lg border border-slate-200 shadow-sm overflow-hidden">
                <div className="p-4 border-b border-slate-200 flex gap-4">
                    <div className="relative flex-1 max-w-sm">
                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-500" />
                        <Input
                            type="search"
                            placeholder="Search expenses..."
                            className="pl-9 bg-slate-50 border-slate-200"
                        />
                    </div>
                </div>

                <Table>
                    <TableHeader>
                        <TableRow className="bg-slate-50 border-slate-200 hover:bg-slate-50">
                            <TableHead className="font-medium text-slate-600">Date</TableHead>
                            <TableHead className="font-medium text-slate-600">Vendor</TableHead>
                            <TableHead className="font-medium text-slate-600">Category</TableHead>
                            <TableHead className="font-medium text-slate-600">Payment Method</TableHead>
                            <TableHead className="font-medium text-slate-600">Amount</TableHead>
                            <TableHead className="w-[80px]"></TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {expenses && expenses.length > 0 ? (
                            expenses.map((expense: any) => (
                                <TableRow key={expense._id} className="hover:bg-slate-50/50">
                                    <TableCell>{new Date(expense.date).toLocaleDateString()}</TableCell>
                                    <TableCell className="font-medium">{expense.vendor}</TableCell>
                                    <TableCell>
                                        <span className="inline-flex items-center px-2 py-1 rounded-sm text-xs font-medium bg-slate-100 text-slate-700">
                                            {expense.category}
                                        </span>
                                    </TableCell>
                                    <TableCell>{expense.paymentMethod || 'Not specified'}</TableCell>
                                    <TableCell className="font-medium text-red-600">-{formatCurrency(expense.amount)}</TableCell>
                                    <TableCell>
                                        <ExpenseRowActions expense={expense} />
                                    </TableCell>
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={6} className="h-24 text-center text-muted-foreground">
                                    No expenses found. Add your first expense to start tracking.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}
