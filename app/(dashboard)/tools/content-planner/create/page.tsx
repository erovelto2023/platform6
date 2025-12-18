import { getContentTemplates } from "@/lib/actions/content-template.actions";
import TemplateGrid from "./_components/template-grid";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Settings } from "lucide-react";
import Link from "next/link";

export default async function CreateContentPage({ searchParams }: { searchParams: Promise<{ [key: string]: string | string[] | undefined }> }) {
    const templates = await getContentTemplates({ isActive: true });
    const resolvedParams = await searchParams;
    const initialValues = {
        topic: resolvedParams?.topic as string,
        title: resolvedParams?.topic as string,
        targetAudience: resolvedParams?.audience as string,
        keywords: resolvedParams?.keywords as string,
        intent: resolvedParams?.intent as string
    };

    return (
        <div className="p-6 space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <Link href="/tools/content-planner" className="text-sm text-slate-500 hover:text-slate-900 flex items-center mb-2">
                        <ArrowLeft className="h-4 w-4 mr-1" /> Back to Planner
                    </Link>
                    <h1 className="text-3xl font-bold tracking-tight">Content Studio</h1>
                    <p className="text-slate-600 mt-1">Select a template to start creating with AI.</p>
                </div>
                <Link href="/settings/ai">
                    <Button variant="outline">
                        <Settings className="h-4 w-4 mr-2" />
                        AI Settings
                    </Button>
                </Link>
            </div>

            <TemplateGrid
                templates={templates}
                initialValues={initialValues}
                initialCategory={resolvedParams?.category as string}
            />
        </div>
    );
}
