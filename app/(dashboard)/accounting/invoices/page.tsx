import Link from "next/link";
import { InvoiceRowActions } from "@/components/accounting/InvoiceRowActions";
import { Button } from "@/components/ui/button";
import { Plus, Search as SearchIcon, FileText, MoreHorizontal, ChevronLeft } from "lucide-react";
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
import { getInvoices } from "@/lib/actions/invoice.actions";
import { formatCurrency } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

export default async function InvoicesPage() {
    const { data: invoices } = await getInvoices();

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'paid': return 'bg-green-100 text-green-800 hover:bg-green-100';
            case 'overdue': return 'bg-red-100 text-red-800 hover:bg-red-100';
            case 'sent': return 'bg-blue-100 text-blue-800 hover:bg-blue-100';
            default: return 'bg-slate-800 text-slate-200 hover:bg-slate-800';
        }
    };

    return (
        <div className="min-h-screen bg-[#07090e] p-6 space-y-6 dark text-white">
            <Link href="/accounting" className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-slate-200 transition-colors w-fit mb-4">
                <ChevronLeft className="w-3.5 h-3.5" /> Back to Accounting
            </Link>
            <div className="flex justify-between items-center">
                <div className="space-y-1">
                    
                    <h1 className="text-3xl font-bold tracking-tight text-white">Invoices</h1>
                    <p className="text-slate-400">Manage your invoices and payments.</p>
                </div>
                <Link href="/accounting/invoices/new">
                    <Button className="bg-blue-600 hover:bg-blue-700">
                        <Plus className="mr-2 h-4 w-4" />
                        Create Invoice
                    </Button>
                </Link>
            </div>

            <div className="flex items-center gap-4 mb-4">
                <Search placeholder="Search invoices..." />
                <Filter
                    paramName="status"
                    placeholder="Filter by Status"
                    options={[
                        { label: 'Draft', value: 'draft' },
                        { label: 'Sent', value: 'sent' },
                        { label: 'Paid', value: 'paid' },
                        { label: 'Overdue', value: 'overdue' },
                        { label: 'Cancelled', value: 'cancelled' },
                    ]}
                />
            </div>

            <div className="bg-[#0d1117] rounded-lg border border-slate-800/80 shadow-sm overflow-hidden">
                <Table>
                    <TableHeader>
                        <TableRow className="bg-[#07090e] border-slate-800/80 hover:bg-[#07090e]">
                            <TableHead className="font-medium text-slate-400">Invoice #</TableHead>
                            <TableHead className="font-medium text-slate-400">Client</TableHead>
                            <TableHead className="font-medium text-slate-400">Date</TableHead>
                            <TableHead className="font-medium text-slate-400">Due Date</TableHead>
                            <TableHead className="font-medium text-slate-400">Amount</TableHead>
                            <TableHead className="font-medium text-slate-400">Status</TableHead>
                            <TableHead className="w-[80px]"></TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {invoices && invoices.length > 0 ? (
                            invoices.map((invoice: any) => (
                                <TableRow key={invoice._id} className="hover:bg-[#07090e]/50">
                                    <TableCell className="font-medium text-blue-600">
                                        <Link href={`/accounting/invoices/${invoice._id}`} className="hover:underline">
                                            {invoice.invoiceNumber}
                                        </Link>
                                    </TableCell>
                                    <TableCell>{invoice.clientId?.name || 'Unknown Client'}</TableCell>
                                    <TableCell>{new Date(invoice.date).toLocaleDateString()}</TableCell>
                                    <TableCell>{new Date(invoice.dueDate).toLocaleDateString()}</TableCell>
                                    <TableCell className="font-medium">{formatCurrency(invoice.total)}</TableCell>
                                    <TableCell>
                                        <Badge variant="secondary" className={`capitalize font-normal ${getStatusColor(invoice.status)}`}>
                                            {invoice.status}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>
                                        <InvoiceRowActions invoice={invoice} />
                                    </TableCell>
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={7} className="h-24 text-center text-slate-400">
                                    No invoices found. Create your first invoice to get started.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}
