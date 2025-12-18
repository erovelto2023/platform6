import { getPages } from "@/lib/actions/page-builder.actions";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { PageListClient } from "./_components/page-list-client";

export default async function PageBuilderPage() {
    const pages = await getPages();

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Page Builder</h1>
                    <p className="text-muted-foreground mt-1">
                        Create and manage custom pages with our visual builder
                    </p>
                </div>
                <Link href="/admin/page-builder/create">
                    <Button size="lg" className="gap-2">
                        <Plus className="h-4 w-4" />
                        Create Page
                    </Button>
                </Link>
            </div>

            <PageListClient pages={pages} />
        </div>
    );
}
