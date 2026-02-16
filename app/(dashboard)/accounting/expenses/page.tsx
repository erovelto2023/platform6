import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Plus, CreditCard, MoreHorizontal } from "lucide-react";
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
import { BackButton } from "@/components/accounting/BackButton";
import { getExpenses } from "@/lib/actions/expense.actions";
import { formatCurrency } from "@/lib/utils";

interface ExpensesPageProps {
    searchParams: {
        page?: string;
        query?: string;
        category?: string;
    };
}

export default async function ExpensesPage(props: ExpensesPageProps) {
    const searchParams = props.searchParams;
    const page = Number(searchParams?.page) || 1;
    const query = searchParams?.query || "";
    const category = searchParams?.category || "";

    const { data: expenses } = await getExpenses(page, 50, query, category);

    return (
        <div className="p-6 space-y-6 bg-slate-50 min-h-screen">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-slate-900">Expenses</h1>
                    <p className="text-muted-foreground">Track and manage business expenses.</p>
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

            <div className="bg-white rounded-lg border border-slate-200 shadow-sm overflow-hidden">
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
