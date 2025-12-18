// Test if templates are loading correctly
import { defaultTemplates } from "./lib/constants/page-builder-templates";
import pageTemplates from "./lib/constants/page-templates";

console.log("=== TEMPLATE DEBUG ===");
console.log("Section Templates Count:", defaultTemplates?.length || 0);
console.log("Page Templates Count:", pageTemplates?.length || 0);

if (defaultTemplates && defaultTemplates.length > 0) {
    console.log("First 3 section templates:");
    defaultTemplates.slice(0, 3).forEach(t => {
        console.log(`  - ${t.name} (${t.category})`);
    });
} else {
    console.log("❌ No section templates found!");
}

if (pageTemplates && pageTemplates.length > 0) {
    console.log("First 3 page templates:");
    pageTemplates.slice(0, 3).forEach(t => {
        console.log(`  - ${t.name} (${t.category})`);
    });
} else {
    console.log("❌ No page templates found!");
}

console.log("=== END DEBUG ===");

export { };
