"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { votePoll } from "@/lib/actions/group.actions";
import { toast } from "sonner";
import { Loader2, CheckCircle2 } from "lucide-react";

interface PollDisplayProps {
    threadId: string;
    poll: any;
    userId: string;
    groupSlug: string;
    isMember: boolean;
}

export function PollDisplay({ threadId, poll, userId, groupSlug, isMember }: PollDisplayProps) {
    const [isLoading, setIsLoading] = useState(false);
    const [selectedOption, setSelectedOption] = useState<number | null>(null);

    const totalVotes = poll.options.reduce((acc: number, curr: any) => acc + curr.votes, 0);
    const userVotedOptionIndex = poll.options.findIndex((opt: any) => opt.voters.includes(userId));
    const hasVoted = userVotedOptionIndex !== -1;

    const handleSubmitVote = async () => {
        if (!isMember) {
            toast.error("Join the group to vote");
            return;
        }

        if (selectedOption === null) return;

        setIsLoading(true);
        try {
            await votePoll(threadId, selectedOption, userId, groupSlug);
            toast.success("Vote recorded!");
            setSelectedOption(null); // Reset selection after successful vote
        } catch (error: any) {
            toast.error(error.message || "Failed to vote");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="bg-slate-50 rounded-lg p-6 border border-slate-200 my-6">
            <h3 className="font-semibold text-lg mb-4">{poll.question}</h3>

            <div className="space-y-4">
                {poll.options.map((option: any, index: number) => {
                    const percentage = totalVotes > 0 ? Math.round((option.votes / totalVotes) * 100) : 0;
                    const isVoted = userVotedOptionIndex === index;
                    const isSelected = selectedOption === index;

                    // Show selection if user just clicked it, OR if they already voted for it
                    const isActive = isSelected || isVoted;

                    return (
                        <div key={index} className="space-y-1">
                            <button
                                onClick={() => !hasVoted && setSelectedOption(index)}
                                disabled={isLoading || hasVoted}
                                className={`w-full text-left p-3 rounded-md border transition-all relative overflow-hidden ${isActive
                                    ? "border-indigo-500 bg-indigo-50 ring-1 ring-indigo-500"
                                    : "border-slate-200 bg-white hover:border-indigo-300"
                                    } ${hasVoted ? "cursor-default" : "cursor-pointer"}`}
                            >
                                <div className="flex justify-between items-center relative z-10">
                                    <span className={`font-medium ${isActive ? "text-indigo-900" : "text-slate-700"}`}>
                                        {option.text}
                                    </span>
                                    {isVoted && <CheckCircle2 className="h-4 w-4 text-indigo-600" />}
                                </div>

                                {/* Progress Bar Background */}
                                {(hasVoted || poll.showResultsBeforeVoting) && (
                                    <div
                                        className="absolute top-0 left-0 h-full bg-indigo-100/50 transition-all duration-500"
                                        style={{ width: `${percentage}%` }}
                                    />
                                )}
                            </button>

                            {(hasVoted || poll.showResultsBeforeVoting) && (
                                <div className="flex justify-between text-xs text-slate-500 px-1">
                                    <span>{option.votes} votes</span>
                                    <span>{percentage}%</span>
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>

            {!hasVoted && selectedOption !== null && (
                <div className="mt-4 flex justify-end">
                    <Button
                        onClick={handleSubmitVote}
                        disabled={isLoading}
                        className="bg-indigo-600 hover:bg-indigo-700 text-white"
                    >
                        {isLoading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                        Submit Vote
                    </Button>
                </div>
            )}

            <div className="mt-4 text-xs text-slate-500 text-right">
                Total votes: {totalVotes}
            </div>
        </div>
    );
}
