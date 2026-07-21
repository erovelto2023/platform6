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

    // Ensure outcomes have IDs
    if (data.outcomes) {
        data.outcomes = data.outcomes.map((o: any) => ({
            ...o,
            id: o.id || uuidv4(),
        }));
    }

    // Safely handle owner field (ObjectId vs Clerk ID string)
    if (data.owner) {
        const isValidObjectId = /^[0-9a-fA-F]{24}$/.test(String(data.owner));
        if (!isValidObjectId) {
            const dbUser = await User.findOne({ clerkId: String(data.owner) });
            if (dbUser) {
                data.owner = dbUser._id;
            } else {
                delete data.owner;
            }
        }
    } else {
        delete data.owner;
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

    // Ensure new outcomes have IDs
    if (data.outcomes) {
        data.outcomes = data.outcomes.map((o: any) => ({
            ...o,
            id: o.id || uuidv4(),
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

    if (filter["context.entityId"]) {
        const mongoose = require('mongoose');
        filter["context.entityId"] = new mongoose.Types.ObjectId(filter["context.entityId"]);
    }

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
    await SurveyResponse.deleteMany({ survey: id });
    return { success: true };
}

// --- Response & Lead Handling ---

export async function submitSurveyResponse(
    surveyId: string,
    userId: string | null,
    answers: any[],
    metadata: any = {},
    leadData: any = null,
    outcomeIdInput: string | null = null
) {
    await connectToDatabase();

    const survey = await Survey.findById(surveyId);
    if (!survey) throw new Error("Survey not found");

    if (survey.status !== "Active") throw new Error("Survey is not active");

    let dbUserId: any = null;
    if (userId) {
        const isValidObjectId = /^[0-9a-fA-F]{24}$/.test(String(userId));
        if (isValidObjectId) {
            dbUserId = userId;
        } else {
            const dbUser = await User.findOne({ clerkId: String(userId) });
            if (dbUser) dbUserId = dbUser._id;
        }
    }

    const allowAnonymous = survey.settings?.allowAnonymous ?? true;
    if (!allowAnonymous && !dbUserId && !userId) {
        throw new Error("You must be logged in to take this survey");
    }

    if (dbUserId) {
        const existing = await SurveyResponse.findOne({ survey: surveyId, user: dbUserId });
        if (existing) throw new Error("You have already taken this survey");
    }

    // Calculate Quiz Score
    let score = 0;
    let maxScore = 0;
    const isQuiz = survey.subtype === "Quiz" || survey.settings?.quizMode;

    if (survey.questions) {
        survey.questions.forEach((q: any) => {
            if (q.correctAnswer !== undefined && q.correctAnswer !== null && q.correctAnswer !== "") {
                const questionPoints = q.points || 1;
                maxScore += questionPoints;

                const userAns = answers.find((a: any) => a.questionId === q.id);
                if (userAns && userAns.value !== undefined && userAns.value !== null) {
                    let isCorrect = false;

                    if (Array.isArray(q.correctAnswer) && Array.isArray(userAns.value)) {
                        const expectedSet = new Set(q.correctAnswer.map((v: any) => String(v).trim().toLowerCase()));
                        const userSet = new Set(userAns.value.map((v: any) => String(v).trim().toLowerCase()));
                        isCorrect = expectedSet.size === userSet.size && [...expectedSet].every(val => userSet.has(val));
                    } else if (typeof q.correctAnswer === "boolean" || typeof userAns.value === "boolean") {
                        isCorrect = Boolean(q.correctAnswer) === Boolean(userAns.value);
                    } else {
                        isCorrect = String(q.correctAnswer).trim().toLowerCase() === String(userAns.value).trim().toLowerCase();
                    }

                    if (isCorrect) {
                        score += questionPoints;
                    }
                }
            }
        });
    }

    const passingScorePercent = survey.settings?.passingScore || 70;
    const scorePercent = maxScore > 0 ? (score / maxScore) * 100 : 100;
    const passed = isQuiz ? scorePercent >= passingScorePercent : true;

    // Determine Matched Outcome
    let outcomeId = outcomeIdInput;
    if (!outcomeId && survey.outcomes && survey.outcomes.length > 0) {
        const matchedOutcome = survey.outcomes.find((o: any) => {
            if (o.minScore !== undefined && o.maxScore !== undefined) {
                return score >= o.minScore && score <= o.maxScore;
            }
            return false;
        }) || survey.outcomes[0];
        outcomeId = matchedOutcome?.id || null;
    }

    const response = await SurveyResponse.create({
        survey: surveyId,
        user: dbUserId,
        answers,
        score,
        maxScore,
        passed,
        outcomeId,
        leadData: leadData || undefined,
        metadata: {
            ...metadata,
            completedQuestionsCount: answers?.length || 0,
        },
        status: "Completed",
    });

    // Increment response & lead stats
    const incStats: any = { "stats.responseCount": 1 };
    if (leadData?.email) {
        incStats["stats.leadsCapturedCount"] = 1;
    }

    await Survey.findByIdAndUpdate(surveyId, { $inc: incStats });

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

    const results: any = {
        quizSummary: {
            totalResponses: responses.length,
            totalLeads: responses.filter((r: any) => r.leadData?.email).length,
            avgScore: 0,
            passCount: 0,
            failCount: 0,
        },
        outcomeDistribution: {},
        funnelDropoff: [],
    };

    let totalScoreSum = 0;
    let totalMaxSum = 0;

    responses.forEach((resp: any) => {
        if (resp.maxScore > 0) {
            totalScoreSum += resp.score;
            totalMaxSum += resp.maxScore;
            if (resp.passed) results.quizSummary.passCount++;
            else results.quizSummary.failCount++;
        }
        if (resp.outcomeId) {
            results.outcomeDistribution[resp.outcomeId] = (results.outcomeDistribution[resp.outcomeId] || 0) + 1;
        }
    });

    if (responses.length > 0 && totalMaxSum > 0) {
        results.quizSummary.avgScore = Math.round((totalScoreSum / totalMaxSum) * 100);
    }

    // Initialize per question option counts
    survey.questions?.forEach((q: any) => {
        if (['multiple_choice', 'checkbox', 'dropdown', 'rating', 'boolean', 'image_choice'].includes(q.type)) {
            results[q.id] = { type: q.type, counts: {}, total: 0 };
            if (q.options) {
                q.options.forEach((opt: any) => {
                    const optText = typeof opt === 'string' ? opt : opt.text;
                    results[q.id].counts[optText] = 0;
                });
            }
            if (q.type === 'rating') {
                [1, 2, 3, 4, 5].forEach(r => results[q.id].counts[r] = 0);
            }
            if (q.type === 'boolean') {
                results[q.id].counts['True'] = 0;
                results[q.id].counts['False'] = 0;
            }
        } else {
            results[q.id] = { type: q.type, answers: [] };
        }
    });

    // Funnel diagnostic calculation
    const totalVisits = Math.max(responses.length * 1.2, responses.length, 1);
    results.funnelDropoff.push({ step: "Started", count: Math.round(totalVisits), percentage: 100 });

    survey.questions?.forEach((q: any, idx: number) => {
        const completedThisQuestion = responses.filter((r: any) =>
            r.answers?.some((a: any) => a.questionId === q.id)
        ).length;

        results.funnelDropoff.push({
            step: `Q${idx + 1}: ${q.text.substring(0, 25)}...`,
            count: completedThisQuestion,
            percentage: Math.round((completedThisQuestion / totalVisits) * 100)
        });
    });

    const leadsCount = responses.filter((r: any) => r.leadData?.email).length;
    results.funnelDropoff.push({
        step: "Lead Captured",
        count: leadsCount,
        percentage: Math.round((leadsCount / totalVisits) * 100)
    });

    // Aggregate answers
    responses.forEach((response: any) => {
        response.answers?.forEach((ans: any) => {
            const qId = ans.questionId;
            const val = ans.value;

            if (results[qId]) {
                if (Array.isArray(val)) {
                    val.forEach(v => {
                        const strV = String(v);
                        if (results[qId].counts[strV] !== undefined) {
                            results[qId].counts[strV]++;
                            results[qId].total++;
                        }
                    });
                } else {
                    const stringVal = typeof val === 'boolean' ? (val ? 'True' : 'False') : String(val);
                    if (results[qId].counts && results[qId].counts[stringVal] !== undefined) {
                        results[qId].counts[stringVal]++;
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
