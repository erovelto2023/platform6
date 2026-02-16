'use server';

import { revalidatePath } from 'next/cache';
import connectToDatabase from '../db/connect';
import Product from '../db/models/Product';
import { getOrCreateBusiness } from './business.actions';

export async function getProducts(page = 1, limit = 50) {
    try {
        const businessResult = await getOrCreateBusiness();
        if (!businessResult.success || !businessResult.data) {
            return { success: false, error: 'Business not found' };
        }
        const businessId = businessResult.data._id;

        await connectToDatabase();
        const skip = (page - 1) * limit;

        const products = await Product.find({ businessId })
            .sort({ name: 1 })
            .skip(skip)
            .limit(limit);

        const total = await Product.countDocuments({ businessId });

        return {
            success: true,
            data: JSON.parse(JSON.stringify(products)),
            pagination: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit),
            },
        };
    } catch (error) {
        console.error('[GET_PRODUCTS]', error);
        return { success: false, error: 'Failed to fetch products' };
    }
}

export async function getProduct(id: string) {
    try {
        const businessResult = await getOrCreateBusiness();
        if (!businessResult.success || !businessResult.data) {
            return { success: false, error: 'Business not found' };
        }
        const businessId = businessResult.data._id;

        await connectToDatabase();
        const product = await Product.findOne({ _id: id, businessId });

        if (!product) {
            return { success: false, error: 'Product not found' };
        }

        return { success: true, data: JSON.parse(JSON.stringify(product)) };
    } catch (error) {
        console.error('[GET_PRODUCT]', error);
        return { success: false, error: 'Failed to fetch product' };
    }
}

export async function createProduct(data: any) {
    try {
        const businessResult = await getOrCreateBusiness();
        if (!businessResult.success || !businessResult.data) {
            return { success: false, error: 'Business not found' };
        }
        const businessId = businessResult.data._id;

        await connectToDatabase();
        const product = await Product.create({
            ...data,
            businessId,
        });

        revalidatePath('/accounting/products');

        return { success: true, data: JSON.parse(JSON.stringify(product)) };
    } catch (error) {
        console.error('[CREATE_PRODUCT]', error);
        return { success: false, error: 'Failed to create product' };
    }
}

export async function updateProduct(id: string, data: any) {
    try {
        const businessResult = await getOrCreateBusiness();
        if (!businessResult.success || !businessResult.data) {
            return { success: false, error: 'Business not found' };
        }
        const businessId = businessResult.data._id;

        await connectToDatabase();
        const product = await Product.findOneAndUpdate(
            { _id: id, businessId },
            data,
            { new: true }
        );

        if (!product) {
            return { success: false, error: 'Product not found' };
        }

        revalidatePath('/accounting/products');
        revalidatePath(`/accounting/products/${id}`);

        return { success: true, data: JSON.parse(JSON.stringify(product)) };
    } catch (error) {
        console.error('[UPDATE_PRODUCT]', error);
        return { success: false, error: 'Failed to update product' };
    }
}

export async function deleteProduct(id: string) {
    try {
        const businessResult = await getOrCreateBusiness();
        if (!businessResult.success || !businessResult.data) {
            return { success: false, error: 'Business not found' };
        }
        const businessId = businessResult.data._id;

        await connectToDatabase();
        await Product.findOneAndDelete({ _id: id, businessId });

        revalidatePath('/accounting/products');

        return { success: true };
    } catch (error) {
        console.error('[DELETE_PRODUCT]', error);
        return { success: false, error: 'Failed to delete product' };
    }
}
