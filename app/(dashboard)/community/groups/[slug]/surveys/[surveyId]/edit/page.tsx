import { getSurvey } from "@/lib/actions/survey.actions";
import SurveyBuilder from "@/components/surveys/survey-builder";
import { notFound } from "next/navigation";

export default async function GroupSurveyEditPage({ params }: { params: Promise<{ surveyId: string }> }) {
    const { surveyId } = await params;
    const survey = await getSurvey(surveyId);

    if (!survey) {
        notFound();
    }

    return <SurveyBuilder initialSurvey={survey} />;
}
