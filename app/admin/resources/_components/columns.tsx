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
            return <BookOpen className="h-4 w-4 text-emerald-600" />;
        case 'doc':
            return <FileText className="h-4 w-4 text-blue-600" />;
        case 'pdf':
            return <FileText className="h-4 w-4 text-rose-600" />;
        case 'audio':
            return <Music className="h-4 w-4 text-purple-600" />;
        case 'spreadsheet':
            return <FileSpreadsheet className="h-4 w-4 text-emerald-700" />;
        case 'video':
            return <Video className="h-4 w-4 text-red-600" />;
        case 'archive':
            return <Archive className="h-4 w-4 text-amber-600" />;
        case 'image':
            return <ImageIcon className="h-4 w-4 text-sky-600" />;
        case 'link':
            return <Globe className="h-4 w-4 text-cyan-600" />;
        default:
            return <File className="h-4 w-4 text-slate-600" />;
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
                    <div className="relative h-10 w-10 rounded-lg overflow-hidden border border-slate-200 bg-slate-100 shrink-0">
                        <img 
                            src={imgSrc} 
                            alt={row.original.title} 
                            className="h-full w-full object-cover"
                        />
                    </div>
                );
            }

            return (
                <div className="h-10 w-10 rounded-lg border border-slate-200 bg-slate-100 flex items-center justify-center shrink-0">
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
                >
                    Title
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            );
        },
        cell: ({ row }) => {
            return (
                <div className="flex flex-col min-w-[200px]">
                    <span className="font-semibold text-sm text-slate-900 line-clamp-1">
                        {row.original.title}
                    </span>
                    {row.original.description && (
                        <span className="text-xs text-slate-500 line-clamp-1">
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
                >
                    Category
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            );
        },
    },
    {
        accessorKey: "type",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Type
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            );
        },
        cell: ({ row }) => {
            const type = row.getValue("type") as string;
            return (
                <Badge variant="outline" className="capitalize flex items-center gap-1.5 w-fit font-medium">
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
                >
                    Access Scope
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            );
        },
        cell: ({ row }) => {
            const access = (row.original.access || "user") as string;
            const isUser = access === "user";

            return (
                <Badge 
                    className={cn(
                        "font-semibold text-xs py-0.5 px-2.5 flex items-center gap-1 w-fit",
                        isUser 
                            ? "bg-emerald-100 text-emerald-800 border border-emerald-300 hover:bg-emerald-200" 
                            : "bg-rose-100 text-rose-800 border border-rose-300 hover:bg-rose-200"
                    )}
                >
                    {isUser ? (
                        <>
                            <Users className="h-3 w-3" />
                            <span>Students & Users</span>
                        </>
                    ) : (
                        <>
                            <ShieldAlert className="h-3 w-3" />
                            <span>Admin Only</span>
                        </>
                    )}
                </Badge>
            );
        }
    },
    {
        accessorKey: "isPublished",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Published
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            );
        },
        cell: ({ row }) => {
            const isPublished = row.getValue("isPublished") || false;

            return (
                <Badge className={cn("bg-slate-500", isPublished && "bg-sky-700")}>
                    {isPublished ? "Published" : "Draft"}
                </Badge>
            );
        }
    },
    {
        id: "actions",
        cell: ({ row }) => {
            const { _id, title, url } = row.original;

            const copyHtmlSnippet = () => {
                const html = `<a href="${url || "#"}" target="_blank" rel="noopener noreferrer" class="inline-flex items-center justify-center gap-2 font-bold bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-xl shadow-md transition-all">📥 Download ${title || "Resource"}</a>`;
                navigator.clipboard.writeText(html);
                toast.success("HTML Download Button code copied!");
            };

            const copyDirectLink = () => {
                navigator.clipboard.writeText(url || "#");
                toast.success("Direct file URL copied!");
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
                        <Link href={`/admin/resources/${_id}`}>
                            <DropdownMenuItem className="cursor-pointer">
                                <Pencil className="h-4 w-4 mr-2" />
                                Edit Resource
                            </DropdownMenuItem>
                        </Link>
                        <DropdownMenuItem onClick={copyHtmlSnippet} className="cursor-pointer">
                            <Code className="h-4 w-4 mr-2 text-indigo-600" />
                            Copy HTML Snippet
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={copyDirectLink} className="cursor-pointer">
                            <Copy className="h-4 w-4 mr-2 text-emerald-600" />
                            Copy Direct Link
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            );
        }
    }
];
