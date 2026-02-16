'use client';

import { useFieldArray, useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
    Form,
    FormControl,
    FormDescription,
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
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { Plus, Trash2 } from "lucide-react";
import { formatCurrency } from "@/lib/utils";

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

    // ... hooks ...
    const { fields, append, remove } = useFieldArray({
        control: form.control,
        name: "items",
    });

    const items = useWatch({
        control: form.control,
        name: "items",
    });

    // Calculate row amounts when quantity or rate changes
    useEffect(() => {
        items.forEach((item, index) => {
            const quantity = Number(item.quantity) || 0;
            const rate = Number(item.rate) || 0;
            const amount = quantity * rate;

            // Only update if difference is significant to avoid infinite loops if generic
            // But strict equality check should be fine
            if (item.amount !== amount) {
                form.setValue(`items.${index}.amount`, amount);
            }
        });
    }, [items, form]);

    const subtotal = items.reduce((sum, item) => sum + (item.amount || 0), 0);
    const tax = 0; // Tax logic can be added later
    const total = subtotal + tax;

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
                // Update
                const { updateInvoice } = await import("@/lib/actions/invoice.actions");
                result = await updateInvoice(initialData._id, data);
            } else {
                // Create
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
                            <FormItem>
                                <FormLabel>Client</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <FormControl>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select client" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        {clients.map((client) => (
                                            <SelectItem key={client._id} value={client._id}>
                                                {client.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="date"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Invoice Date</FormLabel>
                                <FormControl>
                                    <Input type="date" {...field} />
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
                                <FormLabel>Due Date</FormLabel>
                                <FormControl>
                                    <Input type="date" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>

                {/* Line Items */}
                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <h3 className="text-lg font-medium">Items</h3>
                    </div>

                    <div className="border rounded-md overflow-hidden">
                        <table className="w-full text-sm">
                            <thead className="bg-slate-50 border-b">
                                <tr>
                                    <th className="px-4 py-3 text-left font-medium text-slate-500 w-[40%]">Description</th>
                                    <th className="px-4 py-3 text-right font-medium text-slate-500 w-[15%]">Qty</th>
                                    <th className="px-4 py-3 text-right font-medium text-slate-500 w-[15%]">Rate</th>
                                    <th className="px-4 py-3 text-right font-medium text-slate-500 w-[15%]">Amount</th>
                                    <th className="px-4 py-3 w-[5%]"></th>
                                </tr>
                            </thead>
                            <tbody className="divide-y">
                                {fields.map((field, index) => (
                                    <tr key={field.id} className="bg-white group">
                                        <td className="p-2 align-top">
                                            <div className="space-y-2">
                                                {products && products.length > 0 && (
                                                    <Select
                                                        onValueChange={(productId) => {
                                                            const product = products.find(p => p._id === productId);
                                                            if (product) {
                                                                form.setValue(`items.${index}.description`, product.name + (product.description ? ` - ${product.description}` : ''));
                                                                form.setValue(`items.${index}.rate`, product.price);
                                                            }
                                                        }}
                                                    >
                                                        <SelectTrigger className="h-8 text-xs border-slate-200 bg-slate-50 text-slate-500">
                                                            <SelectValue placeholder="Load from Product..." />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            {products.map((p) => (
                                                                <SelectItem key={p._id} value={p._id}>
                                                                    <div className="flex justify-between w-full gap-4">
                                                                        <span>{p.name}</span>
                                                                        <span className="text-slate-400 font-mono">{formatCurrency(p.price)}</span>
                                                                    </div>
                                                                </SelectItem>
                                                            ))}
                                                        </SelectContent>
                                                    </Select>
                                                )}
                                                <FormField
                                                    control={form.control}
                                                    name={`items.${index}.description`}
                                                    render={({ field }) => (
                                                        <FormItem className="space-y-0">
                                                            <FormControl>
                                                                <Input placeholder="Item description" {...field} className="border-0 focus-visible:ring-0 px-2 shadow-none" />
                                                            </FormControl>
                                                        </FormItem>
                                                    )}
                                                />
                                            </div>
                                        </td>
                                        <td className="p-2 align-top">
                                            <FormField
                                                control={form.control}
                                                name={`items.${index}.quantity`}
                                                render={({ field }) => (
                                                    <FormItem className="space-y-0">
                                                        <FormControl>
                                                            <Input type="number" min="1" {...field} className="text-right border-0 focus-visible:ring-0 px-2 shadow-none" />
                                                        </FormControl>
                                                    </FormItem>
                                                )}
                                            />
                                        </td>
                                        <td className="p-2 align-top">
                                            <FormField
                                                control={form.control}
                                                name={`items.${index}.rate`}
                                                render={({ field }) => (
                                                    <FormItem className="space-y-0">
                                                        <FormControl>
                                                            <Input type="number" min="0" step="0.01" {...field} className="text-right border-0 focus-visible:ring-0 px-2 shadow-none" />
                                                        </FormControl>
                                                    </FormItem>
                                                )}
                                            />
                                        </td>
                                        <td className="p-4 text-right font-medium text-slate-700 align-top">
                                            {formatCurrency(items[index]?.amount || 0)}
                                        </td>
                                        <td className="p-2 text-center align-top">
                                            <Button
                                                type="button"
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => remove(index)}
                                                disabled={fields.length === 1}
                                                className="text-slate-400 hover:text-red-600 h-8 w-8 p-0"
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => append({ description: "", quantity: 1, rate: 0, amount: 0 })}
                        className="flex items-center gap-2"
                    >
                        <Plus className="h-4 w-4" /> Add Item
                    </Button>
                </div>

                {/* Totals and Notes */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 border-t pt-8">
                    <div className="space-y-4">
                        <FormField
                            control={form.control}
                            name="notes"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Notes / Terms</FormLabel>
                                    <FormControl>
                                        <Textarea placeholder="Payment terms, thank you note, etc." className="h-32" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>

                    <div className="bg-slate-50 p-6 rounded-lg space-y-4">
                        <div className="flex justify-between text-sm">
                            <span className="text-slate-500">Subtotal</span>
                            <span className="font-medium">{formatCurrency(subtotal)}</span>
                        </div>
                        {/* Tax field can be added here if needed */}
                        <div className="flex justify-between text-sm">
                            <span className="text-slate-500">Tax (0%)</span>
                            <span className="font-medium">{formatCurrency(tax)}</span>
                        </div>
                        <div className="border-t border-slate-200 pt-4 flex justify-between items-end">
                            <span className="text-base font-semibold">Total</span>
                            <span className="text-2xl font-bold">{formatCurrency(total)}</span>
                        </div>
                    </div>
                </div>

                {/* Footer Actions */}
                <div className="flex justify-end gap-4 border-t pt-6">
                    <Button type="button" variant="outline" onClick={() => router.back()}>
                        Cancel
                    </Button>
                    <FormField
                        control={form.control}
                        name="status"
                        render={({ field }) => (
                            <div className="flex items-center gap-2">
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <FormControl>
                                        <SelectTrigger className="w-[180px]">
                                            <SelectValue placeholder="Status" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        <SelectItem value="draft">Save as Draft</SelectItem>
                                        <SelectItem value="sent">Mark as Sent</SelectItem>
                                        <SelectItem value="paid">Mark as Paid</SelectItem>
                                    </SelectContent>
                                </Select>
                                <Button type="submit" disabled={isSubmitting} className="bg-blue-600 hover:bg-blue-700">
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
