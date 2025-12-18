"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogFooter
} from "@/components/ui/dialog";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { Plus, Edit, Trash2, Package } from "lucide-react";
import { createAffiliateProduct, updateAffiliateProduct, deleteAffiliateProduct } from "@/lib/actions/affiliate-admin.actions";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

interface Product {
    _id: string;
    name: string;
    description?: string;
    type: string;
    category?: string;
    price?: string;
    commissionRate?: string;
    affiliateLink?: string;
    isPublic: boolean;
}

interface ProductManagerProps {
    companyId: string;
    initialProducts: Product[];
}

export default function ProductManager({ companyId, initialProducts }: ProductManagerProps) {
    const router = useRouter();
    const [products, setProducts] = useState<Product[]>(initialProducts);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [editingProduct, setEditingProduct] = useState<Product | null>(null);

    const [formData, setFormData] = useState({
        name: "",
        description: "",
        type: "physical",
        category: "",
        price: "",
        commissionRate: "",
        affiliateLink: "",
        isPublic: true
    });

    const resetForm = () => {
        setFormData({
            name: "",
            description: "",
            type: "physical",
            category: "",
            price: "",
            commissionRate: "",
            affiliateLink: "",
            isPublic: true
        });
        setEditingProduct(null);
    };

    const handleOpenModal = (product?: Product) => {
        if (product) {
            setEditingProduct(product);
            setFormData({
                name: product.name,
                description: product.description || "",
                type: product.type || "physical",
                category: product.category || "",
                price: product.price || "",
                commissionRate: product.commissionRate || "",
                affiliateLink: product.affiliateLink || "",
                isPublic: product.isPublic
            });
        } else {
            resetForm();
        }
        setIsModalOpen(true);
    };

    const handleSubmit = async () => {
        if (!formData.name) return toast.error("Name is required");

        setIsLoading(true);
        try {
            if (editingProduct) {
                const updated = await updateAffiliateProduct(editingProduct._id, formData);
                setProducts(products.map(p => p._id === updated._id ? updated : p));
                toast.success("Product updated");
            } else {
                const created = await createAffiliateProduct({ ...formData, companyId });
                setProducts([...products, created]);
                toast.success("Product created");
            }
            setIsModalOpen(false);
            resetForm();
            router.refresh();
        } catch (error) {
            toast.error("Failed to save product");
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this product?")) return;
        try {
            await deleteAffiliateProduct(id);
            setProducts(products.filter(p => p._id !== id));
            toast.success("Product deleted");
            router.refresh();
        } catch (error) {
            toast.error("Failed to delete product");
        }
    };

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium">Products ({products.length})</h3>
                <Button size="sm" onClick={() => handleOpenModal()}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Product
                </Button>
            </div>

            {products.length === 0 ? (
                <div className="text-center py-8 bg-slate-50 rounded-lg border border-dashed">
                    <Package className="h-8 w-8 mx-auto text-slate-400 mb-2" />
                    <p className="text-slate-500">No products added yet.</p>
                </div>
            ) : (
                <div className="grid gap-4">
                    {products.map((product) => (
                        <Card key={product._id} className="overflow-hidden">
                            <CardContent className="p-4 flex items-center justify-between">
                                <div>
                                    <h4 className="font-semibold">{product.name}</h4>
                                    <p className="text-sm text-slate-500 line-clamp-1">{product.description}</p>
                                    <div className="flex gap-2 mt-1 text-xs text-slate-600">
                                        <span className="bg-slate-100 px-2 py-0.5 rounded capitalize">{product.type}</span>
                                        {product.commissionRate && <span>Comm: {product.commissionRate}</span>}
                                        {product.price && <span>Price: {product.price}</span>}
                                    </div>
                                </div>
                                <div className="flex gap-2">
                                    <Button variant="ghost" size="icon" onClick={() => handleOpenModal(product)}>
                                        <Edit className="h-4 w-4" />
                                    </Button>
                                    <Button variant="ghost" size="icon" className="text-red-500 hover:text-red-600 hover:bg-red-50" onClick={() => handleDelete(product._id)}>
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}

            <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                <DialogContent className="max-w-lg">
                    <DialogHeader>
                        <DialogTitle>{editingProduct ? "Edit Product" : "Add New Product"}</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                        <div className="space-y-2">
                            <Label>Product Name</Label>
                            <Input
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                placeholder="e.g. Premium Plan"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>Description</Label>
                            <Textarea
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                placeholder="Brief description of the product..."
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label>Type</Label>
                                <Select
                                    value={formData.type}
                                    onValueChange={(val) => setFormData({ ...formData, type: val })}
                                >
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="physical">Physical</SelectItem>
                                        <SelectItem value="digital">Digital</SelectItem>
                                        <SelectItem value="service">Service</SelectItem>
                                        <SelectItem value="subscription">Subscription</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label>Category</Label>
                                <Input
                                    value={formData.category}
                                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                    placeholder="e.g. Software"
                                />
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label>Price</Label>
                                <Input
                                    value={formData.price}
                                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                                    placeholder="e.g. $99/mo"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>Commission</Label>
                                <Input
                                    value={formData.commissionRate}
                                    onChange={(e) => setFormData({ ...formData, commissionRate: e.target.value })}
                                    placeholder="e.g. 20%"
                                />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label>Affiliate Link (Default/Example)</Label>
                            <Input
                                value={formData.affiliateLink}
                                onChange={(e) => setFormData({ ...formData, affiliateLink: e.target.value })}
                                placeholder="https://..."
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsModalOpen(false)}>Cancel</Button>
                        <Button onClick={handleSubmit} disabled={isLoading}>
                            {isLoading ? "Saving..." : "Save Product"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
