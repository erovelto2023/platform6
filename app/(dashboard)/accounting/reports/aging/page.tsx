import { ChevronLeft } from "lucide-react";
import { PrintButton } from "@/components/accounting/PrintButton";
import Link from "next/link";
import { getAgingReport } from '@/lib/actions/report.actions';
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

export default async function AgingReportPage() {
    const { success, data, error } = await getAgingReport();

    if (!success || error || !data) {
        return (
        <div className="min-h-screen bg-[#07090e] p-6 space-y-6 dark text-white">
            <Link href="/accounting" className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-slate-200 transition-colors w-fit mb-4">
                <ChevronLeft className="w-3.5 h-3.5" /> Back to Accounting
            </Link>
                Failed to load aging report: {error || 'No data'}
            </div>
        );
    }

    const { summary, details } = data;

    return (
        <div className="min-h-screen bg-[#07090e] p-6 space-y-6 dark text-white">
            <Link href="/accounting" className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-slate-200 transition-colors w-fit mb-4 no-print">
                <ChevronLeft className="w-3.5 h-3.5" /> Back to Accounting
            </Link>
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight text-white">Aging Report</h1>
                        <p className="text-slate-400">Accounts Receivable Aging Summary.</p>
                    </div>
                </div>
                <PrintButton label="Print Report" />
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-5 gap-4">
                <Card className="bg-emerald-500/10 border-emerald-500/20">
                    <CardHeader className="p-4 pb-2">
                        <CardTitle className="text-xs font-medium text-emerald-400 uppercase">Current</CardTitle>
                    </CardHeader>
                    <CardContent className="p-4 pt-0">
                        <div className="text-2xl font-bold text-white">{formatCurrency(summary.current)}</div>
                    </CardContent>
                </Card>
                <Card className="bg-amber-500/10 border-amber-500/20">
                    <CardHeader className="p-4 pb-2">
                        <CardTitle className="text-xs font-medium text-amber-400 uppercase">1-30 Days</CardTitle>
                    </CardHeader>
                    <CardContent className="p-4 pt-0">
                        <div className="text-2xl font-bold text-white">{formatCurrency(summary.days30)}</div>
                    </CardContent>
                </Card>
                <Card className="bg-orange-500/10 border-orange-500/20">
                    <CardHeader className="p-4 pb-2">
                        <CardTitle className="text-xs font-medium text-orange-400 uppercase">31-60 Days</CardTitle>
                    </CardHeader>
                    <CardContent className="p-4 pt-0">
                        <div className="text-2xl font-bold text-white">{formatCurrency(summary.days60)}</div>
                    </CardContent>
                </Card>
                <Card className="bg-rose-500/10 border-rose-500/20">
                    <CardHeader className="p-4 pb-2">
                        <CardTitle className="text-xs font-medium text-rose-400 uppercase">61-90 Days</CardTitle>
                    </CardHeader>
                    <CardContent className="p-4 pt-0">
                        <div className="text-2xl font-bold text-white">{formatCurrency(summary.days90)}</div>
                    </CardContent>
                </Card>
                <Card className="bg-red-500/10 border-red-500/20">
                    <CardHeader className="p-4 pb-2">
                        <CardTitle className="text-xs font-medium text-red-400 uppercase">&gt; 90 Days</CardTitle>
                    </CardHeader>
                    <CardContent className="p-4 pt-0">
                        <div className="text-2xl font-bold text-white">{formatCurrency(summary.over90)}</div>
                    </CardContent>
                </Card>
            </div>

            <Card className="border-slate-800/80 shadow-sm">
                <CardHeader>
                    <CardTitle>Invoice Details</CardTitle>
                    <CardDescription>Unpaid invoices grouped by aging bucket.</CardDescription>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Client</TableHead>
                                <TableHead>Invoice #</TableHead>
                                <TableHead>Due Date</TableHead>
                                <TableHead className="text-right">Days Overdue</TableHead>
                                <TableHead className="text-right">Amount</TableHead>
                                <TableHead>Bucket</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {details && details.length > 0 ? (
                                details.sort((a: any, b: any) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()).map((inv: any, i: number) => (
                                    <TableRow key={i} className="hover:bg-[#07090e]">
                                        <TableCell className="font-medium">{inv.client}</TableCell>
                                        <TableCell>{inv.invoiceNumber}</TableCell>
                                        <TableCell>{new Date(inv.dueDate).toLocaleDateString()}</TableCell>
                                        <TableCell className="text-right">
                                            {inv.daysOverdue > 0 ? (
                                                <span className="text-red-600 font-medium">{inv.daysOverdue}</span>
                                            ) : (
                                                <span className="text-green-600">Current</span>
                                            )}
                                        </TableCell>
                                        <TableCell className="text-right font-medium">{formatCurrency(inv.amount)}</TableCell>
                                        <TableCell>
                                            <Badge variant="outline" className={`capitalize
                                                ${inv.bucket === 'current' ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/20' :
                                                    inv.bucket === 'days30' ? 'bg-amber-500/15 text-amber-400 border-amber-500/20' :
                                                        inv.bucket === 'days60' ? 'bg-orange-500/15 text-orange-400 border-orange-500/20' :
                                                            'bg-rose-500/15 text-rose-400 border-rose-500/20'}
                                            `}>
                                                {inv.bucket === 'days30' ? '1-30 Days' :
                                                    inv.bucket === 'days60' ? '31-60 Days' :
                                                        inv.bucket === 'days90' ? '61-90 Days' :
                                                            inv.bucket === 'over90' ? '> 90 Days' : 'Current'}
                                            </Badge>
                                        </TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={6} className="h-24 text-center text-slate-400">
                                        No outstanding invoices. Good job!
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
