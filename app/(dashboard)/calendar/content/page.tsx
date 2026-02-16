
import { ContentCalendarClient } from "./ContentCalendarClient";
import { getContentItems } from "@/lib/actions/content.actions";
import { Separator } from "@/components/ui/separator";

export default async function ContentCalendarPage() {
    const res = await getContentItems();
    const items = res.success ? res.data : [];

    return (
        <div className="space-y-6">
            <div>
                <h3 className="text-lg font-medium">Content Calendar</h3>
                <p className="text-sm text-muted-foreground">
                    Plan and schedule your content marketing efforts.
                </p>
            </div>
            <Separator />
            <ContentCalendarClient items={items} />
        </div>
    );
}
