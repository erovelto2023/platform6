"use server";

import connectToDatabase from "@/lib/db/connect";
import Supplier from "@/lib/db/models/Supplier";
import SavedSupplier from "@/lib/db/models/SavedSupplier";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

// --- Supplier Actions ---

export async function getSuppliers(filters: any = {}) {
    await connectToDatabase();

    const query: any = {};

    if (filters.search) {
        query.$or = [
            { name: { $regex: filters.search, $options: 'i' } },
            { products: { $regex: filters.search, $options: 'i' } },
            { categories: { $regex: filters.search, $options: 'i' } }
        ];
    }

    if (filters.type && filters.type !== 'All') {
        if (filters.type === 'Dropshipper') query.wholesaleType = { $in: ['Dropshipper', 'Both'] };
        if (filters.type === 'Light Bulk') query.wholesaleType = { $in: ['Light Bulk', 'Both'] };
    }

    if (filters.category) {
        query.categories = filters.category;
    }

    if (filters.location) {
        query['location.country'] = filters.location;
    }

    if (filters.channel) {
        query.approvedChannels = filters.channel;
    }

    const suppliers = await Supplier.find(query).sort({ createdAt: -1 }).limit(50);

    // Check which ones are saved by the current user
    const { userId } = await auth();
    let savedIds: string[] = [];
    if (userId) {
        const saved = await SavedSupplier.find({ userId }).select('supplierId');
        savedIds = saved.map((s: any) => s.supplierId.toString());
    }

    return suppliers.map(s => ({
        ...JSON.parse(JSON.stringify(s)),
        isSaved: savedIds.includes(s._id.toString())
    }));
}

export async function getSupplierById(id: string) {
    await connectToDatabase();
    const supplier = await Supplier.findById(id);
    if (!supplier) return null;

    const { userId } = await auth();
    let savedData = null;
    if (userId) {
        savedData = await SavedSupplier.findOne({ userId, supplierId: id });
    }

    return {
        ...JSON.parse(JSON.stringify(supplier)),
        savedData: savedData ? JSON.parse(JSON.stringify(savedData)) : null
    };
}

export async function createSupplier(data: any) {
    // In a real app, check for admin role here
    await connectToDatabase();
    const supplier = await Supplier.create(data);
    revalidatePath('/tools/wholesale-directory');
    return JSON.parse(JSON.stringify(supplier));
}

export async function updateSupplier(id: string, data: any) {
    await connectToDatabase();
    const supplier = await Supplier.findByIdAndUpdate(id, data, { new: true });
    revalidatePath('/tools/wholesale-directory');
    return JSON.parse(JSON.stringify(supplier));
}

export async function deleteSupplier(id: string) {
    await connectToDatabase();
    await Supplier.findByIdAndDelete(id);
    revalidatePath('/tools/wholesale-directory');
    return { success: true };
}

// --- Saved Supplier Actions ---

export async function toggleSaveSupplier(supplierId: string) {
    const { userId } = await auth();
    if (!userId) throw new Error("Unauthorized");

    await connectToDatabase();

    const existing = await SavedSupplier.findOne({ userId, supplierId });

    if (existing) {
        await SavedSupplier.findByIdAndDelete(existing._id);
        revalidatePath('/tools/wholesale-directory');
        return { saved: false };
    } else {
        await SavedSupplier.create({ userId, supplierId });
        revalidatePath('/tools/wholesale-directory');
        return { saved: true };
    }
}

export async function updateSupplierNotes(supplierId: string, notes: string) {
    const { userId } = await auth();
    if (!userId) throw new Error("Unauthorized");

    await connectToDatabase();

    // Upsert the saved record if it doesn't exist (saving automatically if adding notes)
    await SavedSupplier.findOneAndUpdate(
        { userId, supplierId },
        { $set: { notes }, $setOnInsert: { status: 'saved' } },
        { upsert: true, new: true }
    );

    revalidatePath('/tools/wholesale-directory');
    return { success: true };
}

export async function getSavedSuppliers() {
    const { userId } = await auth();
    if (!userId) throw new Error("Unauthorized");

    await connectToDatabase();

    const saved = await SavedSupplier.find({ userId }).populate('supplierId');

    return saved.map((s: any) => ({
        ...JSON.parse(JSON.stringify(s.supplierId)),
        savedData: {
            notes: s.notes,
            savedAt: s.savedAt,
            status: s.status
        },
        isSaved: true
    }));
}
