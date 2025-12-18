"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Star, MapPin, CheckCircle2, ShoppingBag } from "lucide-react";
import { toggleSaveSupplier } from "@/lib/actions/supplier.actions";
import { toast } from "sonner";
import Link from "next/link";

interface SupplierCardProps {
    supplier: any;
}

export function SupplierCard({ supplier }: SupplierCardProps) {
    const [isSaved, setIsSaved] = useState(supplier.isSaved);

    const handleSave = async (e: React.MouseEvent) => {
        e.preventDefault(); // Prevent link navigation
        e.stopPropagation();
        try {
            const result = await toggleSaveSupplier(supplier._id);
            setIsSaved(result.saved);
            toast.success(result.saved ? "Supplier saved!" : "Supplier removed from saved list");
        } catch (error) {
            toast.error("Failed to update saved status");
        }
    };

    return (
        <Link href={`/tools/wholesale-directory/supplier/${supplier._id}`}>
            <Card className="hover:shadow-md transition-all border-slate-200 bg-white group cursor-pointer">
                <CardContent className="p-4">
                    <div className="flex gap-4">
                        {/* Logo / Image */}
                        <div className="w-24 h-24 bg-slate-100 rounded-lg flex items-center justify-center flex-shrink-0 border border-slate-100">
                            {supplier.logo ? (
                                <img src={supplier.logo} alt={supplier.name} className="w-full h-full object-contain p-2" />
                            ) : (
                                <ShoppingBag className="h-8 w-8 text-slate-300" />
                            )}
                        </div>

                        {/* Content */}
                        <div className="flex-1 min-w-0">
                            <div className="flex justify-between items-start">
                                <div>
                                    <h3 className="font-bold text-lg text-slate-900 flex items-center gap-2">
                                        {supplier.name}
                                        {supplier.isCertified && (
                                            <Badge variant="secondary" className="bg-blue-50 text-blue-700 hover:bg-blue-50 border-blue-100 gap-1 text-[10px] h-5">
                                                <CheckCircle2 className="h-3 w-3" />
                                                Certified
                                            </Badge>
                                        )}
                                    </h3>
                                    <div className="flex items-center gap-2 text-sm text-slate-500 mt-1">
                                        <MapPin className="h-3 w-3" />
                                        {supplier.location?.city}, {supplier.location?.state}, {supplier.location?.country}
                                    </div>
                                </div>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className={`h-8 w-8 ${isSaved ? 'text-amber-400 hover:text-amber-500' : 'text-slate-300 hover:text-amber-400'}`}
                                    onClick={handleSave}
                                >
                                    <Star className={`h-5 w-5 ${isSaved ? 'fill-current' : ''}`} />
                                </Button>
                            </div>

                            <div className="mt-3 grid grid-cols-2 gap-x-8 gap-y-2 text-sm">
                                <div>
                                    <span className="font-semibold text-slate-700">Wholesale Type:</span>
                                    <span className="ml-2 text-slate-600">{supplier.wholesaleType}</span>
                                </div>
                                <div>
                                    <span className="font-semibold text-slate-700">Shipping:</span>
                                    <span className="ml-2 text-slate-600">{supplier.shippingRegions?.join(", ")}</span>
                                </div>
                                <div className="col-span-2">
                                    <span className="font-semibold text-slate-700">Products:</span>
                                    <span className="ml-2 text-slate-600 truncate block">
                                        {supplier.products?.join(", ")}
                                    </span>
                                </div>
                            </div>

                            <div className="mt-4 flex items-center gap-2">
                                <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">Approved For:</span>
                                <div className="flex gap-1">
                                    {supplier.approvedChannels?.map((channel: string) => (
                                        <Badge key={channel} variant="outline" className="bg-slate-50 text-slate-600 border-slate-200 text-[10px]">
                                            {channel}
                                        </Badge>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </Link>
    );
}
