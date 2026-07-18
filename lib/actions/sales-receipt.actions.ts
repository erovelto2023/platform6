'use server';

import { auth } from '@clerk/nextjs/server';
import { revalidatePath } from 'next/cache';
import connectDB from '@/lib/db/connect';
import SalesReceipt from '@/lib/db/models/SalesReceipt';
import { getActiveBusinessId } from './business.actions';

export async function getSalesReceipts() {
    try {
        const { userId } = await auth();
        if (!userId) return { error: 'Unauthorized' };
        await connectDB();
        const businessId = await getActiveBusinessId();
        const receipts = await SalesReceipt.find({ businessId }).populate('clientId', 'name email').sort({ createdAt: -1 });
        return { data: JSON.parse(JSON.stringify(receipts)) };
    } catch (e) { console.error(e); return { error: 'Failed to fetch receipts' }; }
}

export async function getSalesReceipt(id: string) {
    try {
        const { userId } = await auth();
        if (!userId) return { error: 'Unauthorized' };
        await connectDB();
        const receipt = await SalesReceipt.findById(id).populate('clientId', 'name email phone address');
        if (!receipt) return { error: 'Not found' };
        return { data: JSON.parse(JSON.stringify(receipt)) };
    } catch (e) { console.error(e); return { error: 'Failed to fetch receipt' }; }
}

export async function createSalesReceipt(data: {
    clientId?: string; receiptNumber: string; date: string;
    paymentMethod: string; depositTo?: string; referenceNo?: string;
    email?: string; billingAddress?: string;
    items: any[]; subtotal: number; tax: number; total: number; message?: string;
}) {
    try {
        const { userId } = await auth();
        if (!userId) return { error: 'Unauthorized' };
        await connectDB();
        const businessId = await getActiveBusinessId();
        const receipt = await SalesReceipt.create({ businessId, ...data });
        revalidatePath('/accounting/sales-receipts');
        revalidatePath('/accounting');
        return { data: JSON.parse(JSON.stringify(receipt)) };
    } catch (e: any) { console.error(e); return { error: e.message || 'Failed to create receipt' }; }
}

export async function deleteSalesReceipt(id: string) {
    try {
        const { userId } = await auth();
        if (!userId) return { error: 'Unauthorized' };
        await connectDB();
        await SalesReceipt.findByIdAndDelete(id);
        revalidatePath('/accounting/sales-receipts');
        return { success: true };
    } catch (e) { console.error(e); return { error: 'Failed to delete receipt' }; }
}

export async function getNextReceiptNumber() {
    try {
        await connectDB();
        const businessId = await getActiveBusinessId();
        const last = await SalesReceipt.findOne({ businessId }).sort({ receiptNumber: -1 }).select('receiptNumber');
        if (!last) return '1001';
        const num = parseInt(last.receiptNumber.replace(/\D/g, ''), 10);
        return (num + 1).toString();
    } catch { return '1001'; }
}
