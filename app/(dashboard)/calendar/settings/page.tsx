
import { getOrCreateBusiness } from "@/lib/actions/business.actions";
import { SettingsForm } from "@/components/calendar/SettingsForm";

export default async function SettingsPage() {
    const { data: business } = await getOrCreateBusiness();

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-xl font-semibold text-slate-900">Settings</h2>
                <p className="text-sm text-slate-500">Customize your booking experience and calendar appearance.</p>
            </div>

            <SettingsForm business={business} />
        </div>
    );
}
