"use client";

import { useState, useTransition } from 'react';
import { ISubscriber } from '@/lib/db/models/Subscriber';
import { Trash2, Search, Mail, Calendar, CheckCircle, XCircle } from 'lucide-react';
import { deleteSubscriber } from '@/lib/actions/subscriber.actions';

interface SubscriberManagerProps {
    subscribers: ISubscriber[];
}

export default function SubscriberManager({ subscribers = [] }: SubscriberManagerProps) {
    const [searchTerm, setSearchTerm] = useState('');
    const [isPending, startTransition] = useTransition();
    const [page, setPage] = useState(1);
    const itemsPerPage = 20;

    const filteredSubscribers = subscribers.filter(s =>
        s.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const totalPages = Math.ceil(filteredSubscribers.length / itemsPerPage);
    const paginatedSubscribers = filteredSubscribers.slice((page - 1) * itemsPerPage, page * itemsPerPage);

    const handleDelete = (id: string) => {
        if (!confirm('Are you sure you want to delete this subscriber?')) return;
        startTransition(async () => {
            const res = await deleteSubscriber(id);
            if (res.success) {
                alert('Deleted successfully');
                window.location.reload();
            } else {
                alert('Error: ' + res.error);
            }
        });
    };

    return (
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h2 className="text-2xl font-black text-slate-800 tracking-tight">Newsletter Subscribers</h2>
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">Manage {subscribers.length} total subscribers</p>
                </div>
                <button
                    onClick={() => {
                        const csv = "Email,Date,Status\n" + subscribers.map(s => `${s.email},${new Date(s.subscribedAt).toLocaleDateString()},${s.status}`).join("\n");
                        const blob = new Blob([csv], { type: 'text/csv' });
                        const url = window.URL.createObjectURL(blob);
                        const a = document.createElement('a');
                        a.href = url;
                        a.download = 'subscribers.csv';
                        a.click();
                    }}
                    className="bg-slate-100 text-slate-700 px-6 py-2 rounded-lg font-bold flex items-center gap-2 border border-slate-200 hover:bg-slate-200 transition-all"
                >
                    Export CSV
                </button>
            </div>

            <div className="mb-6">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input
                        type="text"
                        placeholder="Search by email..."
                        className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-black transition-all bg-slate-50"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-slate-200">
                    <thead className="bg-slate-50">
                        <tr>
                            <th className="px-6 py-4 text-left text-xs font-black text-slate-500 uppercase tracking-widest">Subscriber</th>
                            <th className="px-6 py-4 text-left text-xs font-black text-slate-500 uppercase tracking-widest">Joined</th>
                            <th className="px-6 py-4 text-left text-xs font-black text-slate-500 uppercase tracking-widest">Status</th>
                            <th className="px-6 py-4 text-right text-xs font-black text-slate-500 uppercase tracking-widest">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-slate-100">
                        {paginatedSubscribers.map(sub => (
                            <tr key={sub.id}>
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 bg-slate-100 rounded-full flex items-center justify-center text-slate-400">
                                            <Mail size={14} />
                                        </div>
                                        <span className="text-sm font-bold text-slate-900">{sub.email}</span>
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-2 text-xs font-bold text-slate-500 uppercase">
                                        <Calendar size={12} />
                                        {new Date(sub.subscribedAt).toLocaleDateString()}
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <span className={`px-2 py-1 rounded text-[10px] font-black uppercase flex items-center gap-1 w-fit ${sub.status === 'active' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
                                        {sub.status === 'active' ? <CheckCircle size={10} /> : <XCircle size={10} />}
                                        {sub.status}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <button
                                        onClick={() => handleDelete(sub.id)}
                                        className="text-slate-400 hover:text-red-600 transition-colors"
                                    >
                                        <Trash2 size={18} />
                                    </button>
                                </td>
                            </tr>
                        ))}
                        {paginatedSubscribers.length === 0 && (
                            <tr>
                                <td colSpan={4} className="px-6 py-12 text-center text-slate-500 font-bold uppercase text-xs tracking-widest">No subscribers found.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {totalPages > 1 && (
                <div className="flex justify-between items-center mt-6 pt-6 border-t border-slate-100">
                    <div className="text-xs font-black text-slate-400 uppercase tracking-widest">
                        Page <span className="text-black">{page}</span> of {totalPages}
                    </div>
                    <div className="flex gap-2">
                        <button
                            onClick={() => setPage(p => Math.max(1, p - 1))}
                            disabled={page === 1}
                            className="px-4 py-2 text-xs font-black uppercase tracking-widest text-slate-700 bg-white border border-slate-200 rounded-lg disabled:opacity-30 hover:bg-slate-50 transition-all"
                        >
                            Prev
                        </button>
                        <button
                            onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                            disabled={page >= totalPages}
                            className="px-4 py-2 text-xs font-black uppercase tracking-widest text-slate-700 bg-white border border-slate-200 rounded-lg disabled:opacity-30 hover:bg-slate-50 transition-all"
                        >
                            Next
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}

