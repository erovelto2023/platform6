"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2, Sparkles, Copy, Check, ArrowLeft, Download } from "lucide-react";
import { generateContentFromTemplate } from "@/lib/actions/content.actions";
import { saveGeneratedContent } from "@/lib/actions/content-post.actions";
import { toast } from "sonner";

interface TemplateWizardProps {
    template: any;
    onClose: () => void;
    initialValues?: Record<string, any>;
}

export default function TemplateWizard({ template, onClose, initialValues }: TemplateWizardProps) {
    const [step, setStep] = useState<'briefing' | 'result'>('briefing');
    const [inputs, setInputs] = useState<Record<string, any>>(initialValues || {});
    const [isGenerating, setIsGenerating] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [generatedContent, setGeneratedContent] = useState("");

    const handleInputChange = (variableName: string, value: any) => {
        setInputs(prev => ({ ...prev, [variableName]: value }));
    };

    const handleGenerate = async () => {
        // Validate required fields
        const missing = template.inputs.filter((i: any) => i.required && !inputs[i.variableName]);
        if (missing.length > 0) {
            toast.error(`Please fill in: ${missing.map((i: any) => i.label).join(", ")}`);
            return;
        }

        setIsGenerating(true);
        try {
            const result = await generateContentFromTemplate(template, inputs);
            if (result.success) {
                setGeneratedContent(result.content || "");
                setStep('result');
            } else {
                toast.error(result.error || "Failed to generate content");
            }
        } catch (error) {
            toast.error("An unexpected error occurred");
        } finally {
            setIsGenerating(false);
        }
    };

    const handleCopy = () => {
        navigator.clipboard.writeText(generatedContent);
        toast.success("Copied to clipboard");
    };

    const handleSaveToPlanner = async () => {
        setIsSaving(true);
        try {
            // Extract a title from inputs if possible, or use the first line
            let title = inputs.topic || inputs.title || inputs.headline;
            if (!title) {
                title = generatedContent.split('\n')[0].substring(0, 50);
            }

            await saveGeneratedContent({
                content: generatedContent,
                title: title,
                templateCategory: template.category,
                templateName: template.name,
                inputs: inputs
            });
            toast.success("Saved to Content Planner!");
            onClose();
        } catch (error) {
            toast.error("Failed to save content");
        } finally {
            setIsSaving(false);
        }
    };

    const handleDownloadPDF = async () => {
        try {
            const { jsPDF } = await import("jspdf");
            const doc = new jsPDF();

            const title = inputs.topic || "Generated Content";
            const content = generatedContent;

            // Add Title
            doc.setFontSize(20);
            doc.text(title, 20, 20);

            // Add Content
            doc.setFontSize(12);
            const splitText = doc.splitTextToSize(content, 170);
            doc.text(splitText, 20, 40);

            doc.save(`${title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.pdf`);
            toast.success("Downloaded as PDF");
        } catch (error) {
            console.error(error);
            toast.error("Failed to generate PDF");
        }
    };

    return (
        <Dialog open={true} onOpenChange={onClose}>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto flex flex-col">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        {step === 'result' && (
                            <Button variant="ghost" size="icon" className="h-6 w-6 mr-2" onClick={() => setStep('briefing')}>
                                <ArrowLeft className="h-4 w-4" />
                            </Button>
                        )}
                        {template.name}
                    </DialogTitle>
                    <DialogDescription>
                        {step === 'briefing' ? "Fill in the details below to generate your content." : "Here is your AI-generated draft."}
                    </DialogDescription>
                </DialogHeader>

                <div className="flex-1 py-4">
                    {step === 'briefing' ? (
                        <div className="space-y-6">
                            {template.inputs.map((input: any, index: number) => (
                                <div key={index} className="space-y-2">
                                    <Label>
                                        {input.label}
                                        {input.required && <span className="text-red-500 ml-1">*</span>}
                                    </Label>

                                    {input.type === 'textarea' ? (
                                        <Textarea
                                            placeholder={input.placeholder}
                                            value={inputs[input.variableName] || ""}
                                            onChange={(e) => handleInputChange(input.variableName, e.target.value)}
                                            className="min-h-[100px]"
                                        />
                                    ) : input.type === 'select' ? (
                                        <Select
                                            value={inputs[input.variableName] || ""}
                                            onValueChange={(val) => handleInputChange(input.variableName, val)}
                                        >
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select an option" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {input.options?.map((opt: string) => (
                                                    <SelectItem key={opt} value={opt}>{opt}</SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    ) : (
                                        <Input
                                            type={input.type}
                                            placeholder={input.placeholder}
                                            value={inputs[input.variableName] || ""}
                                            onChange={(e) => handleInputChange(input.variableName, e.target.value)}
                                        />
                                    )}
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="h-full flex flex-col space-y-4">
                            <div className="bg-slate-50 p-6 rounded-lg border min-h-[400px] whitespace-pre-wrap font-serif text-lg leading-relaxed overflow-y-auto">
                                {generatedContent}
                            </div>
                        </div>
                    )}
                </div>

                <div className="flex justify-end gap-3 pt-4 border-t mt-auto">
                    <Button variant="outline" onClick={onClose}>Close</Button>

                    {step === 'briefing' ? (
                        <Button onClick={handleGenerate} disabled={isGenerating} className="bg-indigo-600 hover:bg-indigo-700">
                            {isGenerating ? (
                                <>
                                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                    Generating...
                                </>
                            ) : (
                                <>
                                    <Sparkles className="h-4 w-4 mr-2" />
                                    Generate Content
                                </>
                            )}
                        </Button>
                    ) : (
                        <div className="flex gap-2">
                            <Button variant="outline" onClick={handleDownloadPDF}>
                                <Download className="h-4 w-4 mr-2" />
                                Download PDF
                            </Button>
                            <Button variant="outline" onClick={handleCopy}>
                                <Copy className="h-4 w-4 mr-2" />
                                Copy
                            </Button>
                            <Button onClick={handleSaveToPlanner} disabled={isSaving}>
                                {isSaving ? (
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                ) : (
                                    <>
                                        <Check className="h-4 w-4 mr-2" />
                                        Save to Planner
                                    </>
                                )}
                            </Button>
                        </div>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    );
}
