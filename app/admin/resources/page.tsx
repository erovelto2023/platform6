import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import Link from "next/link";
import { getResources } from "@/lib/actions/resource.actions";
import { DataTable } from "./_components/data-table";
import { columns } from "./_components/columns";

export default async function ResourcesPage() {
    const resources = await getResources();

    return (
        <div className="p-6">
            <div className="flex items-center justify-between mb-6">
                <h1 className="text-2xl font-bold">Resources</h1>
                <Link href="/admin/resources/create">
                    <Button>
                        <PlusCircle className="h-4 w-4 mr-2" />
                        New Resource
                    </Button>
                </Link>
            </div>
            <DataTable columns={columns} data={resources} />
        </div>
    );
}
