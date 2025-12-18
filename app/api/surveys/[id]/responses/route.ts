import { submitSurveyResponse, getSurveyResponses } from "@/lib/services/survey.service";
import { NextResponse } from "next/server";

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params;
        const body = await req.json();
        const { userId, answers, metadata } = body;
        const response = await submitSurveyResponse(id, userId, answers, metadata);
        return NextResponse.json(response);
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params;
        const responses = await getSurveyResponses(id);
        return NextResponse.json(responses);
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
