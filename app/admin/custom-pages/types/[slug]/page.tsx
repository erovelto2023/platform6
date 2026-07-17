import { notFound } from "next/navigation";
import { getPageTypeBySlug, getContentEntries } from "@/lib/actions/custom-pages.actions";
import ContentEntriesClient from "./ContentEntriesClient";

export const metadata = {
    title: "Custom Page Entries Admin",
};

interface Props {
    params: Promise<{ slug: string }>;
}

export default async function ContentEntriesPage({ params }: Props) {
    const { slug } = await params;
    const pageType = await getPageTypeBySlug(slug);

    if (!pageType) {
        notFound();
    }

    const entries = await getContentEntries(slug);

    return (
        <div className="p-8">
            <ContentEntriesClient pageType={pageType} initialEntries={entries} />
        </div>
    );
}
