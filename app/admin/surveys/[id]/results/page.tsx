import { getSurvey, getSurveyResponses } from "@/lib/actions/survey.actions";
import SurveyResults from "@/components/surveys/survey-results";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

export const dynamic = 'force-dynamic';

export default async function AdminSurveyResultsPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const survey = await getSurvey(id);
    if (!survey) notFound();

    const responses = await getSurveyResponses(id);

    return (
        <div className="max-w-6xl mx-auto p-6 pb-24">
            <div className="mb-6">
                <Link href="/admin/surveys">
                    <Button variant="ghost" size="sm" className="text-slate-400 hover:text-white">
                        <ArrowLeft className="h-4 w-4 mr-2" /> Back to Surveys
                    </Button>
                </Link>
            </div>
            <SurveyResults survey={survey} responses={responses} />
        </div>
    );
}
