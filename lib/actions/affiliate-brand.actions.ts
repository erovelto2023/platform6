"use server";

import connectDB from "@/lib/db/connect";
import AffiliateBrand from "@/lib/db/models/AffiliateBrand";
import { revalidatePath } from "next/cache";

// Create a new brand
export async function createBrand(data: {
    name: string;
    affiliateLink: string;
    productType: string;
    logoUrl?: string;
    description?: string;
}) {
    try {
        await connectDB();

        const slug = data.name
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, "-")
            .replace(/(^-|-$)/g, "");

        const brand = await AffiliateBrand.create({
            ...data,
            slug,
        });

        revalidatePath("/admin/affiliate-pages/brands");
        return { success: true, brand: JSON.parse(JSON.stringify(brand)) };
    } catch (error: any) {
        return { success: false, error: error.message };
    }
}

// Get all brands
export async function getBrands() {
    try {
        await connectDB();
        const brands = await AffiliateBrand.find().sort({ createdAt: -1 }).lean();
        return JSON.parse(JSON.stringify(brands));
    } catch (error) {
        return [];
    }
}

// Get single brand
export async function getBrand(id: string) {
    try {
        await connectDB();
        const brand = await AffiliateBrand.findById(id).lean();
        return JSON.parse(JSON.stringify(brand));
    } catch (error) {
        return null;
    }
}

// Update brand
export async function updateBrand(id: string, data: any) {
    try {
        await connectDB();
        const brand = await AffiliateBrand.findByIdAndUpdate(id, data, {
            new: true,
        });
        revalidatePath("/admin/affiliate-pages/brands");
        return { success: true, brand: JSON.parse(JSON.stringify(brand)) };
    } catch (error: any) {
        return { success: false, error: error.message };
    }
}

// Delete brand
export async function deleteBrand(id: string) {
    try {
        await connectDB();
        await AffiliateBrand.findByIdAndDelete(id);
        revalidatePath("/admin/affiliate-pages/brands");
        return { success: true };
    } catch (error: any) {
        return { success: false, error: error.message };
    }
}

// Set active brand
export async function setActiveBrand(id: string) {
    try {
        await connectDB();
        // Deactivate all brands
        await AffiliateBrand.updateMany({}, { isActive: false });
        // Activate selected brand
        await AffiliateBrand.findByIdAndUpdate(id, { isActive: true });
        revalidatePath("/admin/affiliate-pages/brands");
        return { success: true };
    } catch (error: any) {
        return { success: false, error: error.message };
    }
}

// Add knowledge source
export async function addKnowledgeSource(
    brandId: string,
    source: {
        type: "url" | "youtube" | "text";
        content: string;
        title?: string;
    }
) {
    try {
        await connectDB();
        const brand = await AffiliateBrand.findById(brandId);
        if (!brand) {
            return { success: false, error: "Brand not found" };
        }

        brand.knowledgeBase.push(source);
        await brand.save();

        revalidatePath(`/admin/affiliate-pages/brands/${brandId}`);
        return { success: true, brand: JSON.parse(JSON.stringify(brand)) };
    } catch (error: any) {
        return { success: false, error: error.message };
    }
}

// Remove knowledge source
export async function removeKnowledgeSource(
    brandId: string,
    sourceId: string
) {
    try {
        await connectDB();
        const brand = await AffiliateBrand.findById(brandId);
        if (!brand) {
            return { success: false, error: "Brand not found" };
        }

        brand.knowledgeBase = brand.knowledgeBase.filter(
            (source: any) => source._id.toString() !== sourceId
        );
        await brand.save();

        revalidatePath(`/admin/affiliate-pages/brands/${brandId}`);
        return { success: true };
    } catch (error: any) {
        return { success: false, error: error.message };
    }
}
