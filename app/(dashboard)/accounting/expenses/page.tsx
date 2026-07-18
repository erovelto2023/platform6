import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Plus, CreditCard, MoreHorizontal, ChevronLeft } from "lucide-react";
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
import { Search } from "@/components/ui/Search";
import { Filter } from "@/components/ui/Filter";
import { ExpenseRowActions } from "@/components/accounting/ExpenseRowActions";
import { getExpenses } from "@/lib/actions/expense.actions";
import { formatCurrency } from "@/lib/utils";

interface ExpensesPageProps {
    searchParams: Promise<{
        page?: string;
        query?: string;
        category?: string;
    }>;
}

export default async function ExpensesPage(props: ExpensesPageProps) {
    const searchParams = await props.searchParams;
    const page = Number(searchParams?.page) || 1;
    const query = searchParams?.query || "";
    const category = searchParams?.category || "";

    const { data: expenses } = await getExpenses(page, 50, query, category);

    return (
        <div className="min-h-screen bg-[#07090e] p-6 space-y-6 dark text-white">
            <Link href="/accounting" className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-slate-200 transition-colors w-fit mb-4">
                <ChevronLeft className="w-3.5 h-3.5" /> Back to Accounting
            </Link>
            <div className="flex justify-between items-center">
                <div className="space-y-1">
                    
                    <h1 className="text-3xl font-bold tracking-tight text-white">Expenses</h1>
                    <p className="text-slate-400">Track and manage business expenses.</p>
                </div>
                <Link href="/accounting/expenses/new">
                    <Button className="bg-blue-600 hover:bg-blue-700">
                        <Plus className="mr-2 h-4 w-4" />
                        Record Expense
                    </Button>
                </Link>
            </div>

            <div className="flex items-center gap-4 mb-4">
                <Search placeholder="Search expenses..." />
                <Filter
                    paramName="category"
                    placeholder="Filter by Category"
                    options={[
                        { label: 'Office Supplies', value: 'Office Supplies' },
                        { label: 'Travel', value: 'Travel' },
                        { label: 'Meals', value: 'Meals' },
                        { label: 'Utilities', value: 'Utilities' },
                        { label: 'Software', value: 'Software' },
                        { label: 'Rent', value: 'Rent' },
                        { label: 'Other', value: 'Other' },
                    ]}
                />
            </div>

            <div className="bg-[#0d1117] rounded-lg border border-slate-800/80 shadow-sm overflow-hidden">
                <Table>
                    <TableHeader>
                        <TableRow className="bg-[#07090e] border-slate-800/80 hover:bg-[#07090e]">
                            <TableHead className="font-medium text-slate-400">Date</TableHead>
                            <TableHead className="font-medium text-slate-400">Vendor</TableHead>
                            <TableHead className="font-medium text-slate-400">Category</TableHead>
                            <TableHead className="font-medium text-slate-400">Payment Method</TableHead>
                            <TableHead className="font-medium text-slate-400">Amount</TableHead>
                            <TableHead className="w-[80px]"></TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {expenses && expenses.length > 0 ? (
                            expenses.map((expense: any) => (
                                <TableRow key={expense._id} className="hover:bg-[#07090e]/50">
                                    <TableCell>{new Date(expense.date).toLocaleDateString()}</TableCell>
                                    <TableCell className="font-medium">{expense.vendor}</TableCell>
                                    <TableCell>
                                        <span className="inline-flex items-center px-2 py-1 rounded-sm text-xs font-medium bg-slate-800 text-slate-300">
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
                                <TableCell colSpan={6} className="h-24 text-center text-slate-400">
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
