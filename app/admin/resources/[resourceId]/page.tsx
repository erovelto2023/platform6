import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { getResource } from "@/lib/actions/resource.actions";
import { IconBadge } from "@/components/icon-badge";
import { LayoutDashboard, File, ListChecks, Sparkles } from "lucide-react";
import { TitleForm } from "./_components/title-form";
import { DescriptionForm } from "./_components/description-form";
import { FileForm } from "./_components/file-form";
import { ResourceActions } from "./_components/resource-actions";
import { Banner } from "@/components/banner";
import { CategoryForm } from "./_components/category-form";
import { TypeForm } from "./_components/type-form";
import { AccessForm } from "./_components/access-form";
import { ThumbnailForm } from "./_components/thumbnail-form";
import { EmbedCodeForm } from "./_components/embed-code-form";

export default async function ResourceIdPage({
    params
}: {
    params: Promise<{ resourceId: string }>
}) {
    const { userId } = await auth();

    if (!userId) {
        return redirect("/");
    }

    const { resourceId } = await params;
    const resource = await getResource(resourceId);

    if (!resource) {
        return redirect("/");
    }

    const requiredFields = [
        resource.title,
        resource.description,
        resource.url,
        resource.category,
        resource.type,
    ];

    const totalFields = requiredFields.length;
    const completedFields = requiredFields.filter(Boolean).length;

    const completionText = `(${completedFields}/${totalFields})`;

    const isComplete = requiredFields.every(Boolean);

    return (
        <div className="min-h-full bg-slate-950 text-slate-100 pb-12">
            {!resource.isPublished && (
                <Banner
                    label="This resource is unpublished. It will not be visible to users."
                />
            )}
            <div className="p-6 md:p-8 max-w-6xl mx-auto space-y-8">
                <div className="flex items-center justify-between border-b border-slate-800/80 pb-6">
                    <div className="flex flex-col gap-y-1">
                        <h1 className="text-2xl md:text-3xl font-black font-mono text-slate-100 uppercase tracking-tight flex items-center gap-2">
                            <Sparkles className="h-7 w-7 text-orange-400" />
                            Resource Setup
                        </h1>
                        <span className="text-xs font-mono text-slate-400">
                            Complete all fields <span className="text-amber-400 font-bold">{completionText}</span>
                        </span>
                    </div>
                    <ResourceActions
                        disabled={!isComplete}
                        resourceId={resource._id}
                        isPublished={resource.isPublished}
                    />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <div className="space-y-6">
                        <div className="space-y-4">
                            <div className="flex items-center gap-x-2">
                                <IconBadge icon={LayoutDashboard} />
                                <h2 className="text-sm font-mono font-bold uppercase tracking-wider text-slate-100">
                                    Customize your resource
                                </h2>
                            </div>
                            <TitleForm
                                initialData={resource}
                                resourceId={resource._id}
                            />
                            <DescriptionForm
                                initialData={resource}
                                resourceId={resource._id}
                            />
                            <ThumbnailForm
                                initialData={resource}
                                resourceId={resource._id}
                            />
                        </div>

                        <div className="space-y-4 pt-4 border-t border-slate-800">
                            <div className="flex items-center gap-x-2">
                                <IconBadge icon={ListChecks} />
                                <h2 className="text-sm font-mono font-bold uppercase tracking-wider text-slate-100">
                                    Access & Visibility
                                </h2>
                            </div>
                            <AccessForm
                                initialData={resource}
                                resourceId={resource._id}
                            />
                            <CategoryForm
                                initialData={resource}
                                resourceId={resource._id}
                            />
                            <TypeForm
                                initialData={resource}
                                resourceId={resource._id}
                            />
                        </div>
                    </div>

                    <div className="space-y-6">
                        <div className="space-y-4">
                            <div className="flex items-center gap-x-2">
                                <IconBadge icon={File} />
                                <h2 className="text-sm font-mono font-bold uppercase tracking-wider text-slate-100">
                                    Resource Content & Embed Code
                                </h2>
                            </div>
                            <FileForm
                                initialData={resource}
                                resourceId={resource._id}
                            />
                            <EmbedCodeForm
                                resource={resource}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
