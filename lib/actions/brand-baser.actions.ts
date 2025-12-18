"use server";

import connectDB from "@/lib/db/connect";
import BrandBase from "@/lib/db/models/BrandBase";
import { revalidatePath } from "next/cache";

// Create brand base
export async function createBrandBase(data: {
    name: string;
    description?: string;
}) {
    try {
        await connectDB();
        const brandBase = await BrandBase.create(data);
        revalidatePath("/admin/brand-baser");
        return { success: true, brandBase: JSON.parse(JSON.stringify(brandBase)) };
    } catch (error: any) {
        console.error("Error creating brand base:", error);
        return { success: false, error: error.message };
    }
}

// Get all brand bases
export async function getBrandBases() {
    try {
        await connectDB();
        const brandBases = await BrandBase.find().sort({ createdAt: -1 }).lean();
        return JSON.parse(JSON.stringify(brandBases));
    } catch (error) {
        console.error("Error fetching brand bases:", error);
        return [];
    }
}

// Get single brand base
export async function getBrandBase(id: string) {
    try {
        await connectDB();
        const brandBase = await BrandBase.findById(id).lean();
        return JSON.parse(JSON.stringify(brandBase));
    } catch (error) {
        console.error("Error fetching brand base:", error);
        return null;
    }
}

// Update brand base
export async function updateBrandBase(id: string, data: any) {
    try {
        await connectDB();
        const brandBase = await BrandBase.findByIdAndUpdate(
            id,
            { ...data, updatedAt: new Date() },
            { new: true }
        );
        revalidatePath("/admin/brand-baser");
        revalidatePath(`/admin/brand-baser/${id}`);
        return { success: true, brandBase: JSON.parse(JSON.stringify(brandBase)) };
    } catch (error: any) {
        console.error("Error performing brand base action:", error);
        return { success: false, error: error.message };
    }
}

// Delete brand base
export async function deleteBrandBase(id: string) {
    try {
        await connectDB();
        await BrandBase.findByIdAndDelete(id);
        revalidatePath("/admin/brand-baser");
        return { success: true };
    } catch (error: any) {
        return { success: false, error: error.message };
    }
}

// Export brand base as text
export async function exportBrandBase(id: string) {
    try {
        await connectDB();
        const brandBase = await BrandBase.findById(id).lean();

        if (!brandBase) {
            return { success: false, error: "Brand base not found" };
        }

        // Format as text document
        const text = `BRAND QUESTIONNAIRE INTAKE FORM

${brandBase.name}
${brandBase.description || ''}

1- Tell Your Story. What life was like before you cracked the code. The pain points of that life.

${brandBase.questions?.storyBeforeCode || ''}


2- What is the inciting event (how you stumbled onto the secret that changed your life.)

${brandBase.questions?.incitingEvent || ''}


3- What is life like today? Talk about the changes to your quality of life.

${brandBase.questions?.lifeToday || ''}


4- What motivated you to start your business?

${brandBase.questions?.businessMotivation || ''}


5- What is the primary goal you have for your brand?

${brandBase.questions?.primaryGoal || ''}


6- What drives your passion for your industry or niche?

${brandBase.questions?.industryPassion || ''}


7- What qualities make you a trustworthy and reliable expert in your field?

${brandBase.questions?.trustworthyQualities || ''}


8- What range of products, services, or merchandise do you offer?

${brandBase.questions?.productsServices || ''}


9- What is your pricing structure for your products or services?

${brandBase.questions?.pricingStructure || ''}


10- Who is your target market?

${brandBase.questions?.targetMarket || ''}


11- Describe your target audience in detail: What are their demographics, psychographics, and pain points?

${brandBase.questions?.targetAudienceDetails || ''}


12- What challenges or pain points do your customers typically face?

${brandBase.questions?.customerChallenges || ''}


13- How does your company solve these challenges or pain points?

${brandBase.questions?.solutionOffered || ''}


14- What are the most common objections or concerns potential customers raise?

${brandBase.questions?.commonObjections || ''}


15- How do you address these objections or concerns in your marketing materials?

${brandBase.questions?.objectionHandling || ''}


16- What outcomes or benefits can customers anticipate when using your products or engaging with your services?

${brandBase.questions?.customerOutcomes || ''}


17- Please list your product's features using the FABB Framework: Feature, Advantage, Benefit, and Benefit of the Benefit.

${brandBase.questions?.fabbFeatures || ''}


18- Can you identify your top three competitors in the market?

${brandBase.questions?.topCompetitors || ''}


19- What is your unique selling proposition (USP)/ What sets your business apart from competitors?

${brandBase.questions?.uniqueSellingProp || ''}


20- Does your company offer an affiliate program for promoters and partners?

${brandBase.questions?.affiliateProgram || ''}
`;

        return { success: true, text };
    } catch (error: any) {
        return { success: false, error: error.message };
    }
}
