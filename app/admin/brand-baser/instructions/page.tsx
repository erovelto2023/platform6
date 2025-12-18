import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { CopyPromptButton } from "../_components/copy-prompt-button";
import { PROMPTS } from "@/lib/data/project-prompts";

export default function ProjectInstructionsPage() {
  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-2xl font-bold mb-2">Project Instructions</h1>
        <p className="text-slate-600">
          Copy-paste ready prompts for ChatGPT Projects and AI content generation
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {PROMPTS.map((prompt) => {
          const Icon = prompt.icon;
          return (
            <Card key={prompt.id} className="hover:shadow-md transition">
              <CardHeader>
                <div className="flex items-start gap-3 mb-2">
                  <div className={`w-10 h-10 ${prompt.color} rounded-lg flex items-center justify-center flex-shrink-0`}>
                    <Icon className="h-5 w-5 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <CardTitle className="text-lg">{prompt.title}</CardTitle>
                    <CardDescription className="mt-1">
                      {prompt.description}
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <CopyPromptButton
                  promptTitle={prompt.title}
                  promptContent={prompt.prompt}
                />
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Info Box */}
      <Card className="mt-8 bg-emerald-50 border-emerald-200">
        <CardContent className="p-6">
          <h3 className="font-semibold mb-2">💡 How to Use Project Instructions</h3>
          <ul className="text-sm space-y-1 text-slate-700">
            <li>• Click "Copy Prompt" on any template</li>
            <li>• Create a new ChatGPT Project</li>
            <li>• Paste the prompt as your system instructions</li>
            <li>• Upload your Brand Document for context</li>
            <li>• Start generating professional marketing content!</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
