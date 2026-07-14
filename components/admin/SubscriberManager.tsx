"use client";

import { useState, useTransition } from 'react';
import { ISubscriber } from '@/lib/db/models/Subscriber';
import { Trash2, Search, Mail, Calendar, CheckCircle, XCircle, Code, Users } from 'lucide-react';
import { deleteSubscriber, updateSubscriber } from '@/lib/actions/subscriber.actions';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';

interface SubscriberManagerProps {
    subscribers: any[];
    lists: any[];
}

export default function SubscriberManager({ subscribers = [], lists = [] }: SubscriberManagerProps) {
    const [searchTerm, setSearchTerm] = useState('');
    const [isPending, startTransition] = useTransition();
    const [page, setPage] = useState(1);
    const [editingSub, setEditingSub] = useState<any>(null);
    const [editLists, setEditLists] = useState<string[]>([]);
    const [selectedListId, setSelectedListId] = useState('');
    
    const itemsPerPage = 20;

    const filteredSubscribers = subscribers.filter(s =>
        s.email.toLowerCase().includes(searchTerm.toLowerCase()) || 
        (s.name && s.name.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    const totalPages = Math.ceil(filteredSubscribers.length / itemsPerPage);
    const paginatedSubscribers = filteredSubscribers.slice((page - 1) * itemsPerPage, page * itemsPerPage);

    const handleDelete = (id: string) => {
        if (!confirm('Are you sure you want to delete this subscriber?')) return;
        startTransition(async () => {
            const res = await deleteSubscriber(id);
            if (res.success) {
                alert('Deleted successfully');
            } else {
                alert('Error: ' + res.error);
            }
        });
    };

    const handleSaveEdit = () => {
        startTransition(async () => {
            const res = await updateSubscriber(editingSub._id, { lists: editLists });
            if (res.success) {
                setEditingSub(null);
            } else {
                alert('Failed to update lists');
            }
        });
    };

    const openEdit = (sub: any) => {
        setEditingSub(sub);
        setEditLists(sub.lists ? sub.lists.map((l: any) => l._id || l) : []);
    };

    const toggleList = (listId: string) => {
        if (editLists.includes(listId)) {
            setEditLists(editLists.filter(id => id !== listId));
        } else {
            setEditLists([...editLists, listId]);
        }
    };

    return (
        <div className="bg-[#111622] p-6 rounded-xl border border-slate-800 shadow-sm text-white">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
                <div>
                    <h2 className="text-2xl font-black tracking-tight flex items-center gap-2">
                        <Users className="text-indigo-500" />
                        Subscribers
                    </h2>
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">Manage {subscribers.length} total subscribers</p>
                </div>
                
                <div className="flex gap-2">
                    <Dialog>
                        <DialogTrigger asChild>
                            <Button variant="outline" className="bg-transparent border-slate-700 text-slate-300 hover:text-white uppercase text-[10px] font-black tracking-widest h-10">
                                <Code size={14} className="mr-2" /> Get Form Code
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="bg-[#0A0D14] border-slate-800 text-white max-w-2xl">
                            <DialogHeader>
                                <DialogTitle className="text-xl font-black uppercase">Embed Subscription Form</DialogTitle>
                            </DialogHeader>
                            <div className="space-y-4">
                                <p className="text-sm text-slate-400">Select a mailing list and copy this HTML code to embed a subscription form on any external website.</p>
                                
                                <div>
                                    <label className="text-xs font-bold uppercase tracking-widest text-slate-400 block mb-2">Target Mailing List</label>
                                    <select 
                                        className="w-full bg-[#111622] border border-slate-800 rounded-lg p-3 text-sm text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                        value={selectedListId}
                                        onChange={(e) => setSelectedListId(e.target.value)}
                                    >
                                        <option value="">No specific list (Global Subscribe)</option>
                                        {lists.map(l => (
                                            <option key={l._id} value={l._id}>{l.name}</option>
                                        ))}
                                    </select>
                                </div>

                                <div className="relative">
                                    <pre className="bg-[#111622] p-4 pt-10 rounded-lg text-xs font-mono text-emerald-400 border border-slate-800 whitespace-pre-wrap break-all max-h-[300px] overflow-y-auto">
{`<form action="https://kbusinessacademy.com/api/subscribe" method="POST" style="display:flex;flex-direction:column;gap:10px;max-width:300px;font-family:sans-serif;">
  <input type="text" name="name" placeholder="Your Name" required style="padding:10px;border-radius:5px;border:1px solid #ccc;" />
  <input type="email" name="email" placeholder="Your Email" required style="padding:10px;border-radius:5px;border:1px solid #ccc;" />
  ${selectedListId ? `<input type="hidden" name="listId" value="${selectedListId}" />\n  ` : ''}<button type="submit" style="padding:10px;background:#4F46E5;color:white;border:none;border-radius:5px;cursor:pointer;font-weight:bold;">Subscribe</button>
</form>`}
                                    </pre>
                                    <Button 
                                        onClick={() => {
                                            const code = `<form action="https://kbusinessacademy.com/api/subscribe" method="POST" style="display:flex;flex-direction:column;gap:10px;max-width:300px;font-family:sans-serif;">\n  <input type="text" name="name" placeholder="Your Name" required style="padding:10px;border-radius:5px;border:1px solid #ccc;" />\n  <input type="email" name="email" placeholder="Your Email" required style="padding:10px;border-radius:5px;border:1px solid #ccc;" />\n  ${selectedListId ? `<input type="hidden" name="listId" value="${selectedListId}" />\n  ` : ''}<button type="submit" style="padding:10px;background:#4F46E5;color:white;border:none;border-radius:5px;cursor:pointer;font-weight:bold;">Subscribe</button>\n</form>`;
                                            navigator.clipboard.writeText(code);
                                            alert("Code copied to clipboard!");
                                        }}
                                        className="absolute top-2 right-2 bg-indigo-600 hover:bg-indigo-700 text-white font-black uppercase tracking-widest text-[10px] h-6 px-3"
                                    >
                                        Copy Code
                                    </Button>
                                </div>
                            </div>
                        </DialogContent>
                    </Dialog>

                    <Button
                        onClick={() => {
                            const csv = "Email,Name,Date,Status,IP\n" + subscribers.map(s => `${s.email},${s.name || ''},${new Date(s.subscribedAt).toLocaleDateString()},${s.status},${s.ipAddress || ''}`).join("\n");
                            const blob = new Blob([csv], { type: 'text/csv' });
                            const url = window.URL.createObjectURL(blob);
                            const a = document.createElement('a');
                            a.href = url;
                            a.download = 'subscribers.csv';
                            a.click();
                        }}
                        className="bg-indigo-600 hover:bg-indigo-700 text-white font-black uppercase tracking-widest text-[10px] h-10 px-6"
                    >
                        Export CSV
                    </Button>
                </div>
            </div>

            <div className="mb-6">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                    <Input
                        type="text"
                        placeholder="Search by email or name..."
                        className="w-full pl-10 pr-4 py-3 bg-[#0A0D14] border border-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all text-white placeholder-slate-600"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            <div className="overflow-x-auto rounded-xl border border-slate-800">
                <table className="min-w-full divide-y divide-slate-800">
                    <thead className="bg-[#0A0D14]">
                        <tr>
                            <th className="px-6 py-4 text-left text-[10px] font-black text-slate-500 uppercase tracking-widest">Subscriber</th>
                            <th className="px-6 py-4 text-left text-[10px] font-black text-slate-500 uppercase tracking-widest">Joined</th>
                            <th className="px-6 py-4 text-left text-[10px] font-black text-slate-500 uppercase tracking-widest">Lists</th>
                            <th className="px-6 py-4 text-left text-[10px] font-black text-slate-500 uppercase tracking-widest">Status</th>
                            <th className="px-6 py-4 text-right text-[10px] font-black text-slate-500 uppercase tracking-widest">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="bg-[#111622] divide-y divide-slate-800/50">
                        {paginatedSubscribers.map(sub => (
                            <tr key={sub._id} className="hover:bg-[#0A0D14]/50 transition-colors">
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 bg-indigo-500/10 rounded-full flex items-center justify-center text-indigo-400">
                                            <Mail size={16} />
                                        </div>
                                        <div>
                                            <div className="text-sm font-bold text-white">{sub.email}</div>
                                            <div className="text-xs text-slate-500">{sub.name || 'No Name'} • {sub.ipAddress || 'No IP'}</div>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase">
                                        <Calendar size={12} />
                                        {new Date(sub.subscribedAt).toLocaleDateString()}
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="flex flex-wrap gap-1">
                                        {sub.lists && sub.lists.length > 0 ? (
                                            sub.lists.map((l: any) => (
                                                <span key={l._id} className="px-2 py-0.5 bg-slate-800 text-slate-300 text-[10px] font-bold uppercase rounded">
                                                    {l.name}
                                                </span>
                                            ))
                                        ) : (
                                            <span className="text-xs text-slate-600 italic">No lists</span>
                                        )}
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span className={`px-2 py-1 rounded text-[10px] font-black uppercase flex items-center gap-1 w-fit ${sub.status === 'active' ? 'bg-green-500/10 text-green-400 border border-green-500/20' : 'bg-red-500/10 text-red-400 border border-red-500/20'}`}>
                                        {sub.status === 'active' ? <CheckCircle size={10} /> : <XCircle size={10} />}
                                        {sub.status}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <div className="flex items-center justify-end gap-3">
                                        <Dialog open={editingSub?._id === sub._id} onOpenChange={(open) => !open && setEditingSub(null)}>
                                            <DialogTrigger asChild>
                                                <button onClick={() => openEdit(sub)} className="text-indigo-400 hover:text-indigo-300 text-xs font-bold uppercase tracking-widest transition-colors">
                                                    Edit Lists
                                                </button>
                                            </DialogTrigger>
                                            <DialogContent className="bg-[#0A0D14] border-slate-800 text-white">
                                                <DialogHeader>
                                                    <DialogTitle className="text-xl font-black uppercase">Manage Lists for {sub.email}</DialogTitle>
                                                </DialogHeader>
                                                <div className="space-y-4 py-4">
                                                    <p className="text-sm text-slate-400">Select which mailing lists this subscriber belongs to.</p>
                                                    <div className="space-y-2 max-h-60 overflow-y-auto">
                                                        {lists.map(list => (
                                                            <div key={list._id} className="flex items-center gap-3 p-3 rounded-lg border border-slate-800 bg-[#111622] hover:border-indigo-500/50 cursor-pointer" onClick={() => toggleList(list._id)}>
                                                                <div className={`w-5 h-5 rounded flex items-center justify-center border ${editLists.includes(list._id) ? 'bg-indigo-600 border-indigo-600' : 'border-slate-600'}`}>
                                                                    {editLists.includes(list._id) && <CheckCircle size={12} className="text-white" />}
                                                                </div>
                                                                <div>
                                                                    <div className="font-bold text-sm">{list.name}</div>
                                                                    <div className="text-xs text-slate-500">{list.description || 'No description'}</div>
                                                                </div>
                                                            </div>
                                                        ))}
                                                        {lists.length === 0 && <p className="text-slate-500 text-sm">No mailing lists created yet.</p>}
                                                    </div>
                                                    <Button onClick={handleSaveEdit} disabled={isPending} className="w-full bg-indigo-600 hover:bg-indigo-700 font-black uppercase tracking-widest">
                                                        {isPending ? 'Saving...' : 'Save Changes'}
                                                    </Button>
                                                </div>
                                            </DialogContent>
                                        </Dialog>
                                        
                                        <button onClick={() => handleDelete(sub._id)} className="text-slate-600 hover:text-red-500 transition-colors">
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                        {paginatedSubscribers.length === 0 && (
                            <tr>
                                <td colSpan={5} className="px-6 py-12 text-center text-slate-600 font-bold uppercase text-xs tracking-widest">
                                    No subscribers found.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {totalPages > 1 && (
                <div className="flex justify-between items-center mt-6 pt-6 border-t border-slate-800">
                    <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest">
                        Page <span className="text-white">{page}</span> of {totalPages}
                    </div>
                    <div className="flex gap-2">
                        <Button
                            onClick={() => setPage(p => Math.max(1, p - 1))}
                            disabled={page === 1}
                            variant="outline"
                            className="h-8 bg-transparent border-slate-800 text-white uppercase text-[10px] font-black tracking-widest hover:bg-slate-800"
                        >
                            Prev
                        </Button>
                        <Button
                            onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                            disabled={page >= totalPages}
                            variant="outline"
                            className="h-8 bg-transparent border-slate-800 text-white uppercase text-[10px] font-black tracking-widest hover:bg-slate-800"
                        >
                            Next
                        </Button>
                    </div>
                </div>
            )}
        </div>
    );
}
