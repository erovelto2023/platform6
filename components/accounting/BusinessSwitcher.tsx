'use client';

import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
    CommandSeparator,
} from "@/components/ui/command";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Check, ChevronsUpDown, PlusCircle, Building2 } from "lucide-react";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createBusiness, getUserBusinesses, switchBusiness } from "@/lib/actions/business.actions";
import { toast } from "sonner";

// Interface for Business
interface Business {
    _id: string;
    name: string;
}

interface BusinessSwitcherProps {
    currentBusinessId?: string; // We'll pass this later
}

export function BusinessSwitcher({ currentBusinessId }: BusinessSwitcherProps) {
    const [open, setOpen] = useState(false);
    const [showNewBusinessDialog, setShowNewBusinessDialog] = useState(false);
    const [businesses, setBusinesses] = useState<Business[]>([]);
    const [selectedBusiness, setSelectedBusiness] = useState<Business | null>(null);
    const [newBusinessName, setNewBusinessName] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();
    // Use toast or similar if available, else console log for now or create simple alert
    // I'll assume standard sonner or use-toast

    // Fetch businesses on mount
    useEffect(() => {
        const fetchBusinesses = async () => {
            const result = await getUserBusinesses();
            if (result.success && result.data) {
                setBusinesses(result.data);
                // If we have a currentBusinessId, set it as selected
                if (currentBusinessId) {
                    const current = result.data.find((b: any) => b._id === currentBusinessId);
                    if (current) setSelectedBusiness(current);
                } else if (result.data.length > 0) {
                    // Default to first if not set
                    setSelectedBusiness(result.data[0]);
                } else {
                    // No businesses found, enforce creation
                    setShowNewBusinessDialog(true);
                }
            }
        };
        fetchBusinesses();
    }, [currentBusinessId]);

    const onBusinessSelect = async (business: Business) => {
        setSelectedBusiness(business);
        setOpen(false);
        await switchBusiness(business._id);
        router.refresh();
        // Ideally reload page to ensure all server components re-fetch with new cookie
        // router.refresh() does re-fetch server components.
    };

    const onCreateBusiness = async () => {
        if (!newBusinessName.trim()) return;

        setIsLoading(true);
        try {
            const result = await createBusiness({ name: newBusinessName });
            if (result.success && result.data) {
                setBusinesses([...businesses, result.data]);
                setSelectedBusiness(result.data);
                await switchBusiness(result.data._id);
                setShowNewBusinessDialog(false);
                setNewBusinessName("");
                toast.success("Business created successfully");
                router.refresh();
            } else {
                toast.error(result.error || "Failed to create business");
            }
        } catch (error) {
            console.error("Failed to create business", error);
            toast.error("An unexpected error occurred");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Dialog open={showNewBusinessDialog} onOpenChange={setShowNewBusinessDialog}>
            <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                    <Button
                        variant="outline"
                        role="combobox"
                        aria-expanded={open}
                        aria-label="Select a business"
                        className="w-[200px] justify-between bg-slate-900/50 border-slate-800 text-slate-200 hover:bg-slate-900 hover:text-white transition-all"
                    >
                        <Building2 className="mr-2 h-4 w-4 text-slate-400" />
                        {selectedBusiness ? selectedBusiness.name : "Select Business"}
                        <ChevronsUpDown className="ml-auto h-4 w-4 shrink-0 opacity-50 text-slate-500" />
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-[200px] p-0 bg-[#0f131a] border border-slate-800/80 text-slate-100 shadow-2xl rounded-xl overflow-hidden">
                    <Command className="bg-[#0f131a] text-slate-200">
                        <CommandList>
                            <CommandInput placeholder="Search business..." className="border-none focus:ring-0 text-xs text-white" />
                            <CommandEmpty className="text-slate-500 text-xs py-4 text-center">No business found.</CommandEmpty>
                            <CommandGroup heading="Businesses" className="text-slate-400 [&_[cmdk-group-heading]]:text-slate-500">
                                {businesses.map((business) => (
                                    <CommandItem
                                        key={business._id}
                                        onSelect={() => onBusinessSelect(business)}
                                        className="text-xs text-slate-300 hover:bg-slate-900/60 hover:text-white cursor-pointer data-[selected=true]:bg-slate-900/80 data-[selected=true]:text-white"
                                    >
                                        <Building2 className="mr-2 h-3.5 w-3.5 text-slate-400" />
                                        {business.name}
                                        <Check
                                            className={cn(
                                                "ml-auto h-3.5 w-3.5 text-indigo-400",
                                                selectedBusiness?._id === business._id
                                                    ? "opacity-100"
                                                    : "opacity-0"
                                            )}
                                        />
                                    </CommandItem>
                                ))}
                            </CommandGroup>
                        </CommandList>
                        <CommandSeparator className="bg-slate-800" />
                        <CommandList>
                            <CommandGroup>
                                <CommandItem
                                    onSelect={() => {
                                        setOpen(false);
                                        setShowNewBusinessDialog(true);
                                    }}
                                    className="text-xs text-emerald-450 hover:bg-slate-900/60 hover:text-emerald-400 cursor-pointer data-[selected=true]:bg-slate-900/80 data-[selected=true]:text-emerald-400"
                                >
                                    <PlusCircle className="mr-2 h-4 w-4" />
                                    Create Business
                                </CommandItem>
                            </CommandGroup>
                        </CommandList>
                    </Command>
                </PopoverContent>
            </Popover>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Create Business</DialogTitle>
                    <DialogDescription>
                        Add a new business to manage invoices and expenses separately.
                    </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-2 pb-4">
                    <div className="space-y-2">
                        <Label htmlFor="name">Business Name</Label>
                        <Input
                            id="name"
                            placeholder="Acme Inc."
                            value={newBusinessName}
                            onChange={(e) => setNewBusinessName(e.target.value)}
                        />
                    </div>
                </div>
                <DialogFooter>
                    <Button variant="outline" onClick={() => setShowNewBusinessDialog(false)}>
                        Cancel
                    </Button>
                    <Button onClick={onCreateBusiness} disabled={isLoading}>
                        {isLoading ? "Creating..." : "Create"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
