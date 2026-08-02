"use client";

import { useState, useEffect } from "react";
import {
  CreditCard,
  Webhook,
  Play,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  Copy,
  Check,
  ExternalLink,
  ShieldCheck,
  UserCheck,
  Layers,
  ArrowRight,
  Code,
  DollarSign,
  UserX,
  FileText,
  Plus,
  Trash2,
  Save
} from "lucide-react";

import {
  seedSampleGrooveSellProducts,
  getGrooveSellProducts,
  createOrUpdateGrooveSellProduct,
  deleteGrooveSellProduct
} from "@/lib/actions/groovesell-product.actions";

interface Transaction {
  _id: string;
  transactionId: string;
  event: string;
  buyerEmail: string;
  buyerName: string;
  productId: string;
  productName: string;
  amount: number;
  currency: string;
  status: "completed" | "refunded" | "cancelled" | "failed";
  rawPayload: any;
  createdAt: string;
}

export default function AdminGrooveSellPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loadingTx, setLoadingTx] = useState<boolean>(true);
  const [copiedUrl, setCopiedUrl] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<"simulator" | "transactions" | "products" | "guide">("simulator");
  const [productsList, setProductsList] = useState<any[]>([]);
  const [seeding, setSeeding] = useState<boolean>(false);

  // New Product Modal State
  const [showProductModal, setShowProductModal] = useState<boolean>(false);
  const [savingProduct, setSavingProduct] = useState<boolean>(false);
  const [pId, setPId] = useState<string>("");
  const [pTitle, setPTitle] = useState<string>("");
  const [pDesc, setPDesc] = useState<string>("");
  const [pType, setPType] = useState<"book" | "app" | "course" | "template" | "membership" | "upsell">("book");
  const [pPrice, setPPrice] = useState<string>("27.00");
  const [pCheckoutUrl, setPCheckoutUrl] = useState<string>("");
  const [pAccessUrl, setPAccessUrl] = useState<string>("");
  const [pBadge, setPBadge] = useState<string>("Digital Download");

  // Simulator Form State
  const [simEvent, setSimEvent] = useState<string>("PURCHASE");
  const [simEmail, setSimEmail] = useState<string>("john.doe@example.com");
  const [simFirstName, setSimFirstName] = useState<string>("John");
  const [simLastName, setSimLastName] = useState<string>("Doe");
  const [simProductId, setSimProductId] = useState<string>("prod_scale_pro");
  const [simProductName, setSimProductName] = useState<string>("Scale.gg Pro Membership");
  const [simPrice, setSimPrice] = useState<string>("97.00");

  const [simulating, setSimulating] = useState<boolean>(false);
  const [simResponse, setSimResponse] = useState<any>(null);
  const [selectedRawPayload, setSelectedRawPayload] = useState<any>(null);

  const [mounted, setMounted] = useState(false);
  const [webhookUrl, setWebhookUrl] = useState<string>("https://yourdomain.com/api/groovesell-webhook");

  useEffect(() => {
    setMounted(true);
    if (typeof window !== "undefined") {
      setWebhookUrl(`${window.location.origin}/api/groovesell-webhook`);
    }
  }, []);

  const fetchTransactions = async () => {
    setLoadingTx(true);
    try {
      const res = await fetch("/api/admin/groovesell/transactions");
      const data = await res.json();
      if (data.transactions) {
        setTransactions(data.transactions);
      }
    } catch (err) {
      console.error("Failed to fetch transactions:", err);
    } finally {
      setLoadingTx(false);
    }
  };

  const fetchProducts = async () => {
    const res = await getGrooveSellProducts();
    if (res && res.success) {
      setProductsList(res.products || []);
    }
  };

  const handleSeedProducts = async () => {
    setSeeding(true);
    try {
      await seedSampleGrooveSellProducts();
      fetchProducts();
    } catch (err) {
      console.error(err);
    } finally {
      setSeeding(false);
    }
  };

  const handleSaveNewProduct = async () => {
    if (!pId.trim() || !pTitle.trim()) {
      alert("Product ID and Title are required");
      return;
    }
    setSavingProduct(true);
    try {
      const res = await createOrUpdateGrooveSellProduct({
        productId: pId.trim(),
        title: pTitle.trim(),
        description: pDesc.trim(),
        productType: pType,
        price: Number(pPrice) || 0,
        grooveSellCheckoutUrl: pCheckoutUrl.trim(),
        accessUrl: pAccessUrl.trim(),
        badgeText: pBadge.trim() || pType,
        isActive: true,
      });

      if (res.success) {
        fetchProducts();
        setShowProductModal(false);
        setPId("");
        setPTitle("");
        setPDesc("");
        setPCheckoutUrl("");
        setPAccessUrl("");
      } else {
        alert("Failed to save product: " + res.error);
      }
    } catch (err: any) {
      alert("Error creating product: " + err.message);
    } finally {
      setSavingProduct(false);
    }
  };

  const handleDeleteProduct = async (prodId: string) => {
    if (!confirm(`Are you sure you want to delete product "${prodId}"?`)) return;
    try {
      await deleteGrooveSellProduct(prodId);
      fetchProducts();
    } catch (err) {
      console.error("Failed to delete product:", err);
    }
  };

  useEffect(() => {
    fetchTransactions();
    fetchProducts();
  }, []);

  const handleCopyWebhookUrl = () => {
    navigator.clipboard.writeText(webhookUrl);
    setCopiedUrl(true);
    setTimeout(() => setCopiedUrl(false), 2000);
  };

  const handleRunSimulator = async () => {
    setSimulating(true);
    setSimResponse(null);
    try {
      const payload = {
        event: simEvent,
        trans_id: `SIM_GS_${Date.now()}`,
        customer_email: simEmail,
        customer_first_name: simFirstName,
        customer_last_name: simLastName,
        product_id: simProductId,
        product_name: simProductName,
        price: simPrice,
        currency: "USD",
        simulated_at: new Date().toISOString(),
      };

      const res = await fetch("/api/groovesell-webhook", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      setSimResponse({ status: res.status, data });
      fetchTransactions();
    } catch (err: any) {
      setSimResponse({ status: 500, data: { error: err.message || "Failed to send simulated request" } });
    } finally {
      setSimulating(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-4 md:p-8 font-sans">
      {/* Top Banner Header */}
      <div className="max-w-7xl mx-auto mb-8">
        <div className="relative overflow-hidden bg-gradient-to-r from-orange-950/60 via-slate-900 to-amber-950/60 border border-orange-500/30 rounded-3xl p-6 md:p-10 shadow-2xl">
          <div className="absolute top-0 right-0 w-96 h-96 bg-orange-500/10 blur-3xl pointer-events-none rounded-full" />

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
            <div>
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-orange-500/10 border border-orange-500/30 text-orange-400 text-xs font-mono font-bold uppercase tracking-widest mb-4">
                <CreditCard size={14} /> Headless Checkout Integration
              </div>
              <h1 className="text-3xl md:text-5xl font-black text-slate-100 uppercase tracking-tight">
                GrooveSell <span className="bg-gradient-to-r from-orange-400 via-amber-400 to-yellow-400 bg-clip-text text-transparent">Payments Hub</span>
              </h1>
              <p className="text-slate-300 text-sm md:text-lg font-medium mt-2 max-w-2xl leading-relaxed">
                Connect GrooveSell as your primary payment checkout. Process instant purchases, subscription rebills, refunds, and cancellations in real-time.
              </p>
            </div>

            {/* Webhook Live URL Banner */}
            <div className="bg-slate-950 border border-slate-800 p-4 rounded-2xl max-w-md space-y-2">
              <span className="text-[11px] font-mono font-bold text-slate-400 flex items-center gap-1.5">
                <Webhook size={13} className="text-orange-400" /> Live Webhook Receiver URL:
              </span>
              <div className="flex items-center gap-2">
                <code suppressHydrationWarning className="bg-slate-900 border border-slate-800 text-amber-400 px-3 py-1.5 rounded-xl font-mono text-xs truncate flex-1">
                  {mounted ? webhookUrl : "https://yourdomain.com/api/groovesell-webhook"}
                </code>
                <button
                  onClick={handleCopyWebhookUrl}
                  className="px-3 py-1.5 bg-slate-900 border border-slate-700 hover:border-orange-500 text-slate-200 hover:text-white rounded-xl text-xs font-mono font-bold transition-all shrink-0 flex items-center gap-1 cursor-pointer"
                >
                  {copiedUrl ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
                  <span>{copiedUrl ? "Copied" : "Copy"}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Grid Workspace */}
      <div className="max-w-7xl mx-auto space-y-6">

        {/* Navigation Tabs */}
        <div className="flex items-center gap-3 bg-slate-900/90 border border-slate-800 p-1.5 rounded-2xl w-fit">
          <button
            onClick={() => setActiveTab("simulator")}
            className={`px-5 py-2.5 rounded-xl text-xs font-mono font-bold uppercase tracking-wider transition-all cursor-pointer flex items-center gap-2 ${
              activeTab === "simulator"
                ? "bg-orange-600 text-white shadow-lg shadow-orange-600/30"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            <Play size={14} /> Webhook Simulator
          </button>
          <button
            onClick={() => setActiveTab("transactions")}
            className={`px-5 py-2.5 rounded-xl text-xs font-mono font-bold uppercase tracking-wider transition-all cursor-pointer flex items-center gap-2 ${
              activeTab === "transactions"
                ? "bg-orange-600 text-white shadow-lg shadow-orange-600/30"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            <Layers size={14} /> Transaction Logs ({transactions.length})
          </button>
          <button
            onClick={() => setActiveTab("products")}
            className={`px-5 py-2.5 rounded-xl text-xs font-mono font-bold uppercase tracking-wider transition-all cursor-pointer flex items-center gap-2 ${
              activeTab === "products"
                ? "bg-orange-600 text-white shadow-lg shadow-orange-600/30"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            <CreditCard size={14} /> Digital Offers ({productsList.length})
          </button>
          <button
            onClick={() => setActiveTab("guide")}
            className={`px-5 py-2.5 rounded-xl text-xs font-mono font-bold uppercase tracking-wider transition-all cursor-pointer flex items-center gap-2 ${
              activeTab === "guide"
                ? "bg-orange-600 text-white shadow-lg shadow-orange-600/30"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            <FileText size={14} /> Hostinger Action Plan
          </button>
        </div>

        {/* TAB 1: WEBHOOK SIMULATOR */}
        {activeTab === "simulator" && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Form Controls */}
            <div className="lg:col-span-7 bg-slate-900/90 border border-slate-800 rounded-3xl p-6 md:p-8 shadow-xl space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-slate-800">
                <h2 className="text-xl font-black text-slate-100 uppercase tracking-tight flex items-center gap-2">
                  <Webhook className="text-orange-400" size={20} /> Simulate GrooveSell Event
                </h2>
                <span className="text-xs font-mono text-slate-400 bg-slate-950 border border-slate-800 px-3 py-1 rounded-xl">
                  Local & Hostinger Tester
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5 sm:col-span-2">
                  <label className="text-xs font-mono text-slate-400 font-bold uppercase">Event Type</label>
                  <select
                    value={simEvent}
                    onChange={(e) => setSimEvent(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-slate-100 font-mono focus:border-orange-500 focus:outline-none"
                  >
                    <option value="PURCHASE">PURCHASE / Completed Transaction (Grant Access)</option>
                    <option value="REFUND">REFUND / Customer Refund (Revoke Access)</option>
                    <option value="CANCEL">CANCEL / Subscription Cancelled (Downgrade Access)</option>
                  </select>
                </div>

                <div className="space-y-1.5 sm:col-span-2">
                  <label className="text-xs font-mono text-slate-400 font-bold uppercase">Customer Email</label>
                  <input
                    type="email"
                    value={simEmail}
                    onChange={(e) => setSimEmail(e.target.value)}
                    placeholder="customer@example.com"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-slate-100 font-mono focus:border-orange-500 focus:outline-none"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-mono text-slate-400 font-bold uppercase">First Name</label>
                  <input
                    type="text"
                    value={simFirstName}
                    onChange={(e) => setSimFirstName(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-slate-100 font-mono focus:border-orange-500 focus:outline-none"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-mono text-slate-400 font-bold uppercase">Last Name</label>
                  <input
                    type="text"
                    value={simLastName}
                    onChange={(e) => setSimLastName(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-slate-100 font-mono focus:border-orange-500 focus:outline-none"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-mono text-slate-400 font-bold uppercase">Product ID</label>
                  <input
                    type="text"
                    value={simProductId}
                    onChange={(e) => setSimProductId(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-slate-100 font-mono focus:border-orange-500 focus:outline-none"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-mono text-slate-400 font-bold uppercase">Amount ($ USD)</label>
                  <input
                    type="text"
                    value={simPrice}
                    onChange={(e) => setSimPrice(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-slate-100 font-mono focus:border-orange-500 focus:outline-none"
                  />
                </div>

                <div className="space-y-1.5 sm:col-span-2">
                  <label className="text-xs font-mono text-slate-400 font-bold uppercase">Product Name</label>
                  <input
                    type="text"
                    value={simProductName}
                    onChange={(e) => setSimProductName(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-slate-100 font-mono focus:border-orange-500 focus:outline-none"
                  />
                </div>
              </div>

              <button
                onClick={handleRunSimulator}
                disabled={simulating}
                className="w-full py-3.5 bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-400 hover:to-amber-500 text-slate-950 font-black rounded-xl text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 shadow-lg shadow-orange-500/20 cursor-pointer disabled:opacity-50"
              >
                {simulating ? (
                  <>
                    <RefreshCw size={16} className="animate-spin" /> Transmitting Webhook...
                  </>
                ) : (
                  <>
                    <Play size={16} className="fill-slate-950" /> Send Simulated GrooveSell Webhook
                  </>
                )}
              </button>
            </div>

            {/* Response Console */}
            <div className="lg:col-span-5 bg-slate-900/90 border border-slate-800 rounded-3xl p-6 md:p-8 shadow-xl flex flex-col justify-between space-y-4">
              <div>
                <h3 className="text-sm font-mono font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2 mb-4">
                  <Code size={16} className="text-orange-400" /> Webhook Response Inspector
                </h3>

                {simResponse ? (
                  <div className="space-y-4">
                    <div className={`p-4 rounded-2xl border flex items-center justify-between text-xs font-mono font-bold ${
                      simResponse.status === 200
                        ? "bg-emerald-950/60 border-emerald-800 text-emerald-300"
                        : "bg-rose-950/60 border-rose-800 text-rose-300"
                    }`}>
                      <span>HTTP Status: {simResponse.status}</span>
                      <span>{simResponse.status === 200 ? "SUCCESS 200 OK" : "ERROR"}</span>
                    </div>

                    <pre className="bg-slate-950 border border-slate-800/80 rounded-2xl p-4 text-xs font-mono text-amber-300/90 overflow-x-auto max-h-96 leading-relaxed">
                      {JSON.stringify(simResponse.data, null, 2)}
                    </pre>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center p-12 border border-dashed border-slate-800 bg-slate-950/40 rounded-2xl text-center space-y-3">
                    <Webhook className="h-10 w-10 text-slate-600 animate-pulse" />
                    <p className="text-xs font-mono text-slate-400">
                      No webhook response yet. Configure parameters and click <strong className="text-orange-400">Send Simulated Webhook</strong>.
                    </p>
                  </div>
                )}
              </div>

              <div className="pt-4 border-t border-slate-800/80 text-[11px] font-mono text-slate-500 flex items-center justify-between">
                <span>Receiver: /api/groovesell-webhook</span>
                <span>MongoDB Auto-Sync</span>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: TRANSACTION LOGS TABLE */}
        {activeTab === "transactions" && (
          <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 md:p-8 shadow-xl space-y-6">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div>
                <h2 className="text-xl font-black text-slate-100 uppercase tracking-tight flex items-center gap-2">
                  <Layers className="text-orange-400" size={20} /> GrooveSell Webhook Logs
                </h2>
                <p className="text-xs font-mono text-slate-400 mt-1">Real-time webhook events received from GrooveSell</p>
              </div>

              <button
                onClick={fetchTransactions}
                className="px-4 py-2 bg-slate-950 border border-slate-800 hover:border-orange-500 text-orange-400 hover:text-white rounded-xl text-xs font-mono font-bold transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <RefreshCw size={14} className={loadingTx ? "animate-spin" : ""} /> Refresh
              </button>
            </div>

            {loadingTx ? (
              <div className="p-12 text-center text-xs font-mono text-slate-400 flex items-center justify-center gap-2">
                <RefreshCw size={16} className="animate-spin text-orange-400" /> Loading transactions...
              </div>
            ) : transactions.length === 0 ? (
              <div className="p-12 text-center text-xs font-mono text-slate-500 bg-slate-950/40 rounded-2xl border border-slate-800/50">
                No GrooveSell transactions logged yet. Use the Webhook Simulator to test events!
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs font-mono">
                  <thead>
                    <tr className="border-b border-slate-800 text-slate-400 uppercase tracking-wider">
                      <th className="pb-3 px-3">Date</th>
                      <th className="pb-3 px-3">Event</th>
                      <th className="pb-3 px-3">Customer Email</th>
                      <th className="pb-3 px-3">Product</th>
                      <th className="pb-3 px-3">Amount</th>
                      <th className="pb-3 px-3">Status</th>
                      <th className="pb-3 px-3 text-right">Payload</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60">
                    {transactions.map((tx) => (
                      <tr key={tx._id} className="hover:bg-slate-950/60 transition-colors">
                        <td className="py-3 px-3 text-slate-400 whitespace-nowrap">
                          {new Date(tx.createdAt).toLocaleDateString()}{" "}
                          <span className="text-[10px] text-slate-500">{new Date(tx.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                        </td>
                        <td className="py-3 px-3">
                          <span className={`px-2 py-0.5 rounded-md font-bold uppercase text-[10px] ${
                            tx.event.includes("PURCHASE") || tx.event.includes("COMPLETED")
                              ? "bg-emerald-950 border border-emerald-800 text-emerald-400"
                              : tx.event.includes("REFUND")
                              ? "bg-rose-950 border border-rose-800 text-rose-400"
                              : "bg-amber-950 border border-amber-800 text-amber-400"
                          }`}>
                            {tx.event}
                          </span>
                        </td>
                        <td className="py-3 px-3 text-slate-100 font-bold">{tx.buyerEmail}</td>
                        <td className="py-3 px-3 text-slate-300">{tx.productName || tx.productId}</td>
                        <td className="py-3 px-3 text-amber-400 font-bold">${tx.amount.toFixed(2)}</td>
                        <td className="py-3 px-3">
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            tx.status === "completed" ? "text-emerald-400 bg-emerald-950/60" : "text-rose-400 bg-rose-950/60"
                          }`}>
                            ● {tx.status}
                          </span>
                        </td>
                        <td className="py-3 px-3 text-right">
                          <button
                            onClick={() => setSelectedRawPayload(tx.rawPayload)}
                            className="px-2.5 py-1 bg-slate-950 border border-slate-800 hover:border-orange-500 text-xs font-mono text-orange-400 rounded-lg transition-all"
                          >
                            JSON
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* TAB 3: DIGITAL OFFERS & PRODUCTS CATALOG */}
        {activeTab === "products" && (
          <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 md:p-8 shadow-xl space-y-6">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div>
                <h2 className="text-xl font-black text-slate-100 uppercase tracking-tight flex items-center gap-2">
                  <CreditCard className="text-orange-400" size={20} /> GrooveSell Digital Products Catalog
                </h2>
                <p className="text-xs font-mono text-slate-400 mt-1">Manage books, software app access, templates, and masterclass offers</p>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => setShowProductModal(true)}
                  className="px-4 py-2 bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-400 hover:to-amber-500 text-slate-950 font-black rounded-xl text-xs font-mono uppercase tracking-wider transition-all flex items-center gap-1.5 shadow-md cursor-pointer"
                >
                  <Plus size={14} /> Create Digital Product
                </button>

                <button
                  onClick={handleSeedProducts}
                  disabled={seeding}
                  className="px-3.5 py-2 bg-slate-950 border border-slate-800 hover:border-orange-500 text-slate-200 hover:text-white font-bold rounded-xl text-xs font-mono uppercase tracking-wider transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                >
                  <RefreshCw size={14} className={seeding ? "animate-spin" : ""} />
                  <span>{seeding ? "Seeding..." : "Seed Samples"}</span>
                </button>
              </div>
            </div>

            {productsList.length === 0 ? (
              <div className="p-12 text-center text-xs font-mono text-slate-500 bg-slate-950/40 rounded-2xl border border-slate-800/50 space-y-3">
                <p>No digital products created yet. Click "+ Create Digital Product" or "Seed Samples" to start!</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {productsList.map((p) => (
                  <div key={p._id} className="bg-slate-950 border border-slate-800 p-5 rounded-2xl space-y-3 relative group">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-mono uppercase text-orange-400 font-bold bg-orange-950/60 border border-orange-800/60 px-2.5 py-0.5 rounded-full">
                        {p.badgeText || p.productType}
                      </span>
                      <div className="flex items-center gap-2">
                        <span className="text-amber-400 font-black text-sm font-mono">${p.price.toFixed(2)}</span>
                        <button
                          onClick={() => handleDeleteProduct(p.productId)}
                          className="text-slate-600 hover:text-rose-400 transition-colors p-1"
                          title="Delete Product"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-bold text-slate-100 text-base">{p.title}</h4>
                      <p className="text-slate-400 text-xs mt-1 line-clamp-2">{p.description}</p>
                    </div>

                    <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px] font-mono text-slate-400">
                      <span>Product ID: <code className="text-amber-300">{p.productId}</code></span>
                      <a href={p.accessUrl || "#"} className="text-orange-400 font-bold hover:underline">Access Link →</a>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 3: HOSTINGER ACTION PLAN GUIDE */}
        {activeTab === "guide" && (
          <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 md:p-8 shadow-xl space-y-6">
            <div className="border-b border-slate-800 pb-4">
              <h2 className="text-xl font-black text-slate-100 uppercase tracking-tight flex items-center gap-2">
                <FileText className="text-orange-400" size={20} /> Scale.gg Action Plan: GrooveSell + Next.js (Hostinger)
              </h2>
              <p className="text-xs font-mono text-slate-400 mt-1">Guide from docs/My-Scale-Plan (1).docx</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs font-mono leading-relaxed text-slate-300">
              <div className="bg-slate-950 border border-slate-800 p-5 rounded-2xl space-y-3">
                <h3 className="font-bold text-orange-400 uppercase text-sm flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-orange-600 text-white flex items-center justify-center text-xs">1</span>
                  Create Webhook Receiver
                </h3>
                <p>Created <code className="text-amber-400">/api/groovesell-webhook</code> API route in Next.js to handle POST payloads, verify tokens, and extract customer email & purchase event.</p>
              </div>

              <div className="bg-slate-950 border border-slate-800 p-5 rounded-2xl space-y-3">
                <h3 className="font-bold text-orange-400 uppercase text-sm flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-orange-600 text-white flex items-center justify-center text-xs">2</span>
                  Set Up Products in GrooveSell
                </h3>
                <p>In Groove.cm / ScalePlus, navigate to GrooveSell ➔ Create Product. Configure pricing (one-time or subscription) and get checkout link.</p>
              </div>

              <div className="bg-slate-950 border border-slate-800 p-5 rounded-2xl space-y-3">
                <h3 className="font-bold text-orange-400 uppercase text-sm flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-orange-600 text-white flex items-center justify-center text-xs">3</span>
                  Connect GrooveSell Webhook URL
                </h3>
                <p>Paste public Hostinger Next.js route (<code className="text-amber-400">{webhookUrl}</code>) into GrooveSell Webhook settings. Enable Purchase, Refund, and Cancellation events.</p>
              </div>

              <div className="bg-slate-950 border border-slate-800 p-5 rounded-2xl space-y-3">
                <h3 className="font-bold text-orange-400 uppercase text-sm flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-orange-600 text-white flex items-center justify-center text-xs">4</span>
                  Automated Access Provisioning
                </h3>
                <p>Upon receiving <code className="text-emerald-400">PURCHASE</code>, Next.js updates MongoDB user role to <code className="text-emerald-400 font-bold">'student'</code> & unlocks paid course/niche access.</p>
              </div>
            </div>
          </div>
        )}

      </div>

      {/* Create Digital Product Modal */}
      {showProductModal && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-xl w-full p-6 md:p-8 space-y-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div>
                <h3 className="text-lg font-black text-slate-100 uppercase tracking-tight flex items-center gap-2">
                  <Plus className="text-orange-400" size={20} /> Create GrooveSell Digital Product
                </h3>
                <p className="text-xs font-mono text-slate-400 mt-0.5">Publish books, software apps, courses, or template offers</p>
              </div>

              <button
                onClick={() => setShowProductModal(false)}
                className="text-slate-400 hover:text-white font-mono text-xs p-1"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-mono text-slate-400 font-bold uppercase">Product ID (Unique)</label>
                  <input
                    type="text"
                    value={pId}
                    onChange={(e) => setPId(e.target.value)}
                    placeholder="e.g. book_my_guide or app_my_tool"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs font-mono text-slate-100 focus:border-orange-500 focus:outline-none"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-mono text-slate-400 font-bold uppercase">Product Type</label>
                  <select
                    value={pType}
                    onChange={(e) => setPType(e.target.value as any)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs font-mono text-slate-100 focus:border-orange-500 focus:outline-none"
                  >
                    <option value="book">book (eBook / PDF Guide)</option>
                    <option value="app">app (Software / Micro-SaaS)</option>
                    <option value="course">course (Video Course / Workshop)</option>
                    <option value="template">template (Swipe File / Worksheets)</option>
                    <option value="membership">membership (Pro Subscription)</option>
                    <option value="upsell">upsell (Funnel Order Bump / Upsell)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-mono text-slate-400 font-bold uppercase">Product Title</label>
                  <input
                    type="text"
                    value={pTitle}
                    onChange={(e) => setPTitle(e.target.value)}
                    placeholder="e.g. Scale.gg Action Plan Playbook"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-100 focus:border-orange-500 focus:outline-none"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-mono text-slate-400 font-bold uppercase">Price ($ USD)</label>
                  <input
                    type="text"
                    value={pPrice}
                    onChange={(e) => setPPrice(e.target.value)}
                    placeholder="27.00"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs font-mono text-slate-100 focus:border-orange-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-mono text-slate-400 font-bold uppercase">Description</label>
                <textarea
                  rows={2}
                  value={pDesc}
                  onChange={(e) => setPDesc(e.target.value)}
                  placeholder="Describe the transformation or assets included..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-slate-100 focus:border-orange-500 focus:outline-none resize-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-mono text-slate-400 font-bold uppercase">GrooveSell Checkout URL</label>
                <input
                  type="text"
                  value={pCheckoutUrl}
                  onChange={(e) => setPCheckoutUrl(e.target.value)}
                  placeholder="https://groove.cm/checkout/your_product_id"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs font-mono text-slate-100 focus:border-orange-500 focus:outline-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-mono text-slate-400 font-bold uppercase">Access / Download Link</label>
                <input
                  type="text"
                  value={pAccessUrl}
                  onChange={(e) => setPAccessUrl(e.target.value)}
                  placeholder="e.g. /tools/plr-dissector or /docs/my-plan.pdf"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs font-mono text-slate-100 focus:border-orange-500 focus:outline-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-mono text-slate-400 font-bold uppercase">Badge Label</label>
                <input
                  type="text"
                  value={pBadge}
                  onChange={(e) => setPBadge(e.target.value)}
                  placeholder="e.g. eBook & Playbook"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs font-mono text-slate-100 focus:border-orange-500 focus:outline-none"
                />
              </div>
            </div>

            <div className="pt-4 border-t border-slate-800 flex items-center justify-end gap-3">
              <button
                onClick={() => setShowProductModal(false)}
                className="px-4 py-2 bg-slate-950 border border-slate-800 text-slate-400 hover:text-white rounded-xl text-xs font-mono font-bold"
              >
                Cancel
              </button>

              <button
                onClick={handleSaveNewProduct}
                disabled={savingProduct}
                className="px-5 py-2 bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-400 hover:to-amber-500 text-slate-950 font-black rounded-xl text-xs font-mono uppercase tracking-wider transition-all flex items-center gap-2 shadow-lg cursor-pointer disabled:opacity-50"
              >
                {savingProduct ? <RefreshCw size={14} className="animate-spin" /> : <Save size={14} />}
                <span>Publish Digital Product</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

