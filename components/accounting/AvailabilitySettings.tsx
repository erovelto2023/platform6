
"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { getAvailability, updateAvailability } from "@/lib/actions/availability.actions";
import { Loader2 } from "lucide-react";

const DAYS = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
];

// Generate time slots every 30 mins
const TIME_SLOTS: string[] = [];
for (let i = 0; i < 24; i++) {
    for (let j = 0; j < 60; j += 30) {
        const hour = i.toString().padStart(2, "0");
        const minute = j.toString().padStart(2, "0");
        TIME_SLOTS.push(`${hour}:${minute}`);
    }
}

export function AvailabilitySettings() {
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [availability, setAvailability] = useState<any[]>([]);

    useEffect(() => {
        loadAvailability();
    }, []);

    async function loadAvailability() {
        try {
            const res = await getAvailability();
            if (res.success && res.data) {
                // Merge with default days if empty
                const merged = DAYS.map((day, index) => {
                    const existing = res.data.find((a: any) => a.dayOfWeek === index);
                    return existing || {
                        dayOfWeek: index,
                        startTime: "09:00",
                        endTime: "17:00",
                        isActive: index > 0 && index < 6, // Default M-F
                    };
                });
                setAvailability(merged);
            }
        } catch (error) {
            toast.error("Failed to load availability");
        } finally {
            setIsLoading(false);
        }
    }

    const handleUpdate = (index: number, field: string, value: any) => {
        const newAvailability = [...availability];
        newAvailability[index] = { ...newAvailability[index], [field]: value };
        setAvailability(newAvailability);
    };

    async function onSave() {
        setIsSaving(true);
        try {
            const res = await updateAvailability(availability);
            if (res.success) {
                toast.success("Availability updated");
            } else {
                toast.error("Failed to update availability");
            }
        } catch (error) {
            toast.error("An error occurred");
        } finally {
            setIsSaving(false);
        }
    }

    if (isLoading) return <div>Loading...</div>;

    return (
        <div className="space-y-6">
            <div className="bg-white rounded-lg border border-slate-200 shadow-sm overflow-hidden">
                <div className="p-4 border-b border-slate-200 bg-slate-50 font-medium grid grid-cols-12 gap-4">
                    <div className="col-span-3">Day</div>
                    <div className="col-span-1 text-center">Active</div>
                    <div className="col-span-4">Start Time</div>
                    <div className="col-span-4">End Time</div>
                </div>
                <div className="divide-y divide-slate-100">
                    {availability.map((day, index) => (
                        <div key={index} className="p-4 grid grid-cols-12 gap-4 items-center">
                            <div className="col-span-3 font-medium text-slate-700">
                                {DAYS[index]}
                            </div>
                            <div className="col-span-1 flex justify-center">
                                <Checkbox
                                    checked={day.isActive}
                                    onCheckedChange={(checked) => handleUpdate(index, "isActive", checked)}
                                />
                            </div>
                            <div className="col-span-4">
                                <Select
                                    disabled={!day.isActive}
                                    value={day.startTime}
                                    onValueChange={(val) => handleUpdate(index, "startTime", val)}
                                >
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {TIME_SLOTS.map((t) => (
                                            <SelectItem key={`start-${t}`} value={t}>
                                                {t}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="col-span-4">
                                <Select
                                    disabled={!day.isActive}
                                    value={day.endTime}
                                    onValueChange={(val) => handleUpdate(index, "endTime", val)}
                                >
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {TIME_SLOTS.map((t) => (
                                            <SelectItem key={`end-${t}`} value={t}>
                                                {t}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <div className="flex justify-end">
                <Button onClick={onSave} disabled={isSaving}>
                    {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Save Schedule
                </Button>
            </div>
        </div>
    );
}
