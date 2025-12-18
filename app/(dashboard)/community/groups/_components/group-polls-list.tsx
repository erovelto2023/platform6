import Link from "next/link";
import { Button } from "@/components/ui/button";
import { BarChart2, CheckCircle2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { getSurveys } from "@/lib/services/survey.service";
import { CreatePollDialog } from "./create-poll-dialog";

interface GroupPollsListProps {
    groupId: string;
    groupSlug: string;
    userId: string;
}

export async function GroupPollsList({ groupId, groupSlug, userId }: GroupPollsListProps) {
    const polls = await getSurveys({ "context.entityId": groupId, subtype: "Poll" });

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold text-slate-900">Group Polls</h3>
                <CreatePollDialog groupId={groupId} userId={userId} />
            </div>

            <div className="grid gap-4">
                {polls.length === 0 ? (
                    <div className="text-center py-12 bg-slate-50 rounded-lg border border-dashed border-slate-200">
                        <BarChart2 className="h-10 w-10 text-slate-300 mx-auto mb-3" />
                        <p className="text-slate-500 font-medium">No polls yet</p>
                        <p className="text-sm text-slate-400 mt-1">
                            Create a poll to get quick feedback.
                        </p>
                    </div>
                ) : (
                    polls.map((poll: any) => (
                        <div key={poll._id} className="bg-white p-4 rounded-lg border border-slate-200 hover:border-indigo-300 transition-colors flex items-center justify-between group">
                            <div className="flex items-center gap-4">
                                <div className="h-10 w-10 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-600">
                                    <BarChart2 className="h-5 w-5" />
                                </div>
                                <div>
                                    <h4 className="font-medium text-slate-900">
                                        {poll.title}
                                    </h4>
                                    <div className="flex items-center gap-3 text-xs text-slate-500 mt-1">
                                        <span>{format(new Date(poll.createdAt), "MMM d, yyyy")}</span>
                                        <span>•</span>
                                        <span>{poll.stats?.responseCount || 0} votes</span>
                                        {poll.status !== "Active" && (
                                            <Badge variant="secondary" className="text-[10px] h-5 px-1.5">
                                                {poll.status}
                                            </Badge>
                                        )}
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center gap-2">
                                <Link href={`/community/groups/${groupSlug}/surveys/${poll._id}`}>
                                    <Button size="sm" variant="outline">
                                        Vote / View Results
                                    </Button>
                                </Link>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
