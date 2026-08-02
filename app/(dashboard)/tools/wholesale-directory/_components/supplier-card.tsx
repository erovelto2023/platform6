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
        e.preventDefault();
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
            <Card className="hover:border-orange-500/80 transition-all border-slate-800 bg-slate-900/90 group cursor-pointer shadow-lg rounded-2xl">
                <CardContent className="p-5">
                    <div className="flex gap-4 items-start">
                        {/* Logo / Image */}
                        <div className="w-20 h-20 bg-slate-950 rounded-xl flex items-center justify-center flex-shrink-0 border border-slate-800">
                            {supplier.logo ? (
                                <img src={supplier.logo} alt={supplier.name} className="w-full h-full object-contain p-2" />
                            ) : (
                                <ShoppingBag className="h-8 w-8 text-orange-400" />
                            )}
                        </div>

                        {/* Content */}
                        <div className="flex-1 min-w-0">
                            <div className="flex justify-between items-start">
                                <div>
                                    <h3 className="font-bold text-base md:text-lg text-slate-100 group-hover:text-amber-400 transition-colors flex items-center gap-2">
                                        {supplier.name}
                                        {supplier.isCertified && (
                                            <Badge variant="secondary" className="bg-emerald-950/80 text-emerald-400 border border-emerald-800/80 gap-1 text-[10px] h-5 font-mono">
                                                <CheckCircle2 className="h-3 w-3 text-emerald-400" />
                                                Certified
                                            </Badge>
                                        )}
                                    </h3>
                                    <div className="flex items-center gap-1.5 text-xs font-mono text-slate-400 mt-1">
                                        <MapPin className="h-3 w-3 text-orange-400" />
                                        {supplier.location?.city || "USA"}, {supplier.location?.state || ""}, {supplier.location?.country || "United States"}
                                    </div>
                                </div>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className={`h-8 w-8 ${isSaved ? 'text-amber-400 hover:text-amber-500' : 'text-slate-600 hover:text-amber-400'}`}
                                    onClick={handleSave}
                                >
                                    <Star className={`h-5 w-5 ${isSaved ? 'fill-current' : ''}`} />
                                </Button>
                            </div>

                            <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-1.5 text-xs font-mono">
                                <div>
                                    <span className="text-slate-400 uppercase font-bold text-[10px]">Wholesale Type:</span>
                                    <span className="ml-2 text-amber-300 font-bold">{supplier.wholesaleType}</span>
                                </div>
                                <div>
                                    <span className="text-slate-400 uppercase font-bold text-[10px]">Shipping:</span>
                                    <span className="ml-2 text-slate-200">{supplier.shippingRegions?.join(", ") || "Worldwide"}</span>
                                </div>
                                <div className="sm:col-span-2">
                                    <span className="text-slate-400 uppercase font-bold text-[10px]">Products:</span>
                                    <span className="ml-2 text-slate-300 truncate inline-block max-w-full">
                                        {supplier.products?.join(", ") || "General Wholesale Goods"}
                                    </span>
                                </div>
                            </div>

                            <div className="mt-3 pt-3 border-t border-slate-800/80 flex items-center gap-2">
                                <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider">Approved Channels:</span>
                                <div className="flex flex-wrap gap-1">
                                    {supplier.approvedChannels?.map((channel: string) => (
                                        <Badge key={channel} variant="outline" className="bg-slate-950 text-orange-400 border-slate-800 text-[10px] font-mono">
                                            {channel}
                                        </Badge>
                                    )) || (
                                        <Badge variant="outline" className="bg-slate-950 text-slate-400 border-slate-800 text-[10px] font-mono">
                                            Online Store
                                        </Badge>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </Link>
    );
}
