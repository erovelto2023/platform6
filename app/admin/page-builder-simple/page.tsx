import { getPages } from "@/lib/actions/page-builder.actions";
// IDE Refresh: Forcing TS server to reload this import path
import { PuckPageListClient } from "@/components/admin/PuckPageListClient";

export default async function PageBuilderList() {
    const pages = await getPages();
    
    // Filter pages that only have one section with customHTML/puck-blocks
    const simplePages = pages.filter((p: any) => 
        p.sections && 
        p.sections.length === 1 && 
        (p.sections[0].templateId === 'custom-html' || p.sections[0].templateId === 'puck-blocks' || p.sections[0].templateId === 'chai-blocks')
    );

    return <PuckPageListClient pages={simplePages} />;
}
