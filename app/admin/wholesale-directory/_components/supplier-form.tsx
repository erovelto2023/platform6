"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { createSupplier, updateSupplier } from "@/lib/actions/supplier.actions";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { WHOLESALE_CATEGORIES } from "@/lib/constants/wholesale";

interface SupplierFormProps {
    initialData?: any;
}

export function SupplierForm({ initialData }: SupplierFormProps) {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsLoading(true);

        const formData = new FormData(e.currentTarget);
        const selectedCategories = formData.getAll('category_selection') as string[];

        const data = {
            name: formData.get('name'),
            logo: formData.get('logo'),
            location: {
                address: formData.get('address'),
                city: formData.get('city'),
                state: formData.get('state'),
                zipCode: formData.get('zipCode'),
                country: formData.get('country') || 'USA'
            },
            comments: formData.get('comments'),
            wholesaleType: formData.get('wholesaleType'),
            datafeedType: formData.get('datafeedType'),
            shippingRegions: (formData.get('shippingRegions') as string)?.split(',').map(s => s.trim()).filter(Boolean),
            shipMethods: (formData.get('shipMethods') as string)?.split(',').map(s => s.trim()).filter(Boolean),
            categories: selectedCategories,
            products: (formData.get('products') as string)?.split(',').map(s => s.trim()).filter(Boolean),
            brands: (formData.get('brands') as string)?.split(',').map(s => s.trim()).filter(Boolean),
            images: (formData.get('images') as string)?.split(',').map(s => s.trim()).filter(Boolean),
            approvedChannels: [],
            contactInfo: {
                website: formData.get('website'),
                contactName: formData.get('contactName'),
                email: formData.get('email'),
                phone: formData.get('phone'),
                fax: formData.get('fax')
            },
            capabilities: {
                dropship: formData.get('cap_dropship') === 'on',
                lightBulk: formData.get('cap_lightBulk') === 'on',
                ebay: formData.get('cap_ebay') === 'on',
                amazon: formData.get('cap_amazon') === 'on'
            },
            accountSetup: {
                dropShipFee: formData.get('dropShipFee'),
                paymentMethods: (formData.get('paymentMethods') as string)?.split(',').map(s => s.trim()).filter(Boolean),
                orderingMethods: (formData.get('orderingMethods') as string)?.split(',').map(s => s.trim()).filter(Boolean),
            },
            lightBulkDetails: {
                setupFee: formData.get('lb_setupFee'),
                minFirstOrder: formData.get('lb_minFirstOrder'),
                minReorder: formData.get('lb_minReorder'),
                priceBreaks: formData.get('lb_priceBreaks')
            },
            isCertified: formData.get('isCertified') === 'on'
        };

        const channels = [];
        if (data.capabilities.ebay) channels.push('eBay');
        if (data.capabilities.amazon) channels.push('Amazon');
        channels.push('Online Store');
        // @ts-ignore
        data.approvedChannels = channels;

        try {
            if (initialData) {
                await updateSupplier(initialData._id, data);
                toast.success("Supplier updated successfully!");
            } else {
                await createSupplier(data);
                toast.success("Supplier added successfully!");
            }
            router.push("/admin/wholesale-directory");
            router.refresh();
        } catch (error) {
            toast.error(initialData ? "Failed to update supplier" : "Failed to add supplier");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-8 bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
            {/* Basic Info */}
            <div className="space-y-4">
                <h3 className="font-semibold text-lg border-b pb-2">Basic Information</h3>
                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label>Company Name</Label>
                        <Input name="name" required placeholder="e.g. Acme Corp" defaultValue={initialData?.name} />
                    </div>
                    <div className="space-y-2">
                        <Label>Logo URL</Label>
                        <Input name="logo" placeholder="https://..." defaultValue={initialData?.logo} />
                    </div>
                    <div className="space-y-2 col-span-2">
                        <Label>Comments</Label>
                        <Textarea name="comments" placeholder="Company summary and notes..." defaultValue={initialData?.comments || initialData?.description} />
                    </div>
                </div>
            </div>

            {/* Location & Contact */}
            <div className="space-y-4">
                <h3 className="font-semibold text-lg border-b pb-2">Location & Contact</h3>
                <div className="space-y-2">
                    <Label>Address</Label>
                    <Input name="address" placeholder="123 Main St" defaultValue={initialData?.location?.address} />
                </div>
                <div className="grid grid-cols-4 gap-4">
                    <div className="space-y-2 col-span-2">
                        <Label>City</Label>
                        <Input name="city" placeholder="New York" defaultValue={initialData?.location?.city} />
                    </div>
                    <div className="space-y-2">
                        <Label>State</Label>
                        <Input name="state" placeholder="NY" defaultValue={initialData?.location?.state} />
                    </div>
                    <div className="space-y-2">
                        <Label>Zip Code</Label>
                        <Input name="zipCode" placeholder="10001" defaultValue={initialData?.location?.zipCode} />
                    </div>
                </div>
                <div className="space-y-2">
                    <Label>Country</Label>
                    <Input name="country" defaultValue={initialData?.location?.country || "USA"} />
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label>Website</Label>
                        <Input name="website" placeholder="https://..." defaultValue={initialData?.contactInfo?.website} />
                    </div>
                    <div className="space-y-2">
                        <Label>Email</Label>
                        <Input name="email" type="email" defaultValue={initialData?.contactInfo?.email} />
                    </div>
                    <div className="space-y-2">
                        <Label>Phone</Label>
                        <Input name="phone" defaultValue={initialData?.contactInfo?.phone} />
                    </div>
                    <div className="space-y-2">
                        <Label>Fax</Label>
                        <Input name="fax" defaultValue={initialData?.contactInfo?.fax} />
                    </div>
                    <div className="space-y-2 col-span-2">
                        <Label>Contact Person</Label>
                        <Input name="contactName" defaultValue={initialData?.contactInfo?.contactName} />
                    </div>
                </div>
            </div>

            {/* Business Details */}
            <div className="space-y-4">
                <h3 className="font-semibold text-lg border-b pb-2">Business Details</h3>
                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label>Wholesale Type</Label>
                        <Select name="wholesaleType" defaultValue={initialData?.wholesaleType || "Both"}>
                            <SelectTrigger>
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="Dropshipper">Dropshipper</SelectItem>
                                <SelectItem value="Light Bulk">Light Bulk</SelectItem>
                                <SelectItem value="Both">Both</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="space-y-2">
                        <Label>Datafeed Type</Label>
                        <Select name="datafeedType" defaultValue={initialData?.datafeedType || "None"}>
                            <SelectTrigger>
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="None">None</SelectItem>
                                <SelectItem value="CSV">CSV</SelectItem>
                                <SelectItem value="API">API</SelectItem>
                                <SelectItem value="XML">XML</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label>Shipping Regions (comma sep)</Label>
                        <Input name="shippingRegions" placeholder="USA, Canada, Worldwide" defaultValue={initialData?.shippingRegions?.join(", ")} />
                    </div>
                    <div className="space-y-2">
                        <Label>Ship Methods (comma sep)</Label>
                        <Input name="shipMethods" placeholder="UPS, FedEx, USPS" defaultValue={initialData?.shipMethods?.join(", ")} />
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label>Drop Ship Fee</Label>
                        <Input name="dropShipFee" placeholder="$5.95" defaultValue={initialData?.accountSetup?.dropShipFee} />
                    </div>
                    <div className="space-y-2">
                        <Label>Payment Terms (comma sep)</Label>
                        <Input name="paymentMethods" placeholder="Visa, Net 30" defaultValue={initialData?.accountSetup?.paymentMethods?.join(", ")} />
                    </div>
                </div>

                <div className="space-y-2">
                    <Label>Ordering Methods (comma sep)</Label>
                    <Input name="orderingMethods" placeholder="Online, Phone" defaultValue={initialData?.accountSetup?.orderingMethods?.join(", ")} />
                </div>

                <div className="space-y-2">
                    <Label>Categories</Label>
                    <div className="h-48 overflow-y-auto border rounded-md p-4 space-y-2">
                        {WHOLESALE_CATEGORIES.map((category) => (
                            <div key={category} className="flex items-center space-x-2">
                                <Checkbox
                                    id={`cat-${category}`}
                                    name="category_selection"
                                    value={category}
                                    defaultChecked={initialData?.categories?.includes(category)}
                                />
                                <Label htmlFor={`cat-${category}`} className="font-normal cursor-pointer">
                                    {category}
                                </Label>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="space-y-2">
                    <Label>Brand Names (comma sep)</Label>
                    <Input name="brands" placeholder="Brand A, Brand B" defaultValue={initialData?.brands?.join(", ")} />
                </div>

                <div className="space-y-2">
                    <Label>Top Products (comma sep)</Label>
                    <Input name="products" placeholder="Headphones, Phone Cases, Cables" defaultValue={initialData?.products?.join(", ")} />
                </div>

                <div className="space-y-2">
                    <Label>Product Images (comma sep URLs)</Label>
                    <Textarea name="images" placeholder="https://image1.jpg, https://image2.jpg" defaultValue={initialData?.images?.join(", ")} />
                </div>

                <div className="space-y-4 pt-2">
                    <Label>Capabilities</Label>
                    <div className="flex gap-6 flex-wrap">
                        <div className="flex items-center space-x-2">
                            <Checkbox name="cap_dropship" id="cap_dropship" defaultChecked={initialData?.capabilities?.dropship} />
                            <Label htmlFor="cap_dropship">Dropship</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                            <Checkbox name="cap_lightBulk" id="cap_lightBulk" defaultChecked={initialData?.capabilities?.lightBulk} />
                            <Label htmlFor="cap_lightBulk">Light Bulk</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                            <Checkbox name="cap_ebay" id="cap_ebay" defaultChecked={initialData?.capabilities?.ebay} />
                            <Label htmlFor="cap_ebay">eBay Friendly</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                            <Checkbox name="cap_amazon" id="cap_amazon" defaultChecked={initialData?.capabilities?.amazon} />
                            <Label htmlFor="cap_amazon">Amazon Friendly</Label>
                        </div>
                    </div>
                </div>

                <div className="flex items-center space-x-2 pt-2">
                    <Checkbox name="isCertified" id="isCertified" defaultChecked={initialData ? initialData.isCertified : true} />
                    <Label htmlFor="isCertified" className="font-bold text-blue-600">Certified Supplier</Label>
                </div>
            </div>

            {/* Light Bulk Details */}
            <div className="space-y-4">
                <h3 className="font-semibold text-lg border-b pb-2">Light Bulk Details</h3>
                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label>Account Setup Fee</Label>
                        <Input name="lb_setupFee" placeholder="0" defaultValue={initialData?.lightBulkDetails?.setupFee} />
                    </div>
                    <div className="space-y-2">
                        <Label>Min 1st Order</Label>
                        <Input name="lb_minFirstOrder" placeholder="$200.00" defaultValue={initialData?.lightBulkDetails?.minFirstOrder} />
                    </div>
                    <div className="space-y-2">
                        <Label>Min Re-Order</Label>
                        <Input name="lb_minReorder" placeholder="$120.00" defaultValue={initialData?.lightBulkDetails?.minReorder} />
                    </div>
                    <div className="space-y-2">
                        <Label>Price Breaks</Label>
                        <Input name="lb_priceBreaks" placeholder="Negotiable" defaultValue={initialData?.lightBulkDetails?.priceBreaks} />
                    </div>
                </div>
            </div>

            <div className="flex justify-end pt-4">
                <Button type="submit" size="lg" disabled={isLoading}>
                    {isLoading ? "Saving..." : (initialData ? "Update Supplier" : "Add Supplier")}
                </Button>
            </div>
        </form>
    );
}
