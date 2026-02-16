
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import {
    Facebook, Instagram, Linkedin, Twitter, Youtube, Mail, FileText,
    Video, Mic, Layout, Hash
} from "lucide-react";
import { format } from "date-fns";

export interface ContentCardProps {
    item: any;
    onClick?: (item: any) => void;
    className?: string;
}

const PlatformIcon = ({ platform }: { platform: string }) => {
    switch (platform.toLowerCase()) {
        case 'facebook': return <Facebook className="w-3 h-3 text-blue-600" />;
        case 'instagram': return <Instagram className="w-3 h-3 text-pink-600" />;
        case 'linkedin': return <Linkedin className="w-3 h-3 text-blue-700" />;
        case 'twitter': return <Twitter className="w-3 h-3 text-sky-500" />;
        case 'youtube': return <Youtube className="w-3 h-3 text-red-600" />;
        case 'tiktok': return <Video className="w-3 h-3 text-black" />; // Fallback icon
        case 'pinterest': return <Layout className="w-3 h-3 text-red-700" />;
        case 'email': return <Mail className="w-3 h-3 text-amber-600" />;
        case 'blog': return <FileText className="w-3 h-3 text-slate-600" />;
        case 'podcast': return <Mic className="w-3 h-3 text-purple-600" />;
        case 'threads': return <Hash className="w-3 h-3 text-black" />;
        default: return <FileText className="w-3 h-3 text-slate-400" />;
    }
};

export function ContentCard({ item, onClick, className }: ContentCardProps) {
    const getStatusColor = (status: string) => {
        switch (status) {
            case 'published': return 'bg-green-100 text-green-700 border-green-200';
            case 'scheduled': return 'bg-blue-100 text-blue-700 border-blue-200';
            case 'editing': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
            case 'draft': return 'bg-slate-100 text-slate-700 border-slate-200';
            case 'idea': return 'bg-purple-100 text-purple-700 border-purple-200';
            default: return 'bg-slate-100 text-slate-700';
        }
    };

    const getFunnelColor = (stage: string) => {
        switch (stage) {
            case 'awareness': return 'bg-indigo-50 text-indigo-600';
            case 'consideration': return 'bg-violet-50 text-violet-600';
            case 'conversion': return 'bg-emerald-50 text-emerald-600';
            case 'retention': return 'bg-rose-50 text-rose-600';
            default: return 'hidden';
        }
    };

    return (
        <div
            onClick={() => onClick?.(item)}
            className={cn(
                "group relative bg-white p-2.5 rounded-lg border border-slate-200 shadow-sm hover:shadow-md transition-all cursor-pointer flex flex-col gap-2",
                className
            )}
        >
            {/* Header: Platform & Time */}
            <div className="flex justify-between items-center text-xs text-slate-500">
                <div className="flex items-center gap-1.5">
                    {(item.platforms || []).map((p: any, i: number) => (
                        <div key={i} className="p-1 rounded-full bg-slate-50 border border-slate-100">
                            <PlatformIcon platform={p.name} />
                        </div>
                    ))}
                    {(!item.platforms || item.platforms.length === 0) && (
                        <PlatformIcon platform={item.contentType || 'blog'} />
                    )}
                </div>
                {item.scheduledFor && (
                    <span className="font-medium opacity-80">
                        {format(new Date(item.scheduledFor), 'h:mm a')}
                    </span>
                )}
            </div>

            {/* Title */}
            <h4 className="text-sm font-semibold text-slate-900 leading-tight line-clamp-2">
                {item.title}
            </h4>

            {/* Tags / Badges */}
            <div className="flex flex-wrap gap-1 mt-auto">
                <Badge variant="outline" className={cn("text-[10px] px-1.5 py-0 h-5 border-0 font-medium capitalize", getStatusColor(item.status))}>
                    {item.status}
                </Badge>

                {item.campaignId && (
                    <Badge variant="outline" className="text-[10px] px-1.5 py-0 h-5 bg-orange-50 text-orange-700 border-orange-100">
                        Campaign
                    </Badge>
                )}

                {item.offerId && (
                    <Badge variant="outline" className="text-[10px] px-1.5 py-0 h-5 bg-teal-50 text-teal-700 border-teal-100">
                        $ Offer
                    </Badge>
                )}

                {item.funnelStage && (
                    <Badge variant="outline" className={cn("text-[10px] px-1.5 py-0 h-5 border-0 capitalize", getFunnelColor(item.funnelStage))}>
                        {item.funnelStage}
                    </Badge>
                )}
            </div>

            {/* Hover Actions (Edit/Delete placeholder) */}
            <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                {/* Add actions here later */}
            </div>
        </div>
    );
}
