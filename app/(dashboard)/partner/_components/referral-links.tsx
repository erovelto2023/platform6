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
            <h2 className="text-xl font-black text-slate-100 uppercase font-mono tracking-tight">Your Partner Links</h2>
            <div className="grid grid-cols-1 gap-4">
                {links.map((link) => (
                    <Card key={link.name} className="overflow-hidden bg-slate-900 border border-slate-800 shadow-xl">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-bold text-slate-100 flex items-center justify-between">
                                <span className="font-mono text-amber-400 font-bold uppercase">{link.name}</span>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => onCopy(link.url, link.name)}
                                    className="text-slate-300 hover:text-white hover:bg-slate-800 cursor-pointer"
                                >
                                    {copied === link.name ? (
                                        <Check className="h-4 w-4 text-emerald-400" />
                                    ) : (
                                        <Copy className="h-4 w-4" />
                                    )}
                                </Button>
                            </CardTitle>
                            <CardDescription className="text-xs font-mono text-slate-400">
                                {link.description}
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="pt-1">
                            <div className="flex items-center gap-2 mt-1">
                                <code className="flex-1 bg-slate-950 border border-slate-800 p-2.5 rounded-xl text-xs font-mono text-amber-300 truncate font-semibold">
                                    {link.url}
                                </code>
                                <a
                                    href={link.url}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="p-2.5 bg-slate-950 border border-slate-800 hover:border-orange-500 rounded-xl transition-colors shrink-0"
                                >
                                    <ExternalLink className="h-4 w-4 text-orange-400" />
                                </a>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
            
            <Card className="bg-slate-900 border border-slate-800 shadow-xl">
                <CardContent className="p-6 flex flex-col md:flex-row items-center justify-between gap-4 text-center md:text-left">
                    <div>
                        <p className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider">YOUR REFERRAL CODE</p>
                        <h3 className="text-2xl font-black mt-1 font-mono tracking-tight text-amber-400">
                            {affiliateCode}
                        </h3>
                    </div>
                    <Button 
                        onClick={() => onCopy(affiliateCode, 'Affiliate Code')}
                        className="bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-400 hover:to-amber-500 text-slate-950 font-black font-mono text-xs uppercase tracking-wider h-11 px-6 rounded-xl cursor-pointer"
                    >
                        Copy Account Code
                    </Button>
                </CardContent>
            </Card>
        </div>
    );
};
