'use server';

import { revalidatePath } from 'next/cache';
import connectToDatabase from '../db/connect';
import Invoice from '../db/models/Invoice';
import Business from '../db/models/Business';
import { auth } from '@clerk/nextjs/server';

export async function getInvoices() {
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

        const invoices = await Invoice.find({ businessId: business._id })
            .populate('clientId')
            .sort({ date: -1 });

        return {
            success: true,
            data: JSON.parse(JSON.stringify(invoices)),
        };
    } catch (error) {
        console.error('[GET_INVOICES]', error);
        return {
            success: false,
            error: 'Failed to get invoices',
        };
    }
}

export async function getInvoice(invoiceId: string) {
    try {
        const { userId } = await auth();
        if (!userId) {
            return { success: false, error: 'Unauthorized' };
        }

        await connectToDatabase();

        const business = await Business.findOne({ userId });
        if (!business) {
            return { success: false, error: 'Business not found' };
        }

        const invoice = await Invoice.findOne({
            _id: invoiceId,
            businessId: business._id,
        }).populate('clientId');

        if (!invoice) {
            return { success: false, error: 'Invoice not found' };
        }

        return {
            success: true,
            data: JSON.parse(JSON.stringify(invoice)),
        };
    } catch (error) {
        console.error('[GET_INVOICE]', error);
        return {
            success: false,
            error: 'Failed to get invoice',
        };
    }
}

export async function createInvoice(data: any) {
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

        // Generate invoice number
        const count = await Invoice.countDocuments({ businessId: business._id });
        const invoiceNumber = `INV-${String(count + 1).padStart(5, '0')}`;

        const invoice = await Invoice.create({
            ...data,
            businessId: business._id,
            invoiceNumber,
        });

        revalidatePath('/accounting');
        revalidatePath('/accounting/invoices');

        return {
            success: true,
            data: JSON.parse(JSON.stringify(invoice)),
        };
    } catch (error) {
        console.error('[CREATE_INVOICE]', error);
        return {
            success: false,
            error: 'Failed to create invoice',
        };
    }
}

export async function updateInvoice(invoiceId: string, data: any) {
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

        const invoice = await Invoice.findOneAndUpdate(
            { _id: invoiceId, businessId: business._id },
            { $set: data },
            { new: true }
        ).populate('clientId');

        if (!invoice) {
            return { success: false, error: 'Invoice not found' };
        }

        revalidatePath('/accounting');
        revalidatePath('/accounting/invoices');
        revalidatePath(`/accounting/invoices/${invoiceId}`);

        return {
            success: true,
            data: JSON.parse(JSON.stringify(invoice)),
        };
    } catch (error) {
        console.error('[UPDATE_INVOICE]', error);
        return {
            success: false,
            error: 'Failed to update invoice',
        };
    }
}

export async function deleteInvoice(invoiceId: string) {
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

        await Invoice.findOneAndDelete({
            _id: invoiceId,
            businessId: business._id,
        });

        revalidatePath('/accounting');
        revalidatePath('/accounting/invoices');

        return { success: true };
    } catch (error) {
        console.error('[DELETE_INVOICE]', error);
        return {
            success: false,
            error: 'Failed to delete invoice',
        };
    }
}
