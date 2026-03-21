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
        <div className="bg-zinc-950 p-6 rounded-xl border border-zinc-800 shadow-sm">
            {view === 'list' && (
                <>
                    <div className="flex justify-between items-center mb-6">
                        <div>
                            <h2 className="text-2xl font-black text-white tracking-tight">Tools & Products</h2>
                            <p className="text-xs font-bold text-zinc-400 uppercase tracking-widest mt-1">Directory & Affiliate Management</p>
                        </div>
                        <button
                            onClick={() => { setEditingProduct(undefined); setView('create'); }}
                            className="bg-white text-black hover:bg-zinc-200 px-6 py-2 rounded-lg font-bold flex items-center gap-2 transition-all"
                        >
                            <Plus size={16} /> Add Product
                        </button>
                    </div>

                    <div className="mb-6">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" size={18} />
                            <input
                                type="text"
                                placeholder="Search products or niches..."
                                className="w-full pl-10 pr-4 py-3 border border-zinc-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all bg-zinc-900 text-white placeholder:text-zinc-500"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-zinc-800">
                            <thead className="bg-zinc-900">
                                <tr>
                                    <th className="px-6 py-4 text-left text-xs font-black text-zinc-400 uppercase tracking-widest">Product</th>
                                    <th className="px-6 py-4 text-left text-xs font-black text-zinc-400 uppercase tracking-widest">Niche / Category</th>
                                    <th className="px-6 py-4 text-left text-xs font-black text-zinc-400 uppercase tracking-widest">Price / Comm</th>
                                    <th className="px-6 py-4 text-right text-xs font-black text-zinc-400 uppercase tracking-widest">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="bg-zinc-950 divide-y divide-zinc-800">
                                {filteredProducts.map(product => (
                                    <tr key={product.id}>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-4">
                                                {product.logoUrl ? (
                                                    <img src={product.logoUrl} alt={product.name} className="w-10 h-10 rounded-lg object-cover bg-zinc-800" />
                                                ) : (
                                                    <div className="w-10 h-10 bg-zinc-800 rounded-lg flex items-center justify-center text-zinc-400">
                                                        <Tag size={16} />
                                                    </div>
                                                )}
                                                <div>
                                                    <div className="text-sm font-bold text-white">{product.name}</div>
                                                    <div className="flex items-center gap-2 mt-1">
                                                        <span className="text-[10px] font-mono bg-zinc-800 px-1.5 py-0.5 rounded border border-zinc-700 text-zinc-400">/{product.slug}</span>
                                                        {product.affiliateLink && <ShieldCheck size={12} className="text-emerald-500" />}
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="bg-zinc-800 text-zinc-300 px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-tight">{product.niche || 'General'}</span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="text-xs font-bold text-zinc-300">
                                                {product.startingPrice ? `$${product.startingPrice}` : 'Free'}
                                                {product.commissionRate && <span className="text-emerald-600 ml-2">({product.commissionRate})</span>}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-right text-sm font-medium whitespace-nowrap">
                                            <a
                                                href={`/tools/${product.slug}`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-zinc-500 hover:text-emerald-400 mr-4 transition-colors inline-block"
                                                title="View Live"
                                            >
                                                <ExternalLink size={18} />
                                            </a>
                                            <button
                                                onClick={() => {
                                                    const url = `${window.location.origin}/tools/${product.slug}`;
                                                    navigator.clipboard.writeText(url);
                                                    alert('Link Copied: ' + url);
                                                }}
                                                className="text-zinc-500 hover:text-white mr-4 transition-colors"
                                                title="Copy Live Link"
                                            >
                                                <Copy size={18} />
                                            </button>
                                            <button
                                                onClick={() => { setEditingProduct(product); setView('edit'); }}
                                                className="text-zinc-500 hover:text-blue-400 mr-4 transition-colors"
                                            >
                                                <Edit size={18} />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(product.id)}
                                                className="text-zinc-500 hover:text-pink-500 transition-colors"
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                                {filteredProducts.length === 0 && (
                                    <tr>
                                        <td colSpan={4} className="px-6 py-12 text-center text-zinc-500 font-bold uppercase text-xs tracking-widest">No products found.</td>
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
                        className="mb-8 flex items-center gap-2 text-zinc-500 hover:text-white font-bold uppercase text-xs tracking-widest transition-all"
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

