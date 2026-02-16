
"use client";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import {
    Select, SelectContent, SelectItem, SelectTrigger, SelectValue
} from "@/components/ui/select";

export interface FilterState {
    platforms: string[];
    status: string[];
    campaignId: string | null;
    offerId: string | null;
    funnelStage: string | null;
}

interface ContentFiltersProps {
    filters: FilterState;
    onChange: (filters: FilterState) => void;
    campaigns: any[];
    offers: any[];
}

export function ContentFilters({ filters, onChange, campaigns, offers }: ContentFiltersProps) {
    const handlePlatformToggle = (platform: string) => {
        const newPlatforms = filters.platforms.includes(platform)
            ? filters.platforms.filter(p => p !== platform)
            : [...filters.platforms, platform];
        onChange({ ...filters, platforms: newPlatforms });
    };

    const handleStatusToggle = (status: string) => {
        const newStatus = filters.status.includes(status)
            ? filters.status.filter(s => s !== status)
            : [...filters.status, status];
        onChange({ ...filters, status: newStatus });
    };

    return (
        <div className="space-y-6">
            <div>
                <h4 className="font-medium mb-3 text-sm">Campaigns</h4>
                <Select
                    value={filters.campaignId || "all"}
                    onValueChange={(val) => onChange({ ...filters, campaignId: val === "all" ? null : val })}
                >
                    <SelectTrigger>
                        <SelectValue placeholder="All Campaigns" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All Campaigns</SelectItem>
                        {campaigns.map(c => (
                            <SelectItem key={c._id} value={c._id}>{c.name}</SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>

            <div>
                <h4 className="font-medium mb-3 text-sm">Offers</h4>
                <Select
                    value={filters.offerId || "all"}
                    onValueChange={(val) => onChange({ ...filters, offerId: val === "all" ? null : val })}
                >
                    <SelectTrigger>
                        <SelectValue placeholder="All Offers" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All Offers</SelectItem>
                        {offers.map(o => (
                            <SelectItem key={o._id} value={o._id}>{o.name}</SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>

            <Separator />

            <div>
                <h4 className="font-medium mb-3 text-sm">Funnel Stage</h4>
                <div className="space-y-2">
                    {['awareness', 'consideration', 'conversion', 'retention'].map(stage => (
                        <div key={stage} className="flex items-center space-x-2">
                            <Checkbox
                                id={`stage-${stage}`}
                                checked={filters.funnelStage === stage}
                                onCheckedChange={(checked) => onChange({ ...filters, funnelStage: checked ? stage : null })}
                            />
                            <Label htmlFor={`stage-${stage}`} className="text-sm capitalize">{stage}</Label>
                        </div>
                    ))}
                </div>
            </div>

            <Separator />

            <div>
                <h4 className="font-medium mb-3 text-sm">Platforms</h4>
                <div className="space-y-2">
                    {['instagram', 'youtube', 'tiktok', 'linkedin', 'blog', 'email'].map(platform => (
                        <div key={platform} className="flex items-center space-x-2">
                            <Checkbox
                                id={`plat-${platform}`}
                                checked={filters.platforms.includes(platform)}
                                onCheckedChange={() => handlePlatformToggle(platform)}
                            />
                            <Label htmlFor={`plat-${platform}`} className="text-sm capitalize">{platform}</Label>
                        </div>
                    ))}
                </div>
            </div>

            <Separator />

            <div>
                <h4 className="font-medium mb-3 text-sm">Status</h4>
                <div className="space-y-2">
                    {['idea', 'draft', 'scheduled', 'published'].map(status => (
                        <div key={status} className="flex items-center space-x-2">
                            <Checkbox
                                id={`stat-${status}`}
                                checked={filters.status.includes(status)}
                                onCheckedChange={() => handleStatusToggle(status)}
                            />
                            <Label htmlFor={`stat-${status}`} className="text-sm capitalize">{status}</Label>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
