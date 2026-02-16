'use client';

import { useForm } from "react-hook-form";
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
import { createExpense } from "@/lib/actions/expense.actions";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
// import { Calendar } from "@/components/ui/calendar"; // Not using yet
import { Input as DateInput } from "@/components/ui/input"; // Simple date input for now

const formSchema = z.object({
    vendor: z.string().min(2, {
        message: "Vendor name is required.",
    }),
    category: z.string().min(1, {
        message: "Category is required.",
    }),
    amount: z.coerce.number().min(0.01, {
        message: "Amount must be greater than 0.",
    }),
    date: z.string(), // YYYY-MM-DD
    paymentMethod: z.string().optional(),
    description: z.string().optional(),
});

type ExpenseFormValues = z.infer<typeof formSchema>;

export function ExpenseForm() {
    const router = useRouter();
    const [isSubmitting, setIsSubmitting] = useState(false);

    const form = useForm<ExpenseFormValues>({
        resolver: zodResolver(formSchema) as any,
        defaultValues: {
            vendor: "",
            category: "",
            amount: 0,
            date: new Date().toISOString().split('T')[0],
            paymentMethod: "",
            description: "",
        },
    });

    async function onSubmit(values: z.infer<typeof formSchema>) {
        setIsSubmitting(true);
        try {
            const result = await createExpense({
                ...values,
                date: new Date(values.date),
            });

            if (result.success) {
                toast.success("Expense added successfully");
                router.push("/accounting/expenses");
                router.refresh();
            } else {
                toast.error(result.error || "Failed to add expense");
            }
        } catch (error) {
            toast.error("Something went wrong");
        } finally {
            setIsSubmitting(false);
        }
    }

    const categories = [
        "Office Supplies",
        "Software & Subscriptions",
        "Advertising",
        "Travel",
        "Meals & Entertainment",
        "Utilities",
        "Rent",
        "Contractors",
        "Other",
    ];

    const paymentMethods = [
        "Credit Card",
        "Debit Card",
        "Bank Transfer",
        "Cash",
        "PayPal",
        "Check",
    ];

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                        control={form.control}
                        name="vendor"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Vendor / Payee</FormLabel>
                                <FormControl>
                                    <Input placeholder="e.g. Amazon, Google, Staples" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="date"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Date</FormLabel>
                                <FormControl>
                                    <Input type="date" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                        control={form.control}
                        name="category"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Category</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <FormControl>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select a category" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        {categories.map((cat) => (
                                            <SelectItem key={cat} value={cat}>
                                                {cat}
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
                        name="amount"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Amount</FormLabel>
                                <FormControl>
                                    <div className="relative">
                                        <span className="absolute left-3 top-2.5 text-slate-500">$</span>
                                        <Input type="number" step="0.01" className="pl-7" {...field} />
                                    </div>
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>

                <FormField
                    control={form.control}
                    name="paymentMethod"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Payment Method (Optional)</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select payment method" />
                                    </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                    {paymentMethods.map((method) => (
                                        <SelectItem key={method} value={method}>
                                            {method}
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
                    name="description"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Description / Items (Optional)</FormLabel>
                            <FormControl>
                                <Textarea placeholder="Details about this expense..." {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <div className="flex justify-end gap-4">
                    <Button type="button" variant="outline" onClick={() => router.back()}>
                        Cancel
                    </Button>
                    <Button type="submit" disabled={isSubmitting} className="bg-red-600 hover:bg-red-700">
                        {isSubmitting ? "Saving..." : "Save Expense"}
                    </Button>
                </div>
            </form>
        </Form>
    );
}
