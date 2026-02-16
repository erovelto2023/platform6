
"use client";

import { useEffect, useState } from "react";
import { getAvailabilityRules, upsertAvailability } from "@/lib/actions/booking.actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar } from "@/components/ui/calendar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2, Plus, Trash, Copy, RotateCcw } from "lucide-react";
import { toast } from "sonner";
import { format, isSameDay } from "date-fns";
import { Separator } from "@/components/ui/separator";

const DAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

type Slot = { startTime: string; endTime: string };
type Rule = {
    _id?: string;
    dayOfWeek?: number;
    date?: string; // ISO string for overrides
    isActive: boolean;
    slots: Slot[];
};

export function AvailabilityEditor() {
    const [loading, setLoading] = useState(true);
    const [recurringRules, setRecurringRules] = useState<Rule[]>([]);
    const [overrides, setOverrides] = useState<Rule[]>([]);
    const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());

    // Initialize empty rules for all days if missing
    const initRecurring = (fetchedRules: any[]) => {
        const rules = [];
        for (let i = 0; i < 7; i++) {
            const existing = fetchedRules.find(r => r.dayOfWeek === i);
            if (existing) {
                // Ensure slots array exists (migration from old schema)
                if (!existing.slots || existing.slots.length === 0) {
                    if (existing.startTime && existing.endTime) {
                        existing.slots = [{ startTime: existing.startTime, endTime: existing.endTime }];
                    } else {
                        existing.slots = [{ startTime: "09:00", endTime: "17:00" }];
                    }
                }
                rules.push(existing);
            } else {
                rules.push({
                    dayOfWeek: i,
                    isActive: false, // Default to closed
                    slots: [{ startTime: "09:00", endTime: "17:00" }]
                });
            }
        }
        return rules;
    };

    const loadRules = async () => {
        setLoading(true);
        const res = await getAvailabilityRules();
        if (res.success) {
            setRecurringRules(initRecurring(res.data?.recurring || []));
            setOverrides(res.data?.overrides || []);
        }
        setLoading(false);
    };

    useEffect(() => {
        loadRules();
    }, []);

    const handleSaveRule = async (rule: Rule) => {
        // Optimistic update
        if (rule.dayOfWeek !== undefined) { // Recurring
            const newRules = [...recurringRules];
            newRules[rule.dayOfWeek] = rule;
            setRecurringRules(newRules);
        } else if (rule.date) { // Override
            // Update local state is tricky for array replacement, rely on re-fetch mostly or simple ID match
        }

        const payload = {
            ...rule,
            // Ensure we save slots
        };

        const res = await upsertAvailability(payload);
        if (res.success) {
            toast.success("Saved");
            // If it was a new override, reload to get ID and sorted list
            if (rule.date && !rule._id) {
                loadRules();
            }
        } else {
            toast.error("Failed to save");
            loadRules(); // Revert
        }
    };

    const toggleDayActive = (index: number) => {
        const rule = { ...recurringRules[index], isActive: !recurringRules[index].isActive };
        handleSaveRule(rule);
    };

    const updateSlot = (dayIndex: number, slotIndex: number, field: 'startTime' | 'endTime', value: string) => {
        const rule = { ...recurringRules[dayIndex] };
        rule.slots[slotIndex] = { ...rule.slots[slotIndex], [field]: value };
        handleSaveRule(rule);
    };

    const addSlot = (dayIndex: number) => {
        const rule = { ...recurringRules[dayIndex] };
        rule.slots.push({ startTime: "09:00", endTime: "17:00" }); // Default new slot
        handleSaveRule(rule);
    };

    const removeSlot = (dayIndex: number, slotIndex: number) => {
        const rule = { ...recurringRules[dayIndex] };
        rule.slots.splice(slotIndex, 1);
        handleSaveRule(rule);
    };

    const copyToAll = (sourceIndex: number) => {
        if (!confirm(`Copy ${DAYS[sourceIndex]}'s schedule to all other days?`)) return;

        const sourceRule = recurringRules[sourceIndex];
        const promises = recurringRules.map((rule, i) => {
            if (i === sourceIndex) return Promise.resolve();
            return handleSaveRule({
                ...rule,
                isActive: sourceRule.isActive,
                slots: [...sourceRule.slots] // Deep copy slots
            });
        });

        Promise.all(promises).then(() => {
            toast.success("Copied to all days");
            loadRules();
        });
    };

    // --- Override Logic ---
    const getOverrideForRule = (date: Date) => {
        return overrides.find(o => o.date && isSameDay(new Date(o.date), date));
    };

    const handleDateSelect = async (date: Date | undefined) => {
        setSelectedDate(date);
    };

    const saveOverride = async (rule: Rule) => {
        await handleSaveRule(rule);
        loadRules(); // Refresh list to show updated override
    };

    const deleteOverride = async (ruleId: string) => {
        // We actually just toggle active false or delete document?
        // For 'Delete Override', we should probably delete the document to revert to recurring.
        // upsertAvailability handles upsert, but removal of override needs a delete action or isActive: false?
        // Let's just set isActive: false for now, or use a new deleted params.
        // Or simpler: upsert with isActive: false acts as "Unavailable".
        // To "Remove Override" (restore recurring), we need a delete endpoint.
        // For MVP, "Unavailable" is fine.
    };

    if (loading) return <div className="flex justify-center p-8"><Loader2 className="animate-spin" /></div>;

    return (
        <Tabs defaultValue="weekly" className="w-full">
            <TabsList className="mb-4">
                <TabsTrigger value="weekly">Weekly Hours</TabsTrigger>
                <TabsTrigger value="date-overrides">Date Overrides</TabsTrigger>
            </TabsList>

            <TabsContent value="weekly" className="space-y-4">
                <Card>
                    <CardHeader>
                        <CardTitle>Weekly Schedule</CardTitle>
                        <CardDescription>Set your standard availability for each day.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        {recurringRules.map((rule, index) => (
                            <div key={index} className="flex flex-col sm:flex-row gap-4 items-start sm:items-center py-4 border-b last:border-0">
                                <div className="w-32 flex items-center gap-2">
                                    <Switch
                                        checked={rule.isActive}
                                        onCheckedChange={() => toggleDayActive(index)}
                                    />
                                    <span className={!rule.isActive ? "text-muted-foreground" : "font-medium"}>
                                        {DAYS[index]}
                                    </span>
                                </div>
                                <div className="flex-1 space-y-2">
                                    {!rule.isActive ? (
                                        <span className="text-muted-foreground italic text-sm">Unavailable</span>
                                    ) : (
                                        rule.slots.map((slot, sIndex) => (
                                            <div key={sIndex} className="flex items-center gap-2">
                                                <Input
                                                    type="time"
                                                    className="w-32"
                                                    value={slot.startTime}
                                                    onChange={(e) => updateSlot(index, sIndex, 'startTime', e.target.value)}
                                                />
                                                <span>-</span>
                                                <Input
                                                    type="time"
                                                    className="w-32"
                                                    value={slot.endTime}
                                                    onChange={(e) => updateSlot(index, sIndex, 'endTime', e.target.value)}
                                                />
                                                <Button variant="ghost" size="icon" onClick={() => removeSlot(index, sIndex)}>
                                                    <Trash className="h-4 w-4 text-muted-foreground hover:text-red-500" />
                                                </Button>
                                                {sIndex === rule.slots.length - 1 && (
                                                    <Button variant="ghost" size="icon" onClick={() => addSlot(index)}>
                                                        <Plus className="h-4 w-4 text-muted-foreground hover:text-green-600" />
                                                    </Button>
                                                )}
                                            </div>
                                        ))
                                    )}
                                    {rule.isActive && rule.slots.length === 0 && (
                                        <Button variant="ghost" size="sm" onClick={() => addSlot(index)}>
                                            <Plus className="mr-2 h-3 w-3" /> Add Hours
                                        </Button>
                                    )}
                                </div>
                                {rule.isActive && (
                                    <Button variant="ghost" size="icon" title="Copy to all days" onClick={() => copyToAll(index)}>
                                        <Copy className="h-4 w-4 text-muted-foreground" />
                                    </Button>
                                )}
                            </div>
                        ))}
                    </CardContent>
                </Card>
            </TabsContent>

            <TabsContent value="date-overrides">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Select a Date</CardTitle>
                            <CardDescription>Choose a date to add specific hours.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Calendar
                                mode="single"
                                selected={selectedDate}
                                onSelect={handleDateSelect}
                                className="rounded-md border"
                                modifiers={{
                                    hasOverride: (date) => !!getOverrideForRule(date)
                                }}
                                modifiersStyles={{
                                    hasOverride: { fontWeight: 'bold', textDecoration: 'underline', color: 'var(--primary)' }
                                }}
                            />
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>
                                {selectedDate ? format(selectedDate, "MMMM d, yyyy") : "No date selected"}
                            </CardTitle>
                            <CardDescription>Override your weekly schedule for this date.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            {selectedDate ? (
                                (() => {
                                    const override = getOverrideForRule(selectedDate);
                                    // Make new object if none exists, but don't save yet
                                    const displayRule: Rule = override || {
                                        date: selectedDate.toISOString(),
                                        isActive: true, // Default to available on override creation
                                        slots: [{ startTime: "09:00", endTime: "17:00" }]
                                    };

                                    // If no override exists, we are "Creating" one
                                    // If override exists, we are "Editing" it

                                    return (
                                        <div className="space-y-4">
                                            <div className="flex items-center gap-2 mb-4">
                                                <Switch
                                                    checked={displayRule.isActive}
                                                    onCheckedChange={(checked) => saveOverride({ ...displayRule, isActive: checked })}
                                                />
                                                <span className={!displayRule.isActive ? "text-muted-foreground" : "font-medium"}>
                                                    {displayRule.isActive ? "Available" : "Unavailable (Day Off)"}
                                                </span>
                                            </div>

                                            {displayRule.isActive && displayRule.slots.map((slot, idx) => (
                                                <div key={idx} className="flex items-center gap-2">
                                                    <Input
                                                        type="time"
                                                        value={slot.startTime}
                                                        onChange={(e) => {
                                                            const newSlots = [...displayRule.slots];
                                                            newSlots[idx].startTime = e.target.value;
                                                            saveOverride({ ...displayRule, slots: newSlots });
                                                        }}
                                                    />
                                                    <span>-</span>
                                                    <Input
                                                        type="time"
                                                        value={slot.endTime}
                                                        onChange={(e) => {
                                                            const newSlots = [...displayRule.slots];
                                                            newSlots[idx].endTime = e.target.value;
                                                            saveOverride({ ...displayRule, slots: newSlots });
                                                        }}
                                                    />
                                                    <Button variant="ghost" size="icon" onClick={() => {
                                                        const newSlots = [...displayRule.slots];
                                                        newSlots.splice(idx, 1);
                                                        saveOverride({ ...displayRule, slots: newSlots });
                                                    }}>
                                                        <Trash className="h-4 w-4" />
                                                    </Button>
                                                </div>
                                            ))}

                                            {displayRule.isActive && (
                                                <Button size="sm" variant="outline" onClick={() => {
                                                    const newSlots = [...displayRule.slots, { startTime: "09:00", endTime: "17:00" }];
                                                    saveOverride({ ...displayRule, slots: newSlots });
                                                }}>
                                                    <Plus className="mr-2 h-4 w-4" /> Add Time Block
                                                </Button>
                                            )}

                                            <Separator className="my-4" />

                                            {!override ? (
                                                <div className="text-sm text-muted-foreground">
                                                    Start editing to create an override for this date.
                                                </div>
                                            ) : (
                                                <div className="text-sm text-green-600 font-medium">
                                                    Override saved.
                                                </div>
                                            )}
                                        </div>
                                    );
                                })()
                            ) : (
                                <div className="text-center py-8 text-muted-foreground">Select a date to configure specific hours.</div>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </TabsContent>
        </Tabs>
    );
}
