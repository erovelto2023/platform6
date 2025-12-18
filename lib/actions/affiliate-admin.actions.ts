"use server";

import connectToDatabase from "@/lib/db/connect";
import AffiliateCompany from "@/lib/db/models/AffiliateCompany";
import AffiliateProduct from "@/lib/db/models/AffiliateProduct";
import { revalidatePath } from "next/cache";

// --- Company Actions ---

export async function createAffiliateCompany(data: any) {
    await connectToDatabase();

    // Generate slug if not provided
    if (!data.slug) {
        data.slug = data.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
    }

    const company = await AffiliateCompany.create(data);
    revalidatePath('/admin/affiliates');
    return JSON.parse(JSON.stringify(company));
}

export async function updateAffiliateCompany(id: string, data: any) {
    await connectToDatabase();
    const company = await AffiliateCompany.findByIdAndUpdate(id, data, { new: true });
    revalidatePath('/admin/affiliates');
    revalidatePath(`/admin/affiliates/${id}`);
    return JSON.parse(JSON.stringify(company));
}

export async function deleteAffiliateCompany(id: string) {
    await connectToDatabase();
    await AffiliateCompany.findByIdAndDelete(id);
    // Also delete associated products? Yes, probably.
    await AffiliateProduct.deleteMany({ companyId: id });
    revalidatePath('/admin/affiliates');
    return { success: true };
}

export async function getAffiliateCompanies(query: any = {}, limit = 50, skip = 0) {
    await connectToDatabase();
    const companies = await AffiliateCompany.find(query)
        .sort({ name: 1 })
        .skip(skip)
        .limit(limit)
        .lean();
    return JSON.parse(JSON.stringify(companies));
}

export async function getAffiliateCompany(id: string) {
    await connectToDatabase();
    const company = await AffiliateCompany.findById(id).lean();
    return JSON.parse(JSON.stringify(company));
}

// --- Product Actions ---

export async function createAffiliateProduct(data: any) {
    await connectToDatabase();
    const product = await AffiliateProduct.create(data);
    revalidatePath(`/admin/affiliates/${data.companyId}`);
    return JSON.parse(JSON.stringify(product));
}

export async function updateAffiliateProduct(id: string, data: any) {
    await connectToDatabase();
    const product = await AffiliateProduct.findByIdAndUpdate(id, data, { new: true });
    // Revalidate parent company page if we knew it, but we might not have it here easily without fetching.
    // Ideally we pass companyId or fetch it.
    if (product.companyId) {
        revalidatePath(`/admin/affiliates/${product.companyId}`);
    }
    return JSON.parse(JSON.stringify(product));
}

export async function deleteAffiliateProduct(id: string) {
    await connectToDatabase();
    const product = await AffiliateProduct.findByIdAndDelete(id);
    if (product?.companyId) {
        revalidatePath(`/admin/affiliates/${product.companyId}`);
    }
    return { success: true };
}

export async function getAffiliateProducts(companyId: string) {
    await connectToDatabase();
    const products = await AffiliateProduct.find({ companyId }).lean();
    return JSON.parse(JSON.stringify(products));
}
