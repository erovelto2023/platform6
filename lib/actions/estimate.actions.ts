'use server';

import { auth } from '@clerk/nextjs/server';
import { revalidatePath } from 'next/cache';
import connectDB from '@/lib/db/connect';
import Estimate from '@/lib/db/models/Estimate';
import { getActiveBusinessId } from './business.actions';

export async function getEstimates() {
    try {
        const { userId } = await auth();
        if (!userId) return { error: 'Unauthorized' };
        await connectDB();
        const businessId = await getActiveBusinessId();
        const estimates = await Estimate.find({ businessId }).populate('clientId', 'name email').sort({ createdAt: -1 });
        return { data: JSON.parse(JSON.stringify(estimates)) };
    } catch (e) { console.error(e); return { error: 'Failed to fetch estimates' }; }
}

export async function getEstimate(id: string) {
    try {
        const { userId } = await auth();
        if (!userId) return { error: 'Unauthorized' };
        await connectDB();
        const estimate = await Estimate.findById(id).populate('clientId', 'name email phone address');
        if (!estimate) return { error: 'Not found' };
        return { data: JSON.parse(JSON.stringify(estimate)) };
    } catch (e) { console.error(e); return { error: 'Failed to fetch estimate' }; }
}

export async function createEstimate(data: {
    clientId: string; estimateNumber: string; date: string;
    expirationDate?: string; items: any[]; subtotal: number;
    tax: number; total: number; notes?: string; message?: string;
}) {
    try {
        const { userId } = await auth();
        if (!userId) return { error: 'Unauthorized' };
        await connectDB();
        const businessId = await getActiveBusinessId();
        const estimate = await Estimate.create({ businessId, ...data });
        revalidatePath('/accounting/estimates');
        return { data: JSON.parse(JSON.stringify(estimate)) };
    } catch (e: any) { console.error(e); return { error: e.message || 'Failed to create estimate' }; }
}

export async function updateEstimate(id: string, data: Partial<{
    clientId: string; date: string; expirationDate: string; items: any[];
    subtotal: number; tax: number; total: number; status: string;
    notes: string; message: string; acceptedBy: string; acceptedDate: string;
}>) {
    try {
        const { userId } = await auth();
        if (!userId) return { error: 'Unauthorized' };
        await connectDB();
        const estimate = await Estimate.findByIdAndUpdate(id, data, { new: true });
        revalidatePath('/accounting/estimates');
        return { data: JSON.parse(JSON.stringify(estimate)) };
    } catch (e) { console.error(e); return { error: 'Failed to update estimate' }; }
}

export async function updateEstimateStatus(id: string, status: string) {
    try {
        const { userId } = await auth();
        if (!userId) return { error: 'Unauthorized' };
        await connectDB();
        await Estimate.findByIdAndUpdate(id, { status });
        revalidatePath('/accounting/estimates');
        return { success: true };
    } catch (e) { console.error(e); return { error: 'Failed to update status' }; }
}

export async function deleteEstimate(id: string) {
    try {
        const { userId } = await auth();
        if (!userId) return { error: 'Unauthorized' };
        await connectDB();
        await Estimate.findByIdAndDelete(id);
        revalidatePath('/accounting/estimates');
        return { success: true };
    } catch (e) { console.error(e); return { error: 'Failed to delete estimate' }; }
}

export async function getNextEstimateNumber() {
    try {
        await connectDB();
        const businessId = await getActiveBusinessId();
        const last = await Estimate.findOne({ businessId }).sort({ estimateNumber: -1 }).select('estimateNumber');
        if (!last) return 'EST-1001';
        const num = parseInt(last.estimateNumber.replace(/\D/g, ''), 10);
        return `EST-${(num + 1).toString().padStart(4, '0')}`;
    } catch { return 'EST-1001'; }
}

export async function convertEstimateToInvoice(estimateId: string) {
    try {
        const { userId } = await auth();
        if (!userId) return { error: 'Unauthorized' };
        
        await connectDB();
        const businessId = await getActiveBusinessId();
        const est = await Estimate.findById(estimateId);
        if (!est) return { error: 'Estimate not found' };

        const Invoice = (await import('@/lib/db/models/Invoice')).default;

        const count = await Invoice.countDocuments({ businessId });
        const invoiceNumber = `INV-${String(count + 1).padStart(5, '0')}`;

        const inv = await Invoice.create({
            businessId,
            clientId: est.clientId,
            invoiceNumber,
            date: new Date(),
            dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), // 14 days
            items: est.items.map((item: any) => ({
                description: item.description,
                quantity: item.quantity,
                rate: item.rate,
                amount: item.amount
            })),
            subtotal: est.subtotal,
            tax: est.tax,
            total: est.total,
            status: 'sent',
            notes: est.notes
        });

        // Mark estimate as invoiced
        est.status = 'invoiced';
        await est.save();

        revalidatePath('/accounting/estimates');
        revalidatePath('/accounting/invoices');
        return { success: true, data: JSON.parse(JSON.stringify(inv)) };
    } catch (e: any) {
        console.error(e);
        return { error: e.message || 'Failed to convert estimate' };
    }
}
