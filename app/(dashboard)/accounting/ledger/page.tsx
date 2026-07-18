import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import { getLedgerTransactions } from '@/lib/actions/ledger.actions';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { formatCurrency } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

export default async function GeneralLedgerPage() {
    const { success, data: transactions, error } = await getLedgerTransactions();

    if (!success || error) {
        return (
        <div className="min-h-screen bg-[#07090e] p-6 space-y-6 dark text-white">
            <Link href="/accounting" className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-slate-200 transition-colors w-fit mb-4">
                <ChevronLeft className="w-3.5 h-3.5" /> Back to Accounting
            </Link>
                Failed to load ledger: {error}
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#07090e] p-6 space-y-6 dark text-white">
            <Link href="/accounting" className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-slate-200 transition-colors w-fit mb-4">
                <ChevronLeft className="w-3.5 h-3.5" /> Back to Accounting
            </Link>
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight text-white">General Ledger</h1>
                        <p className="text-slate-400">Centralized view of all financial transactions.</p>
                    </div>
                </div>
            </div>

            <Card className="border-slate-800/80 shadow-sm">
                <CardHeader>
                    <CardTitle>Transactions</CardTitle>
                    <CardDescription>All Invoices, Expenses, and Journal Entries sorted by date.</CardDescription>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="w-[100px]">Date</TableHead>
                                <TableHead>Type</TableHead>
                                <TableHead>Reference</TableHead>
                                <TableHead>Description</TableHead>
                                <TableHead>Account / User</TableHead>
                                <TableHead className="text-right">Debit</TableHead>
                                <TableHead className="text-right">Credit</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {transactions && transactions.length > 0 ? (
                                transactions.map((tx: any, index: number) => (
                                    <TableRow key={tx.id || index} className="hover:bg-[#07090e]">
                                        <TableCell className="font-medium">{new Date(tx.date).toLocaleDateString()}</TableCell>
                                        <TableCell>
                                            <Badge variant="outline" className={
                                                tx.type === 'Invoice' ? 'bg-blue-50 text-blue-700 border-blue-200' :
                                                    tx.type === 'Expense' ? 'bg-red-50 text-red-700 border-red-200' :
                                                        'bg-slate-800 text-slate-300 border-slate-800/80'
                                            }>
                                                {tx.type}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>{tx.reference}</TableCell>
                                        <TableCell className="max-w-xs truncate" title={tx.description}>
                                            {tx.description}
                                        </TableCell>
                                        <TableCell className="text-slate-500 text-sm">
                                            {tx.account}
                                        </TableCell>
                                        <TableCell className="text-right font-mono text-slate-400">
                                            {tx.debit ? formatCurrency(tx.debit) : '-'}
                                        </TableCell>
                                        <TableCell className="text-right font-mono text-slate-400">
                                            {tx.credit ? formatCurrency(tx.credit) : '-'}
                                        </TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={7} className="h-24 text-center text-slate-400">
                                        No transactions found.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    );
}
