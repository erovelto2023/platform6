'use server';

import { getInvoices } from './invoice.actions';
import { getExpenses } from './expense.actions';
import { getJournalEntries } from './journal.actions';
import { formatCurrency } from '@/lib/utils';

export async function getLedgerTransactions() {
    try {
        const [invoicesRes, expensesRes, journalRes] = await Promise.all([
            getInvoices(),
            getExpenses(),
            getJournalEntries()
        ]);

        const invoices = invoicesRes.data || [];
        const expenses = expensesRes.data || [];
        const journalEntries = journalRes.data || [];

        // Normalize Invoices
        const normalizedInvoices = invoices.map((inv: any) => ({
            id: inv._id,
            date: inv.date,
            type: 'Invoice',
            reference: inv.invoiceNumber,
            description: `Invoice to ${inv.clientId?.name || 'Unknown'}`,
            amount: inv.total,
            credit: inv.total, // Income is Credit
            debit: 0,
            account: 'Accounts Receivable', // Simplified
            details: inv
        }));

        // Normalize Expenses
        const normalizedExpenses = expenses.map((exp: any) => ({
            id: exp._id,
            date: exp.date,
            type: 'Expense',
            reference: exp.reference || '-',
            description: `Expense: ${exp.vendor}`,
            amount: exp.amount,
            credit: 0,
            debit: exp.amount, // Expense is Debit
            account: exp.category, // Expense Category
            details: exp
        }));

        // Normalize Journal Entries
        // Journal entries have multiple lines. We should probably list them as separate lines or grouping them.
        // For a transaction list, showing the "Head" is easier, but for GL, we need lines.
        // Let's create a flat list of GL lines.

        const journalLines = journalEntries.flatMap((entry: any) => {
            return entry.lines.map((line: any) => ({
                id: `${entry._id}-${line._id}`,
                date: entry.date,
                type: 'Journal',
                reference: entry.reference || '-',
                description: `${entry.description} - ${line.description || ''}`,
                amount: Math.abs((line.debit || 0) - (line.credit || 0)),
                debit: line.debit || 0,
                credit: line.credit || 0,
                account: line.accountId?.name || 'Unknown Account',
                details: entry
            }));
        });

        // For Invoices/Expenses, to be a true GL, we'd need the offset account.
        // But for "Centralized Transaction View", simpler is better initially.
        // Let's return a mixed list sorted by date.

        const allTransactions = [
            ...normalizedInvoices,
            ...normalizedExpenses,
            ...journalLines
        ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

        return { success: true, data: allTransactions };

    } catch (error) {
        console.error('Error fetching ledger transactions:', error);
        return { success: false, error: 'Failed to fetch transactions' };
    }
}
