
"use client";

import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal, Pencil, Trash2, Copy } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";

interface CredentialActionsProps {
    credential: any;
}

export function CredentialActions({ credential }: CredentialActionsProps) {

    const copyPassword = () => {
        if (credential.password) {
            navigator.clipboard.writeText(credential.password);
            toast.success("Password copied to clipboard");
        } else {
            toast.error("No password stored");
        }
    };

    const copyUsername = () => {
        if (credential.username) {
            navigator.clipboard.writeText(credential.username);
            toast.success("Username copied to clipboard");
        }
    };

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-8 w-8 p-0">
                    <span className="sr-only">Open menu</span>
                    <MoreHorizontal className="h-4 w-4" />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={copyUsername}>
                    <Copy className="mr-2 h-4 w-4" />
                    Copy Username
                </DropdownMenuItem>
                <DropdownMenuItem onClick={copyPassword}>
                    <Copy className="mr-2 h-4 w-4" />
                    Copy Password
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <Link href={`/accounting/credentials/${credential._id}/edit`}>
                    <DropdownMenuItem>
                        <Pencil className="mr-2 h-4 w-4" />
                        Edit / View
                    </DropdownMenuItem>
                </Link>
                <DropdownMenuItem
                    className="text-red-600"
                // Delete logic would go here ideally calling a server action directly or via a dialog
                >
                    <Trash2 className="mr-2 h-4 w-4" />
                    Delete
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
