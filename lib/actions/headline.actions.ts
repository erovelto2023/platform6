"use server";

import connectToDatabase from "@/lib/db/connect";
import Headline from "@/lib/db/models/Headline";
import HeadlineFramework from "@/lib/db/models/HeadlineFramework";
import { revalidatePath } from "next/cache";

// --- Headlines ---

export async function getHeadlines(userId: string, filters: any = {}) {
    await connectToDatabase();

    const query: any = { userId };

    if (filters.search) {
        query.$text = { $search: filters.search };
    }
    if (filters.platform) query.platform = filters.platform;
    if (filters.emotion) query.emotion = filters.emotion;
    if (filters.isFavorite) query.isFavorite = true;
    if (filters.folderId) query.folderId = filters.folderId;

    const headlines = await Headline.find(query)
        .sort({ createdAt: -1 })
        .lean();

    return JSON.parse(JSON.stringify(headlines));
}

export async function createHeadline(userId: string, data: any) {
    await connectToDatabase();

    const headline = await Headline.create({
        userId,
        ...data
    });

    revalidatePath('/headlines');
    return JSON.parse(JSON.stringify(headline));
}

export async function updateHeadline(id: string, data: any) {
    await connectToDatabase();

    const headline = await Headline.findByIdAndUpdate(id, data, { new: true });

    revalidatePath('/headlines');
    return JSON.parse(JSON.stringify(headline));
}

export async function deleteHeadline(id: string) {
    await connectToDatabase();
    await Headline.findByIdAndDelete(id);
    revalidatePath('/headlines');
    return { success: true };
}

export async function toggleHeadlineFavorite(id: string) {
    await connectToDatabase();
    const headline = await Headline.findById(id);
    if (headline) {
        headline.isFavorite = !headline.isFavorite;
        await headline.save();
    }
    revalidatePath('/headlines');
    return { success: true };
}

// --- Frameworks ---

export async function getFrameworks(userId?: string) {
    await connectToDatabase();

    const query: any = { isSystem: true };
    if (userId) {
        // Include user's custom frameworks if we implement that
        // query.$or = [{ isSystem: true }, { createdBy: userId }];
    }

    const frameworks = await HeadlineFramework.find(query).sort({ name: 1 }).lean();
    return JSON.parse(JSON.stringify(frameworks));
}

export async function seedFrameworks() {
    await connectToDatabase();

    const count = await HeadlineFramework.countDocuments();
    if (count > 0) return; // Already seeded

    const defaults = [
        {
            name: "The 'How-To' Without Pain",
            template: "How to [Achieve Result] Without [Pain]",
            category: "How-To",
            emotionalTriggers: ["Hope", "Relief"],
            bestPlatforms: ["Blog", "YouTube", "Facebook"],
            examples: ["How to Lose Weight Without Giving Up Pizza", "How to Write a Book Without Typing a Word"]
        },
        {
            name: "The 'Secret' Reveal",
            template: "The Secret to [Desire] That [Authority] Won't Tell You",
            category: "Curiosity",
            emotionalTriggers: ["Curiosity", "Distrust"],
            bestPlatforms: ["Email", "Facebook"],
            examples: ["The Secret to SEO That Google Won't Tell You"]
        },
        {
            name: "The 'Warning' Label",
            template: "Stop [Bad Thing] — Start [Good Thing]",
            category: "Urgency",
            emotionalTriggers: ["Fear", "Urgency"],
            bestPlatforms: ["YouTube", "Ads"],
            examples: ["Stop Wasting Money on Ads — Start Building Organic Traffic"]
        },
        {
            name: "The 'Listicle' Promise",
            template: "[Number] Ways to [Result] in [Timeframe]",
            category: "Listicle",
            emotionalTriggers: ["Curiosity", "Logic"],
            bestPlatforms: ["Blog", "Twitter"],
            examples: ["7 Ways to Double Your Income in 30 Days"]
        }
    ];

    await HeadlineFramework.insertMany(defaults);
    return { success: true };
}
