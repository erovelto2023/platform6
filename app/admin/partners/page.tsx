import { getAdminPartners } from "@/lib/actions/admin.partner.actions";
import { PartnerList } from "./_components/partner-list";
import { redirect } from "next/navigation";
import { checkRole } from "@/lib/roles";
import { Users, ShieldCheck } from "lucide-react";

export default async function AdminPartnersPage() {
    const isAdmin = await checkRole("admin");
    if (!isAdmin) {
        return redirect("/");
    }

    const partners = await getAdminPartners();

    return (
        <div className="p-6 space-y-6 max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div className="flex items-center gap-4">
                    <div className="bg-indigo-600 p-3 rounded-2xl shadow-lg shadow-indigo-100">
                        <Users className="h-8 w-8 text-white" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-black text-slate-900 tracking-tight">Partner Management</h1>
                        <p className="text-slate-500 flex items-center gap-2 mt-1">
                            <ShieldCheck className="h-3.5 w-3.5" />
                            Admin Control Panel
                        </p>
                    </div>
                </div>
            </div>

            <PartnerList partners={partners} />
        </div>
    );
}
