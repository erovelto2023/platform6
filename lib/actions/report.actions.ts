'use server';

import { getInvoices } from './invoice.actions';
import { getExpenses } from './expense.actions';
import { getJournalEntries } from './journal.actions';
import { getAccounts } from './account.actions';

export async function getTrialBalance() {
    try {
        // Mock implementation for now until we have a real double-entry ledger
        // We aggregate from invoices, expenses, and journal entries

        const accountsMap: Record<string, { debit: number; credit: number }> = {};

        // Helper
        const addEntry = (accountName: string, type: 'debit' | 'credit', amount: number) => {
            if (!accountsMap[accountName]) {
                accountsMap[accountName] = { debit: 0, credit: 0 };
            }
            accountsMap[accountName][type] += amount;
        };

        const [invRes, expRes, journalRes] = await Promise.all([
            getInvoices(),
            getExpenses(),
            getJournalEntries()
        ]);

        const invoices = invRes.data || [];
        const expenses = expRes.data || [];
        const journals = journalRes.data || [];

        // Process Invoices
        // Debit: Accounts Receivable, Credit: Income
        invoices.forEach((inv: any) => {
            if (inv.status !== 'paid') { // Only open invoices affect AR? No, all invoices affect AR/Income.
                // Simplified:
                addEntry('Accounts Receivable', 'debit', inv.total);
                addEntry('Sales Income', 'credit', inv.total);
            } else {
                // If paid, it hits Cash/Bank and Income.
                // Since our system just tracks status, let's assume Paid = Cash, Unpaid = AR.
                addEntry('Cash / Bank', 'debit', inv.total);
                addEntry('Sales Income', 'credit', inv.total);
            }
        });

        // Process Expenses
        // Debit: Expense Category, Credit: Cash/Bank
        expenses.forEach((exp: any) => {
            addEntry(exp.category || 'Uncategorized Expense', 'debit', exp.amount);
            addEntry('Cash / Bank', 'credit', exp.amount);
        });

        // Process Journal Entries
        journals.forEach((entry: any) => {
            entry.lines.forEach((line: any) => {
                const accName = line.accountId?.name || 'Unknown Account';
                if (line.debit) addEntry(accName, 'debit', line.debit);
                if (line.credit) addEntry(accName, 'credit', line.credit);
            });
        });

        const report = Object.entries(accountsMap).map(([account, values]) => ({
            account,
            debit: values.debit,
            credit: values.credit,
            balance: values.debit - values.credit
        })).sort((a, b) => a.account.localeCompare(b.account));

        return { success: true, data: report };

    } catch (error) {
        console.error('Error fetching trial balance:', error);
        return { success: false, error: 'Failed to fetch trial balance' };
    }
}

export async function getAgingReport() {
    try {
        const { data: invoices } = await getInvoices();
        const now = new Date();

        const buckets = {
            current: 0,
            days30: 0,
            days60: 0,
            days90: 0,
            over90: 0
        };

        const details: any[] = [];

        invoices.forEach((inv: any) => {
            if (inv.status === 'paid') return;

            const dueDate = new Date(inv.dueDate);
            const diffTime = Math.abs(now.getTime() - dueDate.getTime());
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

            // If future, it's current
            let bucket = 'current';
            if (now > dueDate) {
                if (diffDays <= 30) bucket = 'days30';
                else if (diffDays <= 60) bucket = 'days60';
                else if (diffDays <= 90) bucket = 'days90';
                else bucket = 'over90';
            }

            // @ts-ignore
            buckets[bucket] += inv.total;

            details.push({
                invoiceNumber: inv.invoiceNumber,
                client: inv.clientId?.name || 'Unknown',
                amount: inv.total,
                dueDate: inv.dueDate,
                daysOverdue: now > dueDate ? diffDays : 0,
                bucket
            });
        });

        return {
            success: true,
            data: {
                summary: buckets,
                details
            }
        };

    } catch (error) {
        console.error('Error fetching aging report:', error);
        return { success: false, error: 'Failed to fetch aging report' };
    }
}
