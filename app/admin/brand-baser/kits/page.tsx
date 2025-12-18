import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Palette } from "lucide-react";
import { getBrandBases } from "@/lib/actions/brand-baser.actions";

export default async function BrandKitsPage() {
    const brandBases = await getBrandBases();

    return (
        <div className="p-6">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-2xl font-bold mb-1">Brand Kits</h1>
                    <p className="text-slate-600">
                        Manage your brand identities, colors, and fonts
                    </p>
                </div>
                <Link href="/admin/brand-baser/kits/create">
                    <Button>
                        <Plus className="h-4 w-4 mr-2" />
                        Create Brand Kit
                    </Button>
                </Link>
            </div>

            {brandBases.length === 0 ? (
                <Card className="border-2 border-dashed">
                    <CardContent className="py-16 text-center">
                        <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Palette className="h-8 w-8 text-purple-600" />
                        </div>
                        <h3 className="text-lg font-semibold mb-2">No Brand Kits Yet</h3>
                        <p className="text-slate-600 mb-6 max-w-md mx-auto">
                            Create your first brand kit to manage colors, fonts, logos, and visual identity.
                        </p>
                        <Link href="/admin/brand-baser/kits/create">
                            <Button size="lg">
                                <Plus className="h-4 w-4 mr-2" />
                                Create Your First Brand Kit
                            </Button>
                        </Link>
                    </CardContent>
                </Card>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {brandBases.map((base: any) => {
                        const colors = base.brandColors || [];

                        return (
                            <Link key={base._id} href={`/admin/brand-baser/kits/${base._id}`}>
                                <Card className="hover:shadow-md transition cursor-pointer h-full">
                                    <CardHeader>
                                        <div className="flex items-start justify-between">
                                            <div className="flex-1">
                                                <CardTitle className="text-lg mb-1">{base.name}</CardTitle>
                                                {base.description && (
                                                    <p className="text-sm text-slate-600 line-clamp-2">
                                                        {base.description}
                                                    </p>
                                                )}
                                            </div>
                                            <Palette className="h-5 w-5 text-purple-600 ml-2" />
                                        </div>
                                    </CardHeader>
                                    <CardContent>
                                        {/* Color Palette Preview */}
                                        {colors.length > 0 ? (
                                            <div className="mb-4">
                                                <p className="text-xs text-slate-600 mb-2">Brand Colors</p>
                                                <div className="flex gap-2 flex-wrap">
                                                    {colors.slice(0, 6).map((color: string, index: number) => (
                                                        <div
                                                            key={index}
                                                            className="w-10 h-10 rounded-lg border-2 border-white shadow-sm"
                                                            style={{ backgroundColor: color }}
                                                            title={color}
                                                        />
                                                    ))}
                                                    {colors.length > 6 && (
                                                        <div className="w-10 h-10 rounded-lg border-2 border-dashed border-slate-300 flex items-center justify-center text-xs text-slate-500">
                                                            +{colors.length - 6}
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="mb-4 p-4 bg-slate-50 rounded-lg border-2 border-dashed border-slate-200">
                                                <p className="text-xs text-slate-500 text-center">
                                                    No colors added yet
                                                </p>
                                            </div>
                                        )}

                                        {/* Stats */}
                                        <div className="flex items-center justify-between text-xs text-slate-500">
                                            <span>{colors.length} colors</span>
                                            <span className="text-purple-600 font-medium">View Kit →</span>
                                        </div>
                                    </CardContent>
                                </Card>
                            </Link>
                        );
                    })}
                </div>
            )}

            {/* Info Box */}
            {brandBases.length > 0 && (
                <Card className="mt-6 bg-purple-50 border-purple-200">
                    <CardContent className="p-6">
                        <h3 className="font-semibold mb-2">🎨 Brand Kit Features</h3>
                        <ul className="text-sm space-y-1 text-slate-700">
                            <li>• Create and manage multiple brand identities</li>
                            <li>• Define color palettes for each brand</li>
                            <li>• Upload logos and brand assets</li>
                            <li>• Set typography and font choices</li>
                            <li>• Export brand guidelines</li>
                        </ul>
                    </CardContent>
                </Card>
            )}
        </div>
    );
}
