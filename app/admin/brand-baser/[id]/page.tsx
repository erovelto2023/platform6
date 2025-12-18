import { getBrandBase } from "@/lib/actions/brand-baser.actions";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Download, FileText } from "lucide-react";
import { BrandBaseWizard } from "../_components/brand-base-wizard";
import { ExportButton } from "../_components/export-button";

export default async function BrandBaseDetailPage({
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
        <div className="min-h-screen bg-slate-50 py-8 px-6">
            <div className="max-w-4xl mx-auto mb-6">
                <Link
                    href="/admin/brand-baser"
                    className="flex items-center text-sm text-slate-600 hover:text-slate-900 mb-4"
                >
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Back to BrandBaser
                </Link>

                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold mb-1">Edit Brand Base</h1>
                        <p className="text-slate-600">
                            Complete all 20 questions to build your brand foundation
                        </p>
                    </div>
                    <ExportButton brandBaseId={brandBase._id} brandName={brandBase.name} />
                </div>
            </div>

            <BrandBaseWizard brandBase={brandBase} />
        </div>
    );
}
