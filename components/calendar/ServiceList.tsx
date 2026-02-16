
"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Plus, MoreHorizontal, Clock, DollarSign, ExternalLink } from "lucide-react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { deleteCalendarService } from "@/lib/actions/calendar-service.actions";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

interface ServiceListProps {
    services: any[];
}

export function ServiceList({ services }: ServiceListProps) {
    const router = useRouter();

    const handleDelete = async (id: string) => {
        if (confirm("Are you sure you want to delete this service?")) {
            const res = await deleteCalendarService(id);
            if (res.success) {
                toast.success("Service deleted");
                router.refresh();
            } else {
                toast.error("Failed to delete service");
            }
        }
    };

    return (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {services.map((service) => (
                <div key={service._id} className="bg-white rounded-lg border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                    <div className="p-6 space-y-4">
                        <div className="flex justify-between items-start">
                            <div>
                                <h3 className="font-semibold text-lg text-slate-900">{service.name}</h3>
                                <div className="flex items-center gap-2 mt-1">
                                    <Badge variant={service.isActive ? "default" : "secondary"}>
                                        {service.isActive ? "Active" : "Inactive"}
                                    </Badge>
                                </div>
                            </div>
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" className="h-8 w-8 p-0">
                                        <span className="sr-only">Open menu</span>
                                        <MoreHorizontal className="h-4 w-4" />
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                    <DropdownMenuItem onClick={() => router.push(`/calendar/services/${service._id}`)}>
                                        Edit Service
                                    </DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => navigator.clipboard.writeText(`${window.location.origin}/book/${service._id}`)}>
                                        Copy Booking Link
                                    </DropdownMenuItem>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem className="text-red-600" onClick={() => handleDelete(service._id)}>
                                        Delete
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </div>

                        <p className="text-sm text-slate-500 line-clamp-2 min-h-[40px]">
                            {service.description || "No description provided."}
                        </p>

                        <div className="flex items-center gap-4 text-sm text-slate-600 pt-4 border-t border-slate-100">
                            <div className="flex items-center gap-1">
                                <Clock className="h-4 w-4 text-slate-400" />
                                {service.duration} mins
                            </div>
                            <div className="flex items-center gap-1">
                                <DollarSign className="h-4 w-4 text-slate-400" />
                                {service.price > 0 ? `$${service.price}` : 'Free'}
                            </div>
                        </div>

                        <div className="pt-2">
                            <Button variant="outline" className="w-full text-indigo-600 border-indigo-200 hover:bg-indigo-50" asChild>
                                <Link href={`/book/${service._id}`} target="_blank">
                                    <ExternalLink className="mr-2 h-4 w-4" />
                                    View Booking Page
                                </Link>
                            </Button>
                        </div>
                    </div>
                </div>
            ))}

            {/* Add New Card */}
            <Link href="/calendar/services/new" className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-slate-200 rounded-lg hover:border-indigo-300 hover:bg-indigo-50 transition-colors group h-full min-h-[250px]">
                <div className="h-12 w-12 rounded-full bg-indigo-50 flex items-center justify-center mb-4 group-hover:bg-indigo-100 group-hover:scale-110 transition-all">
                    <Plus className="h-6 w-6 text-indigo-600" />
                </div>
                <h3 className="font-semibold text-slate-900">Add New Service</h3>
                <p className="text-sm text-slate-500 text-center mt-1">Create a new event type for people to book.</p>
            </Link>
        </div>
    );
}
