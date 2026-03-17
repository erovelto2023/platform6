import { getAggregatedLinks } from "@/lib/actions/link-checker.actions";
import LinkChecker from "@/components/admin/LinkChecker";

export const dynamic = 'force-dynamic';

export default async function LinkCheckerPage() {
    const res = await getAggregatedLinks();
    
    if (!res.success || !res.links) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <p className="text-red-500 font-bold uppercase tracking-widest text-xs">Error loading links: {res.error}</p>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto">
            <LinkChecker initialLinks={res.links} />
        </div>
    );
}
