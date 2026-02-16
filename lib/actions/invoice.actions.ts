'use server';

import { revalidatePath } from 'next/cache';
import connectToDatabase from '../db/connect';
import Invoice from '../db/models/Invoice';
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


export async function getInvoices(page = 1, limit = 50, search = "", status = "") {
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

        const query: any = { businessId };

        if (status && status !== 'all') {
            query.status = status;
        }

        if (search) {
            query.$or = [
                { invoiceNumber: { $regex: search, $options: 'i' } },
                { notes: { $regex: search, $options: 'i' } }
            ];
            // Client name search would require aggregation, skipping for now
        }

        const skip = (page - 1) * limit;

        const invoices = await Invoice.find(query)
            .populate('clientId')
            .sort({ date: -1 })
            .skip(skip)
            .limit(limit);

        const total = await Invoice.countDocuments(query);

        return {
            success: true,
            data: JSON.parse(JSON.stringify(invoices)),
            pagination: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit)
            }
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


        const businessId = await getActiveBusinessId(userId);
        if (!businessId) {
            return { success: false, error: 'Business not found' };
        }


        const invoice = await Invoice.findOne({
            _id: invoiceId,
            businessId: businessId,
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


        const businessId = await getActiveBusinessId(userId);
        if (!businessId) {
            return { success: false, error: 'Business profile not found' };
        }


        // Generate invoice number
        const count = await Invoice.countDocuments({ businessId });

        const invoiceNumber = `INV-${String(count + 1).padStart(5, '0')}`;

        const invoice = await Invoice.create({
            ...data,
            businessId,
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


        const businessId = await getActiveBusinessId(userId);
        if (!businessId) {
            return { success: false, error: 'Business profile not found' };
        }


        const invoice = await Invoice.findOneAndUpdate(
            { _id: invoiceId, businessId },

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


        const businessId = await getActiveBusinessId(userId);
        if (!businessId) {
            return { success: false, error: 'Business profile not found' };
        }


        await Invoice.findOneAndDelete({
            _id: invoiceId,
            businessId,
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
