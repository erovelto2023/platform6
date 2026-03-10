import { getFAQs } from "@/lib/actions/faq.actions";
import FAQManager from "@/components/admin/FAQManager";
// import { getOffers } from "@/lib/actions/offer.actions"; // I'll check if this exists

export default async function FAQsAdminPage() {
    const { faqs } = await getFAQs();
    // const { offers } = await getOffers();

    return (
        <div className="p-8">
            <FAQManager faqs={faqs} offers={[]} />
        </div>
    );
}
