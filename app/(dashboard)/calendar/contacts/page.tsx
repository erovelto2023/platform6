
import { ContactList } from "@/components/calendar/ContactList";

export default function ContactsPage() {
    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-xl font-semibold text-slate-900">Contacts</h2>
                <p className="text-sm text-slate-500">Manage your client relationships and contact information.</p>
            </div>

            <ContactList />

            {/* Stats Dashboard Placeholder */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-8">
                <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-sm text-center">
                    <div className="text-2xl font-bold text-slate-900">0</div>
                    <div className="text-xs text-slate-500 uppercase tracking-wide">Total Contacts</div>
                </div>
                <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-sm text-center">
                    <div className="text-2xl font-bold text-green-600">0</div>
                    <div className="text-xs text-slate-500 uppercase tracking-wide">Active Clients</div>
                </div>
                <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-sm text-center">
                    <div className="text-2xl font-bold text-blue-600">0</div>
                    <div className="text-xs text-slate-500 uppercase tracking-wide">Companies</div>
                </div>
                <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-sm text-center">
                    <div className="text-2xl font-bold text-indigo-600">0</div>
                    <div className="text-xs text-slate-500 uppercase tracking-wide">Total Bookings</div>
                </div>
            </div>
        </div>
    );
}
