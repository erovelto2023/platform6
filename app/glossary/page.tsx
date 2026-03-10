import { getGlossaryTerms } from "@/lib/actions/glossary.actions";
import GlossaryClient from "./glossary-client";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Make Money Online Glossary - 100+ Terms & Paths",
    description: "Explore 100+ business and marketing terms, strategies, and methodologies for building your income online.",
};

export default async function GlossaryPage() {
    const result = await getGlossaryTerms({ limit: 1000 }) as any;
    const terms = result?.terms || [];

    // Explicitly derive categories
    const categorySet = new Set<string>();
    terms.forEach((t: any) => {
        categorySet.add(String(t.category || "General"));
    });
    const categories: string[] = Array.from(categorySet).sort();

    return <GlossaryClient initialTerms={terms} categories={categories} />;
}
