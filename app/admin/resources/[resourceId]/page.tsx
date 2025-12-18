import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { getResource } from "@/lib/actions/resource.actions";
import { IconBadge } from "@/components/icon-badge";
import { LayoutDashboard, File } from "lucide-react";
import { TitleForm } from "./_components/title-form";
import { DescriptionForm } from "./_components/description-form";
import { FileForm } from "./_components/file-form";
import { ResourceActions } from "./_components/resource-actions";
import { Banner } from "@/components/banner";

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
        resource.fileUrl,
    ];

    const totalFields = requiredFields.length;
    const completedFields = requiredFields.filter(Boolean).length;

    const completionText = `(${completedFields}/${totalFields})`;

    const isComplete = requiredFields.every(Boolean);

    return (
        <>
            {!resource.isPublished && (
                <Banner
                    label="This resource is unpublished. It will not be visible to the users."
                />
            )}
            <div className="p-6">
                <div className="flex items-center justify-between">
                    <div className="flex flex-col gap-y-2">
                        <h1 className="text-2xl font-medium">
                            Resource setup
                        </h1>
                        <span className="text-sm text-slate-700">
                            Complete all fields {completionText}
                        </span>
                    </div>
                    <ResourceActions
                        disabled={!isComplete}
                        resourceId={resource._id}
                        isPublished={resource.isPublished}
                    />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-16">
                    <div>
                        <div className="flex items-center gap-x-2">
                            <IconBadge icon={LayoutDashboard} />
                            <h2 className="text-xl">
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
                    </div>
                    <div className="space-y-6">
                        <div>
                            <div className="flex items-center gap-x-2">
                                <IconBadge icon={File} />
                                <h2 className="text-xl">
                                    Resource File
                                </h2>
                            </div>
                            <FileForm
                                initialData={resource}
                                resourceId={resource._id}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
