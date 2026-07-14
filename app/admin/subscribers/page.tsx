import { getSubscribers, getMailingLists } from "@/lib/actions/subscriber.actions";
import SubscriberManager from "@/components/admin/SubscriberManager";
import MailingListManager from "@/components/admin/MailingListManager";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Mail, List as ListIcon, Users } from "lucide-react";

export default async function SubscribersAdminPage() {
    const [subsRes, listsRes] = await Promise.all([
        getSubscribers(),
        getMailingLists()
    ]);

    const subscribers = subsRes.success ? subsRes.data : [];
    const lists = listsRes.success ? listsRes.data : [];

    return (
        <div className="min-h-screen bg-[#0A0D14] p-6 lg:p-10 text-white">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 mb-12">
                <div className="space-y-2">
                    <div className="flex items-center gap-3">
                        <div className="h-10 w-1 bg-indigo-500 rounded-full shadow-[0_0_15px_rgba(99,102,241,0.5)]" />
                        <h1 className="text-4xl lg:text-5xl font-black italic uppercase tracking-tighter">
                            Mailing <span className="text-indigo-500">List</span>
                        </h1>
                    </div>
                    <p className="text-slate-500 font-bold uppercase tracking-[0.3em] text-[10px] ml-4">
                        Audience Management System v2.0
                    </p>
                </div>
                
                <div className="flex items-center gap-4 bg-[#111622] px-6 py-4 rounded-2xl border border-slate-800">
                    <div className="flex flex-col items-end">
                        <p className="text-[8px] font-black text-slate-500 uppercase tracking-widest leading-none">Total Subscribers</p>
                        <p className="text-2xl font-black text-indigo-400 mt-1">{subscribers.length}</p>
                    </div>
                    <div className="h-10 w-px bg-slate-800 mx-2" />
                    <div className="flex flex-col items-end">
                        <p className="text-[8px] font-black text-slate-500 uppercase tracking-widest leading-none">Total Lists</p>
                        <p className="text-2xl font-black text-emerald-400 mt-1">{lists.length}</p>
                    </div>
                </div>
            </div>

            <Tabs defaultValue="subscribers" className="w-full">
                <TabsList className="bg-[#111622] border border-slate-800 h-14 p-1 rounded-xl mb-8 flex w-fit">
                    <TabsTrigger value="subscribers" className="data-[state=active]:bg-indigo-600 data-[state=active]:text-white text-slate-400 rounded-lg px-8 font-black uppercase tracking-widest text-[10px] h-full flex items-center gap-2 transition-all">
                        <Users size={14} /> Subscribers
                    </TabsTrigger>
                    <TabsTrigger value="lists" className="data-[state=active]:bg-indigo-600 data-[state=active]:text-white text-slate-400 rounded-lg px-8 font-black uppercase tracking-widest text-[10px] h-full flex items-center gap-2 transition-all">
                        <ListIcon size={14} /> Mailing Lists
                    </TabsTrigger>
                </TabsList>
                
                <TabsContent value="subscribers" className="mt-0 outline-none">
                    <SubscriberManager subscribers={subscribers} lists={lists} />
                </TabsContent>
                
                <TabsContent value="lists" className="mt-0 outline-none">
                    <MailingListManager lists={lists} />
                </TabsContent>
            </Tabs>
        </div>
    );
}
