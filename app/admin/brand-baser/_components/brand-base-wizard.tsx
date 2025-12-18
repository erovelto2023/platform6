"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { ArrowLeft, ArrowRight, Save, Check } from "lucide-react";
import { updateBrandBase } from "@/lib/actions/brand-baser.actions";
import { toast } from "sonner";

interface BrandBaseWizardProps {
    brandBase: any;
}

const QUESTION_GROUPS = [
    {
        title: "Your Story & Origin",
        description: "Tell us about your journey",
        questions: [
            {
                key: "storyBeforeCode",
                label: "1. Tell Your Story",
                description: "What was life like before you cracked the code? What were the pain points?",
                placeholder: "Describe your struggles, challenges, and what life was like before your breakthrough...",
                rows: 6,
            },
            {
                key: "incitingEvent",
                label: "2. The Inciting Event",
                description: "How did you stumble onto the secret that changed your life?",
                placeholder: "Describe the moment or experience that led to your breakthrough...",
                rows: 6,
            },
            {
                key: "lifeToday",
                label: "3. Life Today",
                description: "What is life like today? Talk about the changes to your quality of life.",
                placeholder: "Describe how your life has transformed since your breakthrough...",
                rows: 6,
            },
        ],
    },
    {
        title: "Business Motivation",
        description: "Why you started and what drives you",
        questions: [
            {
                key: "businessMotivation",
                label: "4. Business Motivation",
                description: "What motivated you to start your business?",
                placeholder: "Share what inspired you to turn your breakthrough into a business...",
                rows: 5,
            },
            {
                key: "primaryGoal",
                label: "5. Primary Goal",
                description: "What is the primary goal you have for your brand?",
                placeholder: "What do you want to achieve with your brand?",
                rows: 4,
            },
            {
                key: "industryPassion",
                label: "6. Industry Passion",
                description: "What drives your passion for your industry or niche?",
                placeholder: "What keeps you excited and motivated in this field?",
                rows: 4,
            },
            {
                key: "trustworthyQualities",
                label: "7. Trustworthy Qualities",
                description: "What qualities make you a trustworthy and reliable expert in your field?",
                placeholder: "List your credentials, experience, and what makes you credible...",
                rows: 5,
            },
        ],
    },
    {
        title: "Products & Services",
        description: "What you offer and how you price it",
        questions: [
            {
                key: "productsServices",
                label: "8. Products & Services",
                description: "What range of products, services, or merchandise do you offer?",
                placeholder: "List all your offerings, packages, or product lines...",
                rows: 6,
            },
            {
                key: "pricingStructure",
                label: "9. Pricing Structure",
                description: "What is your pricing structure for your products or services?",
                placeholder: "Describe your pricing tiers, packages, or payment options...",
                rows: 5,
            },
        ],
    },
    {
        title: "Target Market",
        description: "Who you serve and their challenges",
        questions: [
            {
                key: "targetMarket",
                label: "10. Target Market",
                description: "Who is your target market? (Simple answer)",
                placeholder: "e.g., 'accountants', 'fitness coaches', 'e-commerce entrepreneurs'",
                rows: 2,
            },
            {
                key: "targetAudienceDetails",
                label: "11. Target Audience Details",
                description: "Describe your target audience: demographics, psychographics, and pain points",
                placeholder: "Age range, gender, location, income, education, interests, tech proficiency, etc.",
                rows: 6,
            },
            {
                key: "customerChallenges",
                label: "12. Customer Challenges",
                description: "What challenges or pain points do your customers typically face?",
                placeholder: "List the specific problems and frustrations your customers experience...",
                rows: 5,
            },
            {
                key: "solutionOffered",
                label: "13. Your Solution",
                description: "How does your company solve these challenges or pain points?",
                placeholder: "Explain how your products/services address each challenge...",
                rows: 5,
            },
        ],
    },
    {
        title: "Objections & Benefits",
        description: "Addressing concerns and showcasing value",
        questions: [
            {
                key: "commonObjections",
                label: "14. Common Objections",
                description: "What are the most common objections or concerns potential customers raise?",
                placeholder: "List the typical hesitations, doubts, or questions prospects have...",
                rows: 5,
            },
            {
                key: "objectionHandling",
                label: "15. Objection Handling",
                description: "How do you address these objections or concerns in your marketing materials?",
                placeholder: "Explain how you overcome each objection...",
                rows: 5,
            },
            {
                key: "customerOutcomes",
                label: "16. Customer Outcomes",
                description: "What outcomes or benefits can customers anticipate when using your products or services?",
                placeholder: "Describe the transformation, results, and benefits customers will experience...",
                rows: 6,
            },
            {
                key: "fabbFeatures",
                label: "17. FABB Framework",
                description: "List your product's features using FABB: Feature, Advantage, Benefit, Benefit of the Benefit",
                placeholder: "Feature → Advantage → Benefit → Ultimate Benefit\nExample: Video tutorials → Learn visually → Master skills faster → Achieve goals sooner",
                rows: 6,
            },
        ],
    },
    {
        title: "Competition & USP",
        description: "What makes you unique",
        questions: [
            {
                key: "topCompetitors",
                label: "18. Top Competitors",
                description: "Can you identify your top three competitors in the market?",
                placeholder: "List your main competitors and what they offer...",
                rows: 4,
            },
            {
                key: "uniqueSellingProp",
                label: "19. Unique Selling Proposition",
                description: "What is your USP? What sets your business apart from competitors?",
                placeholder: "Explain what makes you different, better, or unique...",
                rows: 6,
            },
            {
                key: "affiliateProgram",
                label: "20. Affiliate Program",
                description: "Does your company offer an affiliate program for promoters and partners?",
                placeholder: "Describe your affiliate program details, commission structure, or write 'No' if not applicable...",
                rows: 4,
            },
        ],
    },
];

export const BrandBaseWizard = ({ brandBase }: BrandBaseWizardProps) => {
    const router = useRouter();
    const [currentStep, setCurrentStep] = useState(0);
    const [formData, setFormData] = useState(brandBase.questions || {});
    const [isSaving, setIsSaving] = useState(false);

    const totalQuestions = QUESTION_GROUPS.reduce((acc, group) => acc + group.questions.length, 0);
    const answeredQuestions = Object.values(formData).filter((val) => val && String(val).trim()).length;
    const progress = (answeredQuestions / totalQuestions) * 100;

    const currentGroup = QUESTION_GROUPS[currentStep];
    const isLastStep = currentStep === QUESTION_GROUPS.length - 1;

    const handleInputChange = (key: string, value: string) => {
        setFormData((prev: any) => ({
            ...prev,
            [key]: value,
        }));
    };

    const handleSave = async (showToast = true) => {
        setIsSaving(true);
        try {
            const result = await updateBrandBase(brandBase._id, {
                questions: formData,
                isComplete: answeredQuestions === totalQuestions,
            });

            if (result.success) {
                if (showToast) {
                    toast.success("Progress saved!");
                }
                router.refresh();
            } else {
                toast.error(result.error || "Failed to save");
            }
        } catch (error) {
            toast.error("Failed to save");
        } finally {
            setIsSaving(false);
        }
    };

    const handleNext = async () => {
        await handleSave(false);
        if (currentStep < QUESTION_GROUPS.length - 1) {
            setCurrentStep(currentStep + 1);
            window.scrollTo({ top: 0, behavior: "smooth" });
        }
    };

    const handlePrevious = () => {
        if (currentStep > 0) {
            setCurrentStep(currentStep - 1);
            window.scrollTo({ top: 0, behavior: "smooth" });
        }
    };

    const handleComplete = async () => {
        await handleSave(false);
        toast.success("Brand base completed!");
        router.push(`/admin/brand-baser/${brandBase._id}`);
    };

    // Auto-save every 30 seconds
    useEffect(() => {
        const interval = setInterval(() => {
            if (Object.keys(formData).length > 0) {
                handleSave(false);
            }
        }, 30000);

        return () => clearInterval(interval);
    }, [formData]);

    return (
        <div className="max-w-4xl mx-auto">
            {/* Progress Header */}
            <div className="mb-8 sticky top-0 bg-white z-10 pb-4 border-b">
                <div className="flex items-center justify-between mb-4">
                    <div>
                        <h2 className="text-2xl font-bold">{brandBase.name}</h2>
                        <p className="text-sm text-slate-600">
                            Step {currentStep + 1} of {QUESTION_GROUPS.length}
                        </p>
                    </div>
                    <Button variant="outline" onClick={() => handleSave(true)} disabled={isSaving}>
                        <Save className="h-4 w-4 mr-2" />
                        {isSaving ? "Saving..." : "Save Progress"}
                    </Button>
                </div>
                <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                        <span className="font-medium">{answeredQuestions} of {totalQuestions} questions answered</span>
                        <span className="text-slate-600">{Math.round(progress)}% complete</span>
                    </div>
                    <Progress value={progress} className="h-2" />
                </div>
            </div>

            {/* Current Group */}
            <Card className="mb-6">
                <CardHeader>
                    <CardTitle className="text-2xl">{currentGroup.title}</CardTitle>
                    <CardDescription className="text-base">{currentGroup.description}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-8">
                    {currentGroup.questions.map((question) => (
                        <div key={question.key} className="space-y-3">
                            <div>
                                <label className="text-lg font-semibold block mb-1">
                                    {question.label}
                                </label>
                                <p className="text-sm text-slate-600">{question.description}</p>
                            </div>
                            <Textarea
                                value={formData[question.key] || ""}
                                onChange={(e) => handleInputChange(question.key, e.target.value)}
                                placeholder={question.placeholder}
                                rows={question.rows}
                                className="resize-none"
                            />
                        </div>
                    ))}
                </CardContent>
            </Card>

            {/* Navigation */}
            <div className="flex items-center justify-between pb-8">
                <Button
                    variant="outline"
                    onClick={handlePrevious}
                    disabled={currentStep === 0}
                >
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Previous
                </Button>

                <div className="flex gap-2">
                    {QUESTION_GROUPS.map((_, index) => (
                        <button
                            key={index}
                            onClick={() => setCurrentStep(index)}
                            className={`w-2 h-2 rounded-full transition ${index === currentStep
                                ? "bg-indigo-600 w-8"
                                : index < currentStep
                                    ? "bg-emerald-500"
                                    : "bg-slate-300"
                                }`}
                            title={`Step ${index + 1}`}
                        />
                    ))}
                </div>

                {isLastStep ? (
                    <Button onClick={handleComplete} className="bg-emerald-600 hover:bg-emerald-700">
                        <Check className="h-4 w-4 mr-2" />
                        Complete
                    </Button>
                ) : (
                    <Button onClick={handleNext}>
                        Next
                        <ArrowRight className="h-4 w-4 ml-2" />
                    </Button>
                )}
            </div>
        </div>
    );
};
