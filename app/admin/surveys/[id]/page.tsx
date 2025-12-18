import { getSurvey } from "@/lib/services/survey.service";
import SurveyBuilder from "@/components/surveys/survey-builder";
import { notFound } from "next/navigation";

export default async function SurveyEditorPage({ params }: { params: { id: string } }) {
    const survey = await getSurvey(params.id);

    if (!survey) {
        notFound();
    }

    return <SurveyBuilder initialSurvey={survey} />;
}
