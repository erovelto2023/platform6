import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import Link from "next/link";
import { getArticles } from "@/lib/actions/article.actions";
import { DataTable } from "./_components/data-table";
import { columns } from "./_components/columns";

export default async function KnowledgeBasePage() {
    const articles = await getArticles();

    return (
        <div className="p-6">
            <div className="flex items-center justify-between mb-6">
                <h1 className="text-2xl font-bold">Knowledge Base</h1>
                <Link href="/admin/knowledge-base/create">
                    <Button>
                        <PlusCircle className="h-4 w-4 mr-2" />
                        New Article
                    </Button>
                </Link>
            </div>
            <DataTable columns={columns} data={articles} />
        </div>
    );
}
