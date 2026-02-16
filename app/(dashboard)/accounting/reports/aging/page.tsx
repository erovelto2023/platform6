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
import { BackButton } from "@/components/accounting/BackButton";
import { Badge } from "@/components/ui/badge";

export default async function AgingReportPage() {
    const { success, data, error } = await getAgingReport();

    if (!success || error || !data) {
        return (
            <div className="p-6 text-red-500">
                Failed to load aging report: {error || 'No data'}
            </div>
        );
    }

    const { summary, details } = data;

    return (
        <div className="p-6 space-y-6 bg-slate-50 min-h-screen">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <BackButton href="/accounting/reports" />
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight text-slate-900">Aging Report</h1>
                        <p className="text-muted-foreground">Accounts Receivable Aging Summary.</p>
                    </div>
                </div>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-5 gap-4">
                <Card className="bg-green-50 border-green-200">
                    <CardHeader className="p-4 pb-2">
                        <CardTitle className="text-xs font-medium text-green-700 uppercase">Current</CardTitle>
                    </CardHeader>
                    <CardContent className="p-4 pt-0">
                        <div className="text-2xl font-bold text-green-900">{formatCurrency(summary.current)}</div>
                    </CardContent>
                </Card>
                <Card className="bg-yellow-50 border-yellow-200">
                    <CardHeader className="p-4 pb-2">
                        <CardTitle className="text-xs font-medium text-yellow-700 uppercase">1-30 Days</CardTitle>
                    </CardHeader>
                    <CardContent className="p-4 pt-0">
                        <div className="text-2xl font-bold text-yellow-900">{formatCurrency(summary.days30)}</div>
                    </CardContent>
                </Card>
                <Card className="bg-orange-50 border-orange-200">
                    <CardHeader className="p-4 pb-2">
                        <CardTitle className="text-xs font-medium text-orange-700 uppercase">31-60 Days</CardTitle>
                    </CardHeader>
                    <CardContent className="p-4 pt-0">
                        <div className="text-2xl font-bold text-orange-900">{formatCurrency(summary.days60)}</div>
                    </CardContent>
                </Card>
                <Card className="bg-red-50 border-red-200">
                    <CardHeader className="p-4 pb-2">
                        <CardTitle className="text-xs font-medium text-red-700 uppercase">61-90 Days</CardTitle>
                    </CardHeader>
                    <CardContent className="p-4 pt-0">
                        <div className="text-2xl font-bold text-red-900">{formatCurrency(summary.days90)}</div>
                    </CardContent>
                </Card>
                <Card className="bg-rose-50 border-rose-200">
                    <CardHeader className="p-4 pb-2">
                        <CardTitle className="text-xs font-medium text-rose-700 uppercase">&gt; 90 Days</CardTitle>
                    </CardHeader>
                    <CardContent className="p-4 pt-0">
                        <div className="text-2xl font-bold text-rose-900">{formatCurrency(summary.over90)}</div>
                    </CardContent>
                </Card>
            </div>

            <Card className="border-slate-200 shadow-sm">
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
                                    <TableRow key={i} className="hover:bg-slate-50">
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
                                                ${inv.bucket === 'current' ? 'bg-green-50 text-green-700 border-green-200' :
                                                    inv.bucket === 'days30' ? 'bg-yellow-50 text-yellow-700 border-yellow-200' :
                                                        inv.bucket === 'days60' ? 'bg-orange-50 text-orange-700 border-orange-200' :
                                                            'bg-red-50 text-red-700 border-red-200'}
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
                                    <TableCell colSpan={6} className="h-24 text-center text-muted-foreground">
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
