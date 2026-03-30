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
    category = "" 
}: { 
    page?: number; 
    limit?: number; 
    search?: string; 
    category?: string; 
}) {
    try {
        await connectToDatabase();
        const query: any = { isPublished: true };

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
