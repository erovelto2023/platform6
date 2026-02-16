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
import { BackButton } from "@/components/accounting/BackButton";

export default async function TrialBalancePage() {
    const { success, data: accounts, error } = await getTrialBalance();

    if (!success || error) {
        return (
            <div className="p-6 text-red-500">
                Failed to load trial balance: {error}
            </div>
        );
    }

    const totalDebit = accounts?.reduce((sum: number, acc: any) => sum + (acc.debit || 0), 0) || 0;
    const totalCredit = accounts?.reduce((sum: number, acc: any) => sum + (acc.credit || 0), 0) || 0;

    return (
        <div className="p-6 space-y-6 bg-slate-50 min-h-screen">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <BackButton href="/accounting/reports" />
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight text-slate-900">Trial Balance</h1>
                        <p className="text-muted-foreground">Balances of all ledger accounts.</p>
                    </div>
                </div>
            </div>

            <Card className="border-slate-200 shadow-sm">
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
                                    <TableRow key={acc.account} className="hover:bg-slate-50">
                                        <TableCell className="font-medium text-slate-900">{acc.account}</TableCell>
                                        <TableCell className="text-right font-mono text-slate-600">
                                            {acc.debit > 0 ? formatCurrency(acc.debit) : '-'}
                                        </TableCell>
                                        <TableCell className="text-right font-mono text-slate-600">
                                            {acc.credit > 0 ? formatCurrency(acc.credit) : '-'}
                                        </TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={3} className="h-24 text-center text-muted-foreground">
                                        No data found.
                                    </TableCell>
                                </TableRow>
                            )}
                            {/* Totals Row */}
                            <TableRow className="bg-slate-100 font-bold border-t-2 border-slate-300">
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
