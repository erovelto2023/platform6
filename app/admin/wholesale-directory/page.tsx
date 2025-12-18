import { getSuppliers } from "@/lib/actions/supplier.actions";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Plus } from "lucide-react";
import { SupplierAdminTable } from "./_components/supplier-admin-table";

export default async function WholesaleAdminPage() {
    const suppliers = await getSuppliers({});

    return (
        <div className="p-6 space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold">Wholesale Suppliers Admin</h1>
                <Link href="/admin/wholesale-directory/add">
                    <Button>
                        <Plus className="h-4 w-4 mr-2" />
                        Add New Supplier
                    </Button>
                </Link>
            </div>

            <div className="bg-white rounded-lg border shadow-sm">
                <SupplierAdminTable suppliers={suppliers} />
            </div>
        </div>
    );
}
