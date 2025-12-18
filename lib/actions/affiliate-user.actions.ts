"use server";

import connectToDatabase from "@/lib/db/connect";
import AffiliateCompany from "@/lib/db/models/AffiliateCompany";
import AffiliateProduct from "@/lib/db/models/AffiliateProduct";
import UserAffiliateCompany from "@/lib/db/models/UserAffiliateCompany";
import UserAffiliateProduct from "@/lib/db/models/UserAffiliateProduct";
import User from "@/lib/db/models/User";
import { revalidatePath } from "next/cache";

// --- Discovery ---

import { v4 as uuidv4 } from 'uuid';

export async function createCustomAffiliateCompany(userId: string, data: any) {
    await connectToDatabase();

    // Get user to verify existence
    const user = await User.findById(userId);
    if (!user) throw new Error("User not found");

    // Create Company
    const company = await AffiliateCompany.create({
        name: data.name,
        website: data.website,
        commissionRate: data.commissionRate,
        affiliateNetwork: data.affiliateNetwork || "Custom",
        slug: `${data.name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-${uuidv4().slice(0, 8)}`,
        isPublic: false,
        createdBy: user.clerkId,
        description: "Custom affiliate program added by user.",
        keywords: data.keywords || []
    });

    // Create Link
    const userCompany = await UserAffiliateCompany.create({
        userId,
        companyId: company._id,
        status: 'active', // Default to active for custom ones
        affiliateId: data.affiliateId,
        personalNotes: data.notes
    });

    revalidatePath('/affiliates');
    return JSON.parse(JSON.stringify(userCompany));
}

export async function searchAffiliateCompanies(query: string, filters: any = {}) {
    await connectToDatabase();

    const dbQuery: any = { isPublic: true };

    if (query) {
        dbQuery.$text = { $search: query };
    }

    if (filters.niche) {
        dbQuery.niches = filters.niche;
    }

    // Add more filters as needed

    const companies = await AffiliateCompany.find(dbQuery)
        .sort({ trustScore: -1 })
        .limit(50)
        .lean();

    return JSON.parse(JSON.stringify(companies));
}

// --- User Library ---

export async function getUserAffiliates(userId: string) {
    await connectToDatabase();

    const userCompanies = await UserAffiliateCompany.find({ userId })
        .populate('companyId')
        .sort({ updatedAt: -1 })
        .lean();

    return JSON.parse(JSON.stringify(userCompanies));
}

export async function saveAffiliateCompanyForUser(clerkId: string, companyId: string) {
    await connectToDatabase();

    const user = await User.findOne({ clerkId });
    if (!user) throw new Error("User not found");

    return saveAffiliateCompany(user._id, companyId);
}

export async function saveAffiliateCompany(userId: string, companyId: string) {
    await connectToDatabase();

    // Check if already exists
    const existing = await UserAffiliateCompany.findOne({ userId, companyId });
    if (existing) return JSON.parse(JSON.stringify(existing));

    const userCompany = await UserAffiliateCompany.create({
        userId,
        companyId,
        status: 'interested'
    });

    revalidatePath('/affiliates');
    return JSON.parse(JSON.stringify(userCompany));
}

export async function updateUserAffiliateCompany(id: string, data: any) {
    await connectToDatabase();
    const updated = await UserAffiliateCompany.findByIdAndUpdate(id, data, { new: true });
    revalidatePath('/affiliates');
    return JSON.parse(JSON.stringify(updated));
}

export async function removeUserAffiliateCompany(id: string) {
    await connectToDatabase();
    await UserAffiliateCompany.findByIdAndDelete(id);
    revalidatePath('/affiliates');
    return { success: true };
}

// --- User Products ---

export async function saveAffiliateProduct(userId: string, productId: string, companyId: string) {
    await connectToDatabase();

    const existing = await UserAffiliateProduct.findOne({ userId, productId });
    if (existing) return JSON.parse(JSON.stringify(existing));

    const userProduct = await UserAffiliateProduct.create({
        userId,
        productId,
        companyId,
        status: 'planned'
    });

    revalidatePath(`/affiliates/${companyId}`); // Assuming we have a detail page
    return JSON.parse(JSON.stringify(userProduct));
}

export async function updateUserAffiliateProduct(id: string, data: any) {
    await connectToDatabase();
    const updated = await UserAffiliateProduct.findByIdAndUpdate(id, data, { new: true });
    return JSON.parse(JSON.stringify(updated));
}

// --- Sales & Performance ---

import AffiliateSale from "@/lib/db/models/AffiliateSale";
import AffiliateLink from "@/lib/db/models/AffiliateLink";

export async function getAffiliateSales(userAffiliateId: string) {
    await connectToDatabase();
    const sales = await AffiliateSale.find({ userAffiliateId }).sort({ dateOfSale: -1 }).lean();
    return JSON.parse(JSON.stringify(sales));
}

export async function addAffiliateSale(userAffiliateId: string, data: any) {
    await connectToDatabase();

    // Get user ID from the userAffiliate record to ensure consistency
    const userAffiliate = await UserAffiliateCompany.findById(userAffiliateId);
    if (!userAffiliate) throw new Error("Affiliate record not found");

    const sale = await AffiliateSale.create({
        userAffiliateId,
        userId: userAffiliate.userId,
        ...data
    });

    // Update total earnings in UserAffiliateCompany
    const allSales = await AffiliateSale.find({ userAffiliateId });
    const totalEarnings = allSales.reduce((sum, s) => sum + (s.amount || 0), 0);
    await UserAffiliateCompany.findByIdAndUpdate(userAffiliateId, { totalEarnings });

    revalidatePath(`/affiliates/${userAffiliate.companyId}`);
    return JSON.parse(JSON.stringify(sale));
}

export async function deleteAffiliateSale(saleId: string) {
    await connectToDatabase();
    const sale = await AffiliateSale.findById(saleId);
    if (!sale) return;

    await AffiliateSale.findByIdAndDelete(saleId);

    // Recalculate total
    const allSales = await AffiliateSale.find({ userAffiliateId: sale.userAffiliateId });
    const totalEarnings = allSales.reduce((sum, s) => sum + (s.amount || 0), 0);
    await UserAffiliateCompany.findByIdAndUpdate(sale.userAffiliateId, { totalEarnings });

    revalidatePath('/affiliates');
    return { success: true };
}

// --- Links & Resources ---

export async function getAffiliateLinks(userAffiliateId: string) {
    await connectToDatabase();
    const links = await AffiliateLink.find({ userAffiliateId }).sort({ createdAt: -1 }).lean();
    return JSON.parse(JSON.stringify(links));
}

export async function addAffiliateLink(userAffiliateId: string, data: any) {
    await connectToDatabase();

    const userAffiliate = await UserAffiliateCompany.findById(userAffiliateId);
    if (!userAffiliate) throw new Error("Affiliate record not found");

    const link = await AffiliateLink.create({
        userAffiliateId,
        userId: userAffiliate.userId,
        ...data
    });

    revalidatePath(`/affiliates/${userAffiliate.companyId}`);
    return JSON.parse(JSON.stringify(link));
}

export async function deleteAffiliateLink(linkId: string) {
    await connectToDatabase();
    await AffiliateLink.findByIdAndDelete(linkId);
    revalidatePath('/affiliates');
    return { success: true };
}
