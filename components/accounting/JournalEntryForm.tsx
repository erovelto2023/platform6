"use client";

import { useForm, useFieldArray } from "react-hook-form";
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
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Trash2, Plus, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { formatCurrency } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { createJournalEntry, updateJournalEntry } from "@/lib/actions/journal.actions";

const journalEntrySchema = z.object({
    date: z.string().min(1, "Date is required"),
    description: z.string().min(1, "Description is required"),
    reference: z.string().optional(),
    lines: z.array(z.object({
        accountId: z.string().min(1, "Account is required"),
        description: z.string().optional(),
        debit: z.coerce.number().min(0),
        credit: z.coerce.number().min(0),
    })).min(2, "At least two lines are required")
}).superRefine((data, ctx) => {
    const totalDebit = data.lines.reduce((sum, line) => sum + (line.debit || 0), 0);
    const totalCredit = data.lines.reduce((sum, line) => sum + (line.credit || 0), 0);

    if (Math.abs(totalDebit - totalCredit) > 0.01) {
        ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: `Debits ($${totalDebit.toFixed(2)}) must equal Credits ($${totalCredit.toFixed(2)})`,
            path: ["lines"],
        });
    }
});

type JournalEntryFormValues = z.infer<typeof journalEntrySchema>;

interface JournalEntryFormProps {
    initialData?: any;
    accounts: any[];
}

export default function JournalEntryForm({ initialData, accounts }: JournalEntryFormProps) {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const defaultValues: Partial<JournalEntryFormValues> = initialData
        ? {
            ...initialData,
            date: initialData.date ? new Date(initialData.date).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
        }
        : {
            date: new Date().toISOString().split('T')[0],
            description: "",
            reference: "",
            lines: [
                { accountId: "", description: "", debit: 0, credit: 0 },
                { accountId: "", description: "", debit: 0, credit: 0 },
            ],
        };

    const form = useForm<JournalEntryFormValues>({
        resolver: zodResolver(journalEntrySchema) as any,
        defaultValues,
    });

    const { fields, append, remove } = useFieldArray({
        control: form.control,
        name: "lines",
    });

    // Calculate totals for display
    const lines = form.watch("lines");
    const totalDebit = lines.reduce((sum, line) => sum + (Number(line.debit) || 0), 0);
    const totalCredit = lines.reduce((sum, line) => sum + (Number(line.credit) || 0), 0);
    const isBalanced = Math.abs(totalDebit - totalCredit) <= 0.01;

    async function onSubmit(data: JournalEntryFormValues) {
        setLoading(true);
        setError(null);

        try {
            const formData = {
                ...data,
                date: new Date(data.date),
            };

            let result;
            if (initialData) {
                result = await updateJournalEntry(initialData._id, formData);
            } else {
                result = await createJournalEntry(formData);
            }

            if (result.success) {
                router.push("/accounting/journal");
                router.refresh();
            } else {
                setError(result.error || "Something went wrong");
            }
        } catch (err) {
            setError("An unexpected error occurred");
            console.error(err);
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Link href="/accounting/journal">
                        <Button variant="outline" size="icon">
                            <ArrowLeft className="h-4 w-4" />
                        </Button>
                    </Link>
                    <h1 className="text-2xl font-bold tracking-tight">
                        {initialData ? "Edit Journal Entry" : "New Journal Entry"}
                    </h1>
                </div>
            </div>

            <Card>
                <CardContent className="pt-6">
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                            {error && (
                                <div className="p-3 text-sm text-red-500 bg-red-50 border border-red-200 rounded-md">
                                    {error}
                                </div>
                            )}

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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

                                <FormField
                                    control={form.control}
                                    name="reference"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Reference</FormLabel>
                                            <FormControl>
                                                <Input placeholder="e.g. ADJ-001" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="description"
                                    render={({ field }) => (
                                        <FormItem className="md:col-span-3">
                                            <FormLabel>Description</FormLabel>
                                            <FormControl>
                                                <Textarea placeholder="What is this transaction for?" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>

                            <div className="border rounded-md">
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead className="w-[30%]">Account</TableHead>
                                            <TableHead className="w-[30%]">Description</TableHead>
                                            <TableHead className="w-[15%] text-right">Debit</TableHead>
                                            <TableHead className="w-[15%] text-right">Credit</TableHead>
                                            <TableHead className="w-[5%]"></TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {fields.map((field, index) => (
                                            <TableRow key={field.id}>
                                                <TableCell>
                                                    <FormField
                                                        control={form.control}
                                                        name={`lines.${index}.accountId`}
                                                        render={({ field }) => (
                                                            <FormItem>
                                                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                                    <FormControl>
                                                                        <SelectTrigger>
                                                                            <SelectValue placeholder="Select Account" />
                                                                        </SelectTrigger>
                                                                    </FormControl>
                                                                    <SelectContent>
                                                                        {accounts.map((account) => (
                                                                            <SelectItem key={account._id} value={account._id}>
                                                                                {account.name} ({account.type})
                                                                            </SelectItem>
                                                                        ))}
                                                                    </SelectContent>
                                                                </Select>
                                                                <FormMessage />
                                                            </FormItem>
                                                        )}
                                                    />
                                                </TableCell>
                                                <TableCell>
                                                    <FormField
                                                        control={form.control}
                                                        name={`lines.${index}.description`}
                                                        render={({ field }) => (
                                                            <FormItem>
                                                                <FormControl>
                                                                    <Input placeholder="Line description" {...field} />
                                                                </FormControl>
                                                                <FormMessage />
                                                            </FormItem>
                                                        )}
                                                    />
                                                </TableCell>
                                                <TableCell>
                                                    <FormField
                                                        control={form.control}
                                                        name={`lines.${index}.debit`}
                                                        render={({ field }) => (
                                                            <FormItem>
                                                                <FormControl>
                                                                    <Input
                                                                        type="number"
                                                                        step="0.01"
                                                                        className="text-right"
                                                                        {...field}
                                                                        onChange={(e) => {
                                                                            // If debit is entered, clear credit
                                                                            if (e.target.value && Number(e.target.value) > 0) {
                                                                                form.setValue(`lines.${index}.credit`, 0);
                                                                            }
                                                                            field.onChange(e);
                                                                        }}
                                                                    />
                                                                </FormControl>
                                                                <FormMessage />
                                                            </FormItem>
                                                        )}
                                                    />
                                                </TableCell>
                                                <TableCell>
                                                    <FormField
                                                        control={form.control}
                                                        name={`lines.${index}.credit`}
                                                        render={({ field }) => (
                                                            <FormItem>
                                                                <FormControl>
                                                                    <Input
                                                                        type="number"
                                                                        step="0.01"
                                                                        className="text-right"
                                                                        {...field}
                                                                        onChange={(e) => {
                                                                            // If credit is entered, clear debit
                                                                            if (e.target.value && Number(e.target.value) > 0) {
                                                                                form.setValue(`lines.${index}.debit`, 0);
                                                                            }
                                                                            field.onChange(e);
                                                                        }}
                                                                    />
                                                                </FormControl>
                                                                <FormMessage />
                                                            </FormItem>
                                                        )}
                                                    />
                                                </TableCell>
                                                <TableCell>
                                                    <Button
                                                        type="button"
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() => remove(index)}
                                                        disabled={fields.length <= 2}
                                                    >
                                                        <Trash2 className="h-4 w-4 text-red-500" />
                                                    </Button>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </div>

                            <div className="flex justify-between items-center bg-slate-50 p-4 rounded-md border">
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => append({ accountId: "", description: "", debit: 0, credit: 0 })}
                                >
                                    <Plus className="mr-2 h-4 w-4" /> Add Line
                                </Button>
                                <div className="flex gap-8 text-sm font-medium">
                                    <div className="flex gap-2">
                                        <span>Total Debits:</span>
                                        <span>{formatCurrency(totalDebit)}</span>
                                    </div>
                                    <div className="flex gap-2">
                                        <span>Total Credits:</span>
                                        <span>{formatCurrency(totalCredit)}</span>
                                    </div>
                                    <div className={`flex gap-2 ${isBalanced ? 'text-green-600' : 'text-red-600'}`}>
                                        <span>Difference:</span>
                                        <span>{formatCurrency(Math.abs(totalDebit - totalCredit))}</span>
                                    </div>
                                </div>
                            </div>

                            {form.formState.errors.lines?.root && (
                                <p className="text-sm font-medium text-red-500">
                                    {form.formState.errors.lines.root.message}
                                </p>
                            )}

                            <div className="flex justify-end gap-4">
                                <Link href="/accounting/journal">
                                    <Button variant="outline" type="button">Cancel</Button>
                                </Link>
                                <Button type="submit" disabled={loading || !isBalanced}>
                                    {loading ? "Saving..." : "Save Journal Entry"}
                                </Button>
                            </div>
                        </form>
                    </Form>
                </CardContent>
            </Card>
        </div>
    );
}
