import { getPaginatedFAQs } from "@/lib/actions/faq.actions";
import FAQManager from "@/components/admin/FAQManager";

interface PageProps {
    searchParams: { [key: string]: string | string[] | undefined };
}

export default async function FAQsAdminPage({ searchParams }: PageProps) {
    const resolvedSearchParams = await searchParams;
    const page = typeof resolvedSearchParams.page === 'string' ? parseInt(resolvedSearchParams.page) : 1;
    const search = typeof resolvedSearchParams.search === 'string' ? resolvedSearchParams.search : "";

    const { faqs, totalPages, total } = await getPaginatedFAQs({ 
        page, 
        search,
        limit: 50 // Increased limit for admin
    });

    return (
        <div className="p-8">
            <FAQManager 
                faqs={faqs} 
                offers={[]} 
                initialPage={page}
                totalPages={totalPages}
                totalCount={total}
                initialSearch={search}
            />
        </div>
    );
}
