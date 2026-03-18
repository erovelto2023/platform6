"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { seedLocations } from "@/lib/actions/location.actions";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { MapPin } from "lucide-react";

export const SeedLocationsButton = () => {
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleSeed = async () => {
        setLoading(true);
        try {
            const result = await seedLocations();
            if (result.success) {
                toast.success(result.message || "Locations seeded successfully");
                router.refresh();
            } else {
                toast.error(result.error || "Failed to seed locations");
            }
        } catch (error) {
            toast.error("Something went wrong");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Button onClick={handleSeed} disabled={loading} variant="outline" className="border-slate-700 bg-slate-800 text-slate-200 hover:bg-slate-700">
            <MapPin className="h-4 w-4 mr-2" />
            {loading ? "Seeding..." : "Seed Locations"}
        </Button>
    );
};
