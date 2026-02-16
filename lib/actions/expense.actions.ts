'use server';

import { revalidatePath } from 'next/cache';
import connectToDatabase from '../db/connect';
import Expense from '../db/models/Expense';
import Business from '../db/models/Business';
import { auth } from '@clerk/nextjs/server';

export async function getExpenses() {
    try {
        const { userId } = await auth();
        if (!userId) {
            return { success: false, error: 'Unauthorized' };
        }

        await connectToDatabase();

        const business = await Business.findOne({ userId });
        if (!business) {
            return { success: true, data: [] };
        }

        const expenses = await Expense.find({ businessId: business._id }).sort({ date: -1 });

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

export async function createExpense(data: any) {
    try {
        const { userId } = await auth();
        if (!userId) {
            return { success: false, error: 'Unauthorized' };
        }

        await connectToDatabase();

        const business = await Business.findOne({ userId });
        if (!business) {
            return { success: false, error: 'Business profile not found' };
        }

        const expense = await Expense.create({
            ...data,
            businessId: business._id,
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

        const business = await Business.findOne({ userId });
        if (!business) {
            return { success: false, error: 'Business profile not found' };
        }

        const expense = await Expense.findOneAndUpdate(
            { _id: expenseId, businessId: business._id },
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

        const business = await Business.findOne({ userId });
        if (!business) {
            return { success: false, error: 'Business profile not found' };
        }

        await Expense.findOneAndDelete({
            _id: expenseId,
            businessId: business._id,
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
