'use server';

import { revalidatePath } from 'next/cache';
import connectToDatabase from '../db/connect';
import JournalEntry from '../db/models/JournalEntry';
import { getOrCreateBusiness } from './business.actions';

export async function getJournalEntries(page = 1, limit = 20) {
    try {
        const businessResult = await getOrCreateBusiness();
        if (!businessResult.success || !businessResult.data) {
            return { success: false, error: 'Business not found' };
        }
        const businessId = businessResult.data._id;

        await connectToDatabase();
        const skip = (page - 1) * limit;

        const journalEntries = await JournalEntry.find({ businessId })
            .sort({ date: -1, createdAt: -1 })
            .skip(skip)
            .limit(limit);

        const total = await JournalEntry.countDocuments({ businessId });

        return {
            success: true,
            data: JSON.parse(JSON.stringify(journalEntries)),
            pagination: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit),
            },
        };
    } catch (error) {
        console.error('[GET_JOURNAL_ENTRIES]', error);
        return { success: false, error: 'Failed to fetch journal entries' };
    }
}

export async function getJournalEntry(id: string) {
    try {
        const businessResult = await getOrCreateBusiness();
        if (!businessResult.success || !businessResult.data) {
            return { success: false, error: 'Business not found' };
        }
        const businessId = businessResult.data._id;

        await connectToDatabase();
        const journalEntry = await JournalEntry.findOne({ _id: id, businessId });

        if (!journalEntry) {
            return { success: false, error: 'Journal entry not found' };
        }

        return { success: true, data: JSON.parse(JSON.stringify(journalEntry)) };
    } catch (error) {
        console.error('[GET_JOURNAL_ENTRY]', error);
        return { success: false, error: 'Failed to fetch journal entry' };
    }
}

export async function createJournalEntry(data: any) {
    try {
        const businessResult = await getOrCreateBusiness();
        if (!businessResult.success || !businessResult.data) {
            return { success: false, error: 'Business not found' };
        }
        const businessId = businessResult.data._id;

        await connectToDatabase();

        // Validate that debits equal credits
        const totalDebit = data.lines.reduce((sum: number, line: any) => sum + (Number(line.debit) || 0), 0);
        const totalCredit = data.lines.reduce((sum: number, line: any) => sum + (Number(line.credit) || 0), 0);

        if (Math.abs(totalDebit - totalCredit) > 0.01) {
            return {
                success: false,
                error: `Journal entry must balance. Debits: ${totalDebit.toFixed(2)}, Credits: ${totalCredit.toFixed(2)}`,
            };
        }

        const journalEntry = await JournalEntry.create({
            ...data,
            businessId,
        });

        revalidatePath('/accounting/journal');
        revalidatePath('/accounting/reports');

        return { success: true, data: JSON.parse(JSON.stringify(journalEntry)) };
    } catch (error) {
        console.error('[CREATE_JOURNAL_ENTRY]', error);
        return { success: false, error: 'Failed to create journal entry' };
    }
}

export async function updateJournalEntry(id: string, data: any) {
    try {
        const businessResult = await getOrCreateBusiness();
        if (!businessResult.success || !businessResult.data) {
            return { success: false, error: 'Business not found' };
        }
        const businessId = businessResult.data._id;

        await connectToDatabase();

        // Validate that debits equal credits
        const totalDebit = data.lines.reduce((sum: number, line: any) => sum + (Number(line.debit) || 0), 0);
        const totalCredit = data.lines.reduce((sum: number, line: any) => sum + (Number(line.credit) || 0), 0);

        if (Math.abs(totalDebit - totalCredit) > 0.01) {
            return {
                success: false,
                error: `Journal entry must balance. Debits: ${totalDebit.toFixed(2)}, Credits: ${totalCredit.toFixed(2)}`,
            };
        }

        const journalEntry = await JournalEntry.findOneAndUpdate(
            { _id: id, businessId },
            data,
            { new: true }
        );

        if (!journalEntry) {
            return { success: false, error: 'Journal entry not found' };
        }

        revalidatePath('/accounting/journal');
        revalidatePath(`/accounting/journal/${id}`);
        revalidatePath('/accounting/reports');

        return { success: true, data: JSON.parse(JSON.stringify(journalEntry)) };
    } catch (error) {
        console.error('[UPDATE_JOURNAL_ENTRY]', error);
        return { success: false, error: 'Failed to update journal entry' };
    }
}

export async function deleteJournalEntry(id: string) {
    try {
        const businessResult = await getOrCreateBusiness();
        if (!businessResult.success || !businessResult.data) {
            return { success: false, error: 'Business not found' };
        }
        const businessId = businessResult.data._id;

        await connectToDatabase();
        await JournalEntry.findOneAndDelete({ _id: id, businessId });

        revalidatePath('/accounting/journal');
        revalidatePath('/accounting/reports');

        return { success: true };
    } catch (error) {
        console.error('[DELETE_JOURNAL_ENTRY]', error);
        return { success: false, error: 'Failed to delete journal entry' };
    }
}
