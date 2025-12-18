"use client";

import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { SupplierForm } from "../_components/supplier-form";

export default function AddSupplierPage() {
    return (
        <div className="max-w-3xl mx-auto p-6 space-y-6">
            <div className="flex items-center gap-4">
                <Link href="/admin/wholesale-directory">
                    <Button variant="ghost" size="icon">
                        <ArrowLeft className="h-4 w-4" />
                    </Button>
                </Link>
                <h1 className="text-2xl font-bold">Add New Supplier</h1>
            </div>

            <SupplierForm />
        </div>
    );
}

