
import { getProducts } from "@/lib/actions/product.actions";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Copy, ExternalLink, Clock, MoreHorizontal } from "lucide-react";
import Link from "next/link";
import { ClientCopyButton } from "./ClientCopyButton";
import { EmbedButton } from "./EmbedButton";

export default async function ServicesPage() {
    // Fetch only bookable products
    // We might need to update getProducts to filter by isBookable, or just fetch all and filter here for now
    const { data: products } = await getProducts();
    const bookableServices = products.filter((p: any) => p.isBookable);

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-xl font-semibold text-slate-900">Services</h2>
                    <p className="text-sm text-slate-500">Manage the services clients can book.</p>
                </div>
                <Link href="/accounting/products/new"> {/* We should probably make a streamlined 'New Service' flow later */}
                    <Button>
                        <Plus className="mr-2 h-4 w-4" /> New Service
                    </Button>
                </Link>
            </div>

            {bookableServices.length === 0 ? (
                <div className="text-center py-12 border-2 border-dashed border-slate-200 rounded-lg">
                    <h3 className="text-lg font-medium text-slate-900">No services found</h3>
                    <p className="text-slate-500 mb-4">Create your first bookable service to get started.</p>
                    <Link href="/accounting/products/new">
                        <Button variant="outline">Create Service</Button>
                    </Link>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                    {bookableServices.map((service: any) => (
                        <Card key={service._id} className="overflow-hidden">
                            <div className="h-2 bg-blue-500" /> {/* Brand color strip */}
                            <CardHeader>
                                <div className="flex justify-between items-start">
                                    <div className="space-y-1">
                                        <CardTitle className="text-lg">{service.name}</CardTitle>
                                        <div className="flex items-center text-sm text-slate-500">
                                            <Clock className="mr-1 h-3 w-3" />
                                            {service.duration} mins
                                        </div>
                                    </div>
                                    {/* Dropdown for Edit/Delete could go here */}
                                </div>
                                <CardDescription className="line-clamp-2 mt-2">
                                    {service.description || "No description provided."}
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="text-sm font-medium text-slate-900">
                                    {service.price === 0 ? 'Free' : `$${service.price.toFixed(2)}`}
                                </div>
                            </CardContent>
                            <CardFooter className="bg-slate-50 p-4 flex gap-2 border-t border-slate-100">
                                <ClientCopyButton
                                    url={`${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/book/${service._id}`}
                                />
                                <EmbedButton serviceId={service._id} />
                                <Link href={`/book/${service._id}`} target="_blank" className="flex-1">
                                    <Button variant="outline" className="w-full">
                                        <ExternalLink className="mr-2 h-3 w-3" />
                                        View Page
                                    </Button>
                                </Link>
                                <Link href={`/accounting/products/${service._id}/edit`}>
                                    <Button variant="ghost" size="icon">
                                        <MoreHorizontal className="h-4 w-4 text-slate-500" />
                                    </Button>
                                </Link>
                            </CardFooter>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
}

// Inline Client Component for Copy functionality (to avoid creating a separate file if possible, or extract)
// Actually, better to extract or use a simple client wrapper if we can't do inline in server file easily without hydration issues.
// Let's create a separate component file for the Copy Button to be clean.
