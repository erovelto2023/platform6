import { getSurvey } from "@/lib/actions/survey.actions";
import SurveyBuilder from "@/components/surveys/survey-builder";
import { notFound } from "next/navigation";

export const dynamic = 'force-dynamic';

export default async function SurveyEditorPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const survey = await getSurvey(id);

    if (!survey) {
        notFound();
    }

    return <SurveyBuilder initialSurvey={survey} />;
}
