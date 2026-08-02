"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { CreditCard, Save, CheckCircle2 } from "lucide-react";
import { updatePartnerPayoutSettings } from "@/lib/actions/partner.actions";

interface PayoutSettingsProps {
    initialEmail?: string;
    initialMethod?: string;
}

export const PayoutSettings = ({ 
    initialEmail = "", 
    initialMethod = "paypal" 
}: PayoutSettingsProps) => {
    const [email, setEmail] = useState(initialEmail);
    const [method, setMethod] = useState(initialMethod);
    const [loading, setLoading] = useState(false);
    const [isSaved, setIsSaved] = useState(!!initialEmail);

    const onSave = async () => {
        if (!email || !email.includes('@')) {
            toast.error("Please enter a valid PayPal email address");
            return;
        }

        setLoading(true);
        try {
            const result = await updatePartnerPayoutSettings({ email, method });
            if (result.success) {
                toast.success("Payout settings saved successfully");
                setIsSaved(true);
            } else {
                toast.error(result.error || "Failed to save settings");
            }
        } catch (error) {
            toast.error("An error occurred");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Card className="overflow-hidden bg-slate-900 border border-slate-800 shadow-xl text-slate-100">
            <CardHeader className="bg-slate-900 border-b border-slate-800 pb-4">
                <div className="flex items-center justify-between">
                    <CardTitle className="text-sm font-mono font-bold text-slate-100 uppercase tracking-wider flex items-center gap-2">
                        <CreditCard className="h-4 w-4 text-orange-400" />
                        Payout Account
                    </CardTitle>
                    {isSaved && (
                        <div className="flex items-center gap-1.5 text-xs font-mono font-bold text-emerald-400 bg-emerald-950 px-2.5 py-1 rounded-full border border-emerald-800">
                            <CheckCircle2 className="h-3 w-3" />
                            Verified
                        </div>
                    )}
                </div>
            </CardHeader>
            <CardContent className="pt-6 space-y-4">
                <div className="space-y-1.5">
                    <Label className="text-xs font-mono font-bold text-slate-300 uppercase tracking-wider">
                        PAYOUT METHOD
                    </Label>
                    <div className="flex gap-2">
                        <Button 
                            variant={method === 'paypal' ? 'default' : 'outline'} 
                            onClick={() => setMethod('paypal')}
                            className="flex-1 text-xs font-mono font-bold h-9 bg-orange-500 hover:bg-orange-600 text-slate-950 border-none cursor-pointer"
                            size="sm"
                        >
                            PayPal
                        </Button>
                        <Button 
                            variant="outline" 
                            disabled 
                            className="flex-1 text-xs font-mono h-9 bg-slate-950 border-slate-800 text-slate-500 opacity-60 cursor-not-allowed"
                            size="sm"
                        >
                            Stripe (Coming Soon)
                        </Button>
                    </div>
                </div>

                <div className="space-y-1.5">
                    <Label className="text-xs font-mono font-bold text-slate-300 uppercase tracking-wider">
                        PAYPAL EMAIL ADDRESS
                    </Label>
                    <Input 
                        placeholder="your-paypal@email.com" 
                        value={email}
                        onChange={(e) => {
                            setEmail(e.target.value);
                            setIsSaved(false);
                        }}
                        className="bg-slate-950 border-slate-800 text-slate-100 font-mono text-xs focus:border-orange-500 h-10"
                    />
                    <p className="text-[11px] font-mono text-slate-400 leading-relaxed">
                        Your monthly earnings will be sent to this account once you reach the $10.00 threshold.
                    </p>
                </div>

                <Button 
                    className="w-full bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-400 hover:to-amber-500 text-slate-950 font-black font-mono text-xs uppercase tracking-wider h-10 mt-2 cursor-pointer shadow-md"
                    onClick={onSave}
                    disabled={loading || (isSaved && email === initialEmail)}
                >
                    {loading ? (
                        "Saving..."
                    ) : (
                        <>
                            <Save className="h-4 w-4 mr-2" />
                            Save Payout Settings
                        </>
                    )}
                </Button>
            </CardContent>
        </Card>
    );
};
