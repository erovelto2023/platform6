import { getSurvey } from "@/lib/services/survey.service";
import SurveyBuilder from "@/components/surveys/survey-builder";
import { notFound } from "next/navigation";

export default async function SurveyEditorPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const survey = await getSurvey(id);

    if (!survey) {
        notFound();
    }

    return <SurveyBuilder initialSurvey={survey} />;
}
