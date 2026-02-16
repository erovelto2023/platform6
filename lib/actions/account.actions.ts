'use server';

import { revalidatePath } from 'next/cache';
import connectToDatabase from '../db/connect';
import Account from '../db/models/Account';
import { auth } from '@clerk/nextjs/server';
import { getActiveBusinessId } from './business.actions'; // Ensure this is exported

export async function getAccounts() {
    try {
        const { userId } = await auth();
        if (!userId) return { success: false, error: 'Unauthorized' };

        await connectToDatabase();
        const businessId = await getActiveBusinessId();

        if (!businessId) return { success: true, data: [] };

        const accounts = await Account.find({ businessId }).sort({ createdAt: -1 });

        return { success: true, data: JSON.parse(JSON.stringify(accounts)) };
    } catch (error) {
        console.error('[GET_ACCOUNTS]', error);
        return { success: false, error: 'Failed to fetch accounts' };
    }
}

export async function createAccount(data: any) {
    try {
        const { userId } = await auth();
        if (!userId) return { success: false, error: 'Unauthorized' };

        await connectToDatabase();
        const businessId = await getActiveBusinessId();

        if (!businessId) return { success: false, error: 'No active business' };

        const account = await Account.create({
            ...data,
            businessId,
        });

        revalidatePath('/accounting/accounts');
        return { success: true, data: JSON.parse(JSON.stringify(account)) };
    } catch (error) {
        console.error('[CREATE_ACCOUNT]', error);
        return { success: false, error: 'Failed to create account' };
    }
}

export async function updateAccount(accountId: string, data: any) {
    try {
        const { userId } = await auth();
        if (!userId) return { success: false, error: 'Unauthorized' };

        await connectToDatabase();
        const businessId = await getActiveBusinessId();

        const account = await Account.findOneAndUpdate(
            { _id: accountId, businessId },
            { $set: data },
            { new: true }
        );

        revalidatePath('/accounting/accounts');
        return { success: true, data: JSON.parse(JSON.stringify(account)) };
    } catch (error) {
        console.error('[UPDATE_ACCOUNT]', error);
        return { success: false, error: 'Failed to update account' };
    }
}

export async function deleteAccount(accountId: string) {
    try {
        const { userId } = await auth();
        if (!userId) return { success: false, error: 'Unauthorized' };

        await connectToDatabase();
        const businessId = await getActiveBusinessId();

        await Account.findOneAndDelete({ _id: accountId, businessId });
        revalidatePath('/accounting/accounts');
        return { success: true };
    } catch (error) {
        console.error('[DELETE_ACCOUNT]', error);
        return { success: false, error: 'Failed to delete account' };
    }
}
