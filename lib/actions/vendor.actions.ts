'use server';

import { revalidatePath } from 'next/cache';
import connectToDatabase from '../db/connect';
import Vendor from '../db/models/Vendor';
import { auth } from '@clerk/nextjs/server';
import { getOrCreateBusiness } from './business.actions';

export async function getVendors(page = 1, limit = 50, search = "") {
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
                { name: { $regex: search, $options: 'i' } },
                { contactPerson: { $regex: search, $options: 'i' } },
                { email: { $regex: search, $options: 'i' } }
            ];
        }

        const skip = (page - 1) * limit;

        const vendors = await Vendor.find(query)
            .sort({ name: 1 })
            .skip(skip)
            .limit(limit);

        const total = await Vendor.countDocuments(query);

        return {
            success: true,
            data: JSON.parse(JSON.stringify(vendors)),
            pagination: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit)
            }
        };
    } catch (error) {
        console.error('[GET_VENDORS]', error);
        return { success: false, error: 'Failed to fetch vendors' };
    }
}

export async function getVendor(vendorId: string) {
    try {
        const businessResult = await getOrCreateBusiness();
        if (!businessResult.success || !businessResult.data) {
            return { success: false, error: 'Business not found' };
        }
        const businessId = businessResult.data._id;

        await connectToDatabase();

        const vendor = await Vendor.findOne({ _id: vendorId, businessId });

        if (!vendor) {
            return { success: false, error: 'Vendor not found' };
        }

        return { success: true, data: JSON.parse(JSON.stringify(vendor)) };
    } catch (error) {
        console.error('[GET_VENDOR]', error);
        return { success: false, error: 'Failed to fetch vendor' };
    }
}

export async function createVendor(data: any) {
    try {
        const businessResult = await getOrCreateBusiness();
        if (!businessResult.success || !businessResult.data) {
            return { success: false, error: 'Business not found' };
        }
        const businessId = businessResult.data._id;

        await connectToDatabase();

        const vendor = await Vendor.create({
            ...data,
            businessId
        });

        revalidatePath('/accounting/vendors');

        return {
            success: true,
            data: JSON.parse(JSON.stringify(vendor))
        };
    } catch (error: any) {
        console.error('[CREATE_VENDOR]', error);
        if (error.code === 11000) {
            return { success: false, error: 'A vendor with this name already exists.' };
        }
        return { success: false, error: 'Failed to create vendor' };
    }
}

export async function updateVendor(vendorId: string, data: any) {
    try {
        const businessResult = await getOrCreateBusiness();
        if (!businessResult.success || !businessResult.data) {
            return { success: false, error: 'Business not found' };
        }
        const businessId = businessResult.data._id;

        await connectToDatabase();

        const vendor = await Vendor.findOneAndUpdate(
            { _id: vendorId, businessId },
            { $set: data },
            { new: true }
        );

        if (!vendor) {
            return { success: false, error: 'Vendor not found' };
        }

        revalidatePath('/accounting/vendors');
        revalidatePath(`/accounting/vendors/${vendorId}`);

        return {
            success: true,
            data: JSON.parse(JSON.stringify(vendor))
        };
    } catch (error: any) {
        console.error('[UPDATE_VENDOR]', error);
        if (error.code === 11000) {
            return { success: false, error: 'A vendor with this name already exists.' };
        }
        return { success: false, error: 'Failed to update vendor' };
    }
}

export async function deleteVendor(vendorId: string) {
    try {
        const businessResult = await getOrCreateBusiness();
        if (!businessResult.success || !businessResult.data) {
            return { success: false, error: 'Business not found' };
        }
        const businessId = businessResult.data._id;

        await connectToDatabase();

        const vendor = await Vendor.findOneAndDelete({ _id: vendorId, businessId });

        if (!vendor) {
            return { success: false, error: 'Vendor not found' };
        }

        revalidatePath('/accounting/vendors');

        return { success: true };
    } catch (error) {
        console.error('[DELETE_VENDOR]', error);
        return { success: false, error: 'Failed to delete vendor' };
    }
}
