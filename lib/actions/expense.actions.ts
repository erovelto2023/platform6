'use server';

import { revalidatePath } from 'next/cache';
import connectToDatabase from '../db/connect';
import Expense from '../db/models/Expense';
import Business from '../db/models/Business';
import { auth } from '@clerk/nextjs/server';
import { getOrCreateBusiness } from './business.actions';
import { cookies } from 'next/headers';

const BUSINESS_COOKIE_NAME = 'accounting_business_id';

async function getActiveBusinessId(userId: string) {
    const cookieStore = await cookies();
    const cookieId = cookieStore.get(BUSINESS_COOKIE_NAME)?.value;
    if (cookieId) return cookieId;

    // Fallback: get default business
    const result = await getOrCreateBusiness();
    if (result.success && result.data) {
        return result.data._id;
    }
    return null;
}


export async function getExpenses() {
    try {
        const { userId } = await auth();
        if (!userId) {
            return { success: false, error: 'Unauthorized' };
        }

        await connectToDatabase();


        const businessId = await getActiveBusinessId(userId);
        if (!businessId) {
            return { success: true, data: [] };
        }

        const expenses = await Expense.find({ businessId }).sort({ date: -1 });


        return {
            success: true,
            data: JSON.parse(JSON.stringify(expenses)),
        };
    } catch (error) {
        console.error('[GET_EXPENSES]', error);
        return {
            success: false,
            error: 'Failed to get expenses',
        };
    }
}

export async function getExpense(expenseId: string) {
    try {
        const { userId } = await auth();
        if (!userId) {
            return { success: false, error: 'Unauthorized' };
        }

        await connectToDatabase();

        const businessId = await getActiveBusinessId(userId);
        if (!businessId) {
            return { success: false, error: 'Business profile not found' };
        }

        const expense = await Expense.findOne({
            _id: expenseId,
            businessId,
        }).populate('accountId');

        if (!expense) {
            return { success: false, error: 'Expense not found' };
        }

        return {
            success: true,
            data: JSON.parse(JSON.stringify(expense)),
        };
    } catch (error) {
        console.error('[GET_EXPENSE]', error);
        return {
            success: false,
            error: 'Failed to get expense',
        };
    }
}

export async function createExpense(data: any) {
    try {
        const { userId } = await auth();
        if (!userId) {
            return { success: false, error: 'Unauthorized' };
        }

        await connectToDatabase();


        const businessId = await getActiveBusinessId(userId);
        if (!businessId) {
            return { success: false, error: 'Business profile not found' };
        }


        const expense = await Expense.create({
            ...data,
            businessId,
        });

        revalidatePath('/accounting');
        revalidatePath('/accounting/expenses');

        return {
            success: true,
            data: JSON.parse(JSON.stringify(expense)),
        };
    } catch (error) {
        console.error('[CREATE_EXPENSE]', error);
        return {
            success: false,
            error: 'Failed to create expense',
        };
    }
}

export async function updateExpense(expenseId: string, data: any) {
    try {
        const { userId } = await auth();
        if (!userId) {
            return { success: false, error: 'Unauthorized' };
        }

        await connectToDatabase();


        const businessId = await getActiveBusinessId(userId);
        if (!businessId) {
            return { success: false, error: 'Business profile not found' };
        }


        const expense = await Expense.findOneAndUpdate(
            { _id: expenseId, businessId },

            { $set: data },
            { new: true }
        );

        if (!expense) {
            return { success: false, error: 'Expense not found' };
        }

        revalidatePath('/accounting');
        revalidatePath('/accounting/expenses');

        return {
            success: true,
            data: JSON.parse(JSON.stringify(expense)),
        };
    } catch (error) {
        console.error('[UPDATE_EXPENSE]', error);
        return {
            success: false,
            error: 'Failed to update expense',
        };
    }
}

export async function deleteExpense(expenseId: string) {
    try {
        const { userId } = await auth();
        if (!userId) {
            return { success: false, error: 'Unauthorized' };
        }

        await connectToDatabase();


        const businessId = await getActiveBusinessId(userId);
        if (!businessId) {
            return { success: false, error: 'Business profile not found' };
        }


        await Expense.findOneAndDelete({
            _id: expenseId,
            businessId,
        });

        revalidatePath('/accounting');
        revalidatePath('/accounting/expenses');

        return { success: true };
    } catch (error) {
        console.error('[DELETE_EXPENSE]', error);
        return {
            success: false,
            error: 'Failed to delete expense',
        };
    }
}
