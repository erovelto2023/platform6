import { getOfferBySlug, incrementOfferStats } from "@/lib/actions/offer.actions";
import { notFound } from "next/navigation";
import { Metadata } from "next";

interface PublicOfferPageProps {
    params: Promise<{ slug: string }>;
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export async function generateMetadata({
    params,
}: {
    params: Promise<{ slug: string }>;
}): Promise<Metadata> {
    const { slug } = await params;
    const result = await getOfferBySlug(slug);

    if (!result.success || !result.data) {
        return {
            title: "Offer Not Found",
        };
    }

    const offer = result.data;
    return {
        title: offer.ogTitle || offer.name,
        description: offer.ogDescription || offer.description || `View ${offer.name}`,
        openGraph: {
            title: offer.ogTitle || offer.name,
            description: offer.ogDescription || offer.description,
            images: offer.ogImage ? [offer.ogImage] : [],
        },
    };
}

export default async function PublicOfferPage({ params, searchParams }: PublicOfferPageProps) {
    const { slug } = await params;
    const result = await getOfferBySlug(slug);

    if (!result.success || !result.data) {
        notFound();
    }

    const offer = result.data;

    // Split test logic
    let bodyCode = offer.bodyCode;
    let version: 'A' | 'B' = 'A';

    if (offer.abEnabled && offer.bodyCodeB) {
        // Simple random split for now
        if (Math.random() > 0.5) {
            bodyCode = offer.bodyCodeB;
            version = 'B';
        }
    }

    // Background: increment view stat
    // Note: In a real production app, we'd do this via a client component to avoid SSR caching issues
    // but for now we'll do it here.
    incrementOfferStats(offer._id, 'view', version);

    return (
        <div className="min-h-screen bg-white">
            <style dangerouslySetInnerHTML={{ __html: `
                /* CSS Isolation */
                .offer-wrapper { all: revert; }
                ${offer.headerCode || ''}
            `}} />
            
            <div 
                className="offer-wrapper"
                dangerouslySetInnerHTML={{ __html: bodyCode }}
            />

            <div dangerouslySetInnerHTML={{ __html: offer.footerCode || '' }} />
        </div>
    );
}
