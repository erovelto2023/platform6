"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Palette } from "lucide-react";
import { getDefaultTheme } from "@/lib/actions/page-theme.actions";
import { toast } from "sonner";

interface ThemeEditorProps {
    onApplyTheme: (theme: any) => void;
}

export function ThemeEditor({ onApplyTheme }: ThemeEditorProps) {
    const [open, setOpen] = useState(false);
    const [theme, setTheme] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (open) {
            loadTheme();
        }
    }, [open]);

    const loadTheme = async () => {
        setLoading(true);
        const defaultTheme = await getDefaultTheme();
        if (defaultTheme) {
            setTheme(defaultTheme);
        }
        setLoading(false);
    };

    const handleApply = () => {
        if (theme) {
            onApplyTheme(theme);
            toast.success("Theme applied to selected section");
            setOpen(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="outline" size="sm">
                    <Palette className="w-4 h-4 mr-2" />
                    Apply Theme
                </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Global Theme</DialogTitle>
                    <DialogDescription>
                        Apply global theme colors and typography to the selected section
                    </DialogDescription>
                </DialogHeader>

                {loading ? (
                    <div className="py-8 text-center text-muted-foreground">Loading theme...</div>
                ) : theme ? (
                    <div className="space-y-6">
                        {/* Colors */}
                        <Card className="p-4">
                            <h3 className="font-semibold mb-4">Colors</h3>
                            <div className="grid grid-cols-2 gap-4">
                                {Object.entries(theme.colors).map(([key, value]) => (
                                    <div key={key} className="flex items-center gap-3">
                                        <div
                                            className="w-10 h-10 rounded border"
                                            style={{ backgroundColor: value as string }}
                                        />
                                        <div className="flex-1">
                                            <Label className="text-xs capitalize">{key}</Label>
                                            <p className="text-xs text-muted-foreground">{value as string}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </Card>

                        {/* Typography */}
                        <Card className="p-4">
                            <h3 className="font-semibold mb-4">Typography</h3>
                            <div className="space-y-3">
                                <div>
                                    <Label className="text-xs">Font Family</Label>
                                    <p className="text-sm">{theme.typography.fontFamily}</p>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    {Object.entries(theme.typography.fontSize).map(([key, value]) => (
                                        <div key={key}>
                                            <Label className="text-xs capitalize">{key}</Label>
                                            <p className="text-sm">{value as string}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </Card>

                        {/* Spacing */}
                        <Card className="p-4">
                            <h3 className="font-semibold mb-4">Spacing</h3>
                            <div className="space-y-3">
                                <div>
                                    <Label className="text-xs">Section Padding</Label>
                                    <p className="text-sm">{theme.spacing.sectionPadding}</p>
                                </div>
                                <div>
                                    <Label className="text-xs">Container Max Width</Label>
                                    <p className="text-sm">{theme.spacing.containerMaxWidth}</p>
                                </div>
                            </div>
                        </Card>

                        <Button onClick={handleApply} className="w-full">
                            Apply Theme to Section
                        </Button>
                    </div>
                ) : (
                    <div className="py-8 text-center text-muted-foreground">
                        No theme found. Create a default theme first.
                    </div>
                )}
            </DialogContent>
        </Dialog>
    );
}
