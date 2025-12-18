import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { getAffiliateCompany, getAffiliateProducts } from "@/lib/actions/affiliate-admin.actions";
import { ArrowLeft, ExternalLink, CheckCircle, Globe } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import CompanyEditForm from "./_components/company-edit-form";
import ProductManager from "./_components/product-manager";

export default async function AdminAffiliateDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const company = await getAffiliateCompany(id);
    const products = await getAffiliateProducts(id);

    if (!company) return notFound();

    return (
        <div className="p-6 max-w-6xl mx-auto">
            <div className="mb-6">
                <Link href="/admin/affiliates" className="text-sm text-slate-500 hover:text-slate-900 flex items-center mb-2">
                    <ArrowLeft className="h-4 w-4 mr-1" /> Back to List
                </Link>
                <div className="flex justify-between items-start">
                    <div className="flex items-center gap-4">
                        {company.logo ? (
                            <img src={company.logo} alt={company.name} className="h-20 w-20 rounded-xl object-contain bg-white border shadow-sm" />
                        ) : (
                            <div className="h-20 w-20 rounded-xl bg-slate-100 flex items-center justify-center text-3xl font-bold text-slate-500 shadow-sm">
                                {company.name[0]}
                            </div>
                        )}
                        <div>
                            <div className="flex items-center gap-2">
                                <h1 className="text-3xl font-bold text-slate-900">{company.name}</h1>
                                {company.isVerified && <CheckCircle className="h-5 w-5 text-blue-500" />}
                                {!company.isPublic && <Badge variant="secondary">Draft</Badge>}
                            </div>
                            <div className="flex items-center gap-2 mt-1 text-slate-500">
                                <span>{company.industry}</span>
                                <span>•</span>
                                <span>{company.affiliateNetwork || "Direct"}</span>
                            </div>
                        </div>
                    </div>
                    <CompanyEditForm company={company} />
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Info */}
                <div className="lg:col-span-2 space-y-8">
                    <Card>
                        <CardHeader>
                            <CardTitle>About</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div>
                                <h3 className="text-sm font-medium text-slate-500 mb-1">Summary</h3>
                                <p className="text-slate-900">{company.summary || "No summary provided."}</p>
                            </div>
                            <div>
                                <h3 className="text-sm font-medium text-slate-500 mb-1">Description</h3>
                                <p className="text-slate-700 whitespace-pre-wrap leading-relaxed">{company.description || "No description provided."}</p>
                            </div>

                            <div className="grid grid-cols-2 gap-4 pt-4 border-t">
                                <div>
                                    <h3 className="text-sm font-medium text-slate-500 mb-1">Target Audience</h3>
                                    <p className="text-slate-900">{company.targetAudience || "N/A"}</p>
                                </div>
                                <div>
                                    <h3 className="text-sm font-medium text-slate-500 mb-1">Website</h3>
                                    {company.website ? (
                                        <a href={company.website} target="_blank" rel="noreferrer" className="text-indigo-600 hover:underline flex items-center">
                                            {company.website} <ExternalLink className="h-3 w-3 ml-1" />
                                        </a>
                                    ) : (
                                        <span className="text-slate-400">N/A</span>
                                    )}
                                </div>
                            </div>

                            <div className="pt-4 border-t">
                                <h3 className="text-sm font-medium text-slate-500 mb-2">Keywords & Niches</h3>
                                <div className="flex flex-wrap gap-2">
                                    {company.niches?.map((niche: string, i: number) => (
                                        <Badge key={`n-${i}`} variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">{niche}</Badge>
                                    ))}
                                    {company.keywords?.map((kw: string, i: number) => (
                                        <Badge key={`k-${i}`} variant="secondary">{kw}</Badge>
                                    ))}
                                    {(!company.niches?.length && !company.keywords?.length) && (
                                        <span className="text-slate-400 text-sm">No keywords or niches tagged.</span>
                                    )}
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Products Section */}
                    <ProductManager companyId={company._id} initialProducts={products} />
                </div>

                {/* Sidebar Info */}
                <div className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-lg">Program Details</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4 text-sm">
                            <div className="p-3 bg-slate-50 rounded-lg">
                                <span className="text-xs font-medium text-slate-500 uppercase block mb-1">Commission</span>
                                <div className="font-semibold text-lg text-slate-900">
                                    {company.commissionRate || "N/A"}
                                    {company.commissionType && <span className="text-xs font-normal text-slate-500 ml-1">({company.commissionType})</span>}
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <span className="text-slate-500 block mb-1">Cookie Duration</span>
                                    <span className="font-medium">{company.cookieDuration ? `${company.cookieDuration} days` : "Unknown"}</span>
                                </div>
                                <div>
                                    <span className="text-slate-500 block mb-1">Payout Threshold</span>
                                    <span className="font-medium">{company.payoutThreshold ? `$${company.payoutThreshold}` : "None"}</span>
                                </div>
                            </div>

                            <div>
                                <span className="text-slate-500 block mb-1">Payout Frequency</span>
                                <span className="font-medium capitalize">{company.payoutFrequency || "Unknown"}</span>
                            </div>

                            <div className="pt-4 border-t">
                                <span className="text-slate-500 block mb-2">Application Link</span>
                                {company.signupUrl ? (
                                    <Button className="w-full" variant="outline" asChild>
                                        <a href={company.signupUrl} target="_blank" rel="noreferrer">
                                            Apply to Program
                                            <ExternalLink className="h-3 w-3 ml-2" />
                                        </a>
                                    </Button>
                                ) : (
                                    <div className="text-center p-2 bg-slate-100 rounded text-slate-500">Not provided</div>
                                )}
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle className="text-lg">Admin Stats</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4 text-sm">
                            <div>
                                <div className="flex justify-between mb-1">
                                    <span className="text-slate-600">Trust Score</span>
                                    <span className="font-medium">{company.trustScore}/100</span>
                                </div>
                                <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                                    <div
                                        className={`h-full ${company.trustScore >= 80 ? 'bg-green-500' : company.trustScore >= 50 ? 'bg-yellow-500' : 'bg-red-500'}`}
                                        style={{ width: `${company.trustScore}%` }}
                                    />
                                </div>
                            </div>

                            <div className="flex justify-between items-center py-2 border-t border-b">
                                <span className="text-slate-600">Visibility</span>
                                <Badge variant={company.isPublic ? "default" : "secondary"}>
                                    {company.isPublic ? "Public" : "Draft"}
                                </Badge>
                            </div>

                            <div className="text-xs text-slate-400">
                                ID: {company._id}
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
