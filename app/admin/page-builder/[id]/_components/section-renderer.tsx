"use client";

interface SectionRendererProps {
    section: any;
    template: any;
    isSelected?: boolean;
    onClick?: () => void;
}

// Helper to safely parse JSON or return the value if already parsed
const safeJSONParse = (value: any) => {
    if (!value) return [];
    if (typeof value !== 'string') return value;
    try {
        return JSON.parse(value);
    } catch (e) {
        console.error('JSON parse error:', e);
        return [];
    }
};

export function SectionRenderer({ section, template, isSelected, onClick }: SectionRendererProps) {
    const { content, style, customHTML, customCSS } = section;

    const sectionStyle = {
        backgroundColor: style.backgroundColor,
        color: style.textColor,
        padding: style.padding || "4rem 1.5rem",
        margin: style.margin,
        fontSize: style.fontSize,
        fontWeight: style.fontWeight,
        textAlign: style.textAlign,
        borderRadius: style.borderRadius,
        maxWidth: style.maxWidth,
    };

    // If custom HTML is provided, render it
    if (customHTML) {
        return (
            <div
                onClick={onClick}
                style={sectionStyle}
                className={`relative transition-all cursor-pointer ${isSelected ? "ring-4 ring-primary ring-offset-4" : "hover:ring-2 hover:ring-slate-300"
                    }`}
            >
                <style>{customCSS}</style>
                <div dangerouslySetInnerHTML={{ __html: customHTML }} />
            </div>
        );
    }

    // Render based on component type
    const renderContent = () => {
        const type = template.componentType;

        // Hero Sections
        if (type === "HeroCentered") {
            return (
                <div className="text-center py-20 px-4">
                    <h1 className="text-5xl font-bold mb-4">{content.title || "Hero Title"}</h1>
                    <p className="text-xl mb-8 opacity-90">{content.subtitle || "Subtitle"}</p>
                    {content.buttonText && (
                        <button className="px-8 py-3 bg-white text-slate-900 rounded-lg font-semibold hover:bg-slate-100 transition-colors">
                            {content.buttonText}
                        </button>
                    )}
                </div>
            );
        }

        if (type === "HeroSplit") {
            return (
                <div className="grid md:grid-cols-2 gap-12 items-center py-16 px-4 max-w-7xl mx-auto">
                    <div>
                        <h1 className="text-4xl font-bold mb-4">{content.title || "Hero Title"}</h1>
                        <p className="text-lg mb-6 opacity-90">{content.subtitle || "Subtitle"}</p>
                        {content.buttonText && (
                            <button className="px-6 py-3 bg-white text-slate-900 rounded-lg font-semibold">
                                {content.buttonText}
                            </button>
                        )}
                    </div>
                    <div className="bg-slate-200 rounded-lg aspect-video flex items-center justify-center overflow-hidden">
                        {content.imageUrl ? (
                            <img src={content.imageUrl} alt={content.title || "Hero"} className="w-full h-full object-cover" />
                        ) : (
                            <span className="text-slate-400">Image</span>
                        )}
                    </div>
                </div>
            );
        }

        if (type === "HeroWithForm") {
            return (
                <div className="grid md:grid-cols-2 gap-12 items-center py-16 px-4 max-w-6xl mx-auto">
                    <div>
                        <h1 className="text-4xl font-bold mb-4">{content.title || "Start Your Free Trial"}</h1>
                        <p className="text-lg opacity-90">{content.subtitle || "No credit card required"}</p>
                    </div>
                    <div className="bg-white p-8 rounded-lg shadow-lg">
                        <h3 className="text-xl font-semibold mb-4">{content.formTitle || "Create Account"}</h3>
                        <div className="space-y-3">
                            <input type="text" placeholder="Name" className="w-full px-4 py-2 border rounded" />
                            <input type="email" placeholder="Email" className="w-full px-4 py-2 border rounded" />
                            <button className="w-full px-6 py-3 bg-slate-900 text-white rounded font-semibold">
                                {content.buttonText || "Get Started"}
                            </button>
                        </div>
                    </div>
                </div>
            );
        }

        if (type === "HeroSocialProof") {
            const logos = safeJSONParse(content.logos);
            return (
                <div className="text-center py-20 px-4">
                    <h1 className="text-4xl font-bold mb-4">{content.title || "Trusted by Companies"}</h1>
                    <p className="text-xl mb-12 opacity-90">{content.subtitle || "Join the leaders"}</p>
                    <div className="flex flex-wrap justify-center items-center gap-8 mb-8">
                        {logos.map((logo: string, i: number) => (
                            <div key={i} className="w-32 h-16 bg-slate-200 rounded flex items-center justify-center">
                                {logo.startsWith("http") ? (
                                    <img src={logo} alt={`Logo ${i + 1}`} className="max-w-full max-h-full object-contain" />
                                ) : (
                                    <span className="text-xs text-slate-400">Logo {i + 1}</span>
                                )}
                            </div>
                        ))}
                    </div>
                    {content.buttonText && (
                        <button className="px-8 py-3 bg-white text-slate-900 rounded-lg font-semibold">
                            {content.buttonText}
                        </button>
                    )}
                </div>
            );
        }

        // Features
        if (type === "FeaturesGrid") {
            const features = safeJSONParse(content.features);
            return (
                <div className="py-16 px-4">
                    <div className="text-center mb-12 max-w-3xl mx-auto">
                        <h2 className="text-3xl font-bold mb-4">{content.title || "Features"}</h2>
                        <p className="text-lg opacity-80">{content.subtitle || "Everything you need"}</p>
                    </div>
                    <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
                        {features.map((feature: any, i: number) => (
                            <div key={i} className="text-center p-6">
                                <div className="text-4xl mb-4">{feature.icon || "✨"}</div>
                                <h3 className="font-semibold text-lg mb-2">{feature.title}</h3>
                                <p className="text-sm opacity-75">{feature.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            );
        }

        // Content Sections
        if (type === "ContentTwoColumn") {
            return (
                <div className="grid md:grid-cols-2 gap-12 items-center py-16 px-4 max-w-6xl mx-auto">
                    <div>
                        <h2 className="text-3xl font-bold mb-4">{content.title || "Title"}</h2>
                        <p className="mb-6 opacity-90">{content.content || "Content goes here"}</p>
                        {content.buttonText && (
                            <button className="px-6 py-3 bg-slate-900 text-white rounded-lg font-semibold">
                                {content.buttonText}
                            </button>
                        )}
                    </div>
                    <div className="bg-slate-200 rounded-lg aspect-video flex items-center justify-center overflow-hidden">
                        {content.imageUrl ? (
                            <img src={content.imageUrl} alt={content.title || "Content"} className="w-full h-full object-cover" />
                        ) : (
                            <span className="text-slate-400">Image</span>
                        )}
                    </div>
                </div>
            );
        }

        if (type === "ImageTextSplit") {
            return (
                <div className="grid md:grid-cols-2 gap-12 items-center py-16 px-4 max-w-6xl mx-auto">
                    <div className="bg-slate-200 rounded-lg aspect-video flex items-center justify-center overflow-hidden">
                        {content.imageUrl ? (
                            <img src={content.imageUrl} alt={content.title || "Image"} className="w-full h-full object-cover" />
                        ) : (
                            <span className="text-slate-400">Image</span>
                        )}
                    </div>
                    <div>
                        <h2 className="text-3xl font-bold mb-4">{content.title || "Title"}</h2>
                        <p className="opacity-90">{content.content || "Content goes here"}</p>
                    </div>
                </div>
            );
        }

        if (type === "TextBlock") {
            return (
                <div className="max-w-4xl mx-auto py-12 px-4">
                    <div className="prose max-w-none">
                        <p>{content.text || "Text content goes here"}</p>
                    </div>
                </div>
            );
        }

        // CTA
        if (type === "CallToAction" || type === "CtaBar") {
            return (
                <div className="text-center py-20 px-4">
                    <h2 className="text-4xl font-bold mb-4">{content.title || "Ready to get started?"}</h2>
                    <p className="text-xl mb-8 opacity-90">{content.subtitle || "Join us today"}</p>
                    {content.buttonText && (
                        <button className="px-8 py-4 bg-white text-slate-900 rounded-lg font-semibold text-lg hover:bg-slate-100 transition-colors">
                            {content.buttonText}
                        </button>
                    )}
                </div>
            );
        }

        // Testimonials
        if (type === "TestimonialsSlider") {
            const testimonials = safeJSONParse(content.testimonials);
            return (
                <div className="py-16 px-4">
                    <h2 className="text-3xl font-bold text-center mb-12">{content.title || "Testimonials"}</h2>
                    <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
                        {testimonials.map((testimonial: any, i: number) => (
                            <div key={i} className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20">
                                <p className="mb-4 italic">&quot;{testimonial.quote}&quot;</p>
                                <div className="flex items-center gap-3">
                                    <div className="w-12 h-12 rounded-full bg-white/20 overflow-hidden">
                                        {testimonial.avatar ? (
                                            <img src={testimonial.avatar} alt={testimonial.author} className="w-full h-full object-cover" />
                                        ) : null}
                                    </div>
                                    <div>
                                        <p className="font-semibold">{testimonial.author}</p>
                                        <p className="text-sm opacity-75">{testimonial.role}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            );
        }

        // Pricing
        if (type === "PricingTable") {
            const plans = safeJSONParse(content.plans);
            return (
                <div className="py-16 px-4">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold mb-4">{content.title || "Pricing"}</h2>
                        <p className="text-lg opacity-80">{content.subtitle || "Choose your plan"}</p>
                    </div>
                    <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
                        {plans.map((plan: any, i: number) => (
                            <div key={i} className={`bg-white rounded-lg p-8 shadow-lg ${plan.popular ? "ring-2 ring-primary scale-105" : ""}`}>
                                {plan.popular && (
                                    <span className="bg-primary text-white text-xs px-3 py-1 rounded-full">Popular</span>
                                )}
                                <h3 className="text-2xl font-bold mt-4 mb-2">{plan.name}</h3>
                                <div className="mb-6">
                                    <span className="text-4xl font-bold">{plan.price}</span>
                                    <span className="text-slate-600">{plan.period}</span>
                                </div>
                                <ul className="space-y-3 mb-8">
                                    {plan.features?.map((feature: string, j: number) => (
                                        <li key={j} className="flex items-center gap-2">
                                            <span className="text-green-500">✓</span>
                                            <span>{feature}</span>
                                        </li>
                                    ))}
                                </ul>
                                <button className="w-full px-6 py-3 bg-slate-900 text-white rounded-lg font-semibold">
                                    {plan.buttonText || "Get Started"}
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            );
        }

        // FAQ
        if (type === "FaqAccordion") {
            const faqs = safeJSONParse(content.faqs);
            return (
                <div className="py-16 px-4">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold mb-4">{content.title || "FAQ"}</h2>
                        <p className="text-lg opacity-80">{content.subtitle || "Common questions"}</p>
                    </div>
                    <div className="max-w-3xl mx-auto space-y-4">
                        {faqs.map((faq: any, i: number) => (
                            <div key={i} className="bg-white rounded-lg p-6 shadow">
                                <h3 className="font-semibold mb-2">{faq.question}</h3>
                                <p className="text-slate-600">{faq.answer}</p>
                            </div>
                        ))}
                    </div>
                </div>
            );
        }

        // Contact Form
        if (type === "ContactForm") {
            return (
                <div className="py-16 px-4">
                    <div className="max-w-2xl mx-auto">
                        <div className="text-center mb-8">
                            <h2 className="text-3xl font-bold mb-4">{content.title || "Contact Us"}</h2>
                            <p className="text-lg opacity-80">{content.subtitle || "Get in touch"}</p>
                        </div>
                        <div className="space-y-4">
                            <input type="text" placeholder="Name" className="w-full px-4 py-3 rounded-lg border" />
                            <input type="email" placeholder="Email" className="w-full px-4 py-3 rounded-lg border" />
                            <textarea placeholder="Message" rows={4} className="w-full px-4 py-3 rounded-lg border"></textarea>
                            <button className="w-full px-6 py-3 bg-slate-900 text-white rounded-lg font-semibold">
                                {content.buttonText || "Send Message"}
                            </button>
                        </div>
                    </div>
                </div>
            );
        }

        // Image Gallery
        if (type === "ImageGallery") {
            const images = safeJSONParse(content.images);
            return (
                <div className="py-16 px-4">
                    <h2 className="text-3xl font-bold text-center mb-12">{content.title || "Gallery"}</h2>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 max-w-6xl mx-auto">
                        {images.map((img: string, i: number) => (
                            <div key={i} className="aspect-square bg-slate-200 rounded-lg overflow-hidden">
                                {img ? (
                                    <img src={img} alt={`Gallery ${i + 1}`} className="w-full h-full object-cover" />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-slate-400">Image {i + 1}</div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            );
        }

        // Default fallback - show all content
        return (
            <div className="py-16 px-4">
                <div className="max-w-4xl mx-auto">
                    {/* Logo - render prominently if present */}
                    {content.logo && (
                        <div className="mb-8">
                            <img
                                src={content.logo}
                                alt="Logo"
                                className="w-full h-auto"
                            />
                        </div>
                    )}


                    {content.imageUrl && (
                        <div className="mb-6 rounded-lg overflow-hidden">
                            <img src={content.imageUrl} alt={content.title || "Image"} className="w-full h-auto" />
                        </div>
                    )}
                    {content.title && <h2 className="text-3xl font-bold mb-4">{content.title}</h2>}
                    {content.subtitle && <p className="text-lg opacity-80 mb-6">{content.subtitle}</p>}
                    {content.content && <p className="mb-6">{content.content}</p>}
                    {content.text && <p>{content.text}</p>}
                    {content.buttonText && (
                        <button className="px-6 py-3 bg-primary text-white rounded-lg font-semibold mt-4">
                            {content.buttonText}
                        </button>
                    )}
                </div>
            </div>
        );
    };

    return (
        <div
            onClick={onClick}
            style={sectionStyle}
            className={`relative transition-all cursor-pointer ${isSelected ? "ring-4 ring-primary ring-offset-4" : "hover:ring-2 hover:ring-slate-300"
                }`}
        >
            {renderContent()}
        </div>
    );
}
