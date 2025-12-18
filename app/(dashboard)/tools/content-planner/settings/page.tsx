"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import {
    Facebook,
    Instagram,
    Linkedin,
    Twitter,
    Youtube,
    Mail,
    Video,
    Globe,
    CheckCircle2,
    AlertCircle,
    Key
} from "lucide-react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

const PLATFORMS = [
    {
        id: "facebook",
        name: "Facebook",
        icon: Facebook,
        color: "text-blue-600",
        description: "Connect Pages & Groups"
    },
    {
        id: "instagram",
        name: "Instagram",
        icon: Instagram,
        color: "text-pink-600",
        description: "Post to Feed, Stories & Reels"
    },
    {
        id: "twitter",
        name: "X (Twitter)",
        icon: Twitter,
        color: "text-black",
        description: "Post tweets & threads"
    },
    {
        id: "linkedin",
        name: "LinkedIn",
        icon: Linkedin,
        color: "text-blue-700",
        description: "Personal Profile & Company Pages"
    },
    {
        id: "youtube",
        name: "YouTube",
        icon: Youtube,
        color: "text-red-600",
        description: "Upload videos & Shorts"
    },
    {
        id: "blog",
        name: "WordPress / Blog",
        icon: Globe,
        color: "text-indigo-600",
        description: "Publish articles directly"
    },
];

export default function ConnectionsPage() {
    const [connected, setConnected] = useState<string[]>([]);
    const [showApiKeyInput, setShowApiKeyInput] = useState<string | null>(null);

    const handleConnect = (platformId: string) => {
        // In a real app, this would trigger OAuth
        // For now, we'll toggle the API key input
        setShowApiKeyInput(platformId === showApiKeyInput ? null : platformId);
    };

    const handleSaveKey = (platformId: string) => {
        // Simulate connection
        setConnected([...connected, platformId]);
        setShowApiKeyInput(null);
    };

    return (
        <div className="p-6 space-y-6 max-w-5xl mx-auto">
            {/* Header */}
            <div className="flex items-center gap-4">
                <Link href="/tools/content-planner">
                    <Button variant="ghost" size="sm">
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        Back
                    </Button>
                </Link>
                <div>
                    <h1 className="text-3xl font-bold">Platform Connections</h1>
                    <p className="text-slate-600 mt-1">Manage your social media and content integrations</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {PLATFORMS.map((platform) => {
                    const isConnected = connected.includes(platform.id);
                    const Icon = platform.icon;

                    return (
                        <Card key={platform.id} className={isConnected ? "border-emerald-200 bg-emerald-50/30" : ""}>
                            <CardHeader className="pb-4">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className={`p-2 rounded-lg bg-white shadow-sm ${platform.color}`}>
                                            <Icon className="h-6 w-6" />
                                        </div>
                                        <div>
                                            <CardTitle className="text-lg">{platform.name}</CardTitle>
                                            <CardDescription>{platform.description}</CardDescription>
                                        </div>
                                    </div>
                                    {isConnected ? (
                                        <Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-100 border-emerald-200">
                                            <CheckCircle2 className="h-3 w-3 mr-1" />
                                            Connected
                                        </Badge>
                                    ) : (
                                        <Badge variant="outline" className="text-slate-500">
                                            Not Connected
                                        </Badge>
                                    )}
                                </div>
                            </CardHeader>
                            <CardContent>
                                {isConnected ? (
                                    <div className="space-y-4">
                                        <div className="flex items-center justify-between text-sm text-slate-600 bg-white p-3 rounded border">
                                            <span className="flex items-center gap-2">
                                                <div className="w-2 h-2 rounded-full bg-emerald-500" />
                                                Active
                                            </span>
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                className="text-red-600 hover:text-red-700 hover:bg-red-50 h-8"
                                                onClick={() => setConnected(connected.filter(id => id !== platform.id))}
                                            >
                                                Disconnect
                                            </Button>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <Label htmlFor={`auto-${platform.id}`} className="text-sm font-medium">Auto-Publish</Label>
                                            <Switch id={`auto-${platform.id}`} />
                                        </div>
                                    </div>
                                ) : (
                                    <div className="space-y-4">
                                        <Button
                                            className="w-full"
                                            variant={showApiKeyInput === platform.id ? "secondary" : "outline"}
                                            onClick={() => handleConnect(platform.id)}
                                        >
                                            {showApiKeyInput === platform.id ? "Cancel" : "Connect Account"}
                                        </Button>

                                        {showApiKeyInput === platform.id && (
                                            <div className="space-y-3 p-4 bg-slate-50 rounded-lg border animate-in fade-in slide-in-from-top-2">
                                                <div className="space-y-2">
                                                    <Label className="text-xs font-medium text-slate-500">API Key / Access Token</Label>
                                                    <div className="relative">
                                                        <Key className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-400" />
                                                        <Input className="pl-9 bg-white" type="password" placeholder={`Enter ${platform.name} Token`} />
                                                    </div>
                                                </div>
                                                <Button size="sm" className="w-full" onClick={() => handleSaveKey(platform.id)}>
                                                    Save & Connect
                                                </Button>
                                                <p className="text-[10px] text-slate-400 text-center">
                                                    Your credentials are encrypted and stored securely.
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    );
                })}
            </div>
        </div>
    );
}
