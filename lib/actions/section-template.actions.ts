"use server";

import connectDB from "@/lib/db/connect";
import SectionTemplate from "@/lib/db/models/SectionTemplate";
import { revalidatePath } from "next/cache";

export async function getSectionTemplates(category?: string) {
    try {
        await connectDB();
        const query = category ? { category } : {};
        const templates = await SectionTemplate.find(query).sort({ createdAt: -1 }).lean();
        return JSON.parse(JSON.stringify(templates));
    } catch (error) {
        console.error("Error fetching section templates:", error);
        return [];
    }
}

export async function createSectionTemplate(data: any) {
    try {
        await connectDB();
        const template = await SectionTemplate.create(data);
        revalidatePath("/admin/content-templates");
        return { success: true, template: JSON.parse(JSON.stringify(template)) };
    } catch (error: any) {
        return { success: false, error: error.message };
    }
}

// Seed some initial templates if none exist
export async function seedInitialTemplates() {
    await connectDB();
    // await SectionTemplate.deleteMany({}); // Uncomment to reset
    const count = await SectionTemplate.countDocuments();
    // if (count > 0) return; // Temporarily disabled to force update

    const templates = [
        {
            name: "Modern Hero",
            category: "Hero",
            structure: `
                <section class="py-20 bg-white">
                    <div class="container mx-auto px-4 text-center">
                        <h1 class="text-5xl font-bold mb-6 text-slate-900" data-id="headline">Your Main Headline Here</h1>
                        <p class="text-xl text-slate-600 mb-8 max-w-2xl mx-auto" data-id="subheadline">Subheadline text goes here. Make it compelling and clear.</p>
                        <div class="flex justify-center gap-4">
                            <a href="#" class="bg-indigo-600 text-white px-8 py-3 rounded-full font-semibold hover:bg-indigo-700 transition" data-id="cta_primary">Get Started</a>
                            <a href="#" class="border border-slate-300 text-slate-700 px-8 py-3 rounded-full font-semibold hover:bg-slate-50 transition" data-id="cta_secondary">Learn More</a>
                        </div>
                    </div>
                </section>
            `,
            editableFields: [
                { key: "headline", label: "Headline", selector: "[data-id='headline']" },
                { key: "subheadline", label: "Subheadline", selector: "[data-id='subheadline']" },
                { key: "cta_primary", label: "Primary Button", selector: "[data-id='cta_primary']" },
                { key: "cta_secondary", label: "Secondary Button", selector: "[data-id='cta_secondary']" }
            ]
        },
        {
            name: "Introduction",
            category: "Content",
            structure: `
                <section class="py-12 bg-white">
                    <div class="container mx-auto px-4 max-w-3xl text-center">
                        <h2 class="text-3xl font-bold mb-6 text-slate-900" data-id="title">Introduction</h2>
                        <div class="text-xl text-slate-500 leading-relaxed" data-id="content">
                            <p>Write a compelling introduction here that hooks the reader and explains what this page is about.</p>
                        </div>
                    </div>
                </section>
            `,
            editableFields: [
                { key: "title", label: "Title", selector: "[data-id='title']" },
                { key: "content", label: "Content", selector: "[data-id='content']" }
            ]
        },
        {
            name: "Feature Grid (3-Col)",
            category: "Features",
            structure: `
                <section class="py-16 bg-slate-50">
                    <div class="container mx-auto px-4">
                        <div class="text-center mb-12">
                            <h2 class="text-3xl font-bold mb-4" data-id="title">Key Features</h2>
                            <p class="text-slate-600" data-id="subtitle">Everything you need to succeed</p>
                        </div>
                        <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
                            <!-- Feature 1 -->
                            <div class="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
                                <div class="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center mb-4 text-indigo-600">
                                    <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
                                </div>
                                <h3 class="text-xl font-semibold mb-2" data-id="f1_title">Feature One</h3>
                                <p class="text-slate-600" data-id="f1_desc">Description for feature one goes here.</p>
                            </div>
                            <!-- Feature 2 -->
                            <div class="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
                                <div class="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center mb-4 text-emerald-600">
                                    <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                                </div>
                                <h3 class="text-xl font-semibold mb-2" data-id="f2_title">Feature Two</h3>
                                <p class="text-slate-600" data-id="f2_desc">Description for feature two goes here.</p>
                            </div>
                            <!-- Feature 3 -->
                            <div class="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
                                <div class="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4 text-purple-600">
                                    <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path></svg>
                                </div>
                                <h3 class="text-xl font-semibold mb-2" data-id="f3_title">Feature Three</h3>
                                <p class="text-slate-600" data-id="f3_desc">Description for feature three goes here.</p>
                            </div>
                        </div>
                    </div>
                </section>
            `,
            editableFields: [
                { key: "title", label: "Section Title", selector: "[data-id='title']" },
                { key: "subtitle", label: "Section Subtitle", selector: "[data-id='subtitle']" },
                { key: "f1_title", label: "Feature 1 Title", selector: "[data-id='f1_title']" },
                { key: "f1_desc", label: "Feature 1 Desc", selector: "[data-id='f1_desc']" },
                { key: "f2_title", label: "Feature 2 Title", selector: "[data-id='f2_title']" },
                { key: "f2_desc", label: "Feature 2 Desc", selector: "[data-id='f2_desc']" },
                { key: "f3_title", label: "Feature 3 Title", selector: "[data-id='f3_title']" },
                { key: "f3_desc", label: "Feature 3 Desc", selector: "[data-id='f3_desc']" }
            ]
        },
        {
            name: "Pros & Cons",
            category: "Content",
            structure: `
                <section class="py-16 bg-white">
                    <div class="container mx-auto px-4">
                        <div class="bg-slate-900 rounded-[3rem] text-white p-8 md:p-16">
                            <div class="grid grid-cols-1 lg:grid-cols-2 gap-16">
                                <div>
                                    <h3 class="text-2xl font-bold mb-6 flex items-center gap-3">
                                        <span class="bg-green-500/20 text-green-400 p-2 rounded-lg">
                                            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg>
                                        </span>
                                        Why We Love It
                                    </h3>
                                    <ul class="space-y-4" data-id="pros_list">
                                        <li class="flex items-start gap-3"><span class="text-green-400 mt-1">✓</span> <span>Pro point one goes here</span></li>
                                        <li class="flex items-start gap-3"><span class="text-green-400 mt-1">✓</span> <span>Pro point two goes here</span></li>
                                        <li class="flex items-start gap-3"><span class="text-green-400 mt-1">✓</span> <span>Pro point three goes here</span></li>
                                    </ul>
                                </div>
                                <div>
                                    <h3 class="text-2xl font-bold mb-6 flex items-center gap-3">
                                        <span class="bg-red-500/20 text-red-400 p-2 rounded-lg">
                                            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                                        </span>
                                        Drawbacks
                                    </h3>
                                    <ul class="space-y-4" data-id="cons_list">
                                        <li class="flex items-start gap-3"><span class="text-red-400 mt-1">×</span> <span class="text-slate-400">Con point one goes here</span></li>
                                        <li class="flex items-start gap-3"><span class="text-red-400 mt-1">×</span> <span class="text-slate-400">Con point two goes here</span></li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            `,
            editableFields: [
                { key: "pros_list", label: "Pros List", selector: "[data-id='pros_list']" },
                { key: "cons_list", label: "Cons List", selector: "[data-id='cons_list']" }
            ]
        },
        {
            name: "Comparison Table",
            category: "Content",
            structure: `
                <section class="py-16 bg-white">
                    <div class="container mx-auto px-4">
                        <div class="overflow-x-auto">
                            <table class="w-full text-left border-collapse">
                                <thead>
                                    <tr class="border-b border-slate-200">
                                        <th class="py-4 px-6 font-semibold text-slate-900 w-1/3">Feature</th>
                                        <th class="py-4 px-6 font-semibold text-indigo-600 w-1/3 bg-indigo-50 rounded-t-xl" data-id="product_name">Our Pick</th>
                                        <th class="py-4 px-6 font-semibold text-slate-500 w-1/3" data-id="competitor_name">Competitor</th>
                                    </tr>
                                </thead>
                                <tbody class="text-slate-600">
                                    <tr class="border-b border-slate-100">
                                        <td class="py-4 px-6 font-medium">Price</td>
                                        <td class="py-4 px-6 bg-indigo-50/30 font-bold text-slate-900" data-id="price_1">$99/mo</td>
                                        <td class="py-4 px-6" data-id="price_2">$129/mo</td>
                                    </tr>
                                    <tr class="border-b border-slate-100">
                                        <td class="py-4 px-6 font-medium">Ease of Use</td>
                                        <td class="py-4 px-6 bg-indigo-50/30 text-green-600 font-medium">Very Easy</td>
                                        <td class="py-4 px-6">Moderate</td>
                                    </tr>
                                    <tr class="border-b border-slate-100">
                                        <td class="py-4 px-6 font-medium">Support</td>
                                        <td class="py-4 px-6 bg-indigo-50/30 text-green-600">24/7 Live Chat</td>
                                        <td class="py-4 px-6">Email Only</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </section>
            `,
            editableFields: [
                { key: "product_name", label: "Product Name", selector: "[data-id='product_name']" },
                { key: "competitor_name", label: "Competitor Name", selector: "[data-id='competitor_name']" },
                { key: "price_1", label: "Price 1", selector: "[data-id='price_1']" },
                { key: "price_2", label: "Price 2", selector: "[data-id='price_2']" }
            ]
        },
        {
            name: "Pricing Table",
            category: "Pricing",
            structure: `
                <section class="py-16 bg-slate-50">
                    <div class="container mx-auto px-4">
                        <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
                            <!-- Basic Plan -->
                            <div class="bg-white rounded-3xl p-8 border border-slate-100">
                                <h3 class="text-xl font-bold mb-2" data-id="plan1_name">Basic</h3>
                                <div class="text-4xl font-bold mb-6" data-id="plan1_price">$29<span class="text-lg text-slate-500 font-normal">/mo</span></div>
                                <ul class="space-y-3 mb-8 text-slate-600">
                                    <li class="flex items-center gap-2"><svg class="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg> Feature One</li>
                                    <li class="flex items-center gap-2"><svg class="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg> Feature Two</li>
                                </ul>
                                <a href="#" class="block w-full py-3 px-6 bg-slate-100 text-slate-900 font-semibold rounded-xl text-center hover:bg-slate-200 transition">Get Basic</a>
                            </div>
                            <!-- Pro Plan -->
                            <div class="bg-white rounded-3xl p-8 border-2 border-indigo-600 shadow-xl relative transform md:-translate-y-4 z-10">
                                <div class="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-indigo-600 text-white px-4 py-1 rounded-full text-sm font-semibold">Most Popular</div>
                                <h3 class="text-xl font-bold mb-2" data-id="plan2_name">Pro</h3>
                                <div class="text-4xl font-bold mb-6" data-id="plan2_price">$79<span class="text-lg text-slate-500 font-normal">/mo</span></div>
                                <ul class="space-y-3 mb-8 text-slate-600">
                                    <li class="flex items-center gap-2"><svg class="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg> Everything in Basic</li>
                                    <li class="flex items-center gap-2"><svg class="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg> Advanced Features</li>
                                    <li class="flex items-center gap-2"><svg class="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg> Priority Support</li>
                                </ul>
                                <a href="#" class="block w-full py-3 px-6 bg-indigo-600 text-white font-semibold rounded-xl text-center hover:bg-indigo-700 transition shadow-lg shadow-indigo-200">Get Pro</a>
                            </div>
                            <!-- Enterprise Plan -->
                            <div class="bg-white rounded-3xl p-8 border border-slate-100">
                                <h3 class="text-xl font-bold mb-2" data-id="plan3_name">Enterprise</h3>
                                <div class="text-4xl font-bold mb-6" data-id="plan3_price">$199<span class="text-lg text-slate-500 font-normal">/mo</span></div>
                                <ul class="space-y-3 mb-8 text-slate-600">
                                    <li class="flex items-center gap-2"><svg class="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg> Unlimited Access</li>
                                    <li class="flex items-center gap-2"><svg class="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg> Dedicated Manager</li>
                                </ul>
                                <a href="#" class="block w-full py-3 px-6 bg-slate-100 text-slate-900 font-semibold rounded-xl text-center hover:bg-slate-200 transition">Contact Sales</a>
                            </div>
                        </div>
                    </div>
                </section>
            `,
            editableFields: [
                { key: "plan1_name", label: "Plan 1 Name", selector: "[data-id='plan1_name']" },
                { key: "plan1_price", label: "Plan 1 Price", selector: "[data-id='plan1_price']" },
                { key: "plan2_name", label: "Plan 2 Name", selector: "[data-id='plan2_name']" },
                { key: "plan2_price", label: "Plan 2 Price", selector: "[data-id='plan2_price']" },
                { key: "plan3_name", label: "Plan 3 Name", selector: "[data-id='plan3_name']" },
                { key: "plan3_price", label: "Plan 3 Price", selector: "[data-id='plan3_price']" }
            ]
        },
        {
            name: "Coupon/Deal Box",
            category: "CTA",
            structure: `
                <section class="py-12 bg-white">
                    <div class="container mx-auto px-4 max-w-4xl">
                        <div class="bg-indigo-600 rounded-[3rem] p-12 text-center text-white shadow-2xl shadow-indigo-200">
                            <h2 class="text-4xl font-bold mb-6" data-id="headline">Exclusive Deal!</h2>
                            <p class="text-indigo-100 mb-8 text-lg" data-id="subheadline">Get 20% off your first year with our exclusive link.</p>
                            <div class="inline-flex flex-col items-center gap-4">
                                <div class="bg-white/10 backdrop-blur border border-white/20 rounded-xl px-6 py-3 font-mono text-xl tracking-wider mb-2">
                                    SAVE20
                                </div>
                                <a href="#" class="bg-white text-indigo-600 px-8 py-4 rounded-full font-bold text-lg hover:bg-indigo-50 transition shadow-lg" data-id="cta_button">Claim Discount Now</a>
                            </div>
                            <p class="mt-6 text-sm text-indigo-200 opacity-75">Offer expires soon. Terms apply.</p>
                        </div>
                    </div>
                </section>
            `,
            editableFields: [
                { key: "headline", label: "Headline", selector: "[data-id='headline']" },
                { key: "subheadline", label: "Subheadline", selector: "[data-id='subheadline']" },
                { key: "cta_button", label: "Button Text", selector: "[data-id='cta_button']" }
            ]
        },
        {
            name: "FAQ Section",
            category: "FAQ",
            structure: `
                <section class="py-16 bg-white">
                    <div class="container mx-auto px-4 max-w-3xl">
                        <h2 class="text-3xl font-bold mb-8 text-center" data-id="title">Frequently Asked Questions</h2>
                        <div class="space-y-4">
                            <details class="group bg-slate-50 rounded-2xl p-6 cursor-pointer open:bg-white open:shadow-lg open:ring-1 open:ring-slate-100 transition-all">
                                <summary class="flex items-center justify-between font-semibold text-slate-900 list-none">
                                    <span data-id="q1">Is this suitable for beginners?</span>
                                    <span class="transition group-open:rotate-180">
                                        <svg class="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path></svg>
                                    </span>
                                </summary>
                                <div class="mt-4 text-slate-600 leading-relaxed" data-id="a1">
                                    Yes, absolutely! It was designed with beginners in mind, featuring an intuitive interface and extensive documentation.
                                </div>
                            </details>
                            <details class="group bg-slate-50 rounded-2xl p-6 cursor-pointer open:bg-white open:shadow-lg open:ring-1 open:ring-slate-100 transition-all">
                                <summary class="flex items-center justify-between font-semibold text-slate-900 list-none">
                                    <span data-id="q2">Can I cancel anytime?</span>
                                    <span class="transition group-open:rotate-180">
                                        <svg class="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path></svg>
                                    </span>
                                </summary>
                                <div class="mt-4 text-slate-600 leading-relaxed" data-id="a2">
                                    Yes, you can cancel your subscription at any time from your account settings. No questions asked.
                                </div>
                            </details>
                        </div>
                    </div>
                </section>
            `,
            editableFields: [
                { key: "title", label: "Section Title", selector: "[data-id='title']" },
                { key: "q1", label: "Question 1", selector: "[data-id='q1']" },
                { key: "a1", label: "Answer 1", selector: "[data-id='a1']" },
                { key: "q2", label: "Question 2", selector: "[data-id='q2']" },
                { key: "a2", label: "Answer 2", selector: "[data-id='a2']" }
            ]
        },
        {
            name: "Conclusion/Verdict",
            category: "Content",
            structure: `
                <section class="py-16 bg-white border-t border-slate-100">
                    <div class="container mx-auto px-4 max-w-3xl text-center">
                        <h2 class="text-3xl font-bold mb-6" data-id="title">Final Verdict</h2>
                        <div class="text-lg text-slate-600 mb-8 leading-relaxed" data-id="summary">
                            <p>After extensive testing, we believe this is one of the best options on the market for most users. It balances power with ease of use perfectly.</p>
                        </div>
                        <div class="flex items-center justify-center gap-1 mb-8">
                            <svg class="w-8 h-8 text-yellow-400 fill-current" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/></svg>
                            <svg class="w-8 h-8 text-yellow-400 fill-current" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/></svg>
                            <svg class="w-8 h-8 text-yellow-400 fill-current" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/></svg>
                            <svg class="w-8 h-8 text-yellow-400 fill-current" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/></svg>
                            <svg class="w-8 h-8 text-yellow-400 fill-current" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/></svg>
                        </div>
                        <a href="#" class="inline-block bg-indigo-600 text-white px-8 py-4 rounded-full font-bold text-lg hover:bg-indigo-700 transition shadow-lg shadow-indigo-200" data-id="cta_button">Check Current Price</a>
                    </div>
                </section>
            `,
            editableFields: [
                { key: "title", label: "Title", selector: "[data-id='title']" },
                { key: "summary", label: "Summary", selector: "[data-id='summary']" },
                { key: "cta_button", label: "Button Text", selector: "[data-id='cta_button']" }
            ]
        },
        {
            name: "Video Embed",
            category: "Media",
            structure: `
                <section class="py-12 bg-white">
                    <div class="container mx-auto px-4 max-w-4xl">
                        <div class="relative w-full rounded-2xl overflow-hidden shadow-2xl border border-slate-200 aspect-video bg-slate-900">
                            <iframe 
                                class="absolute top-0 left-0 w-full h-full"
                                src="https://www.youtube.com/embed/dQw4w9WgXcQ" 
                                title="YouTube video player" 
                                frameborder="0" 
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                                allowfullscreen
                                data-id="video_iframe"
                            ></iframe>
                        </div>
                        <p class="text-center text-slate-500 mt-4 text-sm" data-id="caption">Watch our detailed video review</p>
                    </div>
                </section>
            `,
            editableFields: [
                { key: "video_iframe", label: "Video URL (src)", selector: "[data-id='video_iframe']" },
                { key: "caption", label: "Caption", selector: "[data-id='caption']" }
            ]
        },
        {
            name: "Call to Action",
            category: "CTA",
            structure: `
                <section class="py-20 bg-indigo-600">
                    <div class="container mx-auto px-4 text-center">
                        <h2 class="text-4xl font-bold text-white mb-6" data-id="headline">Ready to Get Started?</h2>
                        <p class="text-indigo-100 text-xl mb-10 max-w-2xl mx-auto" data-id="subheadline">Join thousands of satisfied users today and take your business to the next level.</p>
                        <div class="flex flex-col sm:flex-row justify-center gap-4">
                            <a href="#" class="bg-white text-indigo-600 px-8 py-4 rounded-full font-bold text-lg hover:bg-indigo-50 transition shadow-lg" data-id="primary_btn">Get Started Now</a>
                            <a href="#" class="bg-indigo-700 text-white border border-indigo-500 px-8 py-4 rounded-full font-bold text-lg hover:bg-indigo-800 transition" data-id="secondary_btn">Read Reviews</a>
                        </div>
                    </div>
                </section>
            `,
            editableFields: [
                { key: "headline", label: "Headline", selector: "[data-id='headline']" },
                { key: "subheadline", label: "Subheadline", selector: "[data-id='subheadline']" },
                { key: "primary_btn", label: "Primary Button", selector: "[data-id='primary_btn']" },
                { key: "secondary_btn", label: "Secondary Button", selector: "[data-id='secondary_btn']" }
            ]
        },
        {
            name: "Author Box",
            category: "Trust",
            structure: `
                <section class="py-12 bg-slate-50 border-t border-slate-100">
                    <div class="container mx-auto px-4 max-w-2xl text-center">
                        <div class="w-20 h-20 bg-slate-200 rounded-full mx-auto mb-6 overflow-hidden shadow-md">
                            <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix" alt="Author" class="w-full h-full object-cover" data-id="avatar" />
                        </div>
                        <blockquote class="text-xl italic text-slate-600 mb-6" data-id="quote">
                            "I've tested dozens of tools in this category, and this one stands out for its ease of use and powerful features."
                        </blockquote>
                        <div class="font-bold text-slate-900" data-id="name">Alex Johnson</div>
                        <div class="text-indigo-600 text-sm font-medium" data-id="title">Senior Editor</div>
                    </div>
                </section>
            `,
            editableFields: [
                { key: "avatar", label: "Avatar URL", selector: "[data-id='avatar']" },
                { key: "quote", label: "Quote", selector: "[data-id='quote']" },
                { key: "name", label: "Author Name", selector: "[data-id='name']" },
                { key: "title", label: "Author Title", selector: "[data-id='title']" }
            ]
        }
    ];

    for (const template of templates) {
        await SectionTemplate.findOneAndUpdate(
            { name: template.name },
            template,
            { upsert: true, new: true }
        );
    }
}
