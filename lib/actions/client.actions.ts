'use server';

import { revalidatePath } from 'next/cache';
import connectToDatabase from '../db/connect';
import Client from '../db/models/Client';
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


export async function getClients() {
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

        const clients = await Client.find({ businessId }).sort({ createdAt: -1 });


        return {
            success: true,
            data: JSON.parse(JSON.stringify(clients)),
        };
    } catch (error) {
        console.error('[GET_CLIENTS]', error);
        return {
            success: false,
            error: 'Failed to get clients',
        };
    }
}

export async function createClient(data: any) {
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


        const client = await Client.create({
            ...data,
            businessId,
        });

        revalidatePath('/accounting/clients');
        revalidatePath('/accounting/invoices');

        return {
            success: true,
            data: JSON.parse(JSON.stringify(client)),
        };
    } catch (error) {
        console.error('[CREATE_CLIENT]', error);
        return {
            success: false,
            error: 'Failed to create client',
        };
    }
}

export async function updateClient(clientId: string, data: any) {
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


        const client = await Client.findOneAndUpdate(
            { _id: clientId, businessId },

            { $set: data },
            { new: true }
        );

        if (!client) {
            return { success: false, error: 'Client not found' };
        }

        revalidatePath('/accounting/clients');
        revalidatePath('/accounting/invoices');

        return {
            success: true,
            data: JSON.parse(JSON.stringify(client)),
        };
    } catch (error) {
        console.error('[UPDATE_CLIENT]', error);
        return {
            success: false,
            error: 'Failed to update client',
        };
    }
}

export async function deleteClient(clientId: string) {
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


        await Client.findOneAndDelete({
            _id: clientId,
            businessId,
        });

        revalidatePath('/accounting/clients');

        return { success: true };
    } catch (error) {
        console.error('[DELETE_CLIENT]', error);
        return {
            success: false,
            error: 'Failed to delete client',
        };
    }
}
