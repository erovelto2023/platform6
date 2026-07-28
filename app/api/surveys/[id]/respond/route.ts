import { submitSurveyResponse } from "@/lib/services/survey.service";
import { NextRequest, NextResponse } from "next/server";

export async function POST(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const formData = await req.formData();
        
        // Extract answers from form data
        const answers: any[] = [];
        const leadData: any = {};
        
        for (const [key, value] of formData.entries()) {
            if (key.startsWith('question_')) {
                const questionId = key.replace('question_', '');
                answers.push({
                    questionId,
                    value: value.toString()
                });
            } else if (key.startsWith('lead_')) {
                const fieldId = key.replace('lead_', '');
                leadData[fieldId] = value.toString();
            }
        }

        // Submit response (without user ID for public embeds)
        const result = await submitSurveyResponse(
            id,
            null, // No user ID for public embeds
            answers,
            {},
            leadData
        );

        return NextResponse.json(result);
    } catch (error: any) {
        console.error("API POST /api/surveys/[id]/respond error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
