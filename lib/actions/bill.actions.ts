'use server';

import { auth } from '@clerk/nextjs/server';
import { revalidatePath } from 'next/cache';
import connectDB from '@/lib/db/connect';
import Bill from '@/lib/db/models/Bill';
import { getActiveBusinessId } from './business.actions';

export async function getBills() {
    try {
        const { userId } = await auth();
        if (!userId) return { error: 'Unauthorized' };
        await connectDB();
        const businessId = await getActiveBusinessId();
        const bills = await Bill.find({ businessId }).populate('vendorId', 'name email').sort({ createdAt: -1 });
        return { data: JSON.parse(JSON.stringify(bills)) };
    } catch (e) { return { error: 'Failed to fetch bills' }; }
}

export async function getBill(id: string) {
    try {
        const { userId } = await auth();
        if (!userId) return { error: 'Unauthorized' };
        await connectDB();
        const bill = await Bill.findById(id).populate('vendorId', 'name email address phone');
        if (!bill) return { error: 'Not found' };
        return { data: JSON.parse(JSON.stringify(bill)) };
    } catch (e) { return { error: 'Failed to fetch bill' }; }
}

export async function createBill(data: {
    vendorId: string; billDate: string; dueDate: string;
    terms?: string; billNumber?: string; refNo?: string;
    mailingAddress?: string; items: any[]; total: number; memo?: string;
}) {
    try {
        const { userId } = await auth();
        if (!userId) return { error: 'Unauthorized' };
        await connectDB();
        const businessId = await getActiveBusinessId();
        const bill = await Bill.create({ businessId, ...data });
        revalidatePath('/accounting/bills');
        revalidatePath('/accounting');
        return { data: JSON.parse(JSON.stringify(bill)) };
    } catch (e: any) { return { error: e.message || 'Failed to create bill' }; }
}

export async function updateBill(id: string, data: any) {
    try {
        const { userId } = await auth();
        if (!userId) return { error: 'Unauthorized' };
        await connectDB();
        const bill = await Bill.findByIdAndUpdate(id, data, { new: true });
        revalidatePath('/accounting/bills');
        return { data: JSON.parse(JSON.stringify(bill)) };
    } catch (e) { return { error: 'Failed to update bill' }; }
}

export async function updateBillStatus(id: string, status: string) {
    try {
        const { userId } = await auth();
        if (!userId) return { error: 'Unauthorized' };
        await connectDB();
        await Bill.findByIdAndUpdate(id, { status });
        revalidatePath('/accounting/bills');
        return { success: true };
    } catch (e) { return { error: 'Failed to update status' }; }
}

export async function deleteBill(id: string) {
    try {
        const { userId } = await auth();
        if (!userId) return { error: 'Unauthorized' };
        await connectDB();
        await Bill.findByIdAndDelete(id);
        revalidatePath('/accounting/bills');
        return { success: true };
    } catch (e) { return { error: 'Failed to delete bill' }; }
}
