"use client";

import { useState, useTransition } from 'react';
import { Plus, Trash2, Edit2, List as ListIcon, Users } from 'lucide-react';
import { createMailingList, deleteMailingList, updateMailingList } from '@/lib/actions/subscriber.actions';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

interface MailingListManagerProps {
    lists: any[];
}

export default function MailingListManager({ lists = [] }: MailingListManagerProps) {
    const [isPending, startTransition] = useTransition();
    const [open, setOpen] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [formData, setFormData] = useState({ name: '', description: '' });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        startTransition(async () => {
            if (editingId) {
                await updateMailingList(editingId, formData);
            } else {
                await createMailingList(formData);
            }
            setOpen(false);
            setEditingId(null);
            setFormData({ name: '', description: '' });
        });
    };

    const handleDelete = (id: string) => {
        if (!confirm('Are you sure you want to delete this list? This does not delete the subscribers, but removes them from the list.')) return;
        startTransition(async () => {
            await deleteMailingList(id);
        });
    };

    const openEdit = (list: any) => {
        setFormData({ name: list.name, description: list.description || '' });
        setEditingId(list._id);
        setOpen(true);
    };

    return (
        <div className="bg-[#111622] p-6 rounded-xl border border-slate-800 shadow-sm text-white">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h2 className="text-2xl font-black text-white tracking-tight flex items-center gap-2">
                        <ListIcon className="text-indigo-500" />
                        Mailing Lists
                    </h2>
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">Manage {lists.length} lists</p>
                </div>
                <Dialog open={open} onOpenChange={setOpen}>
                    <DialogTrigger asChild>
                        <Button onClick={() => { setEditingId(null); setFormData({ name: '', description: '' }) }} className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 font-bold flex items-center gap-2 uppercase tracking-widest text-xs">
                            <Plus size={16} /> Create List
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="bg-[#0A0D14] border-slate-800 text-white">
                        <DialogHeader>
                            <DialogTitle className="text-xl font-black uppercase">{editingId ? 'Edit List' : 'Create List'}</DialogTitle>
                        </DialogHeader>
                        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
                            <div>
                                <label className="text-xs font-bold uppercase tracking-widest text-slate-400">List Name</label>
                                <Input 
                                    required 
                                    value={formData.name} 
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })} 
                                    className="bg-[#111622] border-slate-800 mt-1" 
                                    placeholder="e.g. Weekly Newsletter" 
                                />
                            </div>
                            <div>
                                <label className="text-xs font-bold uppercase tracking-widest text-slate-400">Description</label>
                                <Textarea 
                                    value={formData.description} 
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })} 
                                    className="bg-[#111622] border-slate-800 mt-1 resize-none" 
                                    placeholder="Optional description" 
                                />
                            </div>
                            <Button type="submit" disabled={isPending} className="w-full bg-indigo-600 hover:bg-indigo-700 font-black uppercase tracking-widest">
                                {isPending ? 'Saving...' : 'Save List'}
                            </Button>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {lists.map(list => (
                    <div key={list._id} className="bg-[#0A0D14] p-5 rounded-lg border border-slate-800 hover:border-indigo-500/50 transition-colors">
                        <div className="flex justify-between items-start mb-4">
                            <div>
                                <h3 className="font-black text-lg text-white">{list.name}</h3>
                                <p className="text-xs text-slate-400 line-clamp-2 mt-1">{list.description || 'No description'}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-2 text-indigo-400 text-sm font-bold bg-indigo-500/10 w-fit px-3 py-1 rounded-full mb-4">
                            <Users size={14} />
                            {list.subscriberCount} Subscribers
                        </div>
                        <div className="flex gap-2 pt-4 border-t border-slate-800">
                            <Button onClick={() => openEdit(list)} variant="outline" size="sm" className="flex-1 bg-transparent border-slate-700 hover:bg-slate-800 hover:text-white uppercase text-[10px] font-black tracking-widest">
                                <Edit2 size={12} className="mr-2" /> Edit
                            </Button>
                            <Button onClick={() => handleDelete(list._id)} variant="outline" size="sm" className="bg-transparent border-red-900/30 text-red-500 hover:bg-red-950 hover:text-red-400 uppercase text-[10px] font-black tracking-widest">
                                <Trash2 size={12} />
                            </Button>
                        </div>
                    </div>
                ))}
                {lists.length === 0 && (
                    <div className="col-span-full py-12 text-center border-2 border-dashed border-slate-800 rounded-lg">
                        <ListIcon className="mx-auto h-12 w-12 text-slate-600 mb-4" />
                        <h3 className="text-lg font-black text-white">No Mailing Lists</h3>
                        <p className="text-sm text-slate-500 mt-1">Create your first mailing list to start collecting subscribers.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
