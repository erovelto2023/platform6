"use server";

import connectToDatabase from "@/lib/db/connect";
import Survey from "@/lib/db/models/Survey";
import { revalidatePath } from "next/cache";

export async function getSurvey(surveyId: string) {
    await connectToDatabase();
    const survey = await Survey.findById(surveyId).lean();
    if (!survey) return null;
    return JSON.parse(JSON.stringify(survey));
}

export async function createSurvey(data: any) {
    await connectToDatabase();
    const survey = await Survey.create(data);
    return JSON.parse(JSON.stringify(survey));
}

export async function updateSurvey(surveyId: string, data: any) {
    await connectToDatabase();

    // Ensure questions have IDs if missing
    if (data.questions) {
        data.questions = data.questions.map((q: any) => ({
            ...q,
            id: q.id || crypto.randomUUID()
        }));
    }

    const survey = await Survey.findByIdAndUpdate(
        surveyId,
        { $set: data },
        { new: true, runValidators: true }
    );

    if (!survey) throw new Error("Survey not found");

    revalidatePath(`/admin/surveys/${surveyId}`);
    return JSON.parse(JSON.stringify(survey));
}

export async function deleteSurvey(surveyId: string) {
    await connectToDatabase();
    await Survey.findByIdAndDelete(surveyId);
    revalidatePath("/admin/surveys");
}
