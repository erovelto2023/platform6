import { getPaginatedFAQs, getFAQCategories } from "@/lib/actions/faq.actions";
import QuestionsClient from "./questions-client";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Business Questions & Answers | K Business Academy",
    description: "Get the answers you need to start your business. Browse over 2,600 questions about marketing, research, and more.",
};

export default async function QuestionsPage() {
    try {
        // Fetch all published FAQs (no pagination — client handles it)
        const { faqs } = await getPaginatedFAQs({ page: 1, limit: 10000, isPublished: true });
        const categories = await getFAQCategories();
        
        const { products } = await import("@/lib/actions/directory-product.actions").then(mod => mod.getDirectoryProducts());

        if (faqs.length === 0) {
            return (
                <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex items-center justify-center">
                    <div className="text-center">
                        <h1 className="text-4xl font-black text-slate-800 dark:text-white mb-4">Questions Library</h1>
                        <p className="text-slate-500">No published questions yet.</p>
                    </div>
                </div>
            );
        }

        return <QuestionsClient initialFAQs={faqs} categories={categories} products={products || []} />;

    } catch (error) {
        console.error("Error loading FAQ page:", error);
        return (
            <div className="min-h-screen flex items-center justify-center bg-red-50">
                <div className="text-center">
                    <h1 className="text-2xl font-bold text-red-600 mb-4">Error Loading Questions</h1>
                    <p className="text-red-500">{(error as Error).message}</p>
                </div>
            </div>
        );
    }
}
