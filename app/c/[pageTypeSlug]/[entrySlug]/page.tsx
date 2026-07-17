import connectDB from "@/lib/db/connect";
import GlossaryTerm from "@/lib/db/models/GlossaryTerm";
import Offer from "@/lib/db/models/Offer";
import WebPage from "@/lib/db/models/WebPage";
import NicheBox from "@/lib/db/models/NicheBox";
import CPAListing from "@/lib/db/models/CPAListing";
import ContentEntry from "@/lib/db/models/ContentEntry";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import { getPageTypeBySlug, getContentEntryBySlug } from "@/lib/actions/custom-pages.actions";
import { PuckRenderer } from "@/components/PuckRenderer";
import { generateThemeCSS, defaultTheme } from "@/lib/theme-config";

interface Props {
    params: Promise<{ pageTypeSlug: string; entrySlug: string }>;
}

function replacePlaceholders(obj: any, dataMap: Record<string, any>): any {
    if (typeof obj === "string") {
        return obj.replace(/\{\{([a-zA-Z0-9_]+)\}\}/g, (match, key) => {
            return dataMap[key] !== undefined ? String(dataMap[key]) : match;
        });
    } else if (Array.isArray(obj)) {
        return obj.map(item => replacePlaceholders(item, dataMap));
    } else if (obj !== null && typeof obj === "object") {
        const result: Record<string, any> = {};
        for (const key in obj) {
            result[key] = replacePlaceholders(obj[key], dataMap);
        }
        return result;
    }
    return obj;
}

async function getResolvedRelationshipData(fields: any[], data: Record<string, any>) {
    const resolvedData: Record<string, any> = {};
    for (const field of fields) {
        const value = data[field.name];
        if (field.type === "relationship" && value && typeof value === "string") {
            try {
                let doc: any = null;
                switch (field.refCollection) {
                    case "GlossaryTerm":
                        doc = await GlossaryTerm.findById(value).lean();
                        if (doc) {
                            resolvedData[`${field.name}_name`] = doc.term || "";
                            resolvedData[`${field.name}_term`] = doc.term || "";
                            resolvedData[`${field.name}_definition`] = doc.definition || "";
                            resolvedData[`${field.name}_slug`] = doc.slug || "";
                        }
                        break;
                    case "Offer":
                        doc = await Offer.findById(value).lean();
                        if (doc) {
                            resolvedData[`${field.name}_name`] = doc.name || "";
                            resolvedData[`${field.name}_url`] = doc.url || "";
                            resolvedData[`${field.name}_description`] = doc.description || "";
                        }
                        break;
                    case "WebPage":
                        doc = await WebPage.findById(value).lean();
                        if (doc) {
                            resolvedData[`${field.name}_name`] = doc.name || "";
                            resolvedData[`${field.name}_slug`] = doc.slug || "";
                        }
                        break;
                    case "NicheBox":
                        doc = await NicheBox.findById(value).lean();
                        if (doc) {
                            resolvedData[`${field.name}_name`] = doc.name || "";
                            resolvedData[`${field.name}_slug`] = doc.slug || "";
                            resolvedData[`${field.name}_description`] = doc.description || "";
                        }
                        break;
                    case "CPAListing":
                        doc = await CPAListing.findById(value).lean();
                        if (doc) {
                            resolvedData[`${field.name}_name`] = doc.name || "";
                            resolvedData[`${field.name}_payout`] = doc.payout || "";
                        }
                        break;
                }
            } catch (err) {
                console.error(`Failed to resolve relationship for field ${field.name}`, err);
            }
        }
    }
    return resolvedData;
}


export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { entrySlug } = await params;
    const entry = await getContentEntryBySlug(entrySlug);

    if (!entry) {
        return {
            title: "Entry Not Found",
        };
    }

    return {
        title: entry.metaTitle || entry.title,
        description: entry.metaDescription || `Guide and details on ${entry.title}`,
    };
}

export default async function CustomEntryViewPage({ params }: Props) {
    const { pageTypeSlug, entrySlug } = await params;
    const [pageType, entry] = await Promise.all([
        getPageTypeBySlug(pageTypeSlug),
        getContentEntryBySlug(entrySlug)
    ]);

    if (!pageType || !entry || entry.pageTypeSlug !== pageTypeSlug) {
        notFound();
    }

    if (!entry.isPublished) {
        // Under normal circumstances show 404, or draft preview page
        notFound();
    }

    // Increment view count in background (non-blocking)
    ContentEntry.updateOne({ slug: entrySlug }, { $inc: { views: 1 } }).catch(err => {
        console.error("Failed to increment page view:", err);
    });

    // Default or empty template support
    let templateData = { content: [], root: {} };
    if (pageType.puckTemplate) {
        try {
            templateData = typeof pageType.puckTemplate === "string"
                ? JSON.parse(pageType.puckTemplate)
                : pageType.puckTemplate;
        } catch (e) {
            console.error("Failed to parse Puck template", e);
        }
    }

    // Map all fields into a single data object for resolution
    const relationshipData = await getResolvedRelationshipData(pageType.fields || [], entry.data || {});

    const dataMap = {
        title: entry.title,
        slug: entry.slug,
        metaTitle: entry.metaTitle || entry.title,
        metaDescription: entry.metaDescription || "",
        ...entry.data,
        ...relationshipData
    };

    // Recursively resolve all template strings
    const resolvedTemplateData = replacePlaceholders(templateData, dataMap);

    const themeCSS = generateThemeCSS(defaultTheme as any);

    return (
        <>
            {/* Global theme CSS variables */}
            <style dangerouslySetInnerHTML={{ __html: themeCSS }} />

            <div className="min-h-screen bg-white">
                {resolvedTemplateData.content && resolvedTemplateData.content.length > 0 ? (
                    <PuckRenderer data={resolvedTemplateData} />
                ) : (
                    <div className="flex flex-col items-center justify-center min-h-screen text-slate-400 bg-slate-50 p-6 text-center">
                        <h1 className="text-2xl font-black text-slate-800 mb-2">{entry.title}</h1>
                        <p className="text-sm text-slate-500 mb-6">This custom page type does not have a design layout template configured yet.</p>
                        <span className="text-xs font-mono bg-slate-100 p-2 rounded border border-slate-200">
                            Configure a template in the admin dashboard: /admin/custom-pages
                        </span>
                    </div>
                )}
            </div>
        </>
    );
}
