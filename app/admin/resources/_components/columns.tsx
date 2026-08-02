"use client";

import { ColumnDef } from "@tanstack/react-table";
import { 
    ArrowUpDown, 
    MoreHorizontal, 
    Pencil, 
    BookOpen, 
    FileText, 
    FileSpreadsheet, 
    Music, 
    Video, 
    Archive, 
    Globe, 
    File, 
    Image as ImageIcon,
    ShieldAlert,
    Users,
    Copy,
    Code
} from "lucide-react";
import toast from "react-hot-toast";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export const getResourceTypeIcon = (type: string) => {
    switch (type) {
        case 'ebook':
            return <BookOpen className="h-4 w-4 text-emerald-400" />;
        case 'doc':
            return <FileText className="h-4 w-4 text-sky-400" />;
        case 'pdf':
            return <FileText className="h-4 w-4 text-rose-400" />;
        case 'audio':
            return <Music className="h-4 w-4 text-purple-400" />;
        case 'spreadsheet':
            return <FileSpreadsheet className="h-4 w-4 text-emerald-400" />;
        case 'video':
            return <Video className="h-4 w-4 text-red-400" />;
        case 'archive':
            return <Archive className="h-4 w-4 text-amber-400" />;
        case 'image':
            return <ImageIcon className="h-4 w-4 text-sky-400" />;
        case 'link':
            return <Globe className="h-4 w-4 text-cyan-400" />;
        default:
            return <File className="h-4 w-4 text-slate-400" />;
    }
};

export const columns: ColumnDef<any>[] = [
    {
        id: "preview",
        header: "Preview",
        cell: ({ row }) => {
            const thumbnailUrl = row.original.thumbnailUrl;
            const type = row.original.type;
            const url = row.original.url;
            const isImage = type === 'image' || (url && /\.(jpg|jpeg|png|webp|gif|svg)(\?.*)?$/i.test(url));

            if (thumbnailUrl || isImage) {
                const imgSrc = thumbnailUrl || url;
                return (
                    <div className="relative h-10 w-10 rounded-xl overflow-hidden border border-slate-800 bg-slate-950 shrink-0">
                        <img 
                            src={imgSrc} 
                            alt={row.original.title} 
                            className="h-full w-full object-cover"
                        />
                    </div>
                );
            }

            return (
                <div className="h-10 w-10 rounded-xl border border-slate-800 bg-slate-950 flex items-center justify-center shrink-0">
                    {getResourceTypeIcon(type)}
                </div>
            );
        }
    },
    {
        accessorKey: "title",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                    className="text-slate-300 font-extrabold text-xs uppercase tracking-wider hover:text-white"
                >
                    Title
                    <ArrowUpDown className="ml-2 h-4 w-4 text-cyan-400" />
                </Button>
            );
        },
        cell: ({ row }) => {
            return (
                <div className="flex flex-col min-w-[200px]">
                    <span className="font-extrabold text-sm text-slate-100 line-clamp-1">
                        {row.original.title}
                    </span>
                    {row.original.description && (
                        <span className="text-xs text-slate-400 font-mono line-clamp-1">
                            {row.original.description}
                        </span>
                    )}
                </div>
            );
        }
    },
    {
        accessorKey: "category",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                    className="text-slate-300 font-extrabold text-xs uppercase tracking-wider hover:text-white"
                >
                    Category
                    <ArrowUpDown className="ml-2 h-4 w-4 text-cyan-400" />
                </Button>
            );
        },
        cell: ({ row }) => {
            return (
                <span className="text-xs font-mono font-bold text-cyan-300 bg-slate-950 border border-slate-800 px-2.5 py-1 rounded-xl uppercase">
                    {row.getValue("category") || "General"}
                </span>
            );
        }
    },
    {
        accessorKey: "type",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                    className="text-slate-300 font-extrabold text-xs uppercase tracking-wider hover:text-white"
                >
                    Type
                    <ArrowUpDown className="ml-2 h-4 w-4 text-cyan-400" />
                </Button>
            );
        },
        cell: ({ row }) => {
            const type = row.getValue("type") as string;
            return (
                <Badge variant="outline" className="capitalize flex items-center gap-1.5 w-fit font-mono font-bold text-[10px] bg-slate-950 border-slate-800 text-slate-200 px-2.5 py-1 rounded-xl">
                    {getResourceTypeIcon(type)}
                    <span>{type}</span>
                </Badge>
            );
        }
    },
    {
        accessorKey: "access",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                    className="text-slate-300 font-extrabold text-xs uppercase tracking-wider hover:text-white"
                >
                    Access
                    <ArrowUpDown className="ml-2 h-4 w-4 text-cyan-400" />
                </Button>
            );
        },
        cell: ({ row }) => {
            const access = row.getValue("access") as string;
            return (
                <span className={`px-2.5 py-1 rounded-xl text-[10px] font-mono font-bold uppercase border ${
                    access === 'admin' 
                        ? 'bg-slate-950 text-rose-300 border-rose-900/60' 
                        : access === 'student' 
                            ? 'bg-slate-950 text-indigo-300 border-indigo-900/60' 
                            : 'bg-slate-950 text-emerald-300 border-emerald-900/60'
                }`}>
                    {access}
                </span>
            );
        }
    },
    {
        id: "actions",
        cell: ({ row }) => {
            const resource = row.original;

            return (
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0 bg-slate-950 border border-slate-800 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl">
                            <span className="sr-only">Open menu</span>
                            <MoreHorizontal className="h-4 w-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="bg-slate-900 border border-slate-800 text-slate-100 font-sans shadow-2xl rounded-2xl p-1.5">
                        <DropdownMenuItem asChild className="hover:bg-slate-800 text-slate-200 focus:text-white cursor-pointer rounded-xl font-bold">
                            <Link href={`/admin/resources/${resource._id}`}>
                                <Pencil className="mr-2 h-4 w-4 text-cyan-400" />
                                Edit
                            </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                            onClick={() => {
                                navigator.clipboard.writeText(resource.url);
                                toast.success("URL copied to clipboard!");
                            }}
                            className="hover:bg-slate-800 text-slate-200 focus:text-white cursor-pointer rounded-xl font-bold"
                        >
                            <Copy className="mr-2 h-4 w-4 text-emerald-400" />
                            Copy Link
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            );
        },
    },
];
