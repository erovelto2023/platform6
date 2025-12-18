import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { getNicheBox } from "@/lib/actions/niche.actions";
import { NicheTitleForm } from "./_components/niche-title-form";
import { NicheDescriptionForm } from "./_components/niche-description-form";
import { KeywordsForm } from "./_components/keywords-form";
import { DownloadsForm } from "./_components/downloads-form";
import { BusinessIdeasForm } from "./_components/business-ideas-form";
import { VideosForm } from "./_components/videos-form";
import { PlaybooksForm } from "./_components/playbooks-form";
import { MarketResearchForm } from "./_components/market-research-form";
import { LayoutDashboard, ListChecks } from "lucide-react";
import { IconBadge } from "@/components/icon-badge";

export default async function NicheIdPage({
    params
}: {
    params: Promise<{ nicheId: string }>
}) {
    const { userId } = await auth();

    if (!userId) {
        return redirect("/");
    }

    const { nicheId } = await params;
    const niche = await getNicheBox(nicheId);

    if (!niche) {
        return redirect("/");
    }

    const requiredFields = [
        niche.title,
        niche.description,
        niche.keywords.length > 0,
        niche.downloads.length > 0,
        niche.businessIdeas.length > 0
    ];

    const totalFields = requiredFields.length;
    const completedFields = requiredFields.filter(Boolean).length;

    const completionText = `(${completedFields}/${totalFields})`;

    return (
        <div className="p-6">
            <div className="flex items-center justify-between">
                <div className="flex flex-col gap-y-2">
                    <h1 className="text-2xl font-medium">
                        Niche Box Setup
                    </h1>
                    <span className="text-sm text-slate-700">
                        Complete all fields {completionText}
                    </span>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-16">
                <div>
                    <div className="flex items-center gap-x-2">
                        <IconBadge icon={LayoutDashboard} />
                        <h2 className="text-xl">
                            Customize the Niche
                        </h2>
                    </div>
                    <NicheTitleForm
                        initialData={niche}
                        nicheId={niche._id}
                    />
                    <NicheDescriptionForm
                        initialData={niche}
                        nicheId={niche._id}
                    />
                </div>
                <div className="space-y-6">
                    <div>
                        <div className="flex items-center gap-x-2">
                            <IconBadge icon={ListChecks} />
                            <h2 className="text-xl">
                                Business Assets
                            </h2>
                        </div>
                        <KeywordsForm
                            initialData={niche}
                            nicheId={niche._id}
                        />
                        <DownloadsForm
                            initialData={niche}
                            nicheId={niche._id}
                        />
                        <BusinessIdeasForm
                            initialData={niche}
                            nicheId={niche._id}
                        />
                        <VideosForm
                            initialData={niche}
                            nicheId={niche._id}
                        />
                        <PlaybooksForm
                            initialData={niche}
                            nicheId={niche._id}
                        />
                        <MarketResearchForm
                            initialData={niche}
                            nicheId={niche._id}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}
