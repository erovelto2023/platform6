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


export async function scrubGlossaryUrls() {
    try {
        await connectToDatabase();
        const terms = await GlossaryTerm.find({});
        let updatedCount = 0;
        let scrubbedFieldCount = 0;

        const cleanUrl = (url: any) => {
            if (!url || typeof url !== 'string') return "";
            const u = url.trim().toLowerCase();
            if (
                u === "" ||
                u === "#" ||
                u.includes("example.com") ||
                u.includes("yoursite.com") ||
                u.includes("mysite.com") ||
                u.includes("domain.com") ||
                u.includes("insert_url") ||
                u === "http://" ||
                u === "https://"
            ) return "";
            return url.trim();
        };

        for (const term of terms) {
            let hasChanges = false;

            // Arrays of objects
            const objectArrayFields = ['amazonProducts', 'websitesRanking', 'podcastsRanking'];
            for (const field of objectArrayFields) {
                const array = term[field as keyof typeof term];
                if (Array.isArray(array)) {
                    const cleanedArray = array.map((item: any) => {
                        const originalUrl = item.url;
                        const cleanedUrl = cleanUrl(originalUrl);
                        if (originalUrl !== cleanedUrl) {
                            hasChanges = true;
                            scrubbedFieldCount++;
                            return { ...item, url: cleanedUrl };
                        }
                        return item;
                    });
                    
                    if (hasChanges) {
                        (term as any)[field] = cleanedArray;
                    }
                }
            }

            // Single string fields
            const stringFields = ['videoUrl'];
            for (const field of stringFields) {
                const val = term[field as keyof typeof term];
                if (typeof val === 'string') {
                    const cleaned = cleanUrl(val);
                    if (val !== cleaned) {
                        (term as any)[field] = cleaned;
                        hasChanges = true;
                        scrubbedFieldCount++;
                    }
                }
            }

            if (hasChanges) {
                await term.save();
                updatedCount++;
            }
        }

        revalidatePath('/admin/glossary');
        revalidatePath('/glossary');
        return { success: true, updatedTerms: updatedCount, scrubbedFields: scrubbedFieldCount };
    } catch (error: any) {
        console.error("Error scrubbing glossary URLs:", error);
        return { error: error.message || "Failed to scrub URLs" };
    }
}

export async function backfillAffiliateTags() {
    try {
        await connectToDatabase();
        const affiliateId = "weightlo0f57d-20";
        let glossaryUpdated = 0;
        let productUpdated = 0;

        // 1. Update Glossary Terms
        const terms = await GlossaryTerm.find({ 
            amazonProducts: { $exists: true, $ne: [] } 
        });

        for (const term of terms) {
            let hasChanges = false;
            if (term.amazonProducts) {
                term.amazonProducts = term.amazonProducts.map((p: any) => {
                    if (p.url && p.url.includes("amazon.com") && !p.url.includes(`tag=${affiliateId}`)) {
                        const separator = p.url.includes("?") ? "&" : "?";
                        p.url = `${p.url}${separator}tag=${affiliateId}`;
                        hasChanges = true;
                    }
                    return p;
                });
            }
            if (hasChanges) {
                await term.save();
                glossaryUpdated++;
            }
        }

        // 2. Update Directory Products
        const DirectoryProduct = (await import("@/lib/db/models/DirectoryProduct")).default;
        const products = await DirectoryProduct.find({
            affiliateLink: { $regex: /amazon\.com/ }
        });

        for (const product of products) {
            if (product.affiliateLink && !product.affiliateLink.includes(`tag=${affiliateId}`)) {
                const separator = product.affiliateLink.includes("?") ? "&" : "?";
                product.affiliateLink = `${product.affiliateLink}${separator}tag=${affiliateId}`;
                await product.save();
                productUpdated++;
            }
        }

        revalidatePath('/admin/glossary');
        revalidatePath('/glossary');
        return { success: true, glossaryUpdated, productUpdated };
    } catch (error: any) {
        console.error("Error backfilling affiliate tags:", error);
        return { error: error.message || "Failed to backfill affiliate tags" };
    }
}

export async function backfillAiPrompts() {
    try {
        await connectToDatabase();
        const terms = await GlossaryTerm.find({});
        let updatedCount = 0;

        for (const term of terms) {
            let hasChanges = false;
            const termName = term.term;

            if (!term.imagePrompt || term.imagePrompt.trim() === "") {
                term.imagePrompt = `A high-quality, professional 3D render or cinematic photograph representing ${termName}, designed for a modern business and marketing blog background. Clean composition, vibrant but professional colors, 4k resolution.`;
                hasChanges = true;
            }
            if (!term.productPrompt || term.productPrompt.trim() === "") {
                term.productPrompt = `I want to create a unique product related to "${termName}". Please brainstorm 5 distinct product ideas, ranging from digital downloads (ebooks/templates) to physical goods. For each idea, explain the target audience and the primary value proposition.`;
                hasChanges = true;
            }
            if (!term.socialPrompt || term.socialPrompt.trim() === "") {
                term.socialPrompt = `Create a comprehensive 7-day social media content plan for "${termName}". Include hooks for TikTok/Reels, educational captions for Instagram, and a thought-leadership thread for X (Twitter). Focus on how this topic helps small business owners.`;
                hasChanges = true;
            }

            if (hasChanges) {
                await term.save();
                updatedCount++;
            }
        }

        revalidatePath('/admin/glossary');
        revalidatePath('/glossary');
        return { success: true, updatedCount };
    } catch (error: any) {
        console.error("Error backfilling AI prompts:", error);
        return { error: error.message || "Failed to backfill prompts" };
    }
}

export async function verifyYouTubeLinks() {
    try {
        await connectToDatabase();
        const terms = await GlossaryTerm.find({ videoUrl: { $exists: true, $ne: "" } }, { id: 1, term: 1, videoUrl: 1 }).lean();
        
        const brokenTerms: { id: string; term: string; videoUrl: string; reason: string }[] = [];
        
        // Process in small batches to avoid rate limiting
        for (const term of terms) {
            if (!term.videoUrl) continue;
            
            try {
                const res = await fetch(`https://www.youtube.com/oembed?url=${encodeURIComponent(term.videoUrl)}&format=json`);
                if (res.status === 404 || res.status === 400) {
                    brokenTerms.push({
                        id: term.id,
                        term: term.term,
                        videoUrl: term.videoUrl,
                        reason: "Video not found or unavailable"
                    });
                } else if (!res.ok) {
                   // Some other error, maybe rate limit or temporary issue, but 404/400 are definitive
                }
            } catch (err) {
                // Network error or fetch failed
                brokenTerms.push({
                    id: term.id,
                    term: term.term,
                    videoUrl: term.videoUrl,
                    reason: "Verification failed (network error)"
                });
            }
        }
        
        return { success: true, count: terms.length, brokenCount: brokenTerms.length, brokenTerms };
    } catch (error: any) {
        console.error("Error verifying YouTube links:", error);
        return { error: error.message || "Failed to verify links" };
    }
}

export async function normalizeGlossaryData() {
    try {
        await connectToDatabase();
        const collection = GlossaryTerm.collection;
        const terms = await collection.find({}).toArray();
        let updatedCount = 0;

        const objectArrayFields = ['amazonProducts', 'websitesRanking', 'podcastsRanking'];

        for (const term of terms) {
            let termHasChanges = false;
            const updateObj: any = {};
            
            for (const field of objectArrayFields) {
                const array = term[field];
                if (Array.isArray(array)) {
                    let fieldHasChanges = false;
                    const normalized = array.map((item: any) => {
                        if (typeof item === 'string') {
                            fieldHasChanges = true;
                            termHasChanges = true;
                            return { name: item, url: "" };
                        }
                        if (!item || typeof item !== 'object') {
                            fieldHasChanges = true;
                            termHasChanges = true;
                            return { name: String(item || ""), url: "" };
                        }
                        if (item.name === undefined || item.url === undefined) {
                            fieldHasChanges = true;
                            termHasChanges = true;
                            return { name: item.name || item.title || item.label || String(JSON.stringify(item)), url: item.url || item.link || "" };
                        }
                        return item;
                    });
                    
                    if (fieldHasChanges) {
                        updateObj[field] = normalized;
                    }
                }
            }

            if (termHasChanges) {
                await collection.updateOne({ _id: term._id }, { $set: updateObj });
                updatedCount++;
            }
        }

        revalidatePath('/admin/glossary');
        return { success: true, updatedCount };
    } catch (error: any) {
        console.error("Error normalizing glossary data:", error);
        return { error: error.message || "Failed to normalize data" };
    }
}
