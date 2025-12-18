import { getArticles } from "@/lib/actions/article.actions";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { BookOpen } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default async function KnowledgeBaseDashboardPage() {
    const articles = await getArticles();
    const publishedArticles = articles.filter((article: any) => article.isPublished);

    return (
        <div className="p-6 space-y-6">
            <div className="flex flex-col gap-y-2">
                <h1 className="text-3xl font-bold">Knowledge Base</h1>
                <p className="text-muted-foreground">
                    Articles and guides to help you grow.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {publishedArticles.length === 0 ? (
                    <div className="col-span-full text-center text-muted-foreground mt-10">
                        No articles available yet.
                    </div>
                ) : (
                    publishedArticles.map((article: any) => (
                        <Link href={`/knowledge-base/${article._id}`} key={article._id}>
                            <Card className="hover:shadow-lg transition cursor-pointer h-full border-slate-200">
                                <CardHeader>
                                    <div className="flex items-center justify-between">
                                        <CardTitle className="line-clamp-1 text-lg">
                                            {article.title}
                                        </CardTitle>
                                        <BookOpen className="h-4 w-4 text-slate-500" />
                                    </div>
                                    {article.category && (
                                        <Badge variant="secondary" className="w-fit mt-2">
                                            {article.category}
                                        </Badge>
                                    )}
                                </CardHeader>
                                <CardContent>
                                    <p className="text-sm text-slate-600 line-clamp-3">
                                        Click to read more...
                                    </p>
                                </CardContent>
                            </Card>
                        </Link>
                    ))
                )}
            </div>
        </div>
    );
}
