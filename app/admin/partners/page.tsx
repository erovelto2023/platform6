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
        <div className="p-6 md:p-8 space-y-6 max-w-7xl mx-auto font-sans">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-slate-900 p-6 rounded-3xl border border-slate-800 shadow-xl">
                <div className="flex items-center gap-4">
                    <div className="bg-gradient-to-tr from-indigo-600 via-purple-600 to-cyan-600 p-3.5 rounded-2xl shadow-lg shadow-indigo-600/30">
                        <Users className="h-8 w-8 text-white" />
                    </div>
                    <div>
                        <div className="flex items-center gap-2">
                            <h1 className="text-2xl md:text-3xl font-black text-slate-100 tracking-tight">Partner Management</h1>
                            <span className="px-2 py-0.5 bg-indigo-950 border border-indigo-800 text-indigo-300 rounded-full text-[10px] font-extrabold uppercase font-mono">
                                ADMIN CONTROL
                            </span>
                        </div>
                        <p className="text-slate-400 text-xs flex items-center gap-2 mt-1 font-mono">
                            <ShieldCheck className="h-3.5 w-3.5 text-cyan-400" />
                            Admin Control Panel & Affiliate Commission Engine
                        </p>
                    </div>
                </div>
            </div>

            <PartnerList partners={partners} />
        </div>
    );
}
