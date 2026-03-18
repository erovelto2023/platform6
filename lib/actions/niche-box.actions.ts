"use server";

import connectToDatabase from "@/lib/db/connect";
import NicheBox from "@/lib/db/models/NicheBox";

/**
 * Fetch niche boxes relevant to a city or category.
 * For now, we fetch published and featured niches as "opportunities".
 */
export async function getRelevantNiches(category?: string, limit = 3) {
    try {
        await connectToDatabase();
        
        const query: any = { status: 'published' };
        if (category) {
            query.category = category;
        }

        const niches = await NicheBox.find(query)
            .sort({ featured: -1, createdAt: -1 })
            .limit(limit)
            .lean();

        return JSON.parse(JSON.stringify(niches));
    } catch (error) {
        console.error("Error fetching relevant niches:", error);
        return [];
    }
}
