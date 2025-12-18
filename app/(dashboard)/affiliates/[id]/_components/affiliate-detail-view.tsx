"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { format } from "date-fns";
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Cell
} from "recharts";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger
} from "@/components/ui/dialog";
import {
    ArrowLeft,
    ExternalLink,
    Save,
    Trash2,
    Globe,
    DollarSign,
    Clock,
    Plus,
    Copy,
    Check,
    Link as LinkIcon,
    Calendar
} from "lucide-react";

import {
    updateUserAffiliateCompany,
    removeUserAffiliateCompany,
    addAffiliateSale,
    deleteAffiliateSale,
    addAffiliateLink,
    deleteAffiliateLink,
    saveAffiliateProduct,
    updateUserAffiliateProduct
} from "@/lib/actions/affiliate-user.actions";
import { toast } from "sonner";

interface AffiliateCompany {
    _id: string;
    name: string;
    slug: string;
    logo?: string;
    website?: string;
    industry?: string;
    affiliateNetwork?: string;
    description?: string;
    summary?: string;
    commissionRate?: string;
    cookieDuration?: number;
    signupUrl?: string;
}

interface UserAffiliateCompany {
    _id: string;
    status: string;
    affiliateId?: string;
    personalNotes?: string;
    priority: string;
    totalEarnings: number;
    companyId: string;
    userId: string;
}

interface AffiliateProduct {
    _id: string;
    name: string;
    description?: string;
    commissionRate?: string;
    price?: string;
    promotionalAssets?: string[];
}

interface UserAffiliateProduct {
    _id: string;
    productId: AffiliateProduct;
    status: string;
    affiliateLink?: string;
    earnings: number;
    clicks?: number;
    conversions?: number;
}

interface AffiliateDetailViewProps {
    company: AffiliateCompany;
    userAffiliate: UserAffiliateCompany;
    initialSales?: any[];
    initialLinks?: any[];
    companyProducts?: AffiliateProduct[];
    userProducts?: UserAffiliateProduct[];
}

export default function AffiliateDetailView({
    company,
    userAffiliate,
    initialSales = [],
    initialLinks = [],
    companyProducts = [],
    userProducts = []
}: AffiliateDetailViewProps) {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);

    // Main Form Data
    const [formData, setFormData] = useState({
        status: userAffiliate.status || "interested",
        affiliateId: userAffiliate.affiliateId || "",
        personalNotes: userAffiliate.personalNotes || "",
        priority: userAffiliate.priority || "medium",
        totalEarnings: userAffiliate.totalEarnings || 0,
    });

    // Sales & Links State
    const [sales, setSales] = useState(initialSales);
    const [links, setLinks] = useState(initialLinks);
    const [myProducts, setMyProducts] = useState(userProducts);

    // Modals
    const [isSaleModalOpen, setIsSaleModalOpen] = useState(false);
    const [isLinkModalOpen, setIsLinkModalOpen] = useState(false);

    // New Sale Form
    const [newSale, setNewSale] = useState({
        dateOfSale: format(new Date(), "yyyy-MM-dd"),
        dateOfPayment: "",
        amount: "",
        notes: ""
    });

    // New Link Form
    const [newLink, setNewLink] = useState({
        label: "",
        url: "",
        type: "link",
        keywords: "",
        notes: ""
    });

    // --- Actions ---

    const handleSave = async () => {
        setIsLoading(true);
        try {
            await updateUserAffiliateCompany(userAffiliate._id, formData);
            toast.success("Saved successfully");
            router.refresh();
        } catch (error) {
            toast.error("Failed to save changes");
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleRemove = async () => {
        if (!confirm("Are you sure you want to remove this partner from your list?")) return;

        setIsLoading(true);
        try {
            await removeUserAffiliateCompany(userAffiliate._id);
            toast.success("Partner removed");
            router.push("/affiliates");
        } catch (error) {
            toast.error("Failed to remove partner");
            setIsLoading(false);
        }
    };

    const handleAddProduct = async (productId: string) => {
        setIsLoading(true);
        try {
            const newProduct = await saveAffiliateProduct(userAffiliate.userId, productId, company._id);
            // Optimistically add to list (though we need the populated product details, so refresh is safer)
            toast.success("Product added to your list");
            router.refresh();
        } catch (error) {
            toast.error("Failed to add product");
        } finally {
            setIsLoading(false);
        }
    };

    const handleUpdateProductStatus = async (id: string, status: string) => {
        try {
            await updateUserAffiliateProduct(id, { status });
            setMyProducts(myProducts.map(p => p._id === id ? { ...p, status } : p));
            toast.success("Status updated");
        } catch (error) {
            toast.error("Failed to update status");
        }
    };

    const handleAddSale = async () => {
        if (!newSale.amount || !newSale.dateOfSale) return toast.error("Amount and Date are required");

        setIsLoading(true);
        try {
            const sale = await addAffiliateSale(userAffiliate._id, {
                ...newSale,
                amount: parseFloat(newSale.amount)
            });
            setSales([sale, ...sales]);
            setFormData(prev => ({ ...prev, totalEarnings: prev.totalEarnings + sale.amount }));
            setIsSaleModalOpen(false);
            setNewSale({ dateOfSale: format(new Date(), "yyyy-MM-dd"), dateOfPayment: "", amount: "", notes: "" });
            toast.success("Sale recorded!");
            router.refresh();
        } catch (error) {
            toast.error("Failed to add sale");
        } finally {
            setIsLoading(false);
        }
    };

    const handleDeleteSale = async (id: string, amount: number) => {
        if (!confirm("Delete this sale record?")) return;
        try {
            await deleteAffiliateSale(id);
            setSales(sales.filter(s => s._id !== id));
            setFormData(prev => ({ ...prev, totalEarnings: prev.totalEarnings - amount }));
            toast.success("Sale deleted");
            router.refresh();
        } catch (error) {
            toast.error("Failed to delete sale");
        }
    };

    const handleAddLink = async () => {
        if (!newLink.label || !newLink.url) return toast.error("Label and URL are required");

        setIsLoading(true);
        try {
            const link = await addAffiliateLink(userAffiliate._id, {
                ...newLink,
                keywords: newLink.keywords.split(',').map(k => k.trim()).filter(k => k)
            });
            setLinks([link, ...links]);
            setIsLinkModalOpen(false);
            setNewLink({ label: "", url: "", type: "link", keywords: "", notes: "" });
            toast.success("Resource added!");
            router.refresh();
        } catch (error) {
            toast.error("Failed to add resource");
        } finally {
            setIsLoading(false);
        }
    };

    const handleDeleteLink = async (id: string) => {
        if (!confirm("Delete this resource?")) return;
        try {
            await deleteAffiliateLink(id);
            setLinks(links.filter(l => l._id !== id));
            toast.success("Resource deleted");
            router.refresh();
        } catch (error) {
            toast.error("Failed to delete resource");
        }
    };

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text);
        toast.success("Copied to clipboard");
    };

    // --- Chart Data Preparation ---
    const chartData = sales.slice().reverse().map(sale => ({
        date: format(new Date(sale.dateOfSale), "MMM dd"),
        amount: sale.amount
    }));

    return (
        <div className="max-w-5xl mx-auto p-6">
            <Button variant="ghost" className="mb-6 pl-0 hover:pl-2 transition-all" onClick={() => router.back()}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Partners
            </Button>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column: Company Info */}
                <div className="lg:col-span-2 space-y-6">
                    <Card>
                        <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
                            <div className="flex items-center gap-4">
                                <div className="h-16 w-16 rounded-xl bg-slate-100 flex items-center justify-center text-2xl font-bold text-slate-500 overflow-hidden">
                                    {company.logo ? (
                                        <img src={company.logo} alt={company.name} className="h-full w-full object-contain" />
                                    ) : (
                                        company.name[0]
                                    )}
                                </div>
                                <div>
                                    <CardTitle className="text-2xl">{company.name}</CardTitle>
                                    <div className="flex items-center gap-2 mt-2">
                                        <Badge variant="outline">{company.industry || "General"}</Badge>
                                        {company.affiliateNetwork && (
                                            <Badge variant="secondary">{company.affiliateNetwork}</Badge>
                                        )}
                                    </div>
                                </div>
                            </div>
                            <Button variant="outline" size="icon" asChild>
                                <a href={company.website} target="_blank" rel="noopener noreferrer">
                                    <Globe className="h-4 w-4" />
                                </a>
                            </Button>
                        </CardHeader>
                        <CardContent className="mt-4 space-y-6">
                            <div>
                                <h3 className="font-semibold mb-2">About</h3>
                                <p className="text-slate-600 leading-relaxed">
                                    {company.description || company.summary || "No description available."}
                                </p>
                            </div>

                            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                <div className="p-4 bg-slate-50 rounded-lg">
                                    <div className="flex items-center gap-2 text-slate-500 mb-1">
                                        <DollarSign className="h-4 w-4" />
                                        <span className="text-xs font-medium uppercase">Commission</span>
                                    </div>
                                    <p className="font-semibold">{company.commissionRate || "N/A"}</p>
                                </div>
                                <div className="p-4 bg-slate-50 rounded-lg">
                                    <div className="flex items-center gap-2 text-slate-500 mb-1">
                                        <Clock className="h-4 w-4" />
                                        <span className="text-xs font-medium uppercase">Cookie Duration</span>
                                    </div>
                                    <p className="font-semibold">{company.cookieDuration ? `${company.cookieDuration} days` : "N/A"}</p>
                                </div>
                                <div className="p-4 bg-slate-50 rounded-lg">
                                    <div className="flex items-center gap-2 text-slate-500 mb-1">
                                        <ExternalLink className="h-4 w-4" />
                                        <span className="text-xs font-medium uppercase">Network</span>
                                    </div>
                                    <p className="font-semibold">{company.affiliateNetwork || "Direct"}</p>
                                </div>
                            </div>

                            {company.signupUrl && (
                                <Button className="w-full" asChild>
                                    <a href={company.signupUrl} target="_blank" rel="noopener noreferrer">
                                        Apply to Program
                                        <ExternalLink className="h-4 w-4 ml-2" />
                                    </a>
                                </Button>
                            )}
                        </CardContent>
                    </Card>

                    <Tabs defaultValue="products">
                        <TabsList>
                            <TabsTrigger value="products">Products</TabsTrigger>
                            <TabsTrigger value="notes">My Notes</TabsTrigger>
                            <TabsTrigger value="resources">Resources</TabsTrigger>
                            <TabsTrigger value="history">History & Stats</TabsTrigger>
                        </TabsList>

                        <TabsContent value="products" className="mt-4 space-y-6">
                            {/* My Active Products */}
                            <Card>
                                <CardHeader>
                                    <CardTitle>My Promoted Products</CardTitle>
                                    <CardDescription>Products you are actively promoting.</CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    {myProducts.length === 0 ? (
                                        <p className="text-sm text-slate-500">You haven't selected any specific products to promote yet.</p>
                                    ) : (
                                        myProducts.map((up) => (
                                            <div key={up._id} className="flex items-center justify-between p-4 border rounded-lg bg-slate-50">
                                                <div>
                                                    <h4 className="font-semibold">{up.productId.name}</h4>
                                                    <p className="text-xs text-slate-500 mb-2">
                                                        Commission: {up.productId.commissionRate || "Standard"}
                                                    </p>
                                                    <div className="flex gap-3 text-xs text-slate-600">
                                                        <span>Earnings: <b>${up.earnings || 0}</b></span>
                                                        <span>Clicks: <b>{up.clicks || 0}</b></span>
                                                        <span>Conv: <b>{up.conversions || 0}</b></span>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <Select
                                                        value={up.status}
                                                        onValueChange={(val) => handleUpdateProductStatus(up._id, val)}
                                                    >
                                                        <SelectTrigger className="w-[120px] h-8 text-xs">
                                                            <SelectValue />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            <SelectItem value="planned">Planned</SelectItem>
                                                            <SelectItem value="active">Active</SelectItem>
                                                            <SelectItem value="paused">Paused</SelectItem>
                                                        </SelectContent>
                                                    </Select>
                                                </div>
                                            </div>
                                        ))
                                    )}
                                </CardContent>
                            </Card>

                            {/* Available Products */}
                            {companyProducts.length > 0 && (
                                <Card>
                                    <CardHeader>
                                        <CardTitle>Available Products</CardTitle>
                                        <CardDescription>Other products offered by {company.name}.</CardDescription>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                        {companyProducts.filter(cp => !myProducts.some(mp => mp.productId._id === cp._id)).map((product) => (
                                            <div key={product._id} className="flex items-center justify-between p-4 border rounded-lg">
                                                <div>
                                                    <h4 className="font-semibold">{product.name}</h4>
                                                    <p className="text-sm text-slate-600">{product.description}</p>
                                                    <div className="flex gap-2 mt-1">
                                                        {product.commissionRate && (
                                                            <Badge variant="secondary" className="text-[10px]">
                                                                {product.commissionRate} Comm.
                                                            </Badge>
                                                        )}
                                                        {product.price && (
                                                            <Badge variant="outline" className="text-[10px]">
                                                                {product.price}
                                                            </Badge>
                                                        )}
                                                    </div>
                                                </div>
                                                <Button size="sm" variant="outline" onClick={() => handleAddProduct(product._id)} disabled={isLoading}>
                                                    <Plus className="h-4 w-4 mr-2" />
                                                    Promote
                                                </Button>
                                            </div>
                                        ))}
                                        {companyProducts.filter(cp => !myProducts.some(mp => mp.productId._id === cp._id)).length === 0 && (
                                            <p className="text-sm text-slate-500">You have added all available products.</p>
                                        )}
                                    </CardContent>
                                </Card>
                            )}
                        </TabsContent>

                        <TabsContent value="notes" className="mt-4">
                            <Card>
                                <CardContent className="p-6">
                                    <Label htmlFor="notes" className="mb-2 block">Personal Notes & Strategy</Label>
                                    <Textarea
                                        id="notes"
                                        placeholder="Write your strategy, login details, or reminders here..."
                                        className="min-h-[200px]"
                                        value={formData.personalNotes}
                                        onChange={(e) => setFormData({ ...formData, personalNotes: e.target.value })}
                                    />
                                    <div className="flex justify-end mt-4">
                                        <Button onClick={handleSave} disabled={isLoading}>
                                            <Save className="h-4 w-4 mr-2" />
                                            Save Notes
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        </TabsContent>
                        <TabsContent value="resources" className="mt-4">
                            <Card>
                                <CardHeader className="flex flex-row items-center justify-between pb-2">
                                    <CardTitle className="text-lg">Affiliate Links & Assets</CardTitle>
                                    <Dialog open={isLinkModalOpen} onOpenChange={setIsLinkModalOpen}>
                                        <DialogTrigger asChild>
                                            <Button size="sm">
                                                <Plus className="h-4 w-4 mr-2" />
                                                Add Resource
                                            </Button>
                                        </DialogTrigger>
                                        <DialogContent>
                                            <DialogHeader>
                                                <DialogTitle>Add Affiliate Resource</DialogTitle>
                                                <DialogDescription>
                                                    Save banners, special deals, or your unique tracking links.
                                                </DialogDescription>
                                            </DialogHeader>
                                            <div className="space-y-4 py-4">
                                                <div className="space-y-2">
                                                    <Label>Label</Label>
                                                    <Input
                                                        placeholder="e.g. Black Friday Banner"
                                                        value={newLink.label}
                                                        onChange={(e) => setNewLink({ ...newLink, label: e.target.value })}
                                                    />
                                                </div>
                                                <div className="space-y-2">
                                                    <Label>{newLink.type === 'banner' ? 'Banner Code' : 'URL / Code'}</Label>
                                                    {newLink.type === 'banner' ? (
                                                        <Textarea
                                                            placeholder="<a href=...><img src=...></a>"
                                                            className="font-mono text-xs min-h-[100px]"
                                                            value={newLink.url}
                                                            onChange={(e) => setNewLink({ ...newLink, url: e.target.value })}
                                                        />
                                                    ) : (
                                                        <Input
                                                            placeholder="https://..."
                                                            value={newLink.url}
                                                            onChange={(e) => setNewLink({ ...newLink, url: e.target.value })}
                                                        />
                                                    )}
                                                </div>

                                                {newLink.type === 'banner' && newLink.url && (
                                                    <div className="space-y-2">
                                                        <Label>Preview</Label>
                                                        <div className="p-4 border rounded-md bg-slate-50 flex justify-center overflow-hidden">
                                                            <div dangerouslySetInnerHTML={{ __html: newLink.url }} />
                                                        </div>
                                                    </div>
                                                )}

                                                <div className="space-y-2">
                                                    <Label>Type</Label>
                                                    <Select
                                                        value={newLink.type}
                                                        onValueChange={(val) => setNewLink({ ...newLink, type: val })}
                                                    >
                                                        <SelectTrigger>
                                                            <SelectValue />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            <SelectItem value="link">Link</SelectItem>
                                                            <SelectItem value="banner">Banner</SelectItem>
                                                            <SelectItem value="coupon">Coupon Code</SelectItem>
                                                            <SelectItem value="other">Other</SelectItem>
                                                        </SelectContent>
                                                    </Select>
                                                </div>
                                                <div className="space-y-2">
                                                    <Label>Keywords</Label>
                                                    <Input
                                                        placeholder="e.g. amazon, tech, summer sale (comma separated)"
                                                        value={newLink.keywords}
                                                        onChange={(e) => setNewLink({ ...newLink, keywords: e.target.value })}
                                                    />
                                                </div>
                                            </div>
                                            <DialogFooter>
                                                <Button onClick={handleAddLink} disabled={isLoading}>Save Resource</Button>
                                            </DialogFooter>
                                        </DialogContent >
                                    </Dialog >
                                </CardHeader >
                                <CardContent className="space-y-4">
                                    {links.length === 0 ? (
                                        <div className="text-center py-8 text-slate-500">
                                            No resources added yet. Keep your links organized here.
                                        </div>
                                    ) : (
                                        links.map((link) => (
                                            <div key={link._id} className="flex items-center justify-between p-4 border rounded-lg bg-slate-50 group">
                                                <div className="flex items-center gap-4 overflow-hidden">
                                                    <div className="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 shrink-0">
                                                        <LinkIcon className="h-5 w-5" />
                                                    </div>
                                                    <div className="min-w-0">
                                                        <p className="font-medium truncate">{link.label}</p>
                                                        <p className="text-sm text-slate-500 truncate">{link.url}</p>
                                                        {link.keywords && link.keywords.length > 0 && (
                                                            <div className="flex flex-wrap gap-1 mt-1">
                                                                {link.keywords.map((k: string, i: number) => (
                                                                    <Badge key={i} variant="secondary" className="text-[10px] px-1 h-4">
                                                                        {k}
                                                                    </Badge>
                                                                ))}
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-2 shrink-0">
                                                    <Button variant="ghost" size="icon" onClick={() => copyToClipboard(link.url)}>
                                                        <Copy className="h-4 w-4" />
                                                    </Button>
                                                    <Button variant="ghost" size="icon" className="text-red-500 hover:text-red-600 hover:bg-red-50" onClick={() => handleDeleteLink(link._id)}>
                                                        <Trash2 className="h-4 w-4" />
                                                    </Button>
                                                </div>
                                            </div>
                                        ))
                                    )}
                                </CardContent>
                            </Card >
                        </TabsContent >
                        <TabsContent value="history" className="mt-4">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Performance History</CardTitle>
                                    <CardDescription>Track your earnings over time.</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    {sales.length === 0 ? (
                                        <div className="text-center py-12 text-slate-500">
                                            No sales recorded yet. Add a sale in the Performance card to see charts.
                                        </div>
                                    ) : (
                                        <div className="h-[300px] w-full">
                                            <ResponsiveContainer width="100%" height="100%">
                                                <BarChart data={chartData}>
                                                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                                    <XAxis
                                                        dataKey="date"
                                                        tickLine={false}
                                                        axisLine={false}
                                                        tick={{ fontSize: 12, fill: '#64748b' }}
                                                        dy={10}
                                                    />
                                                    <YAxis
                                                        tickLine={false}
                                                        axisLine={false}
                                                        tickFormatter={(value) => `$${value}`}
                                                        tick={{ fontSize: 12, fill: '#64748b' }}
                                                    />
                                                    <Tooltip
                                                        cursor={{ fill: '#f1f5f9' }}
                                                        contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                                    />
                                                    <Bar dataKey="amount" fill="#6366f1" radius={[4, 4, 0, 0]} barSize={40} />
                                                </BarChart>
                                            </ResponsiveContainer>
                                        </div>
                                    )}

                                    <div className="mt-8">
                                        <h4 className="font-medium mb-4">Recent Transactions</h4>
                                        <div className="space-y-2">
                                            {sales.map((sale) => (
                                                <div key={sale._id} className="flex items-center justify-between p-3 border-b last:border-0">
                                                    <div className="flex items-center gap-3">
                                                        <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center text-green-600">
                                                            <DollarSign className="h-4 w-4" />
                                                        </div>
                                                        <div>
                                                            <p className="font-medium">${sale.amount.toFixed(2)}</p>
                                                            <p className="text-xs text-slate-500">
                                                                {format(new Date(sale.dateOfSale), "MMM dd, yyyy")}
                                                                {sale.dateOfPayment && ` • Paid: ${format(new Date(sale.dateOfPayment), "MMM dd")}`}
                                                            </p>
                                                        </div>
                                                    </div>
                                                    <Button variant="ghost" size="sm" className="text-red-500 h-8 w-8 p-0" onClick={() => handleDeleteSale(sale._id, sale.amount)}>
                                                        <Trash2 className="h-4 w-4" />
                                                    </Button>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </TabsContent>
                    </Tabs >
                </div >

                {/* Right Column: Management */}
                < div className="space-y-6" >
                    <Card>
                        <CardHeader>
                            <CardTitle>Partnership Status</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label>Status</Label>
                                <Select
                                    value={formData.status}
                                    onValueChange={(value) => setFormData({ ...formData, status: value })}
                                >
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="interested">Interested</SelectItem>
                                        <SelectItem value="applied">Applied</SelectItem>
                                        <SelectItem value="approved">Approved</SelectItem>
                                        <SelectItem value="rejected">Rejected</SelectItem>
                                        <SelectItem value="active">Active</SelectItem>
                                        <SelectItem value="paused">Paused</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-2">
                                <Label>Priority</Label>
                                <Select
                                    value={formData.priority}
                                    onValueChange={(value) => setFormData({ ...formData, priority: value })}
                                >
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="low">Low</SelectItem>
                                        <SelectItem value="medium">Medium</SelectItem>
                                        <SelectItem value="high">High</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-2">
                                <Label>Affiliate ID / Link</Label>
                                <Input
                                    placeholder="e.g. ?ref=123 or full link"
                                    value={formData.affiliateId}
                                    onChange={(e) => setFormData({ ...formData, affiliateId: e.target.value })}
                                />
                                <p className="text-xs text-slate-500">
                                    Store your unique ID or tracking link here.
                                </p>
                            </div>

                            <div className="pt-4 border-t">
                                <Button className="w-full" onClick={handleSave} disabled={isLoading}>
                                    {isLoading ? "Saving..." : "Save Changes"}
                                </Button>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Performance</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label>Total Earnings</Label>
                                <div className="text-3xl font-bold text-slate-900">
                                    ${formData.totalEarnings.toFixed(2)}
                                </div>
                                <p className="text-xs text-slate-500">Calculated from sales history.</p>
                            </div>

                            <Dialog open={isSaleModalOpen} onOpenChange={setIsSaleModalOpen}>
                                <DialogTrigger asChild>
                                    <Button className="w-full">
                                        <Plus className="h-4 w-4 mr-2" />
                                        Record Sale
                                    </Button>
                                </DialogTrigger>
                                <DialogContent>
                                    <DialogHeader>
                                        <DialogTitle>Record New Sale</DialogTitle>
                                        <DialogDescription>
                                            Track your affiliate commissions.
                                        </DialogDescription>
                                    </DialogHeader>
                                    <div className="space-y-4 py-4">
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="space-y-2">
                                                <Label>Date of Sale</Label>
                                                <Input
                                                    type="date"
                                                    value={newSale.dateOfSale}
                                                    onChange={(e) => setNewSale({ ...newSale, dateOfSale: e.target.value })}
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <Label>Amount ($)</Label>
                                                <Input
                                                    type="number"
                                                    placeholder="0.00"
                                                    value={newSale.amount}
                                                    onChange={(e) => setNewSale({ ...newSale, amount: e.target.value })}
                                                />
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <Label>Date of Payment (Optional)</Label>
                                            <Input
                                                type="date"
                                                value={newSale.dateOfPayment}
                                                onChange={(e) => setNewSale({ ...newSale, dateOfPayment: e.target.value })}
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label>Notes</Label>
                                            <Textarea
                                                placeholder="Product sold, campaign source, etc."
                                                value={newSale.notes}
                                                onChange={(e) => setNewSale({ ...newSale, notes: e.target.value })}
                                            />
                                        </div>
                                    </div>
                                    <DialogFooter>
                                        <Button onClick={handleAddSale} disabled={isLoading}>Save Record</Button>
                                    </DialogFooter>
                                </DialogContent>
                            </Dialog>
                        </CardContent>
                    </Card>

                    <Button variant="destructive" className="w-full" onClick={handleRemove} disabled={isLoading}>
                        <Trash2 className="h-4 w-4 mr-2" />
                        Remove Partner
                    </Button>
                </div >
            </div >
        </div >
    );
}

