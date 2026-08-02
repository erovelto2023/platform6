"use client";

import { useState, useEffect } from "react";
import {
  BookOpen,
  ShoppingBag,
  Download,
  ExternalLink,
  Sparkles,
  RefreshCw,
  Tag,
  CheckCircle2,
  Lock,
  Layers,
  FileText,
  Laptop,
  GraduationCap,
  FileCheck
} from "lucide-react";
import { getUnlockedProductsForUser, getGrooveSellProducts } from "@/lib/actions/groovesell-product.actions";

interface Product {
  _id: string;
  productId: string;
  title: string;
  description: string;
  productType: "book" | "app" | "course" | "template" | "membership" | "upsell";
  price: number;
  grooveSellCheckoutUrl: string;
  accessUrl: string;
  badgeText: string;
}

export default function StudentProductsPage() {
  const [unlockedProducts, setUnlockedProducts] = useState<Product[]>([]);
  const [storeProducts, setStoreProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [activeTab, setActiveTab] = useState<"unlocked" | "store">("unlocked");

  const fetchData = async () => {
    setLoading(true);
    try {
      const [unlockedRes, storeRes] = await Promise.all([
        getUnlockedProductsForUser(),
        getGrooveSellProducts(),
      ]);

      if (unlockedRes && unlockedRes.success) {
        setUnlockedProducts(unlockedRes.unlockedProducts || []);
      }
      if (storeRes && storeRes.success) {
        setStoreProducts(storeRes.products || []);
      }
    } catch (err) {
      console.error("Failed to load products:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const getProductTypeIcon = (type: string) => {
    switch (type) {
      case "book":
        return <FileText className="text-amber-400" size={20} />;
      case "app":
        return <Laptop className="text-cyan-400" size={20} />;
      case "course":
        return <GraduationCap className="text-violet-400" size={20} />;
      case "template":
        return <Layers className="text-emerald-400" size={20} />;
      default:
        return <Tag className="text-orange-400" size={20} />;
    }
  };

  const isProductUnlocked = (prodId: string) => {
    return unlockedProducts.some((p) => p.productId === prodId);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-4 md:p-8 font-sans">
      {/* Top Banner Header */}
      <div className="max-w-7xl mx-auto mb-8">
        <div className="relative overflow-hidden bg-gradient-to-r from-amber-950/60 via-slate-900 to-cyan-950/60 border border-amber-500/30 rounded-3xl p-6 md:p-10 shadow-2xl">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
            <div>
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-mono font-bold uppercase tracking-widest mb-4">
                <ShoppingBag size={14} /> GrooveSell Digital Vault & Store
              </div>
              <h1 className="text-3xl md:text-5xl font-black text-slate-100 uppercase tracking-tight">
                Digital <span className="bg-gradient-to-r from-amber-400 via-yellow-400 to-cyan-400 bg-clip-text text-transparent">Products</span>
              </h1>
              <p className="text-slate-300 text-sm md:text-lg font-medium mt-2 max-w-2xl leading-relaxed">
                Access your purchased digital books, software app access, templates, and masterclasses purchased via GrooveSell.
              </p>
            </div>

            <button
              onClick={fetchData}
              className="px-4 py-2.5 bg-slate-900 border border-slate-700 hover:border-amber-500 text-amber-400 hover:text-white rounded-xl text-xs font-mono font-bold uppercase tracking-wider transition-all flex items-center gap-2 shadow-lg cursor-pointer"
            >
              <RefreshCw size={14} className={loading ? "animate-spin" : ""} /> Refresh Library
            </button>
          </div>
        </div>
      </div>

      {/* Main Grid Workspace */}
      <div className="max-w-7xl mx-auto space-y-6">

        {/* Navigation Tabs */}
        <div className="flex items-center gap-3 bg-slate-900/90 border border-slate-800 p-1.5 rounded-2xl w-fit">
          <button
            onClick={() => setActiveTab("unlocked")}
            className={`px-5 py-2.5 rounded-xl text-xs font-mono font-bold uppercase tracking-wider transition-all cursor-pointer flex items-center gap-2 ${
              activeTab === "unlocked"
                ? "bg-amber-500 text-slate-950 shadow-lg shadow-amber-500/20 font-black"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            <CheckCircle2 size={14} /> My Purchased Products ({unlockedProducts.length})
          </button>
          <button
            onClick={() => setActiveTab("store")}
            className={`px-5 py-2.5 rounded-xl text-xs font-mono font-bold uppercase tracking-wider transition-all cursor-pointer flex items-center gap-2 ${
              activeTab === "store"
                ? "bg-amber-500 text-slate-950 shadow-lg shadow-amber-500/20 font-black"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            <ShoppingBag size={14} /> GrooveSell Digital Store ({storeProducts.length})
          </button>
        </div>

        {/* TAB 1: UNLOCKED DIGITAL PRODUCTS */}
        {activeTab === "unlocked" && (
          <div className="space-y-6">
            {loading ? (
              <div className="p-16 text-center text-xs font-mono text-slate-400 flex items-center justify-center gap-2">
                <RefreshCw size={16} className="animate-spin text-amber-400" /> Loading your digital products...
              </div>
            ) : unlockedProducts.length === 0 ? (
              <div className="p-16 text-center border border-dashed border-slate-800 bg-slate-900/50 rounded-3xl space-y-4">
                <ShoppingBag className="mx-auto h-12 w-12 text-slate-600 animate-pulse" />
                <h3 className="text-lg font-bold text-slate-300 uppercase">No Purchased Products Found Yet</h3>
                <p className="text-slate-400 text-xs font-mono max-w-md mx-auto">
                  When you purchase a book, app upgrade, or template on GrooveSell, your digital assets will appear right here automatically!
                </p>
                <button
                  onClick={() => setActiveTab("store")}
                  className="px-5 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl text-xs font-mono uppercase tracking-wider transition-all shadow-lg"
                >
                  Browse GrooveSell Digital Store →
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {unlockedProducts.map((prod) => (
                  <div
                    key={prod._id}
                    className="bg-slate-900 border border-slate-800 hover:border-amber-500/80 p-6 rounded-3xl shadow-xl transition-all duration-300 flex flex-col justify-between space-y-4 group"
                  >
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="w-10 h-10 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-center">
                          {getProductTypeIcon(prod.productType)}
                        </div>

                        <span className="bg-emerald-950 border border-emerald-800 text-emerald-400 px-3 py-1 rounded-full text-[10px] font-mono font-bold uppercase flex items-center gap-1">
                          <CheckCircle2 size={12} /> Unlocked
                        </span>
                      </div>

                      <div>
                        <span className="text-[10px] font-mono uppercase text-amber-400 font-bold tracking-wider">
                          {prod.badgeText || prod.productType}
                        </span>
                        <h3 className="text-lg font-bold text-slate-100 leading-tight mt-0.5 group-hover:text-amber-400 transition-colors">
                          {prod.title}
                        </h3>
                        <p className="text-slate-400 text-xs mt-2 line-clamp-3 leading-relaxed">
                          {prod.description}
                        </p>
                      </div>
                    </div>

                    <div className="pt-4 border-t border-slate-800/80 flex items-center justify-between">
                      <span className="text-xs font-mono text-slate-500">GrooveSell Item</span>
                      {prod.accessUrl ? (
                        <a
                          href={prod.accessUrl}
                          className="px-4 py-2 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 text-slate-950 font-bold rounded-xl text-xs font-mono uppercase tracking-wider transition-all flex items-center gap-1.5 shadow-md"
                        >
                          <ExternalLink size={13} /> Access Now
                        </a>
                      ) : (
                        <span className="text-xs font-mono text-emerald-400 font-bold">Access Granted</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 2: GROOVESELL STORE CATALOG */}
        {activeTab === "store" && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {storeProducts.map((prod) => {
                const unlocked = isProductUnlocked(prod.productId);

                return (
                  <div
                    key={prod._id}
                    className="bg-slate-900 border border-slate-800 hover:border-cyan-500/80 p-6 rounded-3xl shadow-xl transition-all duration-300 flex flex-col justify-between space-y-4 group"
                  >
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="w-10 h-10 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-center">
                          {getProductTypeIcon(prod.productType)}
                        </div>

                        <span className="text-amber-400 font-black text-lg font-mono">
                          ${prod.price.toFixed(2)}
                        </span>
                      </div>

                      <div>
                        <span className="text-[10px] font-mono uppercase text-slate-400 font-bold tracking-wider">
                          {prod.badgeText || prod.productType}
                        </span>
                        <h3 className="text-lg font-bold text-slate-100 leading-tight mt-0.5 group-hover:text-cyan-400 transition-colors">
                          {prod.title}
                        </h3>
                        <p className="text-slate-400 text-xs mt-2 line-clamp-3 leading-relaxed">
                          {prod.description}
                        </p>
                      </div>
                    </div>

                    <div className="pt-4 border-t border-slate-800/80 flex items-center justify-between">
                      <span className="text-[11px] font-mono text-slate-500 uppercase">{prod.productType}</span>

                      {unlocked ? (
                        <a
                          href={prod.accessUrl || "/account"}
                          className="px-4 py-2 bg-slate-950 border border-emerald-800 text-emerald-400 font-bold rounded-xl text-xs font-mono uppercase tracking-wider flex items-center gap-1.5"
                        >
                          <CheckCircle2 size={13} /> Unlocked
                        </a>
                      ) : (
                        <a
                          href={prod.grooveSellCheckoutUrl || "#"}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-4 py-2 bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-400 hover:to-amber-500 text-slate-950 font-bold rounded-xl text-xs font-mono uppercase tracking-wider transition-all flex items-center gap-1.5 shadow-md"
                        >
                          <ExternalLink size={13} /> Buy on GrooveSell
                        </a>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
