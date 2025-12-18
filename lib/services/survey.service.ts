import connectToDatabase from "@/lib/db/connect";
import Survey from "@/lib/db/models/Survey";
import SurveyResponse from "@/lib/db/models/SurveyResponse";
import User from "@/lib/db/models/User";
import { v4 as uuidv4 } from 'uuid';

// --- Survey Management ---

export async function createSurvey(data: any) {
    await connectToDatabase();

    // Ensure questions have IDs
    if (data.questions) {
        data.questions = data.questions.map((q: any) => ({
            ...q,
            id: q.id || uuidv4(),
        }));
    }

    const survey = await Survey.create(data);
    return JSON.parse(JSON.stringify(survey));
}

export async function updateSurvey(id: string, data: any) {
    await connectToDatabase();

    // Ensure new questions have IDs
    if (data.questions) {
        data.questions = data.questions.map((q: any) => ({
            ...q,
            id: q.id || uuidv4(),
        }));
    }

    const survey = await Survey.findByIdAndUpdate(id, data, { new: true });
    return JSON.parse(JSON.stringify(survey));
}

export async function getSurvey(id: string) {
    await connectToDatabase();
    const survey = await Survey.findById(id).populate("owner", "firstName lastName avatar").lean();
    return JSON.parse(JSON.stringify(survey));
}

export async function getSurveys(filter: any = {}, userId?: string) {
    await connectToDatabase();

    // Ensure entityId is cast to ObjectId
    if (filter["context.entityId"]) {
        const mongoose = require('mongoose');
        filter["context.entityId"] = new mongoose.Types.ObjectId(filter["context.entityId"]);
    }

    // Force User model registration
    const _userModel = User;

    const surveys = await Survey.find(filter)
        .sort({ createdAt: -1 })
        .populate("owner", "firstName lastName")
        .lean();

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

export async function deleteSurvey(id: string) {
    await connectToDatabase();
    await Survey.findByIdAndDelete(id);
    await SurveyResponse.deleteMany({ survey: id }); // Cascade delete responses
    return { success: true };
}

// --- Response Handling ---

export async function submitSurveyResponse(surveyId: string, userId: string | null, answers: any[], metadata: any = {}) {
    await connectToDatabase();

    const survey = await Survey.findById(surveyId);
    if (!survey) throw new Error("Survey not found");

    if (survey.status !== "Active") throw new Error("Survey is not active");

    // Check if anonymous responses are allowed
    const allowAnonymous = survey.settings?.allowAnonymous || false;
    if (!allowAnonymous && !userId) {
        throw new Error("You must be logged in to take this survey");
    }

    // Check for existing response if not anonymous and not allowing multiple (logic can be expanded)
    if (userId) {
        const existing = await SurveyResponse.findOne({ survey: surveyId, user: userId });
        if (existing) throw new Error("You have already taken this survey");
    }

    const response = await SurveyResponse.create({
        survey: surveyId,
        user: userId,
        answers,
        metadata,
        status: "Completed",
    });

    // Update stats
    await Survey.findByIdAndUpdate(surveyId, {
        $inc: { "stats.responseCount": 1 }
    });

    return JSON.parse(JSON.stringify(response));
}

export async function getSurveyResponses(surveyId: string) {
    await connectToDatabase();
    const responses = await SurveyResponse.find({ survey: surveyId })
        .populate("user", "firstName lastName email")
        .sort({ createdAt: -1 })
        .lean();
    return JSON.parse(JSON.stringify(responses));
}

export async function checkUserResponse(surveyId: string, userId: string) {
    await connectToDatabase();
    const response = await SurveyResponse.findOne({ survey: surveyId, user: userId }).lean();
    return !!response;
}

export async function getSurveyResults(surveyId: string) {
    await connectToDatabase();
    const survey = await Survey.findById(surveyId).lean();
    if (!survey) throw new Error("Survey not found");

    const responses = await SurveyResponse.find({ survey: surveyId }).lean();

    const results: any = {};

    // Initialize results structure based on questions
    survey.questions.forEach((q: any) => {
        if (['multiple_choice', 'checkbox', 'dropdown', 'rating'].includes(q.type)) {
            results[q.id] = { type: q.type, counts: {}, total: 0 };
            if (q.options) {
                q.options.forEach((opt: string) => {
                    results[q.id].counts[opt] = 0;
                });
            }
            if (q.type === 'rating') {
                [1, 2, 3, 4, 5].forEach(r => results[q.id].counts[r] = 0);
            }
        } else {
            results[q.id] = { type: q.type, answers: [] };
        }
    });

    // Aggregate
    responses.forEach((response: any) => {
        response.answers.forEach((ans: any) => {
            const qId = ans.questionId;
            const val = ans.value;

            if (results[qId]) {
                if (Array.isArray(val)) {
                    // Checkbox
                    val.forEach(v => {
                        if (results[qId].counts[v] !== undefined) {
                            results[qId].counts[v]++;
                            results[qId].total++;
                        }
                    });
                } else {
                    // Single value
                    if (results[qId].counts && results[qId].counts[val] !== undefined) {
                        results[qId].counts[val]++;
                        results[qId].total++;
                    } else if (results[qId].answers) {
                        results[qId].answers.push(val);
                    }
                }
            }
        });
    });

    return JSON.parse(JSON.stringify(results));
}
