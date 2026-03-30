import { getPaginatedFAQs, countEmptyFAQs } from "@/lib/actions/faq.actions";
import FAQManager from "@/components/admin/FAQManager";

interface PageProps {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function FAQsAdminPage({ searchParams }: PageProps) {
    const resolvedSearchParams = await searchParams;
    const page = typeof resolvedSearchParams.page === 'string' ? parseInt(resolvedSearchParams.page) : 1;
    const draftPage = typeof resolvedSearchParams.draftPage === 'string' ? parseInt(resolvedSearchParams.draftPage) : 1;
    const search = typeof resolvedSearchParams.search === 'string' ? resolvedSearchParams.search : "";
    const draftSearch = typeof resolvedSearchParams.draftSearch === 'string' ? resolvedSearchParams.draftSearch : "";

    const [publishedData, draftData, { count: emptyCount }] = await Promise.all([
        getPaginatedFAQs({ page, search, limit: 50, isPublished: true }),
        getPaginatedFAQs({ page: draftPage, search: draftSearch, limit: 50, isPublished: false }),
        countEmptyFAQs(),
    ]);

    return (
        <div className="p-8">
            <FAQManager 
                faqs={publishedData.faqs}
                draftFaqs={draftData.faqs}
                offers={[]}
                initialPage={page}
                totalPages={publishedData.totalPages}
                totalCount={publishedData.total}
                initialSearch={search}
                draftPage={draftPage}
                draftTotalPages={draftData.totalPages}
                draftTotal={draftData.total}
                draftSearch={draftSearch}
                emptyCount={emptyCount}
            />
        </div>
    );
}
