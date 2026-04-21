"use client";

import { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MediaHeader } from "./_components/media-header";
import { MediaLibrary } from "./_components/media-library";
import { DigitalWarehouse } from "./_components/digital-warehouse";
import { getResources } from "@/lib/actions/media.actions";
import { Loader2 } from "lucide-react";

export default function MediaCenterPage() {
    const [activeTab, setActiveTab] = useState("media");
    const [resources, setResources] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");

    const fetchMedia = async () => {
        setLoading(true);
        const result = await getResources(searchQuery);
        if (result.success) {
            setResources(result.data);
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchMedia();
    }, [searchQuery]);

    return (
        <div className="min-h-screen bg-[#0A0D14] text-slate-200 -m-6 p-8">
            <div className="max-w-[1600px] mx-auto space-y-8">
                <MediaHeader 
                    searchQuery={searchQuery}
                    onSearchChange={setSearchQuery}
                    onUploadSuccess={fetchMedia}
                    stats={{
                        total: resources.length,
                        images: resources.filter(r => r.type === 'image').length,
                        files: resources.filter(r => r.type !== 'image').length
                    }}
                />

                <Tabs defaultValue="media" value={activeTab} onValueChange={setActiveTab} className="w-full">
                    <div className="flex items-center justify-center mb-8">
                        <TabsList className="bg-[#111622] border border-slate-800 p-1 rounded-full h-auto">
                            <TabsTrigger 
                                value="media"
                                className="rounded-full px-8 py-2.5 data-[state=active]:bg-[#6366F1] data-[state=active]:text-white transition-all text-sm font-semibold uppercase tracking-wider"
                            >
                                Media Library
                            </TabsTrigger>
                            <TabsTrigger 
                                value="warehouse"
                                className="rounded-full px-8 py-2.5 data-[state=active]:bg-[#6366F1] data-[state=active]:text-white transition-all text-sm font-semibold uppercase tracking-wider"
                            >
                                Digital Warehouse
                            </TabsTrigger>
                        </TabsList>
                    </div>

                    {loading ? (
                        <div className="flex items-center justify-center py-20">
                            <Loader2 className="h-10 w-10 animate-spin text-[#6366F1]" />
                        </div>
                    ) : (
                        <>
                            <TabsContent value="media" className="mt-0 focus-visible:outline-none">
                                <MediaLibrary 
                                    resources={resources.filter(r => r.type === 'image')} 
                                    onRefresh={fetchMedia}
                                />
                            </TabsContent>
                            <TabsContent value="warehouse" className="mt-0 focus-visible:outline-none">
                                <DigitalWarehouse 
                                    resources={resources.filter(r => r.type !== 'image')} 
                                    onRefresh={fetchMedia}
                                />
                            </TabsContent>
                        </>
                    )}
                </Tabs>
            </div>
        </div>
    );
}
