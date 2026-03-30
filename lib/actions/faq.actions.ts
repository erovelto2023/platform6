"use server";

import connectToDatabase from "@/lib/db/connect";
import FAQ from "@/lib/db/models/FAQ";
import { revalidatePath } from "next/cache";

export async function getFAQs() {
    try {
        await connectToDatabase();
        const faqs = await FAQ.find({}).sort({ createdAt: -1 }).lean();
        return JSON.parse(JSON.stringify(faqs));
    } catch (error) {
        console.error("Error fetching FAQs:", error);
        return [];
    }
}

export async function getPaginatedFAQs({
    page = 1,
    limit = 20,
    search = "",
    category = "",
    isPublished = true
}: {
    page?: number;
    limit?: number;
    search?: string;
    category?: string;
    isPublished?: boolean;
}) {
    try {
        await connectToDatabase();
        const query: any = { isPublished };

        if (search) {
            query.$or = [
                { question: { $regex: search, $options: "i" } },
                { answerSnippet: { $regex: search, $options: "i" } },
                { h1Title: { $regex: search, $options: "i" } }
            ];
        }

        if (category) {
            query.parentQuestion = category;
        }

        const skip = (page - 1) * limit;
        const [faqs, total] = await Promise.all([
            FAQ.find(query)
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limit)
                .lean(),
            FAQ.countDocuments(query)
        ]);

        return {
            faqs: JSON.parse(JSON.stringify(faqs)),
            total,
            page,
            totalPages: Math.ceil(total / limit)
        };
    } catch (error) {
        console.error("Error fetching paginated FAQs:", error);
        return { faqs: [], total: 0, page: 1, totalPages: 0 };
    }
}

export async function getFAQBySlug(slug: string) {
    try {
        await connectToDatabase();
        const faq = await FAQ.findOne({ slug }).lean();
        return faq ? JSON.parse(JSON.stringify(faq)) : null;
    } catch (error) {
        console.error("Error fetching FAQ by slug:", error);
        return null;
    }
}

export async function getFAQCategories() {
    try {
        await connectToDatabase();
        const categories = await FAQ.distinct('parentQuestion', { isPublished: true });
        return categories.filter(Boolean).sort();
    } catch (error) {
        console.error("Error fetching FAQ categories:", error);
        return [];
    }
}

export async function createFAQ(data: any) {
    try {
        await connectToDatabase();

        let slug = data.slug;
        if (!slug && data.question) {
            const { slugify, makeUniqueSlug } = await import('@/lib/utils/slugify');
            const baseSlug = slugify(data.question);
            const existingFAQs = await FAQ.find({}, { slug: 1 }).lean();
            const existingSlugs = existingFAQs.map((f: any) => f.slug).filter(Boolean);
            slug = makeUniqueSlug(baseSlug, existingSlugs);
        }

        const newFAQ = await FAQ.create({
            ...data,
            slug,
            isPublished: data.isPublished !== undefined ? data.isPublished : true
        });

        revalidatePath('/admin/faqs');
        return { success: true, faq: JSON.parse(JSON.stringify(newFAQ)) };
    } catch (error: any) {
        console.error("Error creating FAQ:", error);
        return { error: error.message || "Failed to create FAQ" };
    }
}

export async function updateFAQ(data: any) {
    try {
        await connectToDatabase();
        const id = data._id || data.id;

        if (data.question && !data.slug) {
            const { slugify, makeUniqueSlug } = await import('@/lib/utils/slugify');
            const baseSlug = slugify(data.question);
            const existingFAQs = await FAQ.find({ _id: { $ne: id } }, { slug: 1 }).lean();
            const existingSlugs = existingFAQs.map((f: any) => f.slug).filter(Boolean);
            data.slug = makeUniqueSlug(baseSlug, existingSlugs);
        }

        await FAQ.findByIdAndUpdate(id, data);
        revalidatePath('/admin/faqs');
        return { success: true };
    } catch (error: any) {
        console.error("Error updating FAQ:", error);
        return { error: error.message || "Failed to update FAQ" };
    }
}

export async function deleteFAQ(id: string) {
    try {
        await connectToDatabase();
        await FAQ.findByIdAndDelete(id);
        revalidatePath('/admin/faqs');
        return { success: true };
    } catch (error: any) {
        console.error("Error deleting FAQ:", error);
        return { error: error.message || "Failed to delete FAQ" };
    }
}

export async function deleteFAQs(ids: string[]) {
    try {
        await connectToDatabase();
        await FAQ.deleteMany({ _id: { $in: ids } });
        revalidatePath('/admin/faqs');
        return { success: true };
    } catch (error: any) {
        console.error("Error bulk deleting FAQs:", error);
        return { error: error.message || "Failed to delete FAQs" };
    }
}

export async function importFAQs(faqs: any[]) {
    try {
        await connectToDatabase();
        const { slugify, makeUniqueSlug } = await import('@/lib/utils/slugify');

        const existingFAQs = await FAQ.find({}, { slug: 1 }).lean();
        const existingSlugs = existingFAQs.map((f: any) => f.slug).filter(Boolean);

        const preparedFAQs = faqs.map((faq) => {
            const baseSlug = slugify(faq.question);
            const slug = makeUniqueSlug(baseSlug, existingSlugs);
            existingSlugs.push(slug);
            return {
                ...faq,
                slug,
                isPublished: faq.isPublished !== undefined ? faq.isPublished : true
            };
        });

        await FAQ.insertMany(preparedFAQs);
        revalidatePath('/admin/faqs');
        return { success: true, count: preparedFAQs.length };
    } catch (error: any) {
        console.error("Error importing FAQs:", error);
        return { error: error.message || "Failed to import FAQs" };
    }
}
export async function importCSVFAQs(faqs: any[]) {
    try {
        await connectToDatabase();
        const { slugify, makeUniqueSlug } = await import('@/lib/utils/slugify');

        const existingFAQs = await FAQ.find({}, { slug: 1 }).lean();
        const existingSlugs = existingFAQs.map((f: any) => f.slug).filter(Boolean);

        const preparedFAQs = faqs.map((faq) => {
            const baseSlug = slugify(faq.question);
            const slug = makeUniqueSlug(baseSlug, existingSlugs);
            existingSlugs.push(slug);

            // Map the CSV-like data to the FAQ model
            return {
                question: faq.question,
                slug,
                parentQuestion: faq.parentQuestion || '',
                linkTitle: faq.linkTitle || '',
                linkUrl: faq.linkUrl || '',
                sourceText: faq.sourceText || '',
                h1Title: faq.h1Title || faq.question,
                answerSnippet: faq.answerSnippet || (faq.sourceText && faq.sourceText !== 'not-given' ? faq.sourceText.substring(0, 300) : faq.question),
                deepDive: {
                    problem: '',
                    methodology: '',
                    application: faq.sourceText && faq.sourceText !== 'not-given' ? faq.sourceText : ''
                },
                isPublished: faq.isPublished !== undefined ? faq.isPublished : true
            };
        });

        // Use insertMany for efficiency
        const batchSize = 100;
        let importedCount = 0;
        for (let i = 0; i < preparedFAQs.length; i += batchSize) {
            const batch = preparedFAQs.slice(i, i + batchSize);
            await FAQ.insertMany(batch);
            importedCount += batch.length;
        }

        revalidatePath('/admin/faqs');
        return { success: true, count: importedCount };
    } catch (error: any) {
        console.error("Error importing CSV FAQs:", error);
        return { error: error.message || "Failed to import CSV FAQs" };
    }
}

export async function bulkUnpublishEmptyFAQs() {
    try {
        await connectToDatabase();

        // An FAQ is considered "empty" if it has no meaningful sourceText/answerSnippet
        const emptyConditions = {
            $or: [
                { sourceText: { $in: ['', 'not-given', null] } },
                { answerSnippet: { $in: ['', 'not-given', null] } },
                { sourceText: { $exists: false } },
                { answerSnippet: { $exists: false } },
            ]
        };

        const { modifiedCount } = await FAQ.updateMany(
            { ...emptyConditions, isPublished: true },
            { $set: { isPublished: false } }
        );

        revalidatePath('/admin/faqs');
        return { success: true, count: modifiedCount };
    } catch (error: any) {
        console.error('Error bulk unpublishing empty FAQs:', error);
        return { error: error.message || 'Failed to unpublish empty FAQs' };
    }
}

export async function countEmptyFAQs() {
    try {
        await connectToDatabase();
        const count = await FAQ.countDocuments({
            isPublished: true,
            $or: [
                { sourceText: { $in: ['', 'not-given', null] } },
                { answerSnippet: { $in: ['', 'not-given', null] } },
                { sourceText: { $exists: false } },
                { answerSnippet: { $exists: false } },
            ]
        });
        return { count };
    } catch (error: any) {
        return { count: 0 };
    }
}

export async function publishFAQWithAnswer(id: string, answerText: string) {
    try {
        await connectToDatabase();
        await FAQ.findByIdAndUpdate(id, {
            $set: {
                answerSnippet: answerText.substring(0, 400),
                sourceText: answerText,
                "deepDive.application": answerText,
                isPublished: true
            }
        });
        revalidatePath('/admin/faqs');
        return { success: true };
    } catch (error: any) {
        console.error('Error publishing FAQ with answer:', error);
        return { error: error.message || 'Failed to publish FAQ' };
    }
}


export async function flushAllFAQs() {
    try {
        await connectToDatabase();
        await FAQ.deleteMany({});
        revalidatePath('/admin/faqs');
        revalidatePath('/questions');
        return { success: true };
    } catch (error: any) {
        return { error: error.message || "Failed to flush FAQs" };
    }
}

export async function removeDuplicateFAQs() {
    try {
        await connectToDatabase();
        const duplicates = await FAQ.aggregate([
            {
                $group: {
                    _id: { $toLower: "$question" },
                    count: { $sum: 1 },
                    docs: { $push: { id: "$_id", createdAt: "$createdAt" } }
                }
            },
            { $match: { count: { $gt: 1 } } }
        ]);

        if (duplicates.length === 0) return { success: true, removed: 0 };

        const idsToDelete = [];
        for (const group of duplicates) {
            const sorted = group.docs.sort((a: any, b: any) =>
                new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
            );
            for (let i = 1; i < sorted.length; i++) {
                idsToDelete.push(sorted[i].id);
            }
        }

        if (idsToDelete.length > 0) {
            await FAQ.deleteMany({ _id: { $in: idsToDelete } });
        }

        revalidatePath('/admin/faqs');
        revalidatePath('/questions');
        return { success: true, removed: idsToDelete.length };
    } catch (error: any) {
        return { error: error.message || "Failed to remove duplicate FAQs" };
    }
}

export async function scrubFaqUrls() {
    try {
        await connectToDatabase();
        const faqs = await FAQ.find({});
        let updatedCount = 0;
        let scrubbedFieldCount = 0;

        const cleanUrl = (url: any) => {
            if (!url || typeof url !== 'string') return "";
            const u = url.trim().toLowerCase();
            if (u === "" || u === "#" || u.includes("example.com") || u.includes("yoursite.com") || u.includes("mysite.com") || u.includes("domain.com") || u.includes("insert_url") || u === "http://" || u === "https://") return "";
            return url.trim();
        };

        for (const faq of faqs) {
            let hasChanges = false;
            const stringFields = ['videoUrl', 'linkUrl'];
            for (const field of stringFields) {
                const val = (faq as any)[field];
                if (typeof val === 'string') {
                    const cleaned = cleanUrl(val);
                    if (val !== cleaned) {
                        (faq as any)[field] = cleaned;
                        hasChanges = true;
                        scrubbedFieldCount++;
                    }
                }
            }

            if (hasChanges) {
                await faq.save();
                updatedCount++;
            }
        }

        revalidatePath('/admin/faqs');
        revalidatePath('/questions');
        return { success: true, updatedTerms: updatedCount, scrubbedFields: scrubbedFieldCount };
    } catch (error: any) {
        return { error: error.message || "Failed to scrub FAQ URLs" };
    }
}

export async function normalizeFaqData() {
    try {
        await connectToDatabase();
        const collection = FAQ.collection;
        const faqs = await collection.find({}).toArray();
        let updatedCount = 0;

        for (const f of faqs) {
            let termHasChanges = false;
            const updateObj: any = {};

            if (f.isPublished === undefined) {
                updateObj.isPublished = true;
                termHasChanges = true;
            }

            if (termHasChanges) {
                await collection.updateOne({ _id: f._id }, { $set: updateObj });
                updatedCount++;
            }
        }
        revalidatePath('/admin/faqs');
        return { success: true, updatedCount };
    } catch (error: any) {
        return { error: error.message || "Failed to normalize FAQ data" };
    }
}

export async function backfillFaqAffiliateLinks() {
    try {
        await connectToDatabase();
        const affiliateId = "weightlo0f57d-20";
        let updatedCount = 0;

        const faqs = await FAQ.find({
            $or: [
                { answerSnippet: { $regex: /amazon\.com/i } },
                { sourceText: { $regex: /amazon\.com/i } },
                { "deepDive.application": { $regex: /amazon\.com/i } }
            ]
        });

        const addTag = (text: string) => {
            if (!text) return text;
            return text.replace(/(https?:\/\/(?:www\.)?amazon\.com\/[^\s"'>]+)/g, (match) => {
                if (match.includes(`tag=${affiliateId}`)) return match;
                const separator = match.includes("?") ? "&" : "?";
                return `${match}${separator}tag=${affiliateId}`;
            });
        };

        for (const faq of faqs) {
            let hasChanges = false;

            const newAnswer = addTag(faq.answerSnippet || "");
            if (newAnswer !== faq.answerSnippet) { faq.answerSnippet = newAnswer; hasChanges = true; }

            const newSource = addTag(faq.sourceText || "");
            if (newSource !== faq.sourceText) { faq.sourceText = newSource; hasChanges = true; }

            if (faq.deepDive && faq.deepDive.application) {
                const newApp = addTag(faq.deepDive.application);
                if (newApp !== faq.deepDive.application) { faq.deepDive.application = newApp; hasChanges = true; }
            }

            if (hasChanges) {
                await faq.save();
                updatedCount++;
            }
        }

        revalidatePath('/admin/faqs');
        return { success: true, updatedCount };
    } catch (error: any) {
        return { error: error.message || "Failed to backfill affiliate tags" };
    }
}

export async function backfillFaqAnswers() {
    try {
        await connectToDatabase();

        const emptyFAQs = await FAQ.find({
            isPublished: false,
            $or: [
                { sourceText: { $in: ['', 'not-given', null] } },
                { answerSnippet: { $in: ['', 'not-given', null] } },
                { sourceText: { $exists: false } },
                { answerSnippet: { $exists: false } },
            ]
        }).limit(20);

        let updatedCount = 0;
        let AIService;
        try {
            AIService = (await import('@/lib/ai-service')).AIService;
        } catch (e) { /* ai framework missing? */ }

        for (const faq of emptyFAQs) {
            if (AIService) {
                try {
                    const response = await AIService.generate({
                        prompt: `Provide a detailed, highly accurate answer to the following FAQ question. Structure your response in clean markdown format: ${faq.question}`,
                        systemPrompt: "You are an expert educational tutor. Provide clear, accurate, and helpful answers.",
                        model: "gpt-4o", // fallback
                    });
                    faq.answerSnippet = response.content.substring(0, 400);
                    faq.sourceText = response.content;
                } catch (e) {
                    faq.answerSnippet = `[AI GENERATED] Here is the detailed answer for: ${faq.question}`;
                    faq.sourceText = `[AI GENERATED] Here is the expanded source text and details regarding ${faq.question}`;
                }
            } else {
                faq.answerSnippet = `[AI GENERATED] Here is the detailed answer for: ${faq.question}`;
                faq.sourceText = `[AI GENERATED] Here is the expanded source text and details regarding ${faq.question}`;
            }
            faq.isPublished = true;
            await faq.save();
            updatedCount++;
        }

        revalidatePath('/admin/faqs');
        revalidatePath('/questions');
        return { success: true, updatedCount };
    } catch (error: any) {
        return { error: error.message || "Failed to backfill FAQ answers" };
    }
}

export async function verifyFaqVideoLinksBatch(termsToVerify: { id: string; question: string; videoUrl: string }[]) {
    try {
        await connectToDatabase();
        const brokenTerms: any[] = [];

        await Promise.all(termsToVerify.map(async (faq) => {
            if (!faq.videoUrl) return;
            try {
                const controller = new AbortController();
                const timeoutId = setTimeout(() => controller.abort(), 3500);
                const res = await fetch(`https://www.youtube.com/oembed?url=${encodeURIComponent(faq.videoUrl)}&format=json`, { signal: controller.signal });
                clearTimeout(timeoutId);

                if (res.status === 404 || res.status === 400) {
                    brokenTerms.push({ id: faq.id, term: faq.question, videoUrl: faq.videoUrl, reason: "Video not found or unavailable" });
                }
            } catch (err: any) {
                if (err.name !== 'AbortError') {
                    brokenTerms.push({ id: faq.id, term: faq.question, videoUrl: faq.videoUrl, reason: "Verification failed (network error)" });
                }
            }
        }));
        return { success: true, count: termsToVerify.length, brokenCount: brokenTerms.length, brokenTerms };
    } catch (error: any) {
        return { error: error.message || "Failed to verify video links" };
    }
}

export async function autoReplaceBrokenFaqVideos(brokenTerms: { id: string; term: string }[]) {
    try {
        await connectToDatabase();
        let fixedCount = 0;
        const remainingBroken: any[] = [];
        const ytSearch = (await import('yt-search')).default;

        await Promise.all(brokenTerms.map(async (t) => {
            try {
                const searchResults = await ytSearch(t.term);
                const bestVideo = searchResults.videos.length > 0 ? searchResults.videos[0].url : null;

                if (bestVideo) {
                    await FAQ.findOneAndUpdate({ _id: t.id }, { videoUrl: bestVideo });
                    fixedCount++;
                } else {
                    remainingBroken.push({ ...t, videoUrl: "", reason: "Could not find a replacement" });
                }
            } catch (err) {
                remainingBroken.push({ ...t, videoUrl: "", reason: "Search error during auto-replace" });
            }
        }));

        revalidatePath('/admin/faqs');
        revalidatePath('/questions');
        return { success: true, fixedCount, remainingBroken };
    } catch (error: any) {
        return { error: error.message || "Failed to auto-replace videos" };
    }
}
