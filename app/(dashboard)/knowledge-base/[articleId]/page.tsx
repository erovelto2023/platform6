import { getArticle } from "@/lib/actions/article.actions";
import { redirect } from "next/navigation";
import { Preview } from "@/components/preview";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

export default async function ArticlePage({
    params
}: {
    params: Promise<{ articleId: string }>
}) {
    const { articleId } = await params;
    const article = await getArticle(articleId);

    if (!article || !article.isPublished) {
        return redirect("/knowledge-base");
    }

    return (
        <div className="p-6 max-w-4xl mx-auto">
            <div className="mb-8">
                <h1 className="text-3xl font-bold mb-4">{article.title}</h1>
                {article.category && (
                    <Badge variant="secondary" className="text-md py-1 px-3">
                        {article.category}
                    </Badge>
                )}
            </div>
            <Separator className="my-6" />
            <div className="prose max-w-none">
                <Preview value={article.content} />
            </div>
        </div>
    );
}
