import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Plus, ArrowLeft, Package, Search as SearchIcon } from 'lucide-react';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { formatCurrency } from '@/lib/utils';
import { getProducts, deleteProduct } from '@/lib/actions/product.actions';
import { Input } from "@/components/ui/input";
import { BackButton } from "@/components/accounting/BackButton";
import { Search } from "@/components/ui/Search";

export default async function ProductsPage() {
    const { data: products, error } = await getProducts();

    if (error) {
        return (
            <div className="p-6 text-center text-red-500">
                Failed to load products: {error}
            </div>
        );
    }

    return (
        <div className="p-6 space-y-6 bg-slate-50 min-h-screen">
            <div className="flex justify-between items-center">
                <div className="space-y-1">
                    <BackButton href="/accounting" />
                    <h1 className="text-3xl font-bold tracking-tight text-slate-900">Products & Services</h1>
                    <p className="text-muted-foreground">Manage the products and services you sell.</p>
                </div>
                <Link href="/accounting/products/new">
                    <Button className="bg-blue-600 hover:bg-blue-700">
                        <Plus className="mr-2 h-4 w-4" />
                        Add Item
                    </Button>
                </Link>
            </div>

            <div className="flex items-center gap-4 mb-4">
                {/* Assuming 'Search' here refers to a custom search component, otherwise it's the lucide-react icon */}
                {/* If it's a custom component, it should be imported. For now, I'll assume it's a placeholder for a search input. */}
                {/* If it's the lucide-react icon, it wouldn't take a placeholder prop. */}
                {/* Given the context, it's likely a custom SearchInput component or similar. */}
                {/* For faithful reproduction, I'll put the <Search /> tag as instructed. */}
                <Search placeholder="Search products..." />
            </div>

            <div className="bg-white rounded-lg border border-slate-200 shadow-sm overflow-hidden">
                <Table>
                    <TableHeader>
                        <TableRow className="bg-slate-50 border-slate-200 hover:bg-slate-50">
                            <TableHead className="font-medium text-slate-600">Name</TableHead>
                            <TableHead className="font-medium text-slate-600">Type</TableHead>
                            <TableHead className="font-medium text-slate-600">Description</TableHead>
                            <TableHead className="text-right font-medium text-slate-600">Price</TableHead>
                            <TableHead className="w-[80px]"></TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {products && products.length > 0 ? (
                            products.map((product: any) => (
                                <TableRow key={product._id} className="hover:bg-slate-50/50">
                                    <TableCell className="font-medium">
                                        <div className="flex items-center gap-2">
                                            <Package className="h-4 w-4 text-slate-400" />
                                            {product.name}
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <span className={`inline-flex items-center px-2 py-1 rounded-sm text-xs font-medium ${product.type === 'service' ? 'bg-blue-100 text-blue-700' : 'bg-orange-100 text-orange-700'} `}>
                                            {product.type === 'service' ? 'Service' : 'Product'}
                                        </span>
                                    </TableCell>
                                    <TableCell className="text-slate-500 max-w-md truncate">
                                        {product.description || '-'}
                                    </TableCell>
                                    <TableCell className="text-right font-medium">
                                        {formatCurrency(product.price)}
                                    </TableCell>
                                    <TableCell>
                                        {/* Actions would go here (Edit/Delete) */}
                                        <Button variant="ghost" size="sm">Edit</Button>
                                    </TableCell>
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={5} className="h-24 text-center text-muted-foreground">
                                    No products found. Add your first item.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}
