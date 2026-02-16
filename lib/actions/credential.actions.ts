'use server';

import { revalidatePath } from 'next/cache';
import connectToDatabase from '../db/connect';
import Credential from '../db/models/Credential';
import { getOrCreateBusiness } from './business.actions';

export async function getCredentials(page = 1, limit = 50, search = "") {
    try {
        const businessResult = await getOrCreateBusiness();
        if (!businessResult.success || !businessResult.data) {
            return { success: false, error: 'Business not found' };
        }
        const businessId = businessResult.data._id;

        await connectToDatabase();

        const query: any = { businessId };

        if (search) {
            query.$or = [
                { serviceName: { $regex: search, $options: 'i' } },
                { username: { $regex: search, $options: 'i' } },
                { url: { $regex: search, $options: 'i' } }
            ];
        }

        const skip = (page - 1) * limit;

        const credentials = await Credential.find(query)
            .sort({ serviceName: 1 })
            .skip(skip)
            .limit(limit);

        const total = await Credential.countDocuments(query);

        return {
            success: true,
            data: JSON.parse(JSON.stringify(credentials)),
            pagination: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit)
            }
        };
    } catch (error) {
        console.error('[GET_CREDENTIALS]', error);
        return { success: false, error: 'Failed to fetch credentials' };
    }
}

export async function getCredential(credentialId: string) {
    try {
        const businessResult = await getOrCreateBusiness();
        if (!businessResult.success || !businessResult.data) {
            return { success: false, error: 'Business not found' };
        }
        const businessId = businessResult.data._id;

        await connectToDatabase();

        const credential = await Credential.findOne({ _id: credentialId, businessId });

        if (!credential) {
            return { success: false, error: 'Credential not found' };
        }

        return { success: true, data: JSON.parse(JSON.stringify(credential)) };
    } catch (error) {
        console.error('[GET_CREDENTIAL]', error);
        return { success: false, error: 'Failed to fetch credential' };
    }
}

export async function createCredential(data: any) {
    try {
        const businessResult = await getOrCreateBusiness();
        if (!businessResult.success || !businessResult.data) {
            return { success: false, error: 'Business not found' };
        }
        const businessId = businessResult.data._id;

        await connectToDatabase();

        const credential = await Credential.create({
            ...data,
            businessId
        });

        revalidatePath('/accounting/credentials');

        return {
            success: true,
            data: JSON.parse(JSON.stringify(credential))
        };
    } catch (error) {
        console.error('[CREATE_CREDENTIAL]', error);
        return { success: false, error: 'Failed to create credential' };
    }
}

export async function updateCredential(credentialId: string, data: any) {
    try {
        const businessResult = await getOrCreateBusiness();
        if (!businessResult.success || !businessResult.data) {
            return { success: false, error: 'Business not found' };
        }
        const businessId = businessResult.data._id;

        await connectToDatabase();

        const credential = await Credential.findOneAndUpdate(
            { _id: credentialId, businessId },
            { $set: data },
            { new: true }
        );

        if (!credential) {
            return { success: false, error: 'Credential not found' };
        }

        revalidatePath('/accounting/credentials');
        revalidatePath(`/accounting/credentials/${credentialId}`);

        return {
            success: true,
            data: JSON.parse(JSON.stringify(credential))
        };
    } catch (error) {
        console.error('[UPDATE_CREDENTIAL]', error);
        return { success: false, error: 'Failed to update credential' };
    }
}

export async function deleteCredential(credentialId: string) {
    try {
        const businessResult = await getOrCreateBusiness();
        if (!businessResult.success || !businessResult.data) {
            return { success: false, error: 'Business not found' };
        }
        const businessId = businessResult.data._id;

        await connectToDatabase();

        const credential = await Credential.findOneAndDelete({ _id: credentialId, businessId });

        if (!credential) {
            return { success: false, error: 'Credential not found' };
        }

        revalidatePath('/accounting/credentials');

        return { success: true };
    } catch (error) {
        console.error('[DELETE_CREDENTIAL]', error);
        return { success: false, error: 'Failed to delete credential' };
    }
}
