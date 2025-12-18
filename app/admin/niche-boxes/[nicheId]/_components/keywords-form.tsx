"use client";

import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Loader2, PlusCircle, Trash } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { addKeyword, removeKeyword } from "@/lib/actions/niche.actions";

import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";

interface KeywordsFormProps {
    initialData: {
        keywords: any[];
    };
    nicheId: string;
}

const formSchema = z.object({
    keyword: z.string().min(1),
    volume: z.coerce.number(),
    difficulty: z.string().min(1),
});

export const KeywordsForm = ({
    initialData,
    nicheId
}: KeywordsFormProps) => {
    const [isCreating, setIsCreating] = useState(false);
    const [isDeletingId, setIsDeletingId] = useState<string | null>(null);

    const toggleCreating = () => setIsCreating((current) => !current);

    const router = useRouter();

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema) as any,
        defaultValues: {
            keyword: "",
            volume: 0,
            difficulty: "Medium",
        },
    });

    const { isSubmitting, isValid } = form.formState;

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        try {
            const response = await addKeyword(nicheId, values);
            if (response.success) {
                toast.success("Keyword added");
                form.reset();
                router.refresh();
            } else {
                toast.error("Something went wrong");
            }
        } catch {
            toast.error("Something went wrong");
        }
    }

    const onDelete = async (id: string) => {
        try {
            setIsDeletingId(id);
            await removeKeyword(nicheId, id);
            toast.success("Keyword removed");
            router.refresh();
        } catch {
            toast.error("Something went wrong");
        } finally {
            setIsDeletingId(null);
        }
    }

    return (
        <div className="mt-6 border bg-slate-100 rounded-md p-4">
            <div className="font-medium flex items-center justify-between">
                Keywords
                <Button onClick={toggleCreating} variant="ghost">
                    {isCreating ? (
                        <>Cancel</>
                    ) : (
                        <>
                            <PlusCircle className="h-4 w-4 mr-2" />
                            Add keyword
                        </>
                    )}
                </Button>
            </div>
            {isCreating && (
                <Form {...form}>
                    <form
                        onSubmit={form.handleSubmit(onSubmit)}
                        className="space-y-4 mt-4"
                    >
                        <div className="grid grid-cols-3 gap-4">
                            <FormField
                                control={form.control}
                                name="keyword"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormControl>
                                            <Input
                                                disabled={isSubmitting}
                                                placeholder="Keyword"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="volume"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormControl>
                                            <Input
                                                type="number"
                                                disabled={isSubmitting}
                                                placeholder="Volume"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="difficulty"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormControl>
                                            <Input
                                                disabled={isSubmitting}
                                                placeholder="Difficulty"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                        <Button
                            disabled={!isValid || isSubmitting}
                            type="submit"
                        >
                            Add
                        </Button>
                    </form>
                </Form>
            )}
            {!isCreating && (
                <div className="mt-4">
                    {initialData.keywords.length === 0 && (
                        <p className="text-sm text-slate-500 italic">No keywords added yet.</p>
                    )}
                    {initialData.keywords.length > 0 && (
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Keyword</TableHead>
                                    <TableHead>Volume</TableHead>
                                    <TableHead>Difficulty</TableHead>
                                    <TableHead className="w-[50px]"></TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {initialData.keywords.map((item) => (
                                    <TableRow key={item._id}>
                                        <TableCell>{item.keyword}</TableCell>
                                        <TableCell>{item.volume}</TableCell>
                                        <TableCell>{item.difficulty}</TableCell>
                                        <TableCell>
                                            <Button
                                                onClick={() => onDelete(item._id)}
                                                variant="ghost"
                                                size="sm"
                                                disabled={isDeletingId === item._id}
                                            >
                                                {isDeletingId === item._id ? (
                                                    <Loader2 className="h-4 w-4 animate-spin" />
                                                ) : (
                                                    <Trash className="h-4 w-4 text-red-500" />
                                                )}
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    )}
                </div>
            )}
        </div>
    )
}
