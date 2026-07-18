import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Plus, ChevronLeft } from "lucide-react";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { formatCurrency } from '@/lib/utils';
import { getJournalEntries } from '@/lib/actions/journal.actions';

export default async function JournalEntriesPage() {
    const { data: journalEntries, error } = await getJournalEntries();

    if (error) {
        return (
        <div className="min-h-screen bg-[#07090e] p-6 space-y-6 dark text-white">
            <Link href="/accounting" className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-slate-200 transition-colors w-fit mb-4">
                <ChevronLeft className="w-3.5 h-3.5" /> Back to Accounting
            </Link>
                Failed to load journal entries: {error}
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#07090e] p-6 space-y-6 dark text-white">
            <Link href="/accounting" className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-slate-200 transition-colors w-fit mb-4">
                <ChevronLeft className="w-3.5 h-3.5" /> Back to Accounting
            </Link>
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-white">Journal Entries</h1>
                    <p className="text-slate-400 mt-1">Manage manual accounting adjustments.</p>
                </div>
                <Link href="/accounting/journal/new">
                    <Button className="bg-blue-600 hover:bg-blue-700">
                        <Plus className="mr-2 h-4 w-4" /> New Journal Entry
                    </Button>
                </Link>
            </div>

            <Card className="border-slate-800/80 shadow-sm">
                <CardHeader>
                    <CardTitle>All Journal Entries</CardTitle>
                    <CardDescription>A list of all manual journal entries.</CardDescription>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Date</TableHead>
                                <TableHead>Reference</TableHead>
                                <TableHead>Description</TableHead>
                                <TableHead className="text-right">Total</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {journalEntries && journalEntries.length > 0 ? (
                                journalEntries.map((entry: any) => (
                                    <TableRow key={entry._id}>
                                        <TableCell>{new Date(entry.date).toLocaleDateString()}</TableCell>
                                        <TableCell>{entry.reference || '-'}</TableCell>
                                        <TableCell>{entry.description}</TableCell>
                                        <TableCell className="text-right font-medium">
                                            {formatCurrency(entry.totalAmount || 0)}
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <Link href={`/accounting/journal/${entry._id}`}>
                                                <Button variant="ghost" size="sm">
                                                    View
                                                </Button>
                                            </Link>
                                        </TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={5} className="h-24 text-center text-slate-400">
                                        No journal entries found.
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
