import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import { PrintButton } from "@/components/accounting/PrintButton";
import { getTrialBalance } from '@/lib/actions/report.actions';
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

export default async function TrialBalancePage() {
    const { success, data: accounts, error } = await getTrialBalance();

    if (!success || error) {
        return (
        <div className="min-h-screen bg-[#07090e] p-6 space-y-6 dark text-white">
            <Link href="/accounting" className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-slate-200 transition-colors w-fit mb-4">
                <ChevronLeft className="w-3.5 h-3.5" /> Back to Accounting
            </Link>
                Failed to load trial balance: {error}
            </div>
        );
    }

    const totalDebit = accounts?.reduce((sum: number, acc: any) => sum + (acc.debit || 0), 0) || 0;
    const totalCredit = accounts?.reduce((sum: number, acc: any) => sum + (acc.credit || 0), 0) || 0;

    return (
        <div className="min-h-screen bg-[#07090e] p-6 space-y-6 dark text-white">
            <Link href="/accounting" className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-slate-200 transition-colors w-fit mb-4 no-print">
                <ChevronLeft className="w-3.5 h-3.5" /> Back to Accounting
            </Link>
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight text-white">Trial Balance</h1>
                        <p className="text-slate-400">Balances of all ledger accounts.</p>
                    </div>
                </div>
                <PrintButton label="Print Report" />
            </div>

            <Card className="border-slate-800/80 shadow-sm">
                <CardHeader>
                    <CardTitle>As of {new Date().toLocaleDateString()}</CardTitle>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="w-[400px]">Account</TableHead>
                                <TableHead className="text-right">Debit</TableHead>
                                <TableHead className="text-right">Credit</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {accounts && accounts.length > 0 ? (
                                accounts.map((acc: any) => (
                                    <TableRow key={acc.account} className="hover:bg-[#07090e]">
                                        <TableCell className="font-medium text-white">{acc.account}</TableCell>
                                        <TableCell className="text-right font-mono text-slate-400">
                                            {acc.debit > 0 ? formatCurrency(acc.debit) : '-'}
                                        </TableCell>
                                        <TableCell className="text-right font-mono text-slate-400">
                                            {acc.credit > 0 ? formatCurrency(acc.credit) : '-'}
                                        </TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={3} className="h-24 text-center text-slate-400">
                                        No data found.
                                    </TableCell>
                                </TableRow>
                            )}
                            {/* Totals Row */}
                            <TableRow className="bg-slate-800/40 text-white font-extrabold border-t-2 border-slate-800/80">
                                <TableCell>Total</TableCell>
                                <TableCell className="text-right">{formatCurrency(totalDebit)}</TableCell>
                                <TableCell className="text-right">{formatCurrency(totalCredit)}</TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    );
}
