'use client';

import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { createClient } from "@/lib/actions/client.actions";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { 
    Plus, 
    Trash2, 
    User, 
    Phone, 
    Globe, 
    MessageSquare, 
    MapPin, 
    Briefcase 
} from "lucide-react";

const FacebookIcon = (props: any) => (
    <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" className={props.className}><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg>
);
const TwitterIcon = (props: any) => (
    <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" className={props.className}><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"></path></svg>
);
const LinkedinIcon = (props: any) => (
    <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" className={props.className}><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path><rect x="2" y="9" width="4" height="12"></rect><circle cx="4" cy="4" r="2"></circle></svg>
);
const InstagramIcon = (props: any) => (
    <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" className={props.className}><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
);
const TiktokIcon = (props: any) => (
    <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" className={props.className}><path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5"></path></svg>
);
const YoutubeIcon = (props: any) => (
    <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" className={props.className}><path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z"></path><polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02"></polygon></svg>
);
const WechatIcon = (props: any) => (
    <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" className={props.className}><path d="M8 10a.5.5 0 1 0 0-1 .5.5 0 0 0 0 1zm4-1a.5.5 0 1 1-1 0 .5.5 0 0 1 1 0z"></path><path d="M17 6.5C17 3.46 13.87 1 10 1S3 3.46 3 6.5c0 1.88 1.19 3.54 3 4.54v2.46l2.5-1.5c.5.1 1 .15 1.5.15 3.87 0 7-2.46 7-5.5z"></path><path d="M21 12.5c0-2.43-2.18-4.43-5-4.93C16 7.84 16 8.17 16 8.5c0 3.87-3.13 7-7 7-.33 0-.66 0-1-.04.83 2.27 3.32 3.8 6.25 3.8.38 0 .75-.04 1.13-.08l2.25 1.35v-2.07c1.73-.91 2.87-2.44 2.87-4.16z"></path></svg>
);
const TelegramIcon = (props: any) => (
    <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" className={props.className}><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>
);
const MessengerIcon = (props: any) => (
    <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" className={props.className}><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path></svg>
);
const RedditIcon = (props: any) => (
    <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" className={props.className}><circle cx="12" cy="12" r="10"></circle><path d="M12 8a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3z"></path><path d="M17 16c-1 1-2.5 1.5-5 1.5s-4-.5-5-1.5"></path></svg>
);
const ThreadsIcon = (props: any) => (
    <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" className={props.className}><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15.5c-2.48 0-4.5-2.02-4.5-4.5s2.02-4.5 4.5-4.5 4.5 2.02 4.5 4.5-2.02 4.5-4.5 4.5z"></path></svg>
);
const PinterestIcon = (props: any) => (
    <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" className={props.className}><line x1="8" y1="22" x2="12" y2="11"></line><path d="M12 2a9 9 0 0 1 4 17.5C14.7 18 13 14 13 12c0-2.3 2-4 4-4s4 2.5 4 5.5a8 8 0 0 1-8 8"></path></svg>
);
const SnapchatIcon = (props: any) => (
    <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" className={props.className}><path d="M12 2a5 5 0 0 1 5 5c0 1.25-.5 2.5-1.5 3 .5.5 1.5.5 2.5-.5.5-.5 1-.5 1.5 0s0 1.5-1 2.5c-.75.75-2.25 1-3.5 1v.5c0 2-2 3.5-5 3.5s-5-1.5-5-3.5v-.5C5 13 3.5 12.75 2.75 12c-1-1-1-2-1-2.5s1-.5 1.5 0c1 1 2 1 2.5.5C4.75 9.5 4.25 8.25 4.25 7a5 5 0 0 1 5-5h2.75z"></path></svg>
);
const DiscordIcon = (props: any) => (
    <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" className={props.className}><path d="M18 6h-2l-1 2H9L8 6H6c-3 0-4.5 3-4.5 6 0 4.5 3.5 6.5 6 6.5l1.5-2.5-1-1h6l-1 1 1.5 2.5c2.5 0 6-2 6-6.5 0-3-1.5-6-4.5-6z"></path><circle cx="9.5" cy="12.5" r="1.5"></circle><circle cx="14.5" cy="12.5" r="1.5"></circle></svg>
);
const TwitchIcon = (props: any) => (
    <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" className={props.className}><path d="M21 2H3v16h5v4l4-4h5l4-4V2zm-2 13l-4 4v-4H9v-2h8v2zm0-5l-4 4v-4H9V8h8v2z"></path></svg>
);
const QuoraIcon = (props: any) => (
    <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" className={props.className}><circle cx="12" cy="12" r="10"></circle><path d="M12 6a4 4 0 0 0-4 4v2c0 2 1.5 4 4 4s4-2 4-4V8c0-1.1-.9-2-2-2zM15 15l3 3"></path></svg>
);
const DouyinIcon = (props: any) => (
    <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" className={props.className}><path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5M12 8a4 4 0 0 0 4-4"></path></svg>
);
const KuaishouIcon = (props: any) => (
    <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" className={props.className}><circle cx="12" cy="12" r="10"></circle><path d="M8 12h8M12 8v8"></path></svg>
);
const WeiboIcon = (props: any) => (
    <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" className={props.className}><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 14.5c-2.48 0-4.5-2.02-4.5-4.5S10.52 7.5 13 7.5c2 0 3.5 1.5 3.5 3v1c0 2.5-3 5-3.5 5z"></path></svg>
);
const LineIcon = (props: any) => (
    <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" className={props.className}><path d="M21 11.5C21 7.36 17.06 4 12 4S3 7.36 3 11.5c0 3.73 3.16 6.84 7.45 7.36l-.37 1.58c-.08.35.12.5.37.38l3.65-2.15c4.22-.44 6.9-3.41 6.9-7.07z"></path></svg>
);
const VkIcon = (props: any) => (
    <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" className={props.className}><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.5 11.5h-1.5c-.5 0-.8-.3-1.1-.8-.4-.6-.8-1-1.1-1-.2 0-.4.1-.4.4v1.4h-1.5c-2.2 0-3.8-1.5-4.8-3.8l.5-.2c.8 1.8 1.8 2.5 3 2.5v-2.9c0-.5-.3-.8-.8-.8h-.4v-.8h2.1v4.5z"></path></svg>
);

const contactSchema = z.object({
    name: z.string().min(1, "Contact Name is required"),
    email: z.string().optional(),
    phone: z.string().optional(),
    role: z.string().optional(),
});

const formSchema = z.object({
    name: z.string().min(2, {
        message: "Name must be at least 2 characters.",
    }),
    email: z.string().email({
        message: "Please enter a valid email address.",
    }),
    phone: z.string().optional(),
    accountNumber: z.string().optional(),
    whatsapp: z.string().optional(),
    website: z.string().optional(),
    socials: z.object({
        facebook: z.string().optional(),
        twitter: z.string().optional(),
        linkedin: z.string().optional(),
        instagram: z.string().optional(),
        tiktok: z.string().optional(),
        youtube: z.string().optional(),
        wechat: z.string().optional(),
        telegram: z.string().optional(),
        messenger: z.string().optional(),
        reddit: z.string().optional(),
        threads: z.string().optional(),
        pinterest: z.string().optional(),
        snapchat: z.string().optional(),
        discord: z.string().optional(),
        twitch: z.string().optional(),
        quora: z.string().optional(),
        douyin: z.string().optional(),
        kuaishou: z.string().optional(),
        weibo: z.string().optional(),
        line: z.string().optional(),
        vk: z.string().optional(),
    }).optional(),
    contacts: z.array(contactSchema).default([]),
    address: z.object({
        street: z.string().optional(),
        city: z.string().optional(),
        state: z.string().optional(),
        zip: z.string().optional(),
        country: z.string().optional(),
    }),
    notes: z.string().optional(),
});

export function ClientForm({ onSuccess }: { onSuccess?: (client: any) => void }) {
    const router = useRouter();
    const [isSubmitting, setIsSubmitting] = useState(false);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema) as any,
        defaultValues: {
            name: "",
            email: "",
            phone: "",
            accountNumber: "",
            whatsapp: "",
            website: "",
            socials: {
                facebook: "",
                twitter: "",
                linkedin: "",
                instagram: "",
                tiktok: "",
                youtube: "",
                wechat: "",
                telegram: "",
                messenger: "",
                reddit: "",
                threads: "",
                pinterest: "",
                snapchat: "",
                discord: "",
                twitch: "",
                quora: "",
                douyin: "",
                kuaishou: "",
                weibo: "",
                line: "",
                vk: "",
            },
            contacts: [],
            address: {
                street: "",
                city: "",
                state: "",
                zip: "",
                country: "",
            },
            notes: "",
        },
    });

    const { fields, append, remove } = useFieldArray({
        control: form.control as any,
        name: "contacts",
    });

    async function onSubmit(values: z.infer<typeof formSchema>) {
        setIsSubmitting(true);
        try {
            const cleanedValues = {
                ...values,
                contacts: values.contacts.filter(c => c.name.trim() !== ""),
            };
            const result = await createClient(cleanedValues);
            if (result.success) {
                toast.success("Client created successfully");
                form.reset();
                router.refresh();
                if (onSuccess) onSuccess(result.data);
            } else {
                toast.error(result.error || "Failed to create client");
            }
        } catch (error) {
            toast.error("Something went wrong");
        } finally {
            setIsSubmitting(false);
        }
    }

    const inputCls = "bg-[#07090e] border-slate-800 text-white rounded-xl focus:border-indigo-500 placeholder-slate-650 h-[40px]";
    const textLabelCls = "text-xs font-bold text-slate-400 block mb-1";

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <Tabs defaultValue="basic" className="w-full">
                    <TabsList className="grid grid-cols-4 bg-slate-900/60 p-1 border border-slate-800 rounded-xl mb-4">
                        <TabsTrigger value="basic" className="text-xs font-bold py-1.5 rounded-lg data-[state=active]:bg-slate-800 data-[state=active]:text-white">Basic</TabsTrigger>
                        <TabsTrigger value="contacts" className="text-xs font-bold py-1.5 rounded-lg data-[state=active]:bg-slate-800 data-[state=active]:text-white">Contacts</TabsTrigger>
                        <TabsTrigger value="web" className="text-xs font-bold py-1.5 rounded-lg data-[state=active]:bg-slate-800 data-[state=active]:text-white">Web & Socials</TabsTrigger>
                        <TabsTrigger value="address" className="text-xs font-bold py-1.5 rounded-lg data-[state=active]:bg-slate-800 data-[state=active]:text-white">Address</TabsTrigger>
                    </TabsList>

                    {/* BASIC TAB */}
                    <TabsContent value="basic" className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <FormField
                                control={form.control}
                                name="name"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className={textLabelCls}>Client / Company Name *</FormLabel>
                                        <FormControl>
                                            <Input placeholder="e.g. Acme Corp" className={inputCls} {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="accountNumber"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className={textLabelCls}>Account Number</FormLabel>
                                        <FormControl>
                                            <Input placeholder="e.g. ACC-2026-001" className={inputCls} {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <FormField
                                control={form.control}
                                name="email"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className={textLabelCls}>Email Address *</FormLabel>
                                        <FormControl>
                                            <Input placeholder="e.g. billing@acme.com" className={inputCls} {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="phone"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className={textLabelCls}>Phone Number</FormLabel>
                                        <FormControl>
                                            <Input placeholder="e.g. +1 (555) 123-4567" className={inputCls} {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                    </TabsContent>

                    {/* ADDITIONAL CONTACTS TAB */}
                    <TabsContent value="contacts" className="space-y-4">
                        <div className="flex justify-between items-center mb-2">
                            <div>
                                <h4 className="text-sm font-bold text-white">Contact Persons</h4>
                                <p className="text-xs text-slate-500 mt-0.5">Manage additional representatives for this business.</p>
                            </div>
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => append({ name: "", email: "", phone: "", role: "" })}
                                className="bg-slate-900 border-slate-800 text-xs text-slate-350 hover:bg-slate-800 hover:text-white rounded-xl py-1.5 h-8"
                            >
                                <Plus className="w-3.5 h-3.5 mr-1" /> Add Contact
                            </Button>
                        </div>

                        {fields.length === 0 ? (
                            <div className="text-center py-6 border border-dashed border-slate-800 rounded-xl text-slate-500 text-xs">
                                <Briefcase className="w-6 h-6 mx-auto opacity-20 mb-1.5" />
                                No additional contacts registered. Click "Add Contact" above to start.
                            </div>
                        ) : (
                            <div className="space-y-4 max-h-[300px] overflow-y-auto pr-1">
                                {fields.map((field, index) => (
                                    <div key={field.id} className="p-4 bg-slate-900/30 border border-slate-800 rounded-xl space-y-3 relative group">
                                        <div className="grid grid-cols-2 gap-3">
                                            <FormField
                                                control={form.control}
                                                name={`contacts.${index}.name`}
                                                render={({ field }) => (
                                                    <FormItem className="space-y-1">
                                                        <FormLabel className="text-[10px] uppercase font-bold text-slate-500">Contact Name *</FormLabel>
                                                        <FormControl>
                                                            <Input placeholder="John Doe" className="bg-[#07090e] border-slate-800 text-xs h-8 text-white" {...field} />
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                            <FormField
                                                control={form.control}
                                                name={`contacts.${index}.role`}
                                                render={({ field }) => (
                                                    <FormItem className="space-y-1">
                                                        <FormLabel className="text-[10px] uppercase font-bold text-slate-500">Role / Title</FormLabel>
                                                        <FormControl>
                                                            <Input placeholder="Operations Mgr" className="bg-[#07090e] border-slate-800 text-xs h-8 text-white" {...field} />
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                        </div>

                                        <div className="grid grid-cols-2 gap-3">
                                            <FormField
                                                control={form.control}
                                                name={`contacts.${index}.email`}
                                                render={({ field }) => (
                                                    <FormItem className="space-y-1">
                                                        <FormLabel className="text-[10px] uppercase font-bold text-slate-500">Email</FormLabel>
                                                        <FormControl>
                                                            <Input placeholder="john@acme.com" className="bg-[#07090e] border-slate-800 text-xs h-8 text-white" {...field} />
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                            <FormField
                                                control={form.control}
                                                name={`contacts.${index}.phone`}
                                                render={({ field }) => (
                                                    <FormItem className="space-y-1">
                                                        <FormLabel className="text-[10px] uppercase font-bold text-slate-500">Phone</FormLabel>
                                                        <FormControl>
                                                            <Input placeholder="(555) 0122" className="bg-[#07090e] border-slate-800 text-xs h-8 text-white" {...field} />
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                        </div>

                                        <Button
                                            type="button"
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => remove(index)}
                                            className="absolute top-2 right-2 text-slate-500 hover:text-red-400 hover:bg-slate-900 h-7 w-7 p-0 rounded-lg transition-colors"
                                        >
                                            <Trash2 className="w-3.5 h-3.5" />
                                        </Button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </TabsContent>

                    {/* WEB & SOCIALS TAB */}
                    <TabsContent value="web" className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <FormField
                                control={form.control}
                                name="website"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className={textLabelCls}>
                                            <span className="flex items-center gap-1.5"><Globe className="w-3.5 h-3.5 text-blue-400" /> Website Address</span>
                                        </FormLabel>
                                        <FormControl>
                                            <Input placeholder="https://acme.com" className={inputCls} {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="whatsapp"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className={textLabelCls}>
                                            <span className="flex items-center gap-1.5"><MessageSquare className="w-3.5 h-3.5 text-emerald-400" /> WhatsApp Number</span>
                                        </FormLabel>
                                        <FormControl>
                                            <Input placeholder="+1 (555) 000-0000" className={inputCls} {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <div className="space-y-4 pt-2 max-h-[350px] overflow-y-auto pr-1">
                            <div className="text-xs font-bold text-indigo-400 uppercase tracking-wider mb-2">Major Networks</div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <FormField
                                    control={form.control}
                                    name="socials.facebook"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className={textLabelCls}>
                                                <span className="flex items-center gap-1.5"><FacebookIcon className="w-3.5 h-3.5 text-blue-500" /> Facebook</span>
                                            </FormLabel>
                                            <FormControl>
                                                <Input placeholder="https://facebook.com/acme" className={inputCls} {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="socials.twitter"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className={textLabelCls}>
                                                <span className="flex items-center gap-1.5"><TwitterIcon className="w-3.5 h-3.5 text-sky-450" /> X (formerly Twitter)</span>
                                            </FormLabel>
                                            <FormControl>
                                                <Input placeholder="https://x.com/acme" className={inputCls} {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <FormField
                                    control={form.control}
                                    name="socials.linkedin"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className={textLabelCls}>
                                                <span className="flex items-center gap-1.5"><LinkedinIcon className="w-3.5 h-3.5 text-indigo-500" /> LinkedIn</span>
                                            </FormLabel>
                                            <FormControl>
                                                <Input placeholder="https://linkedin.com/company/acme" className={inputCls} {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="socials.instagram"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className={textLabelCls}>
                                                <span className="flex items-center gap-1.5"><InstagramIcon className="w-3.5 h-3.5 text-rose-450" /> Instagram</span>
                                            </FormLabel>
                                            <FormControl>
                                                <Input placeholder="https://instagram.com/acme" className={inputCls} {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <FormField
                                    control={form.control}
                                    name="socials.tiktok"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className={textLabelCls}>
                                                <span className="flex items-center gap-1.5"><TiktokIcon className="w-3.5 h-3.5 text-slate-350" /> TikTok</span>
                                            </FormLabel>
                                            <FormControl>
                                                <Input placeholder="https://tiktok.com/@acme" className={inputCls} {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="socials.youtube"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className={textLabelCls}>
                                                <span className="flex items-center gap-1.5"><YoutubeIcon className="w-3.5 h-3.5 text-red-500" /> YouTube</span>
                                            </FormLabel>
                                            <FormControl>
                                                <Input placeholder="https://youtube.com/c/acme" className={inputCls} {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>

                            <div className="text-xs font-bold text-indigo-400 uppercase tracking-wider mt-4 mb-2">Messaging & Platforms</div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <FormField
                                    control={form.control}
                                    name="socials.telegram"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className={textLabelCls}>
                                                <span className="flex items-center gap-1.5"><TelegramIcon className="w-3.5 h-3.5 text-sky-400" /> Telegram</span>
                                            </FormLabel>
                                            <FormControl>
                                                <Input placeholder="https://t.me/acme" className={inputCls} {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="socials.discord"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className={textLabelCls}>
                                                <span className="flex items-center gap-1.5"><DiscordIcon className="w-3.5 h-3.5 text-indigo-400" /> Discord</span>
                                            </FormLabel>
                                            <FormControl>
                                                <Input placeholder="https://discord.gg/acme" className={inputCls} {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <FormField
                                    control={form.control}
                                    name="socials.messenger"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className={textLabelCls}>
                                                <span className="flex items-center gap-1.5"><MessengerIcon className="w-3.5 h-3.5 text-blue-500" /> Messenger</span>
                                            </FormLabel>
                                            <FormControl>
                                                <Input placeholder="https://m.me/acme" className={inputCls} {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="socials.wechat"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className={textLabelCls}>
                                                <span className="flex items-center gap-1.5"><WechatIcon className="w-3.5 h-3.5 text-emerald-500" /> WeChat ID</span>
                                            </FormLabel>
                                            <FormControl>
                                                <Input placeholder="WeChat Username" className={inputCls} {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <FormField
                                    control={form.control}
                                    name="socials.line"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className={textLabelCls}>
                                                <span className="flex items-center gap-1.5"><LineIcon className="w-3.5 h-3.5 text-green-500" /> Line ID</span>
                                            </FormLabel>
                                            <FormControl>
                                                <Input placeholder="Line ID" className={inputCls} {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="socials.threads"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className={textLabelCls}>
                                                <span className="flex items-center gap-1.5"><ThreadsIcon className="w-3.5 h-3.5 text-white" /> Threads</span>
                                            </FormLabel>
                                            <FormControl>
                                                <Input placeholder="https://threads.net/@acme" className={inputCls} {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <FormField
                                    control={form.control}
                                    name="socials.reddit"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className={textLabelCls}>
                                                <span className="flex items-center gap-1.5"><RedditIcon className="w-3.5 h-3.5 text-orange-500" /> Reddit</span>
                                            </FormLabel>
                                            <FormControl>
                                                <Input placeholder="https://reddit.com/user/acme" className={inputCls} {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="socials.pinterest"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className={textLabelCls}>
                                                <span className="flex items-center gap-1.5"><PinterestIcon className="w-3.5 h-3.5 text-red-600" /> Pinterest</span>
                                            </FormLabel>
                                            <FormControl>
                                                <Input placeholder="https://pinterest.com/acme" className={inputCls} {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <FormField
                                    control={form.control}
                                    name="socials.snapchat"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className={textLabelCls}>
                                                <span className="flex items-center gap-1.5"><SnapchatIcon className="w-3.5 h-3.5 text-yellow-400" /> Snapchat</span>
                                            </FormLabel>
                                            <FormControl>
                                                <Input placeholder="https://snapchat.com/add/acme" className={inputCls} {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="socials.twitch"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className={textLabelCls}>
                                                <span className="flex items-center gap-1.5"><TwitchIcon className="w-3.5 h-3.5 text-purple-500" /> Twitch</span>
                                            </FormLabel>
                                            <FormControl>
                                                <Input placeholder="https://twitch.tv/acme" className={inputCls} {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <FormField
                                    control={form.control}
                                    name="socials.quora"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className={textLabelCls}>
                                                <span className="flex items-center gap-1.5"><QuoraIcon className="w-3.5 h-3.5 text-red-700" /> Quora</span>
                                            </FormLabel>
                                            <FormControl>
                                                <Input placeholder="https://quora.com/profile/acme" className={inputCls} {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <div className="hidden md:block"></div>
                            </div>

                            <div className="text-xs font-bold text-indigo-400 uppercase tracking-wider mt-4 mb-2">Regional & International</div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <FormField
                                    control={form.control}
                                    name="socials.vk"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className={textLabelCls}>
                                                <span className="flex items-center gap-1.5"><VkIcon className="w-3.5 h-3.5 text-blue-400" /> VK (Vkontakte)</span>
                                            </FormLabel>
                                            <FormControl>
                                                <Input placeholder="https://vk.com/acme" className={inputCls} {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="socials.weibo"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className={textLabelCls}>
                                                <span className="flex items-center gap-1.5"><WeiboIcon className="w-3.5 h-3.5 text-rose-500" /> Weibo</span>
                                            </FormLabel>
                                            <FormControl>
                                                <Input placeholder="https://weibo.com/acme" className={inputCls} {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <FormField
                                    control={form.control}
                                    name="socials.douyin"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className={textLabelCls}>
                                                <span className="flex items-center gap-1.5"><DouyinIcon className="w-3.5 h-3.5 text-rose-400" /> Douyin</span>
                                            </FormLabel>
                                            <FormControl>
                                                <Input placeholder="Douyin Account Link" className={inputCls} {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="socials.kuaishou"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className={textLabelCls}>
                                                <span className="flex items-center gap-1.5"><KuaishouIcon className="w-3.5 h-3.5 text-orange-400" /> Kuaishou</span>
                                            </FormLabel>
                                            <FormControl>
                                                <Input placeholder="Kuaishou Account Link" className={inputCls} {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                        </div>
                    </TabsContent>

                    {/* ADDRESS TAB */}
                    <TabsContent value="address" className="space-y-4">
                        <div className="space-y-3">
                            <FormField
                                control={form.control}
                                name="address.street"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className={textLabelCls}>Street Address</FormLabel>
                                        <FormControl>
                                            <Input placeholder="123 Financial Way" className={inputCls} {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <div className="grid grid-cols-2 gap-4">
                                <FormField
                                    control={form.control}
                                    name="address.city"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className={textLabelCls}>City</FormLabel>
                                            <FormControl>
                                                <Input placeholder="San Francisco" className={inputCls} {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="address.state"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className={textLabelCls}>State / Province</FormLabel>
                                            <FormControl>
                                                <Input placeholder="CA" className={inputCls} {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <FormField
                                    control={form.control}
                                    name="address.zip"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className={textLabelCls}>ZIP / Postal Code</FormLabel>
                                            <FormControl>
                                                <Input placeholder="94107" className={inputCls} {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="address.country"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className={textLabelCls}>Country</FormLabel>
                                            <FormControl>
                                                <Input placeholder="United States" className={inputCls} {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                        </div>

                        <FormField
                            control={form.control}
                            name="notes"
                            render={({ field }) => (
                                <FormItem className="pt-2">
                                    <FormLabel className={textLabelCls}>Notes</FormLabel>
                                    <FormControl>
                                        <Textarea placeholder="Internal notes about this client..." className="bg-[#07090e] border-slate-800 text-white rounded-xl focus:border-indigo-500 min-h-24 text-sm" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </TabsContent>
                </Tabs>

                <div className="flex justify-end pt-4 border-t border-slate-800/80">
                    <Button 
                        type="submit" 
                        disabled={isSubmitting}
                        className="bg-indigo-650 hover:bg-indigo-600 text-white font-bold rounded-xl px-5 py-2"
                    >
                        {isSubmitting ? "Creating..." : "Create Client"}
                    </Button>
                </div>
            </form>
        </Form>
    );
}
