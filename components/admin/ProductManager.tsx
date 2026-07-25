"use client";

import { useState, useTransition } from 'react';
import { IDirectoryProduct } from '@/lib/db/models/DirectoryProduct';
import { Edit, Trash2, Plus, ArrowLeft, Search, Copy, ExternalLink, Tag, ShieldCheck } from 'lucide-react';
import ProductForm from './ProductForm';
import { deleteDirectoryProduct } from '@/lib/actions/directory-product.actions';

interface ProductManagerProps {
    products: IDirectoryProduct[];
}

export default function ProductManager({ products = [] }: ProductManagerProps) {
    const [view, setView] = useState<'list' | 'create' | 'edit'>('list');
    const [editingProduct, setEditingProduct] = useState<IDirectoryProduct | undefined>(undefined);
    const [searchTerm, setSearchTerm] = useState('');
    const [isPending, startTransition] = useTransition();

    const filteredProducts = products.filter(p =>
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (p.niche && p.niche.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    const handleDelete = (id: number) => {
        if (!confirm('Are you sure you want to delete this product?')) return;
        startTransition(async () => {
            const res = await deleteDirectoryProduct(id);
            if (res.success) {
                alert('Deleted successfully');
                window.location.reload();
            } else {
                alert('Error: ' + res.error);
            }
        });
    };

    return (
        <div className="bg-slate-900 p-6 md:p-8 rounded-3xl border border-slate-800 shadow-2xl space-y-6 font-sans">
            {view === 'list' && (
                <>
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
                        <div>
                            <h2 className="text-2xl font-black text-slate-100 tracking-tight">Recommended Tools & Products</h2>
                            <p className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider mt-1">Directory & Affiliate Management Database</p>
                        </div>
                        <button
                            onClick={() => { setEditingProduct(undefined); setView('create'); }}
                            className="bg-gradient-to-r from-cyan-600 via-indigo-600 to-purple-600 hover:from-cyan-500 hover:to-purple-500 text-white px-5 py-2.5 rounded-2xl font-extrabold flex items-center gap-2 transition-all shadow-lg shadow-indigo-600/30 cursor-pointer"
                        >
                            <Plus size={16} /> Add Product / Tool
                        </button>
                    </div>

                    <div>
                        <div className="relative">
                            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                            <input
                                type="text"
                                placeholder="Search tools, products, categories or niches..."
                                className="w-full pl-10 pr-4 py-3 border border-slate-800 rounded-2xl focus:outline-none focus:ring-2 focus:ring-cyan-500 transition-all bg-slate-950 text-slate-100 placeholder:text-slate-500 font-sans text-xs"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="overflow-x-auto rounded-2xl border border-slate-800">
                        <table className="min-w-full divide-y divide-slate-800">
                            <thead className="bg-slate-950">
                                <tr>
                                    <th className="px-6 py-4 text-left text-xs font-extrabold text-slate-300 uppercase tracking-wider">Product</th>
                                    <th className="px-6 py-4 text-left text-xs font-extrabold text-slate-300 uppercase tracking-wider">Niche / Category</th>
                                    <th className="px-6 py-4 text-left text-xs font-extrabold text-slate-300 uppercase tracking-wider">Views</th>
                                    <th className="px-6 py-4 text-left text-xs font-extrabold text-slate-300 uppercase tracking-wider">Price / Comm</th>
                                    <th className="px-6 py-4 text-right text-xs font-extrabold text-slate-300 uppercase tracking-wider">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="bg-slate-950 divide-y divide-slate-800/80">
                                {filteredProducts.map(product => (
                                    <tr key={product.id} className="hover:bg-slate-900/60 transition">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-4">
                                                {product.logoUrl ? (
                                                    <img src={product.logoUrl} alt={product.name} className="w-10 h-10 rounded-xl object-contain bg-slate-900 p-1 border border-slate-800" />
                                                ) : (
                                                    <div className="w-10 h-10 bg-slate-900 border border-slate-800 rounded-xl flex items-center justify-center text-slate-400">
                                                        <Tag size={16} />
                                                    </div>
                                                )}
                                                <div>
                                                    <div className="text-sm font-extrabold text-slate-100">{product.name}</div>
                                                    <div className="flex items-center gap-2 mt-1">
                                                        <span className="text-[10px] font-mono bg-slate-900 px-2 py-0.5 rounded border border-slate-800 text-cyan-400">/{product.slug}</span>
                                                        {product.affiliateLink && <ShieldCheck size={14} className="text-emerald-400" />}
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="bg-slate-900 border border-slate-800 text-slate-300 px-2.5 py-1 rounded-xl text-[10px] font-mono font-bold uppercase">{product.niche || 'General'}</span>
                                        </td>
                                        <td className="px-6 py-4 text-xs font-mono font-bold text-slate-400">
                                            {product.views || 0}
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="text-xs font-bold text-slate-200">
                                                {product.startingPrice ? `$${product.startingPrice}` : 'Free'}
                                                {product.commissionRate && <span className="text-emerald-400 font-mono ml-2">({product.commissionRate})</span>}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex justify-end gap-2">
                                                <button
                                                    onClick={() => { setEditingProduct(product); setView('edit'); }}
                                                    className="p-2 bg-slate-900 border border-slate-800 hover:border-cyan-500 text-slate-300 hover:text-white rounded-xl transition"
                                                    title="Edit Product"
                                                >
                                                    <Edit size={14} />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(product.id)}
                                                    className="p-2 bg-slate-900 border border-slate-800 hover:border-rose-500 text-slate-400 hover:text-rose-400 rounded-xl transition"
                                                    title="Delete Product"
                                                >
                                                    <Trash2 size={14} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </>
            )}

            {(view === 'create' || view === 'edit') && (
                <div>
                    <button
                        onClick={() => setView('list')}
                        className="mb-6 px-4 py-2 bg-slate-950 border border-slate-800 hover:bg-slate-800 text-slate-300 rounded-xl text-xs font-bold flex items-center gap-2 transition"
                    >
                        <ArrowLeft size={16} /> Back to Products List
                    </button>
                    <ProductForm
                        initialData={editingProduct}
                        onComplete={() => { setView('list'); window.location.reload(); }}
                    />
                </div>
            )}
        </div>
    );
}
