import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { CopyPromptButton } from "../_components/copy-prompt-button";
import { PROMPTS } from "@/lib/data/project-prompts";
import { Zap } from "lucide-react";

export default function ActionBriefPage() {
    // Filter for the Action Brief prompt if it exists, or use a default one
    const actionBriefPrompt = PROMPTS.find(p => p.id === "action-brief") || {
        title: "Action Brief Wizard",
        description: "Create a comprehensive action plan from your brand base",
        prompt: `You are an expert business strategist and project manager. Using the provided Brand Base document, please create a comprehensive Action Brief.

Your goal is to translate the brand's core identity, target audience, and value proposition into a concrete, actionable plan.

Please structure the Action Brief as follows:

1. **Executive Summary**: A concise overview of the brand's mission and primary goals.
2. **Target Audience Persona**: A detailed profile of the ideal customer, including pain points and motivations.
3. **Core Messaging Pillars**: The key themes and messages that should be consistent across all marketing channels.
4. **Content Strategy**: A high-level plan for content creation, including topics, formats, and channels.
5. **Immediate Action Items**: A checklist of the top 5-10 tasks to execute immediately to gain momentum.
6. **90-Day Roadmap**: A strategic timeline for the next quarter, broken down by month.

Ensure the tone is professional, encouraging, and highly practical. Use the specific details from the Brand Base to make this plan unique to the business.`
    };

    return (
        <div className="p-6">
            <div className="mb-8">
                <div className="flex items-center gap-3 mb-2">
                    <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                        <Zap className="h-6 w-6 text-orange-600" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold">Create Action Brief</h1>
                        <p className="text-slate-600">
                            Turn your Brand Base into a concrete action plan
                        </p>
                    </div>
                </div>
            </div>

            <div className="max-w-3xl mx-auto">
                <Card className="hover:shadow-md transition border-orange-200">
                    <CardHeader className="bg-orange-50/50 border-b border-orange-100">
                        <CardTitle className="text-xl">{actionBriefPrompt.title}</CardTitle>
                        <CardDescription className="text-base mt-2">
                            {actionBriefPrompt.description}
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="p-6 space-y-6">
                        <div className="bg-slate-50 p-4 rounded-lg border text-sm text-slate-700 leading-relaxed font-mono whitespace-pre-wrap max-h-[400px] overflow-y-auto">
                            {actionBriefPrompt.prompt}
                        </div>

                        <div className="flex flex-col gap-4">
                            <CopyPromptButton
                                promptTitle={actionBriefPrompt.title}
                                promptContent={actionBriefPrompt.prompt}
                            />

                            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-sm text-blue-800">
                                <p className="font-semibold mb-1">How to use this:</p>
                                <ol className="list-decimal list-inside space-y-1 ml-1">
                                    <li>Copy the prompt above</li>
                                    <li>Open a new chat in ChatGPT (or your preferred AI)</li>
                                    <li>Paste the prompt</li>
                                    <li>Upload your exported Brand Base text file</li>
                                    <li>Hit enter and watch your Action Brief come to life!</li>
                                </ol>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
