import { getPageBySlug } from "@/lib/actions/page-builder.actions";
import { CustomHTMLRenderer } from "@/components/CustomHTMLRenderer";
import FoundationsLandingPage from "@/components/FoundationsLandingPage";
import { Metadata } from "next";

export const dynamic = 'force-dynamic';

export async function generateMetadata(): Promise<Metadata> {
    const page = await getPageBySlug("home") || await getPageBySlug("index");

    if (!page) {
        return {
            title: "Foundations to Profits - K Business Academy",
            description: "Live 7-day intensive training to build real online profits.",
        };
    }

    return {
        title: page.metaTitle || page.name,
        description: page.metaDescription || `View ${page.name}`,
    };
}

export default async function IndexPage() {
    // Check if a custom home page is configured and published
    const page = await getPageBySlug("home") || await getPageBySlug("index");

    if (page) {
        return (
            <div className="min-h-screen bg-white">
                <style dangerouslySetInnerHTML={{ __html: `
                    /* Reset/Isolation for custom HTML */
                    .custom-html-wrapper {
                        all: revert;
                    }
                `}} />
                
                {page.sections?.map((section: any, index: number) => {
                    if (section.customHTML) {
                        return (
                            <CustomHTMLRenderer 
                                key={section._id || index}
                                className="custom-html-wrapper"
                                html={section.customHTML}
                            />
                        );
                    }
                    return null;
                })}

                {(!page.sections || page.sections.length === 0) && (
                    <div className="flex items-center justify-center min-h-screen text-slate-400">
                        <div className="text-center">
                            <p className="text-lg">This page is empty</p>
                        </div>
                    </div>
                )}
            </div>
        );
    }

    // Fallback to default marketing landing page
    return <FoundationsLandingPage />;
}
