"use server";

import connectToDatabase from "@/lib/db/connect";
import Survey from "@/lib/db/models/Survey";
import SurveyResponse from "@/lib/db/models/SurveyResponse";
import { revalidatePath } from "next/cache";

export async function getSurveys(filter: any = {}, userId?: string) {
    await connectToDatabase();
    const surveys = await Survey.find(filter).sort({ createdAt: -1 }).lean();
    
    if (userId) {
        const surveyIds = surveys.map((s: any) => s._id);
        const responses = await SurveyResponse.find({
            survey: { $in: surveyIds },
            user: userId
        }).select('survey').lean();

        const respondedSurveyIds = new Set(responses.map((r: any) => r.survey.toString()));

        surveys.forEach((s: any) => {
            s.hasResponded = respondedSurveyIds.has(s._id.toString());
        });
    }
    
    return JSON.parse(JSON.stringify(surveys));
}

export async function getSurvey(surveyId: string) {
    await connectToDatabase();
    const survey = await Survey.findById(surveyId).lean();
    if (!survey) return null;
    return JSON.parse(JSON.stringify(survey));
}

export async function createSurvey(data: any) {
    await connectToDatabase();
    const survey = await Survey.create(data);
    revalidatePath("/admin/surveys");
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
    revalidatePath("/admin/surveys");
    return JSON.parse(JSON.stringify(survey));
}

export async function deleteSurvey(surveyId: string) {
    await connectToDatabase();
    await Survey.findByIdAndDelete(surveyId);
    await SurveyResponse.deleteMany({ survey: surveyId });
    revalidatePath("/admin/surveys");
    return { success: true };
}

export async function getSurveyResponses(surveyId: string) {
    await connectToDatabase();
    const responses = await SurveyResponse.find({ survey: surveyId }).sort({ createdAt: -1 }).lean();
    return JSON.parse(JSON.stringify(responses));
}

export async function checkUserResponse(surveyId: string, userId: string) {
    await connectToDatabase();
    const response = await SurveyResponse.findOne({ survey: surveyId, user: userId }).lean();
    return response ? JSON.parse(JSON.stringify(response)) : null;
}
