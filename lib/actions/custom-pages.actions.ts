"use server";

import connectDB from "@/lib/db/connect";
import PageType, { ICustomField } from "@/lib/db/models/PageType";
import ContentEntry from "@/lib/db/models/ContentEntry";
import GlossaryTerm from "@/lib/db/models/GlossaryTerm";
import Offer from "@/lib/db/models/Offer";
import WebPage from "@/lib/db/models/WebPage";
import NicheBox from "@/lib/db/models/NicheBox";
import CPAListing from "@/lib/db/models/CPAListing";
import { revalidatePath } from "next/cache";

// ─────────────────────────────────────────────────────────────────────────────
// PAGE TYPE ACTIONS
// ─────────────────────────────────────────────────────────────────────────────

export async function getPageTypes() {
    try {
        await connectDB();
        const types = await PageType.find().sort({ name: 1 }).lean();
        return JSON.parse(JSON.stringify(types));
    } catch (error) {
        console.error("Error fetching page types:", error);
        return [];
    }
}

export async function getPageTypeBySlug(slug: string) {
    try {
        await connectDB();
        const pageType = await PageType.findOne({ slug }).lean();
        return JSON.parse(JSON.stringify(pageType));
    } catch (error) {
        console.error("Error fetching page type by slug:", error);
        return null;
    }
}

export async function createPageType(data: {
    name: string;
    slug: string;
    fields: ICustomField[];
}) {
    try {
        await connectDB();

        const slug = data.slug.toLowerCase().trim()
            .replace(/[^a-z0-9]+/g, "-")
            .replace(/(^-|-$)/g, "");

        // Check if slug exists
        const existing = await PageType.findOne({ slug });
        if (existing) {
            return { success: false, error: "A page type with this slug already exists." };
        }

        const pageType = await PageType.create({
            name: data.name,
            slug,
            fields: data.fields || [],
        });

        revalidatePath("/admin/custom-pages");
        return { success: true, pageType: JSON.parse(JSON.stringify(pageType)) };
    } catch (error: any) {
        console.error("Error creating page type:", error);
        return { success: false, error: error.message };
    }
}

export async function updatePageType(slug: string, data: {
    name: string;
    fields: ICustomField[];
}) {
    try {
        await connectDB();

        const pageType = await PageType.findOneAndUpdate(
            { slug },
            { name: data.name, fields: data.fields },
            { new: true }
        );

        revalidatePath("/admin/custom-pages");
        revalidatePath(`/admin/custom-pages/types/${slug}`);
        return { success: true, pageType: JSON.parse(JSON.stringify(pageType)) };
    } catch (error: any) {
        console.error("Error updating page type:", error);
        return { success: false, error: error.message };
    }
}

export async function savePageTypeTemplate(slug: string, puckTemplate: any) {
    try {
        await connectDB();

        const pageType = await PageType.findOneAndUpdate(
            { slug },
            { puckTemplate, updatedAt: new Date() },
            { new: true }
        );

        revalidatePath("/admin/custom-pages");
        revalidatePath(`/admin/custom-pages/types/${slug}`);
        return { success: true, pageType: JSON.parse(JSON.stringify(pageType)) };
    } catch (error: any) {
        console.error("Error saving page type template:", error);
        return { success: false, error: error.message };
    }
}

export async function deletePageType(slug: string) {
    try {
        await connectDB();
        await PageType.findOneAndDelete({ slug });
        // Delete all associated entries
        await ContentEntry.deleteMany({ pageTypeSlug: slug });

        revalidatePath("/admin/custom-pages");
        return { success: true };
    } catch (error: any) {
        console.error("Error deleting page type:", error);
        return { success: false, error: error.message };
    }
}

// ─────────────────────────────────────────────────────────────────────────────
// CONTENT ENTRY ACTIONS
// ─────────────────────────────────────────────────────────────────────────────

export async function getContentEntries(pageTypeSlug: string) {
    try {
        await connectDB();
        const entries = await ContentEntry.find({ pageTypeSlug }).sort({ createdAt: -1 }).lean();
        return JSON.parse(JSON.stringify(entries));
    } catch (error) {
        console.error("Error fetching content entries:", error);
        return [];
    }
}

export async function getContentEntryBySlug(slug: string) {
    try {
        await connectDB();
        const entry = await ContentEntry.findOne({ slug }).lean();
        return JSON.parse(JSON.stringify(entry));
    } catch (error) {
        console.error("Error fetching content entry by slug:", error);
        return null;
    }
}

export async function createContentEntry(data: {
    pageTypeSlug: string;
    title: string;
    slug: string;
    data: any;
    metaTitle?: string;
    metaDescription?: string;
    isPublished?: boolean;
}) {
    try {
        await connectDB();

        const slug = (data.slug || data.title).toLowerCase().trim()
            .replace(/[^a-z0-9]+/g, "-")
            .replace(/(^-|-$)/g, "");

        const existing = await ContentEntry.findOne({ slug });
        if (existing) {
            return { success: false, error: "An entry with this slug already exists." };
        }

        const entry = await ContentEntry.create({
            pageTypeSlug: data.pageTypeSlug,
            title: data.title,
            slug,
            data: data.data || {},
            metaTitle: data.metaTitle,
            metaDescription: data.metaDescription,
            isPublished: data.isPublished !== undefined ? data.isPublished : true,
        });

        revalidatePath(`/admin/custom-pages/types/${data.pageTypeSlug}`);
        revalidatePath(`/c/${data.pageTypeSlug}/${slug}`);
        return { success: true, entry: JSON.parse(JSON.stringify(entry)) };
    } catch (error: any) {
        console.error("Error creating content entry:", error);
        return { success: false, error: error.message };
    }
}

export async function updateContentEntry(id: string, data: {
    title: string;
    slug: string;
    data: any;
    metaTitle?: string;
    metaDescription?: string;
    isPublished?: boolean;
}) {
    try {
        await connectDB();

        const slug = data.slug.toLowerCase().trim()
            .replace(/[^a-z0-9]+/g, "-")
            .replace(/(^-|-$)/g, "");

        const existing = await ContentEntry.findOne({ slug, _id: { $ne: id } });
        if (existing) {
            return { success: false, error: "An entry with this slug already exists." };
        }

        const entry = await ContentEntry.findByIdAndUpdate(
            id,
            {
                title: data.title,
                slug,
                data: data.data || {},
                metaTitle: data.metaTitle,
                metaDescription: data.metaDescription,
                isPublished: data.isPublished !== undefined ? data.isPublished : true,
                updatedAt: new Date()
            },
            { new: true }
        );

        if (entry) {
            revalidatePath(`/admin/custom-pages/types/${entry.pageTypeSlug}`);
            revalidatePath(`/c/${entry.pageTypeSlug}/${slug}`);
        }

        return { success: true, entry: JSON.parse(JSON.stringify(entry)) };
    } catch (error: any) {
        console.error("Error updating content entry:", error);
        return { success: false, error: error.message };
    }
}

export async function deleteContentEntry(id: string) {
    try {
        await connectDB();
        const entry = await ContentEntry.findByIdAndDelete(id);
        if (entry) {
            revalidatePath(`/admin/custom-pages/types/${entry.pageTypeSlug}`);
            revalidatePath(`/c/${entry.pageTypeSlug}/${entry.slug}`);
        }
        return { success: true };
    } catch (error: any) {
        console.error("Error deleting content entry:", error);
        return { success: false, error: error.message };
    }
}

export async function deleteContentEntries(ids: string[]) {
    try {
        await connectDB();
        const entries = await ContentEntry.find({ _id: { $in: ids } }).select("pageTypeSlug slug");
        await ContentEntry.deleteMany({ _id: { $in: ids } });
        
        for (const entry of entries) {
            revalidatePath(`/admin/custom-pages/types/${entry.pageTypeSlug}`);
            revalidatePath(`/c/${entry.pageTypeSlug}/${entry.slug}`);
        }
        return { success: true };
    } catch (error: any) {
        console.error("Error deleting content entries:", error);
        return { success: false, error: error.message };
    }
}

export async function bulkImportEntries(pageTypeSlug: string, entries: any[]) {
    try {
        await connectDB();
        
        let successCount = 0;
        let skipCount = 0;
        let errors: string[] = [];

        for (let i = 0; i < entries.length; i++) {
            const item = entries[i];
            const title = item.title || item.name || item.keyword;
            if (!title) {
                errors.push(`Row ${i + 1}: Missing title/name/keyword.`);
                continue;
            }

            const rawSlug = item.slug || title;
            const slug = rawSlug.toLowerCase().trim()
                .replace(/[^a-z0-9]+/g, "-")
                .replace(/(^-|-$)/g, "");

            // Check if slug exists
            const existing = await ContentEntry.findOne({ slug });
            if (existing) {
                skipCount++;
                continue;
            }

            // Extract content data fields from the rest of the keys
            const contentData: any = {};
            const reservedKeys = ["title", "name", "keyword", "slug", "metaTitle", "metaDescription", "isPublished", "pageTypeSlug"];
            
            Object.keys(item).forEach(key => {
                if (!reservedKeys.includes(key)) {
                    contentData[key] = item[key];
                }
            });

            await ContentEntry.create({
                pageTypeSlug,
                title,
                slug,
                data: contentData,
                metaTitle: item.metaTitle || title,
                metaDescription: item.metaDescription || `Guide and details on ${title}.`,
                isPublished: true
            });
            successCount++;
        }

        revalidatePath(`/admin/custom-pages/types/${pageTypeSlug}`);
        return { success: true, count: successCount, skipped: skipCount, errors };
    } catch (error: any) {
        console.error("Error during bulk import:", error);
        return { success: false, error: error.message };
    }
}

export async function getRelationshipOptions(collectionName: "GlossaryTerm" | "Offer" | "WebPage" | "NicheBox" | "CPAListing") {
    try {
        await connectDB();
        let items: { id: string; name: string }[] = [];

        switch (collectionName) {
            case "GlossaryTerm": {
                const terms = await GlossaryTerm.find().select("term").sort({ term: 1 }).lean();
                items = terms.map((t: any) => ({ id: String(t._id), name: t.term }));
                break;
            }
            case "Offer": {
                const offers = await Offer.find().select("name").sort({ name: 1 }).lean();
                items = offers.map((o: any) => ({ id: String(o._id), name: o.name }));
                break;
            }
            case "WebPage": {
                const pages = await WebPage.find().select("name").sort({ name: 1 }).lean();
                items = pages.map((p: any) => ({ id: String(p._id), name: p.name }));
                break;
            }
            case "NicheBox": {
                const boxes = await NicheBox.find().select("name").sort({ name: 1 }).lean();
                items = boxes.map((n: any) => ({ id: String(n._id), name: n.name }));
                break;
            }
            case "CPAListing": {
                const listings = await CPAListing.find().select("name").sort({ name: 1 }).lean();
                items = listings.map((c: any) => ({ id: String(c._id), name: c.name }));
                break;
            }
        }
        return { success: true, options: JSON.parse(JSON.stringify(items)) };
    } catch (error: any) {
        console.error("Error fetching relationship options:", error);
        return { success: false, error: error.message, options: [] };
    }
}

export async function getCollectionItems(collectionName: "GlossaryTerm" | "Offer" | "WebPage" | "NicheBox" | "CPAListing", limit: number = 10) {
    try {
        await connectDB();
        let items: any[] = [];

        switch (collectionName) {
            case "GlossaryTerm":
                items = await GlossaryTerm.find().sort({ term: 1 }).limit(limit).lean();
                break;
            case "Offer":
                items = await Offer.find().sort({ name: 1 }).limit(limit).lean();
                break;
            case "WebPage":
                items = await WebPage.find().sort({ name: 1 }).limit(limit).lean();
                break;
            case "NicheBox":
                items = await NicheBox.find().sort({ name: 1 }).limit(limit).lean();
                break;
            case "CPAListing":
                items = await CPAListing.find().sort({ name: 1 }).limit(limit).lean();
                break;
        }

        const mapped = items.map((item: any) => {
            const id = String(item._id);
            let name = "";
            let link = "";
            let description = "";
            let badge = "";

            if (collectionName === "GlossaryTerm") {
                name = item.term || "";
                description = item.definition || "";
                link = `/glossary/${item.slug || ""}`;
                badge = "Glossary";
            } else if (collectionName === "Offer") {
                name = item.name || "";
                description = item.description || "";
                link = item.url || "";
                badge = `Offer`;
            } else if (collectionName === "WebPage") {
                name = item.name || "";
                link = `/p/${item.slug || ""}`;
                badge = "Page";
            } else if (collectionName === "NicheBox") {
                name = item.name || "";
                description = item.description || "";
                link = `/niche-boxes/${item.slug || ""}`;
                badge = item.niche || "Niche";
            } else if (collectionName === "CPAListing") {
                name = item.name || "";
                description = item.description || "";
                badge = `CPA`;
            }

            return {
                id,
                name,
                link,
                description,
                badge
            };
        });

        return { success: true, items: JSON.parse(JSON.stringify(mapped)) };
    } catch (error: any) {
        console.error("Error fetching collection items:", error);
        return { success: false, error: error.message, items: [] };
    }
}


