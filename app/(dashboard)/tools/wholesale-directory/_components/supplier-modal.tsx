"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { CheckCircle2, MapPin, Globe, Mail, Phone, Star, Truck, CreditCard, Box } from "lucide-react";
import { useState } from "react";
import { updateSupplierNotes } from "@/lib/actions/supplier.actions";
import { toast } from "sonner";

interface SupplierModalProps {
    supplier: any;
    isOpen: boolean;
    onClose: () => void;
    isSaved: boolean;
    onToggleSave: (e: any) => void;
}

export function SupplierModal({ supplier, isOpen, onClose, isSaved, onToggleSave }: SupplierModalProps) {
    const [notes, setNotes] = useState(supplier.savedData?.notes || "");
    const [isSavingNotes, setIsSavingNotes] = useState(false);

    const handleSaveNotes = async () => {
        setIsSavingNotes(true);
        try {
            await updateSupplierNotes(supplier._id, notes);
            toast.success("Notes updated");
        } catch (error) {
            toast.error("Failed to save notes");
        } finally {
            setIsSavingNotes(false);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto p-0 gap-0">
                <DialogTitle className="sr-only">{supplier.name}</DialogTitle>
                {/* Header */}
                <div className="p-6 border-b border-slate-100 bg-slate-50/50 flex justify-between items-start">
                    <div className="flex gap-4">
                        <div className="w-20 h-20 bg-white rounded-lg border border-slate-200 flex items-center justify-center p-2 shadow-sm">
                            {supplier.logo ? (
                                <img src={supplier.logo} alt={supplier.name} className="w-full h-full object-contain" />
                            ) : (
                                <Box className="h-8 w-8 text-slate-300" />
                            )}
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
                                {supplier.name}
                                {supplier.isCertified && (
                                    <Badge variant="secondary" className="bg-blue-100 text-blue-700 hover:bg-blue-100 border-blue-200">
                                        <CheckCircle2 className="h-3 w-3 mr-1" />
                                        Certified Supplier
                                    </Badge>
                                )}
                            </h2>
                            <div className="flex items-center gap-4 mt-2 text-sm text-slate-600">
                                <div className="flex items-center gap-1">
                                    <MapPin className="h-4 w-4 text-slate-400" />
                                    {supplier.location?.address && <span>{supplier.location.address}, </span>}
                                    {supplier.location?.city}, {supplier.location?.state} {supplier.location?.zipCode}
                                    <span className="mx-1">•</span>
                                    {supplier.location?.country}
                                </div>
                                {supplier.contactInfo?.website && (
                                    <a href={supplier.contactInfo.website} target="_blank" rel="noreferrer" className="flex items-center gap-1 text-blue-600 hover:underline">
                                        <Globe className="h-4 w-4" />
                                        Visit Website
                                    </a>
                                )}
                            </div>
                        </div>
                    </div>
                    <Button
                        variant={isSaved ? "secondary" : "outline"}
                        className={isSaved ? "bg-amber-100 text-amber-700 hover:bg-amber-200 border-amber-200" : ""}
                        onClick={onToggleSave}
                    >
                        <Star className={`h-4 w-4 mr-2 ${isSaved ? "fill-current" : ""}`} />
                        {isSaved ? "Saved Supplier" : "Save Supplier"}
                    </Button>
                </div>

                <div className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {/* Main Info */}
                        <div className="md:col-span-2 space-y-8">
                            <section>
                                <h3 className="font-semibold text-lg mb-3 text-slate-900">Comments</h3>
                                <p className="text-slate-600 leading-relaxed">{supplier.comments || supplier.description || "No comments available."}</p>
                            </section>

                            <section>
                                <h3 className="font-semibold text-lg mb-3 text-slate-900">Product Categories</h3>
                                <div className="flex flex-wrap gap-2">
                                    {supplier.categories?.map((cat: string) => (
                                        <Badge key={cat} variant="outline" className="px-3 py-1 text-sm font-normal">
                                            {cat}
                                        </Badge>
                                    ))}
                                </div>
                            </section>

                            {supplier.brands && supplier.brands.length > 0 && (
                                <section>
                                    <h3 className="font-semibold text-lg mb-3 text-slate-900">Brands</h3>
                                    <div className="flex flex-wrap gap-2">
                                        {supplier.brands.map((brand: string) => (
                                            <Badge key={brand} variant="secondary" className="px-3 py-1 text-sm font-normal bg-slate-100 text-slate-700">
                                                {brand}
                                            </Badge>
                                        ))}
                                    </div>
                                </section>
                            )}

                            <section>
                                <h3 className="font-semibold text-lg mb-3 text-slate-900">Operations</h3>
                                <div className="grid grid-cols-2 gap-4 text-sm">
                                    <div>
                                        <span className="text-slate-500 block">Ship Methods</span>
                                        <span className="font-medium text-slate-900">{supplier.shipMethods?.join(", ") || "Standard"}</span>
                                    </div>
                                    <div>
                                        <span className="text-slate-500 block">Datafeed Type</span>
                                        <span className="font-medium text-slate-900">{supplier.datafeedType || "None"}</span>
                                    </div>
                                </div>
                            </section>

                            {supplier.images && supplier.images.length > 0 && (
                                <section>
                                    <h3 className="font-semibold text-lg mb-3 text-slate-900">Product Examples</h3>
                                    <div className="grid grid-cols-3 gap-4">
                                        {supplier.images.map((img: string, i: number) => (
                                            <div key={i} className="aspect-square bg-slate-100 rounded-lg overflow-hidden border border-slate-200">
                                                <img src={img} alt={`Product ${i + 1}`} className="w-full h-full object-cover" />
                                            </div>
                                        ))}
                                    </div>
                                </section>
                            )}

                            <section>
                                <h3 className="font-semibold text-lg mb-3 text-slate-900">Capabilities</h3>
                                <div className="grid grid-cols-2 gap-4">
                                    {Object.entries((supplier.capabilities || {}) as Record<string, boolean>).map(([key, value]) => (
                                        value && (
                                            <div key={key} className="flex items-center gap-2 text-slate-700">
                                                <CheckCircle2 className="h-4 w-4 text-green-500" />
                                                <span className="capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</span>
                                            </div>
                                        )
                                    ))}
                                </div>
                            </section>

                            <section>
                                <h3 className="font-semibold text-lg mb-3 text-slate-900">My Notes</h3>
                                <div className="space-y-2">
                                    <Textarea
                                        placeholder="Add private notes about this supplier..."
                                        value={notes}
                                        onChange={(e) => setNotes(e.target.value)}
                                        className="min-h-[100px]"
                                    />
                                    <div className="flex justify-end">
                                        <Button size="sm" onClick={handleSaveNotes} disabled={isSavingNotes}>
                                            {isSavingNotes ? "Saving..." : "Save Notes"}
                                        </Button>
                                    </div>
                                </div>
                            </section>
                        </div>

                        {/* Sidebar Info */}
                        <div className="space-y-6">
                            <div className="bg-slate-50 p-4 rounded-lg border border-slate-100 space-y-4">
                                <h4 className="font-semibold text-slate-900">Contact Details</h4>
                                <div className="space-y-3 text-sm">
                                    {supplier.contactInfo?.contactName && (
                                        <div>
                                            <span className="text-slate-500 block">Contact Person</span>
                                            <span className="font-medium">{supplier.contactInfo.contactName}</span>
                                        </div>
                                    )}
                                    {supplier.contactInfo?.email && (
                                        <div>
                                            <span className="text-slate-500 block">Email</span>
                                            <a href={`mailto:${supplier.contactInfo.email}`} className="text-blue-600 hover:underline">{supplier.contactInfo.email}</a>
                                        </div>
                                    )}
                                    {supplier.contactInfo?.phone && (
                                        <div>
                                            <span className="text-slate-500 block">Phone</span>
                                            <span className="font-medium">{supplier.contactInfo.phone}</span>
                                        </div>
                                    )}
                                    {supplier.contactInfo?.fax && (
                                        <div>
                                            <span className="text-slate-500 block">Fax</span>
                                            <span className="font-medium">{supplier.contactInfo.fax}</span>
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="bg-slate-50 p-4 rounded-lg border border-slate-100 space-y-4">
                                <h4 className="font-semibold text-slate-900">Account Setup</h4>
                                <div className="space-y-3 text-sm">
                                    {supplier.accountSetup?.dropShipFee && (
                                        <div>
                                            <span className="text-slate-500 block">Drop Ship Fee</span>
                                            <span className="font-medium">{supplier.accountSetup.dropShipFee}</span>
                                        </div>
                                    )}
                                    <div>
                                        <span className="text-slate-500 block">Payment Terms</span>
                                        <span className="font-medium">{supplier.accountSetup?.paymentMethods?.join(", ") || "Contact Supplier"}</span>
                                    </div>
                                    <div>
                                        <span className="text-slate-500 block">Ordering Methods</span>
                                        <span className="font-medium">{supplier.accountSetup?.orderingMethods?.join(", ") || "Online"}</span>
                                    </div>
                                </div>
                            </div>

                            {supplier.lightBulkDetails && (
                                <div className="bg-slate-50 p-4 rounded-lg border border-slate-100 space-y-4">
                                    <h4 className="font-semibold text-slate-900">Light Bulk Details</h4>
                                    <div className="space-y-3 text-sm">
                                        <div>
                                            <span className="text-slate-500 block">Setup Fee</span>
                                            <span className="font-medium">{supplier.lightBulkDetails.setupFee || "None"}</span>
                                        </div>
                                        <div>
                                            <span className="text-slate-500 block">Min 1st Order</span>
                                            <span className="font-medium">{supplier.lightBulkDetails.minFirstOrder || "None"}</span>
                                        </div>
                                        <div>
                                            <span className="text-slate-500 block">Min Re-Order</span>
                                            <span className="font-medium">{supplier.lightBulkDetails.minReorder || "None"}</span>
                                        </div>
                                        <div>
                                            <span className="text-slate-500 block">Price Breaks</span>
                                            <span className="font-medium">{supplier.lightBulkDetails.priceBreaks || "None"}</span>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
