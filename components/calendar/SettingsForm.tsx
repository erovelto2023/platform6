
"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { updateCalendarSettings, updateEmailSettings } from "@/lib/actions/business.actions";
import { useState } from "react";
import { Loader2, Mail, Globe, Settings2, ShieldCheck, Zap } from "lucide-react";
import { cn } from "@/lib/utils";

const formSchema = z.object({
    slug: z.string().min(3, "Slug must be at least 3 characters").regex(/^[a-z0-9-]+$/, "Slug can only contain lowercase letters, numbers, and hyphens"),
    timezone: z.string(),
    bufferTime: z.string(),
    slotInterval: z.string(),
    requiresConfirmation: z.boolean(),
    resendApiKey: z.string().optional(),
    fromEmail: z.string().email("Invalid email address").optional().or(z.literal('')),
});

interface SettingsFormProps {
    business: any;
}

export function SettingsForm({ business }: SettingsFormProps) {
    const [isLoading, setIsLoading] = useState(false);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            slug: business.calendarSettings?.slug || business._id,
            timezone: business.calendarSettings?.timezone || "UTC",
            bufferTime: (business.calendarSettings?.bufferTime || 0).toString(),
            slotInterval: (business.calendarSettings?.slotInterval || 30).toString(),
            requiresConfirmation: business.calendarSettings?.requiresConfirmation || false,
            resendApiKey: business.emailSettings?.apiKey || "", 
            fromEmail: business.emailSettings?.fromEmail || "onboarding@resend.dev",
        },
    });

    async function onSubmit(values: z.infer<typeof formSchema>) {
        setIsLoading(true);
        try {
            const formattedValues = {
                slug: values.slug,
                timezone: values.timezone,
                bufferTime: Number(values.bufferTime),
                slotInterval: Number(values.slotInterval),
                requiresConfirmation: values.requiresConfirmation,
            };
            const resCalendar = await updateCalendarSettings(formattedValues);

            const resEmail = await updateEmailSettings({
                apiKey: values.resendApiKey,
                fromEmail: values.fromEmail || "onboarding@resend.dev",
            });

            if (resCalendar.success && resEmail.success) {
                toast.success("Protocol Parameters Synchronized");
            } else {
                toast.error(resCalendar.error || resEmail.error || "Sync Failed");
            }
        } catch (error) {
            toast.error("Critical Engine Error");
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-10 max-w-5xl animate-in fade-in slide-in-from-bottom duration-1000">
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Operational Core */}
                    <Card className="bg-zinc-900/40 border-zinc-800/50 backdrop-blur-3xl rounded-[2.5rem] shadow-2xl relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/5 blur-[60px] pointer-events-none" />
                        <CardHeader className="p-8 pb-4">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="p-2 bg-indigo-500/10 border border-indigo-500/20 rounded-xl text-indigo-400">
                                    <Globe size={20} />
                                </div>
                                <CardTitle className="text-xl font-black uppercase italic tracking-tighter text-white">Operational Core</CardTitle>
                            </div>
                            <CardDescription className="text-[10px] font-black uppercase tracking-[3px] text-zinc-600">Global routing & temporal baseline</CardDescription>
                        </CardHeader>
                        <CardContent className="p-8 space-y-6">
                            <FormField
                                control={form.control}
                                name="slug"
                                render={({ field }) => (
                                    <FormItem className="space-y-3">
                                        <FormLabel className="text-[11px] font-black uppercase tracking-widest text-zinc-400">Booking URL Slug</FormLabel>
                                        <div className="flex bg-black/40 border border-zinc-800 rounded-2xl overflow-hidden focus-within:border-indigo-500/50 transition-all shadow-inner">
                                            <span className="flex select-none items-center pl-4 pr-3 text-zinc-600 text-[10px] font-black uppercase tracking-widest border-r border-zinc-800 italic">
                                                platform.app/book/
                                            </span>
                                            <FormControl>
                                                <Input className="border-none bg-transparent rounded-none h-12 text-sm font-black text-indigo-400 focus-visible:ring-0" placeholder="my-protocol" {...field} />
                                            </FormControl>
                                        </div>
                                        <FormMessage className="text-[10px] font-bold text-rose-500 uppercase tracking-widest" />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="timezone"
                                render={({ field }) => (
                                    <FormItem className="space-y-3">
                                        <FormLabel className="text-[11px] font-black uppercase tracking-widest text-zinc-400">Temporal Base (Timezone)</FormLabel>
                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                                            <FormControl>
                                                <SelectTrigger className="h-12 bg-black/40 border-zinc-800 rounded-2xl text-xs font-black uppercase tracking-widest text-zinc-300">
                                                    <SelectValue placeholder="Select temporal base" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent className="bg-zinc-900 border-zinc-800 text-zinc-400 backdrop-blur-3xl rounded-xl">
                                                <SelectItem value="UTC" className="focus:bg-indigo-600 focus:text-white rounded-lg">UTC (Universal)</SelectItem>
                                                <SelectItem value="America/New_York" className="focus:bg-indigo-600 focus:text-white rounded-lg">New York (ET)</SelectItem>
                                                <SelectItem value="America/Chicago" className="focus:bg-indigo-600 focus:text-white rounded-lg">Chicago (CT)</SelectItem>
                                                <SelectItem value="America/Los_Angeles" className="focus:bg-indigo-600 focus:text-white rounded-lg">Los Angeles (PT)</SelectItem>
                                                <SelectItem value="Europe/London" className="focus:bg-indigo-600 focus:text-white rounded-lg">London (GMT)</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </CardContent>
                    </Card>

                    {/* Email Orchestration */}
                    <Card className="bg-zinc-900/40 border-zinc-800/50 backdrop-blur-3xl rounded-[2.5rem] shadow-2xl relative overflow-hidden">
                         <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/5 blur-[60px] pointer-events-none" />
                        <CardHeader className="p-8 pb-4">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="p-2 bg-cyan-500/10 border border-cyan-500/20 rounded-xl text-cyan-400">
                                    <Mail size={20} />
                                </div>
                                <CardTitle className="text-xl font-black uppercase italic tracking-tighter text-white">Communication Layer</CardTitle>
                            </div>
                            <CardDescription className="text-[10px] font-black uppercase tracking-[3px] text-zinc-600">Automated dispatch via Resend</CardDescription>
                        </CardHeader>
                        <CardContent className="p-8 space-y-6">
                            <FormField
                                control={form.control}
                                name="resendApiKey"
                                render={({ field }) => (
                                    <FormItem className="space-y-3">
                                        <FormLabel className="text-[11px] font-black uppercase tracking-widest text-zinc-400">Resend API Signature</FormLabel>
                                        <FormControl>
                                            <Input 
                                                type="password" 
                                                className="h-12 bg-black/40 border-zinc-800 rounded-2xl text-xs font-black tracking-widest text-zinc-300 focus:border-cyan-500/50" 
                                                placeholder="re_••••••••••••" 
                                                {...field} 
                                            />
                                        </FormControl>
                                        <FormDescription className="text-[9px] font-bold text-zinc-600 uppercase tracking-widest italic">
                                            Authorized key from Resend.com
                                        </FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="fromEmail"
                                render={({ field }) => (
                                    <FormItem className="space-y-3">
                                        <FormLabel className="text-[11px] font-black uppercase tracking-widest text-zinc-400">Verified Dispatch Email</FormLabel>
                                        <FormControl>
                                            <Input 
                                                className="h-12 bg-black/40 border-zinc-800 rounded-2xl text-xs font-black tracking-widest text-cyan-400 focus:border-cyan-500/50" 
                                                placeholder="concierge@verified-domain.com" 
                                                {...field} 
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </CardContent>
                    </Card>
                </div>

                {/* Tactical Parameters */}
                <Card className="bg-zinc-900/40 border-zinc-800/50 backdrop-blur-3xl rounded-[3rem] shadow-2xl relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/5 blur-[100px] pointer-events-none" />
                    <CardHeader className="p-10 pb-6">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="p-2 bg-indigo-500/10 border border-indigo-500/20 rounded-xl text-indigo-400">
                                <Settings2 size={20} />
                            </div>
                            <CardTitle className="text-2xl font-black uppercase italic tracking-tighter text-white">Tactical Constraints</CardTitle>
                        </div>
                        <CardDescription className="text-[10px] font-black uppercase tracking-[4px] text-zinc-600 italic">Fine-tune the temporal engagement engine</CardDescription>
                    </CardHeader>
                    <CardContent className="p-10 space-y-10">
                        <FormField
                            control={form.control}
                            name="requiresConfirmation"
                            render={({ field }) => (
                                <FormItem className="flex flex-row items-center justify-between p-8 bg-black/40 border border-zinc-800 rounded-[2rem] shadow-inner transition-all hover:bg-black/60 group">
                                    <div className="space-y-2">
                                        <FormLabel className="text-base font-black uppercase tracking-tight text-white flex items-center gap-3">
                                            <ShieldCheck size={18} className="text-emerald-500" />
                                            Manual Authorization Required
                                        </FormLabel>
                                        <FormDescription className="text-xs text-zinc-600 font-bold uppercase tracking-widest italic leading-relaxed">
                                            Enforce manual confirmation protocol before session finalization.
                                        </FormDescription>
                                    </div>
                                    <FormControl>
                                        <Switch
                                            checked={field.value}
                                            onCheckedChange={field.onChange}
                                            className="data-[state=checked]:bg-emerald-600 scale-125"
                                        />
                                    </FormControl>
                                </FormItem>
                            )}
                        />

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                            <FormField
                                control={form.control}
                                name="bufferTime"
                                render={({ field }) => (
                                    <FormItem className="space-y-4">
                                        <div className="flex items-center gap-2">
                                            <Zap size={14} className="text-cyan-500" />
                                            <FormLabel className="text-[11px] font-black uppercase tracking-widest text-zinc-400">Engagement Buffer (Cooldown)</FormLabel>
                                        </div>
                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                                            <FormControl>
                                                <SelectTrigger className="h-14 bg-black/40 border-zinc-800 rounded-2xl text-xs font-black uppercase tracking-widest text-zinc-300">
                                                    <SelectValue placeholder="Select cooldown" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent className="bg-zinc-900 border-zinc-800 text-zinc-400 backdrop-blur-3xl rounded-xl">
                                                <SelectItem value="0" className="focus:bg-cyan-600 focus:text-white rounded-lg">Direct Handoff (0m)</SelectItem>
                                                <SelectItem value="15" className="focus:bg-cyan-600 focus:text-white rounded-lg">Tactical Pause (15m)</SelectItem>
                                                <SelectItem value="30" className="focus:bg-cyan-600 focus:text-white rounded-lg">Operational Reset (30m)</SelectItem>
                                                <SelectItem value="60" className="focus:bg-cyan-600 focus:text-white rounded-lg">Full Cooldown (1h)</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        <FormDescription className="text-[9px] font-bold text-zinc-700 uppercase tracking-widest">Temporal padding between session windows.</FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="slotInterval"
                                render={({ field }) => (
                                    <FormItem className="space-y-4">
                                         <div className="flex items-center gap-2">
                                            <Settings2 size={14} className="text-indigo-500" />
                                            <FormLabel className="text-[11px] font-black uppercase tracking-widest text-zinc-400">Granularity Interval</FormLabel>
                                        </div>
                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                                            <FormControl>
                                                <SelectTrigger className="h-14 bg-black/40 border-zinc-800 rounded-2xl text-xs font-black uppercase tracking-widest text-zinc-300">
                                                    <SelectValue placeholder="Select interval" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent className="bg-zinc-900 border-zinc-800 text-zinc-400 backdrop-blur-3xl rounded-xl">
                                                <SelectItem value="15" className="focus:bg-indigo-600 focus:text-white rounded-lg">Precision (15m)</SelectItem>
                                                <SelectItem value="30" className="focus:bg-indigo-600 focus:text-white rounded-lg">Standard (30m)</SelectItem>
                                                <SelectItem value="60" className="focus:bg-indigo-600 focus:text-white rounded-lg">Macro (60m)</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        <FormDescription className="text-[9px] font-bold text-zinc-700 uppercase tracking-widest">Temporal step frequency for slot generation.</FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                    </CardContent>
                </Card>

                <div className="flex justify-end pt-10">
                    <Button 
                        type="submit" 
                        disabled={isLoading} 
                        className="h-16 px-12 bg-indigo-600 hover:bg-indigo-500 border border-indigo-400 shadow-2xl shadow-indigo-600/30 text-white rounded-[1.5rem] font-black uppercase tracking-[5px] text-xs transition-all active:scale-95"
                    >
                        {isLoading ? (
                            <>
                                <Loader2 className="mr-3 h-5 w-5 animate-spin" />
                                Syncing Protocol...
                            </>
                        ) : (
                            "Synchronize Operational Matrix"
                        )}
                    </Button>
                </div>
            </form>
        </Form>
    );
}
