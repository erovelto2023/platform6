import { getSurvey, checkUserResponse } from "@/lib/services/survey.service";
import SurveyViewer from "@/components/surveys/survey-viewer";
import { notFound, redirect } from "next/navigation";
import { currentUser } from "@clerk/nextjs/server";
import User from "@/lib/db/models/User";
import connectToDatabase from "@/lib/db/connect";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

interface GroupSurveyPageProps {
    params: Promise<{ slug: string; surveyId: string }>;
}

export default async function GroupSurveyPage({ params }: GroupSurveyPageProps) {
    const { slug, surveyId } = await params;
    const user = await currentUser();

    // Auth check (optional depending on survey settings, but usually required for groups)
    let dbUserId = null;
    if (user) {
        await connectToDatabase();
        const dbUser = await User.findOne({ clerkId: user.id });
        if (dbUser) dbUserId = dbUser._id.toString();
    }

    const survey = await getSurvey(surveyId);
    if (!survey) notFound();

    // Check if user has already responded
    let hasResponded = false;
    if (dbUserId) {
        hasResponded = await checkUserResponse(surveyId, dbUserId);
    }

    return (
        <div className="max-w-4xl mx-auto p-6">
            <Link href={`/community/groups/${slug}?tab=surveys`} className="inline-flex items-center text-sm text-slate-500 hover:text-indigo-600 mb-6 transition-colors">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Group
            </Link>

            <SurveyViewer survey={survey} hasResponded={hasResponded} userId={dbUserId} />
        </div>
    );
}
