import { getPageBySlug } from "@/lib/actions/page-builder.actions";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import { CustomHTMLRenderer } from "@/components/CustomHTMLRenderer";

export async function generateMetadata({
    params,
}: {
    params: Promise<{ slug: string }>;
}): Promise<Metadata> {
    const { slug } = await params;
    const page = await getPageBySlug(slug);

    if (!page) {
        return {
            title: "Page Not Found",
        };
    }

    return {
        title: page.metaTitle || page.name,
        description: page.metaDescription || `View ${page.name}`,
    };
}

export default async function PublicPageView({
    params,
}: {
    params: Promise<{ slug: string }>;
}) {
    const { slug } = await params;
    const page = await getPageBySlug(slug);

    if (!page) {
        notFound();
    }

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
