"use server";

import connectDB from "@/lib/db/connect";
import IdeaPipeline from "@/lib/db/models/IdeaPipeline";
import { currentUser } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

export async function getIdeas(competitorId?: string) {
    try {
        await connectDB();
        const clerkUser = await currentUser();
        if (!clerkUser) return [];

        const query: any = { userId: clerkUser.id };
        if (competitorId) {
            query.competitorId = competitorId;
        }

        const ideas = await IdeaPipeline.find(query).sort({ updatedAt: -1 }).lean();
        return JSON.parse(JSON.stringify(ideas));
    } catch (error) {
        console.error("Error in getIdeas:", error);
        return [];
    }
}

export async function createIdea(data: {
    title: string;
    competitorId?: string;
    competitorName?: string;
    category?: string;
    opportunityType?: string;
    relatedProductOrFeature?: string;
    problemIdentified?: string;
    proposedSolution?: string;
    targetAudience?: string;
    customerBenefit?: string;
    estimatedEffort?: number;
    estimatedCost?: string;
    estimatedTimeToBuild?: string;
    estimatedRevenuePotential?: string;
    strategicImpact?: number;
    confidenceLevel?: number;
    priority?: string;
    status?: string;
    owner?: string;
    dueDate?: string;
    dependencies?: string;
    notes?: string;
    links?: string;
    successMetrics?: string;
    validationEvidence?: string;
    risks?: string;
    nextAction?: string;
}) {
    try {
        await connectDB();
        const clerkUser = await currentUser();
        if (!clerkUser) return { success: false, error: "Unauthorized" };

        if (!data.title?.trim()) {
            return { success: false, error: "Idea title is required" };
        }

        const idea = await IdeaPipeline.create({
            userId: clerkUser.id,
            competitorId: data.competitorId || '',
            competitorName: data.competitorName || '',
            title: data.title.trim(),
            category: data.category || 'Products',
            opportunityType: data.opportunityType || 'Innovate',
            relatedProductOrFeature: data.relatedProductOrFeature || '',
            problemIdentified: data.problemIdentified || '',
            proposedSolution: data.proposedSolution || '',
            targetAudience: data.targetAudience || '',
            customerBenefit: data.customerBenefit || '',
            estimatedEffort: Number(data.estimatedEffort || 5),
            estimatedCost: data.estimatedCost || '',
            estimatedTimeToBuild: data.estimatedTimeToBuild || '',
            estimatedRevenuePotential: data.estimatedRevenuePotential || '',
            strategicImpact: Number(data.strategicImpact || 5),
            confidenceLevel: Number(data.confidenceLevel || 5),
            priority: data.priority || 'Medium',
            status: data.status || 'Backlog',
            owner: data.owner || '',
            dueDate: data.dueDate || '',
            dependencies: data.dependencies || '',
            notes: data.notes || '',
            links: data.links || '',
            successMetrics: data.successMetrics || '',
            validationEvidence: data.validationEvidence || '',
            risks: data.risks || '',
            nextAction: data.nextAction || ''
        });

        revalidatePath("/tools/competition-black-book");
        revalidatePath("/tools/competition-black-book/ideas");
        return { success: true, idea: JSON.parse(JSON.stringify(idea)) };
    } catch (error: any) {
        console.error("Error creating idea:", error);
        return { success: false, error: error.message };
    }
}

export async function updateIdea(id: string, data: any) {
    try {
        await connectDB();
        const clerkUser = await currentUser();
        if (!clerkUser) return { success: false, error: "Unauthorized" };

        const idea = await IdeaPipeline.findOneAndUpdate(
            { _id: id, userId: clerkUser.id },
            { ...data, updatedAt: new Date() },
            { new: true }
        );

        revalidatePath("/tools/competition-black-book");
        revalidatePath("/tools/competition-black-book/ideas");
        return { success: true, idea: JSON.parse(JSON.stringify(idea)) };
    } catch (error: any) {
        console.error("Error updating idea:", error);
        return { success: false, error: error.message };
    }
}

export async function deleteIdea(id: string) {
    try {
        await connectDB();
        const clerkUser = await currentUser();
        if (!clerkUser) return { success: false, error: "Unauthorized" };

        await IdeaPipeline.deleteOne({ _id: id, userId: clerkUser.id });

        revalidatePath("/tools/competition-black-book");
        revalidatePath("/tools/competition-black-book/ideas");
        return { success: true };
    } catch (error: any) {
        console.error("Error deleting idea:", error);
        return { success: false, error: error.message };
    }
}
