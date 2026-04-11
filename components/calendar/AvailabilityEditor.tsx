
"use client";

import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";
import { 
    getAvailabilityRules, 
    upsertAvailability, 
    batchCreateAvailability 
} from "@/lib/actions/booking.actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar } from "@/components/ui/calendar";
import { 
    Loader2, 
    Plus, 
    Trash, 
    Copy, 
    Calendar as CalendarIcon, 
    Clock, 
    Save, 
    ChevronRight,
    AlertCircle,
    Zap,
    ShieldCheck
} from "lucide-react";
import { toast } from "sonner";
import { format, isSameDay, startOfDay } from "date-fns";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";

const DAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

type Slot = { startTime: string; endTime: string };
type Rule = {
    _id?: string;
    dayOfWeek?: number;
    date?: string; 
    isActive: boolean;
    slots: Slot[];
};

export function AvailabilityEditor() {
    const [loading, setLoading] = useState(true);
    const [recurringRules, setRecurringRules] = useState<Rule[]>([]);
    const [overrides, setOverrides] = useState<Rule[]>([]);
    const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());

    const initRecurring = (fetchedRules: any[]) => {
        const rules = [];
        for (let i = 0; i < 7; i++) {
            const existing = fetchedRules.find(r => r.dayOfWeek === i);
            rules.push(existing || {
                dayOfWeek: i,
                isActive: false,
                slots: [{ startTime: "09:00", endTime: "17:00" }]
            });
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

    useEffect(() => { loadRules(); }, []);

    const handleSaveRule = async (rule: Rule) => {
        const res = await upsertAvailability(rule);
        if (res.success) {
            toast.success("Temporal Rule Synchronized");
            if (rule.date) loadRules();
        } else {
            toast.error(res.error || "Save Failed");
        }
    };

    const updateSlot = (dayIndex: number, slotIndex: number, field: 'startTime' | 'endTime', value: string) => {
        const newRules = [...recurringRules];
        newRules[dayIndex].slots[slotIndex] = { ...newRules[dayIndex].slots[slotIndex], [field]: value };
        setRecurringRules(newRules);
    };

    const addSlot = (dayIndex: number) => {
        const newRules = [...recurringRules];
        newRules[dayIndex].slots.push({ startTime: "09:00", endTime: "17:00" });
        setRecurringRules(newRules);
    };

    const removeSlot = (dayIndex: number, slotIndex: number) => {
        const newRules = [...recurringRules];
        newRules[dayIndex].slots.splice(slotIndex, 1);
        setRecurringRules(newRules);
    };

    const getOverrideForRule = (date: Date) => {
        return overrides.find(o => o.date && isSameDay(new Date(o.date), date));
    };

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center p-20 gap-6 text-zinc-500 animate-pulse">
                <Loader2 className="animate-spin text-indigo-500" size={48} />
                <span className="text-[10px] uppercase tracking-[6px] font-black italic">Syncing Temporal Matrix...</span>
            </div>
        );
    }

    return (
        <div className="animate-in fade-in slide-in-from-bottom duration-1000">
            <Tabs defaultValue="weekly" className="w-full">
                <TabsList className="bg-zinc-900/40 border border-zinc-800/50 p-1.5 rounded-2xl mb-12 h-auto backdrop-blur-3xl inline-flex shadow-2xl">
                    <TabsTrigger value="weekly" className="rounded-xl px-10 py-4 text-[10px] font-black uppercase tracking-[3px] data-[state=active]:bg-indigo-600 data-[state=active]:text-white transition-all shadow-xl">
                        Weekly Routine
                    </TabsTrigger>
                    <TabsTrigger value="overrides" className="rounded-xl px-10 py-4 text-[10px] font-black uppercase tracking-[3px] data-[state=active]:bg-indigo-600 data-[state=active]:text-white transition-all shadow-xl">
                        Strategic Overrides
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="weekly">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                        <div className="lg:col-span-2 space-y-4">
                            {recurringRules.map((rule, index) => (
                                <Card key={index} className={cn(
                                    "bg-zinc-900/40 border-zinc-800/50 backdrop-blur-3xl rounded-[2.5rem] transition-all relative overflow-hidden",
                                    rule.isActive ? 'border-l-4 border-l-cyan-500/50 opacity-100 shadow-2xl' : 'opacity-40 grayscale group'
                                )}>
                                     <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/[0.02] blur-[60px] pointer-events-none" />
                                    <CardContent className="p-8 flex flex-col md:flex-row items-start md:items-center gap-10">
                                        <div className="w-44 flex items-center gap-6">
                                            <Switch
                                                checked={rule.isActive}
                                                onCheckedChange={(checked) => handleSaveRule({ ...rule, isActive: checked })}
                                                className="data-[state=checked]:bg-cyan-600 scale-125"
                                            />
                                            <div className="flex flex-col">
                                                <span className={cn(
                                                    "text-lg font-black uppercase tracking-tighter italic leading-none mb-1",
                                                    rule.isActive ? 'text-white' : 'text-zinc-600 italic'
                                                )}>
                                                    {DAYS[index]}
                                                </span>
                                                <div className="flex items-center gap-1.5 uppercase text-[9px] font-black tracking-widest leading-none">
                                                   <div className={cn(
                                                       "w-1.5 h-1.5 rounded-full",
                                                       rule.isActive ? "bg-cyan-500 animate-pulse" : "bg-zinc-800"
                                                   )} />
                                                   <span className={rule.isActive ? "text-cyan-500" : "text-zinc-700"}>{rule.isActive ? 'Operation Live' : 'restricted'}</span>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex-1 space-y-4">
                                            {rule.isActive ? (
                                                rule.slots.map((slot, sIndex) => (
                                                    <div key={sIndex} className="flex items-center gap-4 animate-in fade-in slide-in-from-left-4 transition-all">
                                                        <div className="relative group">
                                                            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-600 group-focus-within:text-cyan-400 transition-colors"><Clock size={12} /></div>
                                                            <Input
                                                                type="time"
                                                                className="w-36 h-12 bg-black/40 border-zinc-800 group-focus-within:border-cyan-500/50 rounded-xl pl-11 text-xs font-black tracking-widest text-zinc-300 transition-all uppercase"
                                                                value={slot.startTime}
                                                                onChange={(e) => updateSlot(index, sIndex, 'startTime', e.target.value)}
                                                            />
                                                        </div>
                                                        <ChevronRight size={16} className="text-zinc-800 stroke-[3]" />
                                                        <div className="relative group">
                                                            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-600 group-focus-within:text-cyan-400 transition-colors"><Clock size={12} /></div>
                                                            <Input
                                                                type="time"
                                                                className="w-36 h-12 bg-black/40 border-zinc-800 group-focus-within:border-cyan-500/50 rounded-xl pl-11 text-xs font-black tracking-widest text-zinc-300 transition-all uppercase"
                                                                value={slot.endTime}
                                                                onChange={(e) => updateSlot(index, sIndex, 'endTime', e.target.value)}
                                                            />
                                                        </div>
                                                        <Button variant="ghost" size="icon" className="h-12 w-12 text-zinc-700 hover:text-rose-500 hover:bg-rose-500/10 rounded-2xl group transition-all" onClick={() => removeSlot(index, sIndex)}>
                                                            <Trash size={16} />
                                                        </Button>
                                                    </div>
                                                ))
                                            ) : (
                                                <div className="text-[10px] font-black text-zinc-800 uppercase tracking-[4px] py-4 italic">Baseline Restricted</div>
                                            )}
                                        </div>

                                        <div className="flex items-center gap-3">
                                            {rule.isActive && (
                                                <Button size="icon" variant="ghost" className="h-12 w-12 bg-black/20 border border-zinc-800 text-zinc-600 hover:text-cyan-400 rounded-2xl transition-all" onClick={() => addSlot(index)}>
                                                    <Plus size={20} />
                                                </Button>
                                            )}
                                            <Button size="icon" className="h-12 w-12 bg-cyan-600/10 border border-cyan-500/20 text-cyan-400 hover:bg-cyan-600 hover:text-white rounded-2xl transition-all group shadow-xl shadow-cyan-900/5" onClick={() => handleSaveRule(recurringRules[index])}>
                                                <Save size={20} className="group-hover:scale-110 transition-transform" />
                                            </Button>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>

                        <div className="space-y-10">
                            <div className="relative bg-zinc-900/40 border border-zinc-800/50 rounded-[3rem] p-10 overflow-hidden shadow-2xl backdrop-blur-3xl">
                                <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 blur-[60px] -mr-16 -mt-16 pointer-events-none" />
                                <div className="flex items-center gap-4 mb-8">
                                    <div className="w-12 h-12 bg-indigo-600/10 border border-indigo-600/20 rounded-2xl flex items-center justify-center text-indigo-400"><Copy size={20} /></div>
                                    <h3 className="font-black text-xl tracking-tighter uppercase italic text-white leading-none">Sync protocols</h3>
                                </div>
                                <p className="text-zinc-500 text-sm mb-10 leading-relaxed font-medium italic">Clone scheduling architectures across your grid to maintain a unified operational posture.</p>
                                <div className="space-y-4">
                                    <Button className="w-full h-16 bg-indigo-600 hover:bg-indigo-500 border border-indigo-400/20 text-white rounded-2xl font-black uppercase tracking-[3px] text-[10px] shadow-2xl shadow-indigo-600/20 transition-all">
                                        Apply to All Protocols
                                    </Button>
                                    <Button variant="outline" className="w-full h-16 border-zinc-800/50 bg-black/20 text-zinc-600 hover:text-white hover:border-zinc-700 rounded-2xl font-black uppercase tracking-[3px] text-[10px] transition-all">
                                        Reset Matrix Defaults
                                    </Button>
                                </div>
                            </div>

                            <div className="p-10 bg-zinc-900/10 border border-zinc-800/40 rounded-[2.5rem] border-dashed">
                                <div className="flex gap-5 items-start">
                                    <ShieldCheck className="text-indigo-500/40 shrink-0" size={24} />
                                    <div className="space-y-3">
                                        <h4 className="text-[10px] font-black uppercase tracking-[4px] text-zinc-400 italic">Operational Constraint</h4>
                                        <p className="text-[11px] text-zinc-600 font-bold leading-relaxed italic uppercase tracking-wider">
                                            The matrix enforces 1-hour session blocks. baseline accommodates these windows plus any configured priority buffer periods.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </TabsContent>

                <TabsContent value="overrides">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                        <Card className="bg-zinc-900/40 border-zinc-800/50 rounded-[3rem] overflow-hidden shadow-2xl backdrop-blur-3xl">
                            <CardHeader className="bg-black/20 px-10 py-8 border-b border-zinc-800/50">
                                <CardTitle className="text-xl font-black tracking-tighter uppercase italic text-white flex items-center gap-3">
                                    <Zap size={20} className="text-cyan-500" />
                                    Priority Calendar
                                </CardTitle>
                                <CardDescription className="text-[10px] font-black text-zinc-600 uppercase tracking-[4px] mt-2">Target specific temporal points</CardDescription>
                            </CardHeader>
                            <CardContent className="p-10">
                                <Calendar
                                    mode="single"
                                    selected={selectedDate}
                                    onSelect={setSelectedDate}
                                    className="p-3 bg-transparent rounded-2xl mx-auto dark"
                                    modifiers={{
                                        hasOverride: (date) => !!getOverrideForRule(date)
                                    }}
                                    modifiersStyles={{
                                        hasOverride: { color: "#22d3ee", fontWeight: "900", background: "#22d3ee10", borderRadius: "12px" }
                                    }}
                                />
                            </CardContent>
                        </Card>

                        <div className="space-y-8 animate-in slide-in-from-right-10 duration-700">
                            {selectedDate && (
                                <Card className="bg-zinc-900/40 border border-zinc-800/50 rounded-[3rem] shadow-2xl border-l-[6px] border-l-indigo-600 backdrop-blur-3xl relative overflow-hidden">
                                     <div className="absolute top-0 right-0 w-48 h-48 bg-indigo-500/5 blur-[80px] pointer-events-none" />
                                    <CardHeader className="px-10 py-10">
                                        <div className="flex items-center justify-between">
                                            <div className="flex flex-col">
                                                <span className="text-[10px] font-black uppercase tracking-[5px] text-zinc-600 mb-2 italic">Temporal Point Config</span>
                                                <CardTitle className="text-3xl font-black tracking-tighter uppercase italic text-white">{format(selectedDate, "MMMM d, yyyy")}</CardTitle>
                                            </div>
                                            <Badge className="bg-indigo-600 text-white font-black uppercase tracking-[3px] text-[10px] py-2 px-5 rounded-full shadow-lg shadow-indigo-600/20 italic border-none">Priority</Badge>
                                        </div>
                                    </CardHeader>
                                    <CardContent className="px-10 pb-12 space-y-10">
                                        {(() => {
                                            const override = getOverrideForRule(selectedDate);
                                            const displayRule: Rule = override || {
                                                date: startOfDay(selectedDate).toISOString(),
                                                isActive: true,
                                                slots: [{ startTime: "09:00", endTime: "17:00" }]
                                            };

                                            return (
                                                <div className="space-y-10">
                                                    <div className="flex items-center justify-between p-8 bg-black/40 rounded-[2rem] border border-zinc-800/50 shadow-inner">
                                                        <div className="flex flex-col">
                                                            <span className="text-[11px] font-black uppercase tracking-[3px] text-zinc-300">Operational state</span>
                                                            <span className="text-xs text-zinc-600 font-bold uppercase tracking-widest mt-2 italic">
                                                                {displayRule.isActive ? "Authorized for engagements" : "Baseline Restricted / Offline"}
                                                            </span>
                                                        </div>
                                                        <Switch
                                                            checked={displayRule.isActive}
                                                            onCheckedChange={(checked) => handleSaveRule({ ...displayRule, isActive: checked })}
                                                            className="data-[state=checked]:bg-indigo-500 scale-125"
                                                        />
                                                    </div>

                                                    {displayRule.isActive && (
                                                        <div className="space-y-6">
                                                            <div className="flex items-center justify-between px-2">
                                                                <span className="text-[10px] font-black uppercase tracking-[5px] text-zinc-600 italic">Active Windows</span>
                                                            </div>
                                                            <div className="space-y-4">
                                                                {displayRule.slots.map((slot, idx) => (
                                                                    <div key={idx} className="flex items-center gap-5 bg-zinc-800/30 p-6 rounded-[1.5rem] border border-zinc-700/30 transition-all hover:bg-zinc-800/50">
                                                                        <div className="flex-1 relative group">
                                                                            <Input type="time" value={slot.startTime} className="bg-black/60 border-none text-indigo-400 font-black tracking-widest h-12 rounded-xl text-xs uppercase pl-4" onChange={(e) => {
                                                                                const newSlots = [...displayRule.slots];
                                                                                newSlots[idx].startTime = e.target.value;
                                                                                handleSaveRule({ ...displayRule, slots: newSlots });
                                                                            }} />
                                                                        </div>
                                                                        <ChevronRight size={18} className="text-zinc-800 stroke-[3]" />
                                                                        <div className="flex-1 relative group">
                                                                            <Input type="time" value={slot.endTime} className="bg-black/60 border-none text-indigo-400 font-black tracking-widest h-12 rounded-xl text-xs uppercase pl-4" onChange={(e) => {
                                                                                const newSlots = [...displayRule.slots];
                                                                                newSlots[idx].endTime = e.target.value;
                                                                                handleSaveRule({ ...displayRule, slots: newSlots });
                                                                            }} />
                                                                        </div>
                                                                        <Button variant="ghost" size="icon" className="h-12 w-12 text-zinc-700 hover:text-rose-500 hover:bg-rose-500/10 rounded-xl" onClick={() => {
                                                                            const newSlots = [...displayRule.slots];
                                                                            newSlots.splice(idx, 1);
                                                                            handleSaveRule({ ...displayRule, slots: newSlots });
                                                                        }}><Trash size={18} /></Button>
                                                                    </div>
                                                                ))}
                                                            </div>
                                                            <Button variant="outline" className="w-full h-16 border-zinc-800/50 border-dashed bg-transparent text-zinc-600 hover:text-indigo-400 hover:border-indigo-500/50 rounded-[1.5rem] font-black uppercase tracking-[4px] text-[10px] transition-all" onClick={() => {
                                                                const newSlots = [...displayRule.slots, { startTime: "09:00", endTime: "17:00" }];
                                                                handleSaveRule({ ...displayRule, slots: newSlots });
                                                            }}>
                                                                <Plus size={18} className="mr-3" />
                                                                Initialize Priority Window
                                                            </Button>
                                                        </div>
                                                    )}
                                                </div>
                                            );
                                        })()}
                                    </CardContent>
                                </Card>
                            )}
                        </div>
                    </div>
                </TabsContent>
            </Tabs>
        </div>
    );
}
