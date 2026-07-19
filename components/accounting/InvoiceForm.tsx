'use client';

import { useFieldArray, useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { createInvoice } from "@/lib/actions/invoice.actions";
import { createProduct } from "@/lib/actions/product.actions";
import { ClientForm } from "@/components/accounting/ClientForm";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { Plus, Trash2, UserPlus } from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";

const invoiceItemSchema = z.object({
    description: z.string().min(1, "Description is required"),
    quantity: z.coerce.number().min(1, "Quantity must be at least 1"),
    rate: z.coerce.number().min(0, "Rate must be positive"),
    amount: z.number().min(0),
});

const formSchema = z.object({
    clientId: z.string().min(1, "Client is required"),
    date: z.string(),
    dueDate: z.string(),
    items: z.array(invoiceItemSchema).min(1, "At least one item is required"),
    notes: z.string().optional(),
    status: z.enum(["draft", "sent", "paid", "overdue"]),
});

type InvoiceFormValues = z.infer<typeof formSchema>;

interface InvoiceFormProps {
    clients: any[];
    products?: any[];
    initialData?: any;
}

export function InvoiceForm({ clients, products = [], initialData }: InvoiceFormProps) {
    const router = useRouter();
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Client Creation State
    const [clientList, setClientList] = useState(clients);
    const [isClientOpen, setIsClientOpen] = useState(false);

    // Product Creation State
    const [productList, setProductList] = useState(products);
    const [isProductOpen, setIsProductOpen] = useState(false);
    const [newProductName, setNewProductName] = useState("");
    const [newProductPrice, setNewProductPrice] = useState("");
    const [newProductDesc, setNewProductDesc] = useState("");

    const form = useForm<InvoiceFormValues>({
        resolver: zodResolver(formSchema) as any,
        defaultValues: initialData ? {
            ...initialData,
            clientId: initialData.clientId?._id || initialData.clientId || "",
            date: new Date(initialData.date).toISOString().split('T')[0],
            dueDate: new Date(initialData.dueDate).toISOString().split('T')[0],
            items: initialData.items.map((item: any) => ({
                ...item,
                amount: Number(item.amount),
                quantity: Number(item.quantity),
                rate: Number(item.rate),
            })),
        } : {
            clientId: "",
            date: new Date().toISOString().split('T')[0],
            dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 14 days from now
            items: [
                { description: "", quantity: 1, rate: 0, amount: 0 }
            ],
            notes: "",
            status: "draft",
        },
    });

    const { fields, append, remove } = useFieldArray({
        control: form.control,
        name: "items",
    });

    const items = form.watch("items") || [];

    // Calculate row amounts when quantity or rate changes
    useEffect(() => {
        items.forEach((item: any, index: number) => {
            const quantity = Number(item.quantity) || 0;
            const rate = Number(item.rate) || 0;
            const amount = quantity * rate;

            if (item.amount !== amount) {
                form.setValue(`items.${index}.amount`, amount);
            }
        });
    }, [items, form]);

    const subtotal = items.reduce((sum: number, item: any) => sum + (item.amount || 0), 0);
    const tax = 0; 
    const total = subtotal + tax;

    const handleAddProduct = async () => {
        if (!newProductName || !newProductPrice) {
            toast.error("Name and Price are required");
            return;
        }

        try {
            const result = await createProduct({
                name: newProductName,
                price: Number(newProductPrice),
                description: newProductDesc || undefined,
                type: 'service',
            });

            if (result.success && result.data) {
                toast.success("Product created successfully");
                const newProd = result.data;
                setProductList(prev => [...prev, newProd].sort((a, b) => a.name.localeCompare(b.name)));
                
                // Clear fields
                setNewProductName("");
                setNewProductPrice("");
                setNewProductDesc("");
                setIsProductOpen(false);
            } else {
                toast.error(result.error || "Failed to create product");
            }
        } catch (error) {
            toast.error("Failed to add product");
        }
    };

    async function onSubmit(values: z.infer<typeof formSchema>) {
        setIsSubmitting(true);
        try {
            const data = {
                ...values,
                date: new Date(values.date),
                dueDate: new Date(values.dueDate),
                subtotal,
                tax,
                total,
            };

            let result;
            if (initialData) {
                const { updateInvoice } = await import("@/lib/actions/invoice.actions");
                result = await updateInvoice(initialData._id, data);
            } else {
                result = await createInvoice(data);
            }

            if (result.success) {
                toast.success(initialData ? "Invoice updated successfully" : "Invoice created successfully");
                router.push("/accounting/invoices");
                router.refresh();
            } else {
                toast.error(result.error || "Failed to save invoice");
            }
        } catch (error) {
            toast.error("Something went wrong");
        } finally {
            setIsSubmitting(false);
        }
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">

                {/* Invoice Header Details */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <FormField
                        control={form.control}
                        name="clientId"
                        render={({ field }) => (
                            <FormItem className="flex flex-col justify-end">
                                <FormLabel className="text-xs font-bold text-slate-400 mb-1.5">Client</FormLabel>
                                <div className="flex gap-2">
                                    <div className="flex-1">
                                        <Select onValueChange={field.onChange} value={field.value}>
                                            <FormControl>
                                                <SelectTrigger className="bg-slate-900 border-slate-800 text-white rounded-xl focus:border-indigo-500 h-[42px]">
                                                    <SelectValue placeholder="Select client" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                {clientList.map((client) => (
                                                    <SelectItem key={client._id} value={client._id}>
                                                        {client.name}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    
                                    {/* Inline Add Client Dialog */}
                                    <Dialog open={isClientOpen} onOpenChange={setIsClientOpen}>
                                        <DialogTrigger asChild>
                                            <Button 
                                                type="button" 
                                                variant="outline" 
                                                className="px-3 border-slate-800 bg-slate-900 hover:bg-slate-800 text-slate-300 h-[42px] rounded-xl"
                                                title="Add New Client"
                                            >
                                                <UserPlus className="w-4 h-4" />
                                            </Button>
                                        </DialogTrigger>
                                        <DialogContent className="bg-[#0d1117] border-slate-800 text-white dark sm:max-w-[600px] max-h-[85vh] overflow-y-auto">
                                            <DialogHeader>
                                                <DialogTitle>Add New Client</DialogTitle>
                                                <DialogDescription className="text-slate-400 text-xs">
                                                    Create a client profile to generate this invoice.
                                                </DialogDescription>
                                            </DialogHeader>
                                            <div className="pt-2">
                                                <ClientForm 
                                                    onSuccess={(newClient) => {
                                                        setClientList(prev => [newClient, ...prev]);
                                                        form.setValue("clientId", newClient._id);
                                                        setIsClientOpen(false);
                                                    }}
                                                />
                                            </div>
                                        </DialogContent>
                                    </Dialog>
                                </div>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="date"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="text-xs font-bold text-slate-400 mb-1.5">Invoice Date</FormLabel>
                                <FormControl>
                                    <Input type="date" {...field} className="bg-slate-900 border-slate-800 text-white rounded-xl focus:border-indigo-500 h-[42px] [color-scheme:dark]" />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="dueDate"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="text-xs font-bold text-slate-400 mb-1.5">Due Date</FormLabel>
                                <FormControl>
                                    <Input type="date" {...field} className="bg-slate-900 border-slate-800 text-white rounded-xl focus:border-indigo-500 h-[42px] [color-scheme:dark]" />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>

                {/* Line Items */}
                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <h3 className="text-sm font-black text-white uppercase tracking-wider">Items</h3>
                        
                        {/* Inline Add Product Dialog */}
                        <Dialog open={isProductOpen} onOpenChange={setIsProductOpen}>
                            <DialogTrigger asChild>
                                <Button 
                                    type="button" 
                                    variant="outline" 
                                    className="bg-slate-900 hover:bg-slate-800 text-slate-300 font-bold rounded-xl border border-slate-800 px-3.5 py-2 text-xs flex items-center gap-1.5"
                                >
                                    <Plus className="w-3.5 h-3.5 text-indigo-400" /> Add Product to Catalog
                                </Button>
                            </DialogTrigger>
                            <DialogContent className="bg-[#0d1117] border-slate-800 text-white dark max-w-md">
                                <DialogHeader>
                                    <DialogTitle>Add Product to Catalog</DialogTitle>
                                    <DialogDescription className="text-slate-400 text-xs">
                                        Create a product or service to easily load it into invoices.
                                    </DialogDescription>
                                </DialogHeader>
                                <div className="space-y-4 pt-2">
                                    <div className="space-y-1.5">
                                        <label className="text-xs font-bold text-slate-400">Product Name *</label>
                                        <input 
                                            value={newProductName} 
                                            onChange={e => setNewProductName(e.target.value)} 
                                            placeholder="e.g. Consulting Service"
                                            className="w-full bg-[#07090e] border border-slate-700 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-indigo-500" 
                                        />
                                    </div>
                                    <div className="space-y-1.5">
                                        <label className="text-xs font-bold text-slate-400">Price ($) *</label>
                                        <input 
                                            type="number"
                                            value={newProductPrice} 
                                            onChange={e => setNewProductPrice(e.target.value)} 
                                            placeholder="e.g. 150.00"
                                            className="w-full bg-[#07090e] border border-slate-700 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-indigo-500" 
                                        />
                                    </div>
                                    <div className="space-y-1.5">
                                        <label className="text-xs font-bold text-slate-400">Description</label>
                                        <textarea 
                                            value={newProductDesc} 
                                            onChange={e => setNewProductDesc(e.target.value)} 
                                            placeholder="Details of the product or service..."
                                            className="w-full bg-[#07090e] border border-slate-700 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-indigo-500 h-20" 
                                        />
                                    </div>
                                    <div className="flex justify-end gap-2 pt-2">
                                        <Button 
                                            type="button" 
                                            variant="ghost" 
                                            className="text-slate-400 hover:text-white"
                                            onClick={() => setIsProductOpen(false)}
                                        >
                                            Cancel
                                        </Button>
                                        <Button 
                                            type="button" 
                                            onClick={handleAddProduct}
                                            className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl"
                                        >
                                            Create Product
                                        </Button>
                                    </div>
                                </div>
                            </DialogContent>
                        </Dialog>
                    </div>

                    <div className="border border-slate-800/80 rounded-2xl overflow-hidden bg-slate-900/10">
                        <table className="w-full text-sm">
                            <thead className="bg-slate-900/60 border-b border-slate-800">
                                <tr>
                                    <th className="px-4 py-3 text-left text-[10px] font-extrabold text-slate-500 uppercase tracking-wider w-[45%]">Description</th>
                                    <th className="px-4 py-3 text-right text-[10px] font-extrabold text-slate-500 uppercase tracking-wider w-[15%]">Qty</th>
                                    <th className="px-4 py-3 text-right text-[10px] font-extrabold text-slate-500 uppercase tracking-wider w-[15%]">Rate</th>
                                    <th className="px-4 py-3 text-right text-[10px] font-extrabold text-slate-500 uppercase tracking-wider w-[20%]">Amount</th>
                                    <th className="px-4 py-3 w-[5%]"></th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-800/40">
                                {fields.map((field, index) => (
                                    <tr key={field.id} className="bg-slate-900/10 hover:bg-slate-900/20 transition-colors group">
                                        <td className="p-3 align-top">
                                            <div className="space-y-2">
                                                <Select
                                                    onValueChange={(productId) => {
                                                        const product = productList.find(p => p._id === productId);
                                                        if (product) {
                                                            form.setValue(`items.${index}.description`, product.name + (product.description ? ` - ${product.description}` : ''));
                                                            form.setValue(`items.${index}.rate`, product.price);
                                                        }
                                                    }}
                                                >
                                                    <SelectTrigger className="h-9 text-xs border-slate-800 bg-[#07090e] text-slate-400 rounded-xl focus:border-indigo-500">
                                                        <SelectValue placeholder={productList.length === 0 ? "No products in catalog. Add one above!" : "Load from Product Catalog..."} />
                                                    </SelectTrigger>
                                                    {productList.length > 0 && (
                                                        <SelectContent>
                                                            {productList.map((p) => (
                                                                <SelectItem key={p._id} value={p._id}>
                                                                    <div className="flex justify-between w-full gap-4">
                                                                        <span>{p.name}</span>
                                                                        <span className="text-slate-400 font-mono">{formatCurrency(p.price)}</span>
                                                                    </div>
                                                                </SelectItem>
                                                            ))}
                                                        </SelectContent>
                                                    )}
                                                </Select>
                                                <FormField
                                                    control={form.control}
                                                    name={`items.${index}.description`}
                                                    render={({ field }) => (
                                                        <FormItem className="space-y-0">
                                                            <FormControl>
                                                                <Input 
                                                                    placeholder="Item description..." 
                                                                    {...field} 
                                                                    className="bg-[#07090e] border border-slate-800 rounded-xl focus:border-indigo-500 px-3 py-2 text-white text-sm focus-visible:ring-0 focus-visible:ring-offset-0" 
                                                                />
                                                            </FormControl>
                                                        </FormItem>
                                                    )}
                                                />
                                            </div>
                                        </td>
                                        <td className="p-3 align-top">
                                            <FormField
                                                control={form.control}
                                                name={`items.${index}.quantity`}
                                                render={({ field }) => (
                                                    <FormItem className="space-y-0">
                                                        <FormControl>
                                                            <Input 
                                                                type="number" 
                                                                min="1" 
                                                                {...field} 
                                                                className="bg-[#07090e] border border-slate-800 rounded-xl focus:border-indigo-500 px-3 py-2 text-white text-sm text-right focus-visible:ring-0 focus-visible:ring-offset-0" 
                                                            />
                                                        </FormControl>
                                                    </FormItem>
                                                )}
                                            />
                                        </td>
                                        <td className="p-3 align-top">
                                            <FormField
                                                control={form.control}
                                                name={`items.${index}.rate`}
                                                render={({ field }) => (
                                                    <FormItem className="space-y-0">
                                                        <FormControl>
                                                            <Input 
                                                                type="number" 
                                                                min="0" 
                                                                step="0.01" 
                                                                {...field} 
                                                                className="bg-[#07090e] border border-slate-800 rounded-xl focus:border-indigo-500 px-3 py-2 text-white text-sm text-right focus-visible:ring-0 focus-visible:ring-offset-0" 
                                                            />
                                                        </FormControl>
                                                    </FormItem>
                                                )}
                                            />
                                        </td>
                                        <td className="p-4 text-right font-bold text-white text-sm align-top">
                                            {formatCurrency(items[index]?.amount || 0)}
                                        </td>
                                        <td className="p-3 text-center align-top">
                                            <Button
                                                type="button"
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => remove(index)}
                                                disabled={fields.length === 1}
                                                className="text-slate-500 hover:text-rose-400 disabled:opacity-30 h-9 w-9 p-0"
                                            >
                                                <Trash2 className="h-4.5 w-4.5" />
                                            </Button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    <Button
                        type="button"
                        onClick={() => append({ description: "", quantity: 1, rate: 0, amount: 0 })}
                        className="bg-slate-900 hover:bg-slate-800 text-slate-300 font-bold rounded-xl border border-slate-800 px-3.5 py-1.5 text-xs flex items-center gap-1.5"
                    >
                        <Plus className="h-3.5 w-3.5" /> Add Item
                    </Button>
                </div>

                {/* Totals and Notes */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 border-t border-slate-800/60 pt-8">
                    <div className="space-y-4">
                        <FormField
                            control={form.control}
                            name="notes"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-xs font-bold text-slate-400 mb-1.5">Notes / Terms</FormLabel>
                                    <FormControl>
                                        <Textarea 
                                            placeholder="Payment terms, thank you note, etc." 
                                            className="bg-slate-900 border-slate-800 text-white rounded-xl focus:border-indigo-500 h-32 text-sm placeholder-slate-500" 
                                            {...field} 
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>

                    <div className="bg-slate-900/40 border border-slate-800 p-6 rounded-2xl space-y-4">
                        <div className="flex justify-between text-sm">
                            <span className="text-slate-400 font-bold">Subtotal</span>
                            <span className="font-bold text-white">{formatCurrency(subtotal)}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                            <span className="text-slate-400 font-bold">Tax (0%)</span>
                            <span className="font-bold text-white">{formatCurrency(tax)}</span>
                        </div>
                        <div className="border-t border-slate-850 pt-4 flex justify-between items-end">
                            <span className="text-sm font-black uppercase text-indigo-400 tracking-wider">Total</span>
                            <span className="text-2xl font-black text-indigo-400">{formatCurrency(total)}</span>
                        </div>
                    </div>
                </div>

                {/* Footer Actions */}
                <div className="flex justify-end gap-4 border-t border-slate-800/60 pt-6">
                    <Button 
                        type="button" 
                        onClick={() => router.back()}
                        className="bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold border border-slate-700 rounded-xl px-5"
                    >
                        Cancel
                    </Button>
                    <FormField
                        control={form.control}
                        name="status"
                        render={({ field }) => (
                            <div className="flex items-center gap-2">
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <FormControl>
                                        <SelectTrigger className="bg-slate-900 border-slate-800 text-white rounded-xl focus:border-indigo-500 w-[180px]">
                                            <SelectValue placeholder="Status" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        <SelectItem value="draft">Save as Draft</SelectItem>
                                        <SelectItem value="sent">Mark as Sent</SelectItem>
                                        <SelectItem value="paid">Mark as Paid</SelectItem>
                                    </SelectContent>
                                </Select>
                                <Button 
                                    type="submit" 
                                    disabled={isSubmitting} 
                                    className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl px-5 shadow-lg shadow-indigo-600/20"
                                >
                                    {isSubmitting ? "Saving..." : "Save Invoice"}
                                </Button>
                            </div>
                        )}
                    />
                </div>
            </form>
        </Form>
    );
}
