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
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
            {view === 'list' && (
                <>
                    <div className="flex justify-between items-center mb-6">
                        <div>
                            <h2 className="text-2xl font-black text-slate-800 tracking-tight">Tools & Products</h2>
                            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">Directory & Affiliate Management</p>
                        </div>
                        <button
                            onClick={() => { setEditingProduct(undefined); setView('create'); }}
                            className="bg-black text-white px-6 py-2 rounded-lg font-bold flex items-center gap-2 hover:bg-slate-800 transition-all"
                        >
                            <Plus size={16} /> Add Product
                        </button>
                    </div>

                    <div className="mb-6">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                            <input
                                type="text"
                                placeholder="Search products or niches..."
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
                                    <th className="px-6 py-4 text-left text-xs font-black text-slate-500 uppercase tracking-widest">Product</th>
                                    <th className="px-6 py-4 text-left text-xs font-black text-slate-500 uppercase tracking-widest">Niche / Category</th>
                                    <th className="px-6 py-4 text-left text-xs font-black text-slate-500 uppercase tracking-widest">Price / Comm</th>
                                    <th className="px-6 py-4 text-right text-xs font-black text-slate-500 uppercase tracking-widest">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-slate-100">
                                {filteredProducts.map(product => (
                                    <tr key={product.id}>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-4">
                                                {product.logoUrl ? (
                                                    <img src={product.logoUrl} alt={product.name} className="w-10 h-10 rounded-lg object-cover bg-slate-100" />
                                                ) : (
                                                    <div className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center text-slate-400">
                                                        <Tag size={16} />
                                                    </div>
                                                )}
                                                <div>
                                                    <div className="text-sm font-bold text-slate-900">{product.name}</div>
                                                    <div className="flex items-center gap-2 mt-1">
                                                        <span className="text-[10px] font-mono bg-slate-50 px-1.5 py-0.5 rounded border border-slate-100 text-slate-500">/{product.slug}</span>
                                                        {product.affiliateLink && <ShieldCheck size={12} className="text-emerald-500" />}
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="bg-slate-100 text-slate-600 px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-tight">{product.niche || 'General'}</span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="text-xs font-bold text-slate-700">
                                                {product.startingPrice ? `$${product.startingPrice}` : 'Free'}
                                                {product.commissionRate && <span className="text-emerald-600 ml-2">({product.commissionRate})</span>}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-right text-sm font-medium whitespace-nowrap">
                                            <button
                                                onClick={() => {
                                                    const url = `${window.location.origin}/tools/${product.slug}`;
                                                    navigator.clipboard.writeText(url);
                                                    alert('Link Copied!');
                                                }}
                                                className="text-slate-400 hover:text-black mr-4 transition-colors"
                                                title="Copy Live Link"
                                            >
                                                <Copy size={18} />
                                            </button>
                                            <button
                                                onClick={() => { setEditingProduct(product); setView('edit'); }}
                                                className="text-slate-400 hover:text-blue-600 mr-4 transition-colors"
                                            >
                                                <Edit size={18} />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(product.id)}
                                                className="text-slate-400 hover:text-red-600 transition-colors"
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                                {filteredProducts.length === 0 && (
                                    <tr>
                                        <td colSpan={4} className="px-6 py-12 text-center text-slate-500 font-bold uppercase text-xs tracking-widest">No products found.</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </>
            )}

            {(view === 'create' || view === 'edit') && (
                <div>
                     <button
                        onClick={() => setView('list')}
                        className="mb-8 flex items-center gap-2 text-slate-500 hover:text-black font-bold uppercase text-xs tracking-widest transition-all"
                    >
                        <ArrowLeft size={16} /> Back to Directory
                    </button>
                    <ProductForm
                        initialData={editingProduct}
                        onComplete={() => { window.location.reload(); }}
                    />
                </div>
            )}
        </div>
    );
}

