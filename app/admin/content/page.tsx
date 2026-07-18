import { getAdminContentData } from "@/lib/actions/dashboard.actions";
import AdminContentManager from "@/components/admin/AdminContentManager";

export default async function AdminContentPage() {
    const data = await getAdminContentData();

    if ("error" in data) {
        return (
            <div className="p-8 text-center text-red-500">
                {data.error}
            </div>
        );
    }

    return <AdminContentManager initialData={data} />;
}
