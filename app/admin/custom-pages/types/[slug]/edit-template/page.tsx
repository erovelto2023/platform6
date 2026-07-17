import { notFound } from "next/navigation";
import { getPageTypeBySlug } from "@/lib/actions/custom-pages.actions";
import { PuckTemplateEditor } from "@/components/admin/PuckTemplateEditor";

interface Props {
    params: Promise<{ slug: string }>;
}

export default async function EditCustomPageTemplate({ params }: Props) {
    const { slug } = await params;
    const pageType = await getPageTypeBySlug(slug);

    if (!pageType) {
        notFound();
    }

    return <PuckTemplateEditor pageType={pageType} />;
}
