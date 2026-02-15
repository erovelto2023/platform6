"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createTicket } from "@/lib/actions/ticket.actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input"; // Using standard input/select for simplicity or shacdn components
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { ChevronLeft } from "lucide-react";

export default function CreateTicketPage() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);

    // Form state
    const [product, setProduct] = useState("iPhone");
    const [description, setDescription] = useState("");

    const onSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const result = await createTicket(product, description);

            if (result.error) {
                toast.error(result.error);
            } else if (result.success) {
                toast.success("Ticket created successfully!");
                router.push("/tickets");
            }
        } catch (error) {
            toast.error("Something went wrong");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="p-6 max-w-2xl mx-auto">
            <Button variant="ghost" className="mb-6 pl-0 hover:bg-transparent" onClick={() => router.back()}>
                <ChevronLeft className="h-4 w-4 mr-2" />
                Back
            </Button>

            <div className="space-y-6">
                <div>
                    <h1 className="text-2xl font-bold">Create New Ticket</h1>
                    <p className="text-muted-foreground">Please fill out the form below</p>
                </div>

                <form onSubmit={onSubmit} className="space-y-6">
                    <div className="space-y-2">
                        <Label>Product</Label>
                        <Select
                            disabled={isLoading}
                            value={product}
                            onValueChange={setProduct}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Select a product" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="iPhone">iPhone</SelectItem>
                                <SelectItem value="Macbook Pro">Macbook Pro</SelectItem>
                                <SelectItem value="iMac">iMac</SelectItem>
                                <SelectItem value="iPad">iPad</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-2">
                        <Label>Description of the issue</Label>
                        <Textarea
                            disabled={isLoading}
                            placeholder="Description"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            rows={4}
                            required
                        />
                    </div>

                    <Button type="submit" className="w-full" disabled={isLoading}>
                        Submit
                    </Button>
                </form>
            </div>
        </div>
    );
}
