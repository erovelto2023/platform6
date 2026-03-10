"use server";

import connectToDatabase from "@/lib/db/connect";
import GlossaryTerm from "@/lib/db/models/GlossaryTerm";
import { revalidatePath } from "next/cache";

export async function getGlossaryTerms(options: { limit?: number; niche?: string } = {}) {
    try {
        await connectToDatabase();
        const query = options.niche ? { niche: options.niche } : {};
        const terms = await GlossaryTerm.find(query)
            .sort({ term: 1 })
            .limit(options.limit || 0)
            .lean();
        return { terms: JSON.parse(JSON.stringify(terms)) };
    } catch (e) {
        console.error("Failed to fetch glossary terms", e);
        return { terms: [] };
    }
}

export async function getNiches() {
    try {
        await connectToDatabase();
        const niches = await GlossaryTerm.distinct("niche");
        return { niches: niches.filter(Boolean) };
    } catch (e) {
        console.error("Failed to fetch niches", e);
        return { niches: [] };
    }
}

export async function bulkCreateGlossaryTerms(terms: any[]) {
    try {
        await connectToDatabase();
        const { slugify, makeUniqueSlug } = await import('@/lib/utils/slugify');
        
        const existingTerms = await GlossaryTerm.find({}, { slug: 1 }).lean();
        const existingSlugs = existingTerms.map((t: any) => t.slug).filter(Boolean);

        const preparedTerms = terms.map((term, index) => {
            const baseSlug = slugify(term.term || term.id);
            const slug = makeUniqueSlug(baseSlug, existingSlugs);
            existingSlugs.push(slug);
            return {
                ...term,
                id: term.id || `g-bulk-${Date.now()}-${index}`,
                slug
            };
        });

        await GlossaryTerm.insertMany(preparedTerms);
        revalidatePath('/admin/glossary');
        return { success: true, count: preparedTerms.length };
    } catch (error: any) {
        console.error("Error bulk creating glossary terms:", error);
        return { error: error.message || "Failed to bulk create terms" };
    }
}

export async function createGlossaryTerm(data: any) {
    try {
        await connectToDatabase();
        
        // Simple ID generation
        const count = await GlossaryTerm.countDocuments();
        const nextId = `g${count + 1}-${Date.now()}`;

        // Ensure slug uniqueness
        let slug = data.slug;
        if (!slug && data.term) {
            const { slugify, makeUniqueSlug } = await import('@/lib/utils/slugify');
            const baseSlug = slugify(data.term);
            const existingTerms = await GlossaryTerm.find({}, { slug: 1 }).lean();
            const existingSlugs = existingTerms.map((t: any) => t.slug).filter(Boolean);
            slug = makeUniqueSlug(baseSlug, existingSlugs);
        }

        const newTerm = await GlossaryTerm.create({
            ...data,
            id: nextId,
            slug
        });

        revalidatePath('/admin/glossary');
        return { success: true, term: JSON.parse(JSON.stringify(newTerm)) };
    } catch (error: any) {
        console.error("Error creating glossary term:", error);
        return { error: error.message || "Failed to create glossary term" };
    }
}

export async function updateGlossaryTerm(data: any) {
    try {
        await connectToDatabase();

        if (data.term && !data.slug) {
            const { slugify, makeUniqueSlug } = await import('@/lib/utils/slugify');
            const baseSlug = slugify(data.term);
            const existingTerms = await GlossaryTerm.find({ id: { $ne: data.id } }, { slug: 1 }).lean();
            const existingSlugs = existingTerms.map((t: any) => t.slug).filter(Boolean);
            data.slug = makeUniqueSlug(baseSlug, existingSlugs);
        }

        await GlossaryTerm.findOneAndUpdate({ id: data.id }, data);
        revalidatePath('/admin/glossary');
        return { success: true };
    } catch (error: any) {
        console.error("Error updating glossary term:", error);
        return { error: error.message || "Failed to update term" };
    }
}

export async function deleteGlossaryTerm(termId: string) {
    try {
        await connectToDatabase();
        await GlossaryTerm.findOneAndDelete({ id: termId });
        revalidatePath('/admin/glossary');
        return { success: true };
    } catch (error: any) {
        console.error('Error deleting glossary term:', error);
        return { error: error.message || "Failed to delete term" };
    }
}

export async function deleteGlossaryTerms(termIds: string[]) {
    try {
        await connectToDatabase();
        await GlossaryTerm.deleteMany({ id: { $in: termIds } });
        revalidatePath('/admin/glossary');
        return { success: true };
    } catch (error: any) {
        console.error("Error bulk deleting glossary terms:", error);
        return { error: error.message || "Failed to delete terms" };
    }
}

export async function findDuplicateGlossaryTerms(category?: string) {
    try {
        await connectToDatabase();
        const matchStage = category ? { category: category } : {};
        const duplicates = await GlossaryTerm.aggregate([
            { $match: matchStage },
            {
                $group: {
                    _id: { $toLower: "$term" },
                    count: { $sum: 1 },
                    terms: { $push: "$$ROOT" }
                }
            },
            {
                $match: {
                    count: { $gt: 1 }
                }
            }
        ]);
        return JSON.parse(JSON.stringify(duplicates));
    } catch (error: any) {
        console.error("Error finding duplicate glossary terms:", error);
        return { error: error.message || "Failed to find duplicates" };
    }
}
