import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus } from "lucide-react";
import Link from "next/link";
import { getAffiliateCompanies } from "@/lib/actions/affiliate-admin.actions";

export default async function AdminAffiliatesPage() {
    const companies = await getAffiliateCompanies();

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">Affiliate Companies</h1>
                    <p className="text-muted-foreground">Manage the global database of affiliate programs.</p>
                </div>
                <Link href="/admin/affiliates/create">
                    <Button>
                        <Plus className="mr-2 h-4 w-4" />
                        Add Company
                    </Button>
                </Link>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {companies.map((company: any) => (
                    <Card key={company._id}>
                        <CardHeader className="flex flex-row items-center gap-4 space-y-0">
                            {company.logo ? (
                                <img src={company.logo} alt={company.name} className="h-12 w-12 rounded-md object-contain bg-slate-50" />
                            ) : (
                                <div className="h-12 w-12 rounded-md bg-slate-100 flex items-center justify-center text-xl font-bold text-slate-500">
                                    {company.name[0]}
                                </div>
                            )}
                            <div>
                                <CardTitle className="text-base">{company.name}</CardTitle>
                                <CardDescription className="text-xs">{company.industry}</CardDescription>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <p className="text-sm text-slate-500 line-clamp-2 mb-4">
                                {company.summary || "No summary provided."}
                            </p>
                            <div className="flex justify-between items-center text-xs text-slate-500">
                                <span>{company.commissionRate || "N/A"} Comm.</span>
                                <Link href={`/admin/affiliates/${company._id}`}>
                                    <Button variant="outline" size="sm">Manage</Button>
                                </Link>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
}
