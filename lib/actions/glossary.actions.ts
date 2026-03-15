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
            .limit(options.limit || 10000) // Increase default limit to ensure all terms are fetched
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

// Coerce string values in object-array fields to {name, url} shape
function normalizeObjectArrayFields(term: any) {
    const objectArrayFields = ['amazonProducts', 'websitesRanking', 'podcastsRanking'];
    for (const field of objectArrayFields) {
        if (Array.isArray(term[field])) {
            term[field] = term[field].map((item: any) =>
                typeof item === 'string' ? { name: item, url: '' } : item
            );
        }
    }
    return term;
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
            const normalized = normalizeObjectArrayFields({ ...term });
            return {
                ...normalized,
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

export async function removeDuplicateGlossaryTerms() {
    try {
        await connectToDatabase();
        // Find all duplicate groups (case-insensitive term match)
        const duplicates = await GlossaryTerm.aggregate([
            {
                $group: {
                    _id: { $toLower: "$term" },
                    count: { $sum: 1 },
                    docs: { $push: { id: "$id", _id: "$_id", createdAt: "$createdAt" } }
                }
            },
            { $match: { count: { $gt: 1 } } }
        ]);

        if (duplicates.length === 0) return { success: true, removed: 0 };

        // For each duplicate group, keep the first/oldest, delete the rest
        const idsToDelete: string[] = [];
        for (const group of duplicates) {
            // Sort so oldest is first (keep it), delete the rest
            const sorted = group.docs.sort((a: any, b: any) =>
                new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
            );
            // Skip the first (oldest), mark the rest for deletion
            for (let i = 1; i < sorted.length; i++) {
                idsToDelete.push(sorted[i].id);
            }
        }

        if (idsToDelete.length > 0) {
            await GlossaryTerm.deleteMany({ id: { $in: idsToDelete } });
        }

        revalidatePath('/admin/glossary');
        revalidatePath('/glossary');
        return { success: true, removed: idsToDelete.length };
    } catch (error: any) {
        console.error("Error removing duplicate glossary terms:", error);
        return { error: error.message || "Failed to remove duplicates" };
    }
}

