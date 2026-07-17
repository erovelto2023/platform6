import { getPageTypes } from "@/lib/actions/custom-pages.actions";
import CustomPagesClient from "./CustomPagesClient";

export const metadata = {
    title: "Custom Page Types Admin",
};

export default async function CustomPagesAdminPage() {
    const pageTypes = await getPageTypes();

    return (
        <div className="p-8">
            <CustomPagesClient initialTypes={pageTypes} />
        </div>
    );
}
