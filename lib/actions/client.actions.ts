'use server';

import { revalidatePath } from 'next/cache';
import connectToDatabase from '../db/connect';
import Client from '../db/models/Client';
import Business from '../db/models/Business';
import { auth } from '@clerk/nextjs/server';

export async function getClients() {
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

        const clients = await Client.find({ businessId: business._id }).sort({ createdAt: -1 });

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

        const business = await Business.findOne({ userId });
        if (!business) {
            return { success: false, error: 'Business profile not found' };
        }

        const client = await Client.create({
            ...data,
            businessId: business._id,
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

        const business = await Business.findOne({ userId });
        if (!business) {
            return { success: false, error: 'Business profile not found' };
        }

        const client = await Client.findOneAndUpdate(
            { _id: clientId, businessId: business._id },
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

        const business = await Business.findOne({ userId });
        if (!business) {
            return { success: false, error: 'Business profile not found' };
        }

        await Client.findOneAndDelete({
            _id: clientId,
            businessId: business._id,
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
