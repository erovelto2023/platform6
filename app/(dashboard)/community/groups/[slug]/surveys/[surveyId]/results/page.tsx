import { getSurvey, getSurveyResponses } from "@/lib/services/survey.service";
import SurveyResults from "@/components/surveys/survey-results";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

interface GroupSurveyResultsPageProps {
    params: Promise<{ slug: string; surveyId: string }>;
}

export default async function GroupSurveyResultsPage({ params }: GroupSurveyResultsPageProps) {
    const { slug, surveyId } = await params;

    const survey = await getSurvey(surveyId);
    if (!survey) notFound();

    const responses = await getSurveyResponses(surveyId);

    return (
        <div className="max-w-5xl mx-auto p-6">
            <Link href={`/community/groups/${slug}?tab=surveys`} className="inline-flex items-center text-sm text-slate-500 hover:text-indigo-600 mb-6 transition-colors">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Group
            </Link>

            <div className="mb-8">
                <h1 className="text-2xl font-bold text-slate-900">{survey.title} - Results</h1>
                <p className="text-slate-500">Analytics and responses</p>
            </div>

            <SurveyResults survey={survey} responses={responses} />
        </div>
    );
}
