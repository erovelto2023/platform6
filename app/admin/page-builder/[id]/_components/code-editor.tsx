"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Code, Eye } from "lucide-react";
import { toast } from "sonner";

interface CodeEditorProps {
    html?: string;
    css?: string;
    onSave: (html: string, css: string) => void;
}

export function CodeEditor({ html = "", css = "", onSave }: CodeEditorProps) {
    const [open, setOpen] = useState(false);
    const [htmlCode, setHtmlCode] = useState(html);
    const [cssCode, setCssCode] = useState(css);
    const [preview, setPreview] = useState(false);

    const handleSave = () => {
        onSave(htmlCode, cssCode);
        toast.success("Code saved successfully");
        setOpen(false);
    };

    const getPreviewHTML = () => {
        return `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            ${cssCode}
          </style>
        </head>
        <body>
          ${htmlCode}
        </body>
      </html>
    `;
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="outline" size="sm">
                    <Code className="w-4 h-4 mr-2" />
                    Edit Code
                </Button>
            </DialogTrigger>
            <DialogContent className="max-w-6xl max-h-[90vh]">
                <DialogHeader>
                    <DialogTitle>HTML & CSS Editor</DialogTitle>
                    <DialogDescription>
                        Edit the raw HTML and CSS for this section
                    </DialogDescription>
                </DialogHeader>

                <div className="flex items-center gap-2 mb-4">
                    <Button
                        variant={!preview ? "default" : "outline"}
                        size="sm"
                        onClick={() => setPreview(false)}
                    >
                        <Code className="w-4 h-4 mr-2" />
                        Code
                    </Button>
                    <Button
                        variant={preview ? "default" : "outline"}
                        size="sm"
                        onClick={() => setPreview(true)}
                    >
                        <Eye className="w-4 h-4 mr-2" />
                        Preview
                    </Button>
                </div>

                {!preview ? (
                    <Tabs defaultValue="html" className="w-full">
                        <TabsList>
                            <TabsTrigger value="html">HTML</TabsTrigger>
                            <TabsTrigger value="css">CSS</TabsTrigger>
                        </TabsList>

                        <TabsContent value="html" className="space-y-2">
                            <Label>HTML Code</Label>
                            <Textarea
                                value={htmlCode}
                                onChange={(e) => setHtmlCode(e.target.value)}
                                className="font-mono text-sm h-[500px]"
                                placeholder="<div>Your HTML here...</div>"
                            />
                        </TabsContent>

                        <TabsContent value="css" className="space-y-2">
                            <Label>CSS Code</Label>
                            <Textarea
                                value={cssCode}
                                onChange={(e) => setCssCode(e.target.value)}
                                className="font-mono text-sm h-[500px]"
                                placeholder=".your-class { color: blue; }"
                            />
                        </TabsContent>
                    </Tabs>
                ) : (
                    <div className="border rounded-lg overflow-hidden h-[500px]">
                        <iframe
                            srcDoc={getPreviewHTML()}
                            className="w-full h-full"
                            title="Preview"
                            sandbox="allow-same-origin"
                        />
                    </div>
                )}

                <div className="flex justify-end gap-2 mt-4">
                    <Button variant="outline" onClick={() => setOpen(false)}>
                        Cancel
                    </Button>
                    <Button onClick={handleSave}>
                        Save Code
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}
