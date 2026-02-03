import { getPage } from "@/lib/actions/docs.actions";
import { MarkdownEditor } from "./_components/markdown-editor";
import { Metadata } from "next";

export async function generateMetadata(props: { params: Promise<{ pageId: string }> }): Promise<Metadata> {
    const params = await props.params;
    const page = await getPage(params.pageId);

    return {
        title: `Edit: ${page?.title || 'Page'} | Admin`,
        description: `Edit documentation page: ${page?.title}`,
    };
}

export default async function AdminPageEditor(props: { params: Promise<{ pageId: string }> }) {
    const params = await props.params;
    const page = await getPage(params.pageId);

    if (!page) return <div className="p-8">Page not found</div>;

    return <MarkdownEditor page={page} />;
}
