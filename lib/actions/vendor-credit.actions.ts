'use server';

import { auth } from '@clerk/nextjs/server';
import { revalidatePath } from 'next/cache';
import connectDB from '@/lib/db/connect';
import VendorCredit from '@/lib/db/models/VendorCredit';
import { getActiveBusinessId } from './business.actions';

export async function getVendorCredits() {
    try {
        const { userId } = await auth();
        if (!userId) return { error: 'Unauthorized' };
        await connectDB();
        const businessId = await getActiveBusinessId();
        const credits = await VendorCredit.find({ businessId }).populate('vendorId', 'name email').sort({ createdAt: -1 });
        return { data: JSON.parse(JSON.stringify(credits)) };
    } catch (e) { return { error: 'Failed to fetch vendor credits' }; }
}

export async function createVendorCredit(data: {
    vendorId: string; paymentDate: string; refNo?: string;
    mailingAddress?: string; items: any[]; total: number; memo?: string;
}) {
    try {
        const { userId } = await auth();
        if (!userId) return { error: 'Unauthorized' };
        await connectDB();
        const businessId = await getActiveBusinessId();
        const credit = await VendorCredit.create({ businessId, ...data });
        revalidatePath('/accounting/vendor-credits');
        return { data: JSON.parse(JSON.stringify(credit)) };
    } catch (e: any) { return { error: e.message || 'Failed to create vendor credit' }; }
}

export async function deleteVendorCredit(id: string) {
    try {
        const { userId } = await auth();
        if (!userId) return { error: 'Unauthorized' };
        await connectDB();
        await VendorCredit.findByIdAndDelete(id);
        revalidatePath('/accounting/vendor-credits');
        return { success: true };
    } catch (e) { return { error: 'Failed to delete vendor credit' }; }
}
