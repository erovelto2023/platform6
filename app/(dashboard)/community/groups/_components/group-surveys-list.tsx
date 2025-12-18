import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Plus, FileText, BarChart2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { getSurveys } from "@/lib/services/survey.service";

interface GroupSurveysListProps {
    groupId: string;
    groupSlug: string;
    isAdmin: boolean;
    userId?: string;
}

export async function GroupSurveysList({ groupId, groupSlug, isAdmin, userId }: GroupSurveysListProps) {
    const surveys = await getSurveys({ "context.entityId": groupId, subtype: "Survey" }, userId);

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold text-slate-900">Group Surveys</h3>
                <Link href={`/community/groups/${groupSlug}/surveys/create`}>
                    <Button size="sm">
                        <Plus className="mr-2 h-4 w-4" />
                        New Survey
                    </Button>
                </Link>
            </div>

            <div className="grid gap-4">
                {surveys.length === 0 ? (
                    <div className="text-center py-12 bg-slate-50 rounded-lg border border-dashed border-slate-200">
                        <FileText className="h-10 w-10 text-slate-300 mx-auto mb-3" />
                        <p className="text-slate-500 font-medium">No surveys yet</p>
                        {isAdmin && (
                            <p className="text-sm text-slate-400 mt-1">
                                Create a survey to gather feedback from your members.
                            </p>
                        )}
                    </div>
                ) : (
                    surveys.map((survey: any) => (
                        <div key={survey._id} className="bg-white p-4 rounded-lg border border-slate-200 hover:border-indigo-300 transition-colors flex items-center justify-between group">
                            <div className="flex items-center gap-4">
                                <div className="h-10 w-10 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-600">
                                    <FileText className="h-5 w-5" />
                                </div>
                                <div>
                                    <Link href={`/community/groups/${groupSlug}/surveys/${survey._id}`} className="font-medium text-slate-900 hover:text-indigo-600 transition-colors">
                                        {survey.title}
                                    </Link>
                                    <div className="flex items-center gap-3 text-xs text-slate-500 mt-1">
                                        <span>{format(new Date(survey.createdAt), "MMM d, yyyy")}</span>
                                        <span>•</span>
                                        <span>{survey.stats?.responseCount || 0} responses</span>
                                        {survey.status !== "Active" && (
                                            <Badge variant="secondary" className="text-[10px] h-5 px-1.5">
                                                {survey.status}
                                            </Badge>
                                        )}
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                {isAdmin && (
                                    <>
                                        <Link href={`/community/groups/${groupSlug}/surveys/${survey._id}/edit`}>
                                            <Button variant="ghost" size="sm">Edit</Button>
                                        </Link>
                                        <Link href={`/community/groups/${groupSlug}/surveys/${survey._id}/results`}>
                                            <Button variant="ghost" size="sm">
                                                <BarChart2 className="h-4 w-4" />
                                            </Button>
                                        </Link>
                                    </>
                                )}
                                {survey.hasResponded ? (
                                    <Button size="sm" variant="secondary" disabled>Taken</Button>
                                ) : (
                                    <Link href={`/community/groups/${groupSlug}/surveys/${survey._id}`}>
                                        <Button size="sm" variant="outline">Take Survey</Button>
                                    </Link>
                                )}
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
