"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Copy, Check, ExternalLink } from "lucide-react";
import { toast } from "sonner";

interface ReferralLink {
    name: string;
    description: string;
    url: string;
}

interface ReferralLinksProps {
    links: ReferralLink[];
    affiliateCode: string;
}

export const ReferralLinks = ({ links, affiliateCode }: ReferralLinksProps) => {
    const [copied, setCopied] = useState<string | null>(null);

    const onCopy = (url: string, name: string) => {
        navigator.clipboard.writeText(url);
        setCopied(name);
        toast.success(`Copied ${name} to clipboard`);
        setTimeout(() => setCopied(null), 2000);
    };

    return (
        <div className="space-y-4">
            <h2 className="text-xl font-bold">Your Partner Links</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {links.map((link) => (
                    <Card key={link.name} className="overflow-hidden">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-base flex items-center justify-between">
                                {link.name}
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => onCopy(link.url, link.name)}
                                >
                                    {copied === link.name ? (
                                        <Check className="h-4 w-4 text-green-500" />
                                    ) : (
                                        <Copy className="h-4 w-4" />
                                    )}
                                </Button>
                            </CardTitle>
                            <CardDescription className="text-xs line-clamp-1">
                                {link.description}
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="pt-0">
                            <div className="flex items-center gap-2 mt-2">
                                <code className="flex-1 bg-slate-100 p-2 rounded text-xs truncate">
                                    {link.url}
                                </code>
                                <a
                                    href={link.url}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="p-2 hover:bg-slate-100 rounded-md transition-colors"
                                >
                                    <ExternalLink className="h-4 w-4 text-slate-500" />
                                </a>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
            
            <Card className="bg-slate-900 text-white border-none">
                <CardContent className="p-6 flex flex-col md:flex-row items-center justify-between gap-4 text-center md:text-left">
                    <div>
                        <p className="text-sm font-medium text-slate-400 uppercase tracking-wider">Your Referral Code</p>
                        <h3 className="text-2xl font-black mt-1 font-mono tracking-tighter text-indigo-400">
                            {affiliateCode}
                        </h3>
                    </div>
                    <Button 
                        onClick={() => onCopy(affiliateCode, 'Affiliate Code')}
                        className="bg-indigo-600 hover:bg-indigo-700 h-12 px-8 rounded-xl ring-offset-slate-900"
                    >
                        Copy Account Code
                    </Button>
                </CardContent>
            </Card>
        </div>
    );
};
