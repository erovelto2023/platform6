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
        <Card className="overflow-hidden border-indigo-100 shadow-sm hover:shadow-md transition-shadow">
            <CardHeader className="bg-slate-50 border-b pb-4">
                <div className="flex items-center justify-between">
                    <CardTitle className="text-lg flex items-center gap-2">
                        <CreditCard className="h-5 w-5 text-indigo-600" />
                        Payout Account
                    </CardTitle>
                    {isSaved && (
                        <div className="flex items-center gap-1.5 text-xs font-bold text-green-600 bg-green-50 px-2 py-1 rounded-full border border-green-100">
                            <CheckCircle2 className="h-3 w-3" />
                            Verified
                        </div>
                    )}
                </div>
            </CardHeader>
            <CardContent className="pt-6 space-y-4">
                <div className="space-y-1.5">
                    <Label className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                        Payout Method
                    </Label>
                    <div className="flex gap-2">
                        <Button 
                            variant={method === 'paypal' ? 'default' : 'outline'} 
                            onClick={() => setMethod('paypal')}
                            className="flex-1 text-xs h-9"
                            size="sm"
                        >
                            PayPal
                        </Button>
                        <Button 
                            variant="outline" 
                            disabled 
                            className="flex-1 text-xs h-9 opacity-50 cursor-not-allowed"
                            size="sm"
                        >
                            Stripe (Coming Soon)
                        </Button>
                    </div>
                </div>

                <div className="space-y-1.5">
                    <Label className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                        PayPal Email Address
                    </Label>
                    <Input 
                        placeholder="your-paypal@email.com" 
                        value={email}
                        onChange={(e) => {
                            setEmail(e.target.value);
                            setIsSaved(false);
                        }}
                        className="bg-slate-50 border-slate-200 focus:bg-white transition-colors"
                    />
                    <p className="text-[10px] text-slate-400 leading-tight">
                        Your monthly earnings will be sent to this account once you reach the $10.00 threshold.
                    </p>
                </div>

                <Button 
                    className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold h-10 mt-2"
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
