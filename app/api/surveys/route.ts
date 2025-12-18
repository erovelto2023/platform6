import { createSurvey, getSurveys } from "@/lib/services/survey.service";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const survey = await createSurvey(body);
        return NextResponse.json(survey);
    } catch (error: any) {
        console.error("API POST /api/surveys error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        // Basic filter support
        const filter: any = {};
        if (searchParams.get("context.entityId")) {
            filter["context.entityId"] = searchParams.get("context.entityId");
        }

        const surveys = await getSurveys(filter);
        return NextResponse.json(surveys);
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
