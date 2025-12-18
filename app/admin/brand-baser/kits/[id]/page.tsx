import { getBrandBase } from "@/lib/actions/brand-baser.actions";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { ColorPaletteManager } from "../../_components/color-palette-manager";

export default async function BrandKitDetailPage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const { id } = await params;
    const brandBase = await getBrandBase(id);

    if (!brandBase) {
        notFound();
    }

    return (
        <div className="p-6">
            <div className="max-w-4xl mx-auto">
                <Link
                    href="/admin/brand-baser/kits"
                    className="flex items-center text-sm text-slate-600 hover:text-slate-900 mb-6"
                >
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Back to Brand Kits
                </Link>

                <div className="mb-8">
                    <h1 className="text-3xl font-bold mb-1">{brandBase.name}</h1>
                    <p className="text-slate-600">
                        Manage your brand colors, logos, and visual identity
                    </p>
                </div>

                <ColorPaletteManager brandBase={brandBase} />
            </div>
        </div>
    );
}
