"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { QRCodeSVG } from "qrcode.react";
import { getAmazonSettings } from "@/lib/actions/amazon.actions";
import toast from "react-hot-toast";
import { Copy, Download, Link as LinkIcon, Trash2 } from "lucide-react";

export default function LinkToolsPage() {
    const [asins, setAsins] = useState("");
    const [results, setResults] = useState<any[]>([]);
    const [partnerTag, setPartnerTag] = useState("");
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchSettings = async () => {
            try {
                const settings = await getAmazonSettings();
                if (settings?.partnerTag) {
                    setPartnerTag(settings.partnerTag);
                } else {
                    toast.error("Please configure your Partner Tag in Settings first.");
                }
            } catch (error) {
                console.error(error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchSettings();
    }, []);

    const generateLinks = () => {
        if (!partnerTag) {
            toast.error("Partner Tag is missing. Please go to Settings.");
            return;
        }

        const asinList = asins.split(/\r?\n/).map(a => a.trim()).filter(a => a);
        if (asinList.length === 0) {
            toast.error("Please enter at least one ASIN.");
            return;
        }

        const newResults = asinList.map(asin => {
            return {
                asin,
                link: `https://www.amazon.com/dp/${asin}/?tag=${partnerTag}`
            };
        });

        setResults(newResults);
        toast.success(`Generated ${newResults.length} links.`);
    };

    const clearResults = () => {
        setResults([]);
        setAsins("");
    };

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text);
        toast.success("Copied to clipboard");
    };

    const downloadQRCode = (asin: string) => {
        const svg = document.getElementById(`qr-${asin}`);
        if (!svg) return;

        const svgData = new XMLSerializer().serializeToString(svg);
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");
        const img = new Image();

        img.onload = () => {
            canvas.width = img.width;
            canvas.height = img.height;
            ctx?.drawImage(img, 0, 0);
            const pngFile = canvas.toDataURL("image/png");

            const downloadLink = document.createElement("a");
            downloadLink.download = `${asin}-qrcode.png`;
            downloadLink.href = pngFile;
            downloadLink.click();
        };

        img.src = "data:image/svg+xml;base64," + btoa(svgData);
    };

    if (isLoading) return <div className="p-6">Loading...</div>;

    return (
        <div className="p-6 max-w-5xl mx-auto space-y-6">
            <div className="flex flex-col gap-y-2">
                <h1 className="text-3xl font-bold">Link & QR Code Tools</h1>
                <p className="text-muted-foreground">
                    Bulk generate affiliate links and QR codes from ASINs.
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Input Section */}
                <Card className="lg:col-span-1 h-fit">
                    <CardHeader>
                        <CardTitle>Input ASINs</CardTitle>
                        <CardDescription>
                            Enter one ASIN per line (e.g., B08N5WRWNW).
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <Textarea
                            placeholder="B08N5WRWNW&#10;B09G9F5Y4J&#10;B08L5TNJHG"
                            rows={10}
                            value={asins}
                            onChange={(e) => setAsins(e.target.value)}
                            className="font-mono"
                        />
                        <div className="flex gap-2">
                            <Button onClick={generateLinks} className="w-full">
                                Generate
                            </Button>
                            <Button onClick={clearResults} variant="destructive" size="icon">
                                <Trash2 className="h-4 w-4" />
                            </Button>
                        </div>
                    </CardContent>
                </Card>

                {/* Results Section */}
                <Card className="lg:col-span-2">
                    <CardHeader>
                        <CardTitle>Generated Links</CardTitle>
                        <CardDescription>
                            Your affiliate links and QR codes.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        {results.length === 0 ? (
                            <div className="text-center py-12 text-muted-foreground border-2 border-dashed rounded-lg">
                                No results generated yet.
                            </div>
                        ) : (
                            <div className="space-y-6">
                                {results.map((item, index) => (
                                    <div key={index} className="flex flex-col sm:flex-row items-start sm:items-center gap-4 p-4 border rounded-lg bg-slate-50">
                                        <div className="bg-white p-2 rounded border">
                                            <QRCodeSVG
                                                id={`qr-${item.asin}`}
                                                value={item.link}
                                                size={80}
                                                level={"L"}
                                                includeMargin={false}
                                            />
                                        </div>
                                        <div className="flex-1 space-y-1 min-w-0">
                                            <div className="flex items-center gap-2">
                                                <span className="font-bold font-mono text-sm bg-slate-200 px-2 py-0.5 rounded">
                                                    {item.asin}
                                                </span>
                                            </div>
                                            <div className="text-xs text-muted-foreground break-all font-mono">
                                                {item.link}
                                            </div>
                                            <div className="flex gap-2 mt-2">
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    className="h-8 text-xs"
                                                    onClick={() => copyToClipboard(item.link)}
                                                >
                                                    <Copy className="h-3 w-3 mr-1" /> Copy Link
                                                </Button>
                                                {/* Note: Download SVG logic is complex in React without extra libs, keeping it simple or removing if buggy */}
                                                {/* For now, just showing the QR is good. */}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
