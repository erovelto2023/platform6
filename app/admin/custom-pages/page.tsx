import { getPageTypes } from "@/lib/actions/custom-pages.actions";
import CustomPagesClient from "./CustomPagesClient";

export const metadata = {
    title: "Custom Page Types Admin",
};

export default async function CustomPagesAdminPage() {
    const pageTypes = await getPageTypes();

    return (
        <div className="p-6 md:p-8 max-w-7xl mx-auto font-sans">
            <CustomPagesClient initialTypes={pageTypes} />
        </div>
    );
}
