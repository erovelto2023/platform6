import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { getArticle } from "@/lib/actions/article.actions";
import { IconBadge } from "@/components/icon-badge";
import { LayoutDashboard, ListChecks } from "lucide-react";
import { TitleForm } from "./_components/title-form";
import { ContentForm } from "./_components/content-form";
import { CategoryForm } from "./_components/category-form";
import { ArticleActions } from "./_components/article-actions";
import { Banner } from "@/components/banner";

export default async function ArticleIdPage({
    params
}: {
    params: Promise<{ articleId: string }>
}) {
    const { userId } = await auth();

    if (!userId) {
        return redirect("/");
    }

    const { articleId } = await params;
    const article = await getArticle(articleId);

    if (!article) {
        return redirect("/");
    }

    const requiredFields = [
        article.title,
        article.content,
        article.category,
    ];

    const totalFields = requiredFields.length;
    const completedFields = requiredFields.filter(Boolean).length;

    const completionText = `(${completedFields}/${totalFields})`;

    const isComplete = requiredFields.every(Boolean);

    return (
        <>
            {!article.isPublished && (
                <Banner
                    label="This article is unpublished. It will not be visible to the users."
                />
            )}
            <div className="p-6">
                <div className="flex items-center justify-between">
                    <div className="flex flex-col gap-y-2">
                        <h1 className="text-2xl font-medium">
                            Article setup
                        </h1>
                        <span className="text-sm text-slate-700">
                            Complete all fields {completionText}
                        </span>
                    </div>
                    <ArticleActions
                        disabled={!isComplete}
                        articleId={article._id}
                        isPublished={article.isPublished}
                    />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-16">
                    <div>
                        <div className="flex items-center gap-x-2">
                            <IconBadge icon={LayoutDashboard} />
                            <h2 className="text-xl">
                                Customize your article
                            </h2>
                        </div>
                        <TitleForm
                            initialData={article}
                            articleId={article._id}
                        />
                        <CategoryForm
                            initialData={article}
                            articleId={article._id}
                        />
                    </div>
                    <div className="space-y-6">
                        <div>
                            <div className="flex items-center gap-x-2">
                                <IconBadge icon={ListChecks} />
                                <h2 className="text-xl">
                                    Content
                                </h2>
                            </div>
                            <ContentForm
                                initialData={article}
                                articleId={article._id}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
