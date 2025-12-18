import { getPageBySlug } from "@/lib/actions/page-builder.actions";
import { notFound } from "next/navigation";
import { SectionRenderer } from "@/app/admin/page-builder/[id]/_components/section-renderer";
import { defaultTemplates } from "@/lib/constants/page-builder-templates";
import { Metadata } from "next";

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
            {page.sections?.map((section: any, index: number) => {
                const template = defaultTemplates.find((t) => t.id === section.templateId);
                if (!template) return null;

                return (
                    <SectionRenderer
                        key={section._id || index}
                        section={section}
                        template={template}
                    />
                );
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
