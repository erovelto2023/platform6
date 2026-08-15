"use client";

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';
import Link from '@tiptap/extension-link';
import Youtube from '@tiptap/extension-youtube';
import {
    Bold,
    Italic,
    List,
    ListOrdered,
    Heading2,
    Quote,
    Undo,
    Redo,
    ImageIcon,
    Link2,
    Video as YoutubeIcon,
    Code,
    Minus,
    Music,
    FileCode,
    Type,
    Sparkles
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useState, useEffect } from 'react';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { UploadButton } from "@/lib/uploadthing";
import toast from "react-hot-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface RichTextEditorProps {
    content: string;
    onChange: (content: string) => void;
    placeholder?: string;
}

// Helper function to process inline formatting & bold lead-in labels
function processInlineFormatting(text: string): string {
    let result = text
        .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
        .replace(/\*(.+?)\*/g, '<em>$1</em>')
        .replace(/`(.+?)`/g, '<code>$1</code>')
        .replace(/\[(.+?)\]\((.+?)\)/g, '<a href="$2">$1</a>');

    // Auto-bold key prefix labels (e.g. "What they don't show you:", "The Reality:", "Why?", "The Trick:", "The Trap:", "Tip 1:", "Option A:")
    if (!result.startsWith('<strong>')) {
        const prefixMatch = result.match(/^([A-Z0-9][A-Za-z0-9\s'–—"-]{1,40})(:|-|\?)\s+(.+)$/);
        if (prefixMatch) {
            const label = prefixMatch[1] + prefixMatch[2];
            const rest = prefixMatch[3];
            result = `<strong>${label}</strong> ${rest}`;
        }
    }
    return result;
}

// Comprehensive Smart Text to Structured HTML Parser
export function formatTextToHtml(rawText: string): string {
    if (!rawText || !rawText.trim()) return '';

    // Convert HTML linebreaks to newlines if input is raw HTML
    const cleanText = rawText
        .replace(/<br\s*\/?>/gi, '\n')
        .replace(/<\/p>/gi, '\n\n')
        .replace(/<\/h[1-6]>/gi, '\n\n')
        .replace(/<\/li>/gi, '\n')
        .replace(/<[^>]*>/g, '');

    const lines = cleanText.split(/\r?\n/).map(l => l.trim());

    let htmlOutput = '';
    let inList = false;
    let listType: 'ul' | 'ol' = 'ul';
    let listItems: string[] = [];

    const closeList = () => {
        if (inList && listItems.length > 0) {
            htmlOutput += `<${listType}>${listItems.map(item => `<li>${item}</li>`).join('')}</${listType}>`;
            listItems = [];
            inList = false;
        }
    };

    for (let i = 0; i < lines.length; i++) {
        const line = lines[i];

        if (!line) {
            closeList();
            continue;
        }

        // 1. Horizontal Rules (3+ underscores, dashes, or asterisks)
        if (/^[_*\-\s]{3,}$/.test(line)) {
            closeList();
            htmlOutput += '<hr>';
            continue;
        }

        // 2. Markdown Headings (# Heading, ## Heading, etc.)
        const mdHeadingMatch = line.match(/^(#{1,6})\s+(.+)$/);
        if (mdHeadingMatch) {
            closeList();
            const level = Math.min(mdHeadingMatch[1].length, 6);
            htmlOutput += `<h${level}>${processInlineFormatting(mdHeadingMatch[2])}</h${level}>`;
            continue;
        }

        // 3. Auto-detect Headings (Title patterns, Anatomy, Reality, Examples, Tips, Tricks, Bottom Line)
        const isHeading2 = (
            /^The Anatomy of/i.test(line) ||
            /^The Reality: The/i.test(line) ||
            /^Real-World Examples/i.test(line) ||
            /^Actionable Tips/i.test(line) ||
            /^The Bottom Line/i.test(line) ||
            /^(Section|Part|Chapter)\s+\d+/i.test(line)
        );

        const isHeading3 = (
            /^(Tip|Trick|Example|Step|Myth|Rule|Framework|Detox|Test|Model)\s+\d+/i.test(line) ||
            /^[A-Z][A-Za-z0-9\s'":–—\-]{3,60}\s+(Trick|Illusion|Myth|Rule|Framework|Detox|Test|Model)$/i.test(line)
        );

        if (isHeading2) {
            closeList();
            htmlOutput += `<h2>${processInlineFormatting(line)}</h2>`;
            continue;
        }

        if (isHeading3) {
            closeList();
            htmlOutput += `<h3>${processInlineFormatting(line)}</h3>`;
            continue;
        }

        // 4. Bullet Lists (•, -, *, +, o, ▪)
        const bulletMatch = line.match(/^([•\-\*\+\u25cf\u25cb\u25a0o])\s*(.+)$/);
        if (bulletMatch) {
            if (!inList || listType !== 'ul') {
                closeList();
                inList = true;
                listType = 'ul';
            }
            listItems.push(processInlineFormatting(bulletMatch[2]));
            continue;
        }

        // 5. Numbered Lists (1., 2., 1), etc.)
        const numMatch = line.match(/^(\d+)[\.\)]\s*(.+)$/);
        if (numMatch) {
            if (!inList || listType !== 'ol') {
                closeList();
                inList = true;
                listType = 'ol';
            }
            listItems.push(processInlineFormatting(numMatch[2]));
            continue;
        }

        // Close list for normal paragraphs
        closeList();

        // 6. Normal Paragraph
        htmlOutput += `<p>${processInlineFormatting(line)}</p>`;
    }

    closeList();

    return htmlOutput;
}

export const RichTextEditor = ({ content, onChange, placeholder }: RichTextEditorProps) => {
    const [imageUrl, setImageUrl] = useState('');
    const [linkUrl, setLinkUrl] = useState('');
    const [linkText, setLinkText] = useState('');
    const [youtubeUrl, setYoutubeUrl] = useState('');
    const [audioUrl, setAudioUrl] = useState('');
    const [isImageDialogOpen, setIsImageDialogOpen] = useState(false);
    const [isLinkDialogOpen, setIsLinkDialogOpen] = useState(false);
    const [isYoutubeDialogOpen, setIsYoutubeDialogOpen] = useState(false);
    const [isAudioDialogOpen, setIsAudioDialogOpen] = useState(false);
    const [viewMode, setViewMode] = useState<'visual' | 'code'>('visual');
    const [rawHtml, setRawHtml] = useState(content);

    const editor = useEditor({
        immediatelyRender: false,
        extensions: [
            StarterKit,
            Image.configure({
                HTMLAttributes: {
                    class: 'rounded-lg max-w-full h-auto my-4 shadow-md',
                },
            }),
            Link.configure({
                openOnClick: false,
                HTMLAttributes: {
                    class: 'text-indigo-600 underline hover:text-indigo-800 transition-colors',
                },
            }),
            Youtube.configure({
                controls: true,
                nocookie: true,
                HTMLAttributes: {
                    class: 'rounded-lg my-4 shadow-lg w-full aspect-video',
                },
            }),
        ],
        content: content,
        onUpdate: ({ editor }) => {
            const html = editor.getHTML();
            setRawHtml(html);
            onChange(html);
        },
        editorProps: {
            attributes: {
                class: 'prose prose-lg max-w-none focus:outline-none min-h-[500px] px-6 py-8 text-slate-900 bg-white selection:bg-indigo-100 selection:text-indigo-900',
            },
            handlePaste: (view, event) => {
                const text = event.clipboardData?.getData('text/plain');

                if (text && text.trim()) {
                    event.preventDefault();
                    const formattedHtml = formatTextToHtml(text);
                    editor?.commands.insertContent(formattedHtml);
                    return true;
                }

                return false;
            },
        },
    });

    // Update rawHtml when content prop changes from outside
    useEffect(() => {
        if (editor && content !== editor.getHTML()) {
            editor.commands.setContent(content);
            setRawHtml(content);
        }
    }, [content, editor]);

    const handleRawHtmlChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const value = e.target.value;
        setRawHtml(value);
        onChange(value);
        if (editor) {
            editor.commands.setContent(value);
        }
    };

    if (!editor) {
        return null;
    }

    const addImage = () => {
        if (imageUrl) {
            editor.chain().focus().setImage({ src: imageUrl }).run();
            setImageUrl('');
            setIsImageDialogOpen(false);
        }
    };

    const addLink = () => {
        if (linkUrl) {
            if (linkText) {
                editor.chain().focus().insertContent(`<a href="${linkUrl}">${linkText}</a>`).run();
            } else {
                editor.chain().focus().setLink({ href: linkUrl }).run();
            }
            setLinkUrl('');
            setLinkText('');
            setIsLinkDialogOpen(false);
        }
    };

    const addYoutube = () => {
        if (youtubeUrl) {
            editor.chain().focus().setYoutubeVideo({ src: youtubeUrl }).run();
            setYoutubeUrl('');
            setIsYoutubeDialogOpen(false);
        }
    };

    const addAudio = () => {
        if (audioUrl) {
            editor.chain().focus().insertContent(`<audio controls src="${audioUrl}" class="w-full my-4"></audio>`).run();
            setAudioUrl('');
            setIsAudioDialogOpen(false);
        }
    };

    const handleAutoFormat = () => {
        if (!editor) return;
        const textContent = editor.getText();
        if (!textContent.trim()) {
            toast.error("Editor is empty!");
            return;
        }
        const formattedHtml = formatTextToHtml(textContent);
        editor.commands.setContent(formattedHtml);
        setRawHtml(formattedHtml);
        onChange(formattedHtml);
        toast.success("Article structure formatted!");
    };

    return (
        <div className="border rounded-xl bg-white shadow-sm overflow-hidden flex flex-col">
            {/* Mode Switcher */}
            <div className="bg-slate-50 border-b px-4 py-2 flex items-center justify-between">
                <Tabs value={viewMode} onValueChange={(v) => setViewMode(v as 'visual' | 'code')} className="w-auto">
                    <TabsList className="bg-slate-200/50 p-1 rounded-lg">
                        <TabsTrigger value="visual" className="data-[state=active]:bg-white rounded-md flex items-center gap-2 text-xs">
                            <Type className="h-3 w-3" />
                            Visual Editor
                        </TabsTrigger>
                        <TabsTrigger value="code" className="data-[state=active]:bg-white rounded-md flex items-center gap-2 text-xs">
                            <FileCode className="h-3 w-3" />
                            HTML Source
                        </TabsTrigger>
                    </TabsList>
                </Tabs>
                <div className="flex items-center gap-3">
                    <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={handleAutoFormat}
                        className="h-7 px-2.5 text-xs font-bold text-indigo-600 border-indigo-200 bg-indigo-50 hover:bg-indigo-100 hover:text-indigo-700 rounded-lg flex items-center gap-1.5 cursor-pointer transition-all"
                        title="Automatically format headings, bullet points, horizontal dividers, and lead-in labels"
                    >
                        <Sparkles className="h-3.5 w-3.5 text-indigo-600" />
                        Auto-Format Structure
                    </Button>
                    <div className="text-xs text-slate-400 font-medium hidden sm:block">
                        {viewMode === 'visual' ? 'Rich Text Mode' : 'HTML Source Mode'}
                    </div>
                </div>
            </div>

            {viewMode === 'visual' && (
                <>
                    {/* Toolbar */}
                    <div className="border-b bg-white p-2 flex flex-wrap gap-1 sticky top-0 z-10 transition-all">
                        <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => editor.chain().focus().toggleBold().run()}
                            className={editor.isActive('bold') ? 'bg-indigo-50 text-indigo-700' : 'text-slate-600'}
                        >
                            <Bold className="h-4 w-4" />
                        </Button>
                        <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => editor.chain().focus().toggleItalic().run()}
                            className={editor.isActive('italic') ? 'bg-indigo-50 text-indigo-700' : 'text-slate-600'}
                        >
                            <Italic className="h-4 w-4" />
                        </Button>
                        <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
                            className={editor.isActive('heading', { level: 2 }) ? 'bg-indigo-50 text-indigo-700' : 'text-slate-600'}
                        >
                            <Heading2 className="h-4 w-4" />
                        </Button>
                        <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => editor.chain().focus().toggleBulletList().run()}
                            className={editor.isActive('bulletList') ? 'bg-indigo-50 text-indigo-700' : 'text-slate-600'}
                        >
                            <List className="h-4 w-4" />
                        </Button>
                        <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => editor.chain().focus().toggleOrderedList().run()}
                            className={editor.isActive('orderedList') ? 'bg-indigo-50 text-indigo-700' : 'text-slate-600'}
                        >
                            <ListOrdered className="h-4 w-4" />
                        </Button>
                        <div className="w-px h-6 bg-slate-200 mx-1 self-center" />
                        <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => editor.chain().focus().toggleBlockquote().run()}
                            className={editor.isActive('blockquote') ? 'bg-indigo-50 text-indigo-700' : 'text-slate-600'}
                        >
                            <Quote className="h-4 w-4" />
                        </Button>
                        <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => editor.chain().focus().toggleCodeBlock().run()}
                            className={editor.isActive('codeBlock') ? 'bg-indigo-50 text-indigo-700' : 'text-slate-600'}
                        >
                            <Code className="h-4 w-4" />
                        </Button>
                        <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => editor.chain().focus().setHorizontalRule().run()}
                            className="text-slate-600"
                        >
                            <Minus className="h-4 w-4" />
                        </Button>

                        <div className="w-px h-6 bg-slate-200 mx-1 self-center" />

                        {/* Image Dialog */}
                        <Dialog open={isImageDialogOpen} onOpenChange={setIsImageDialogOpen}>
                            <DialogTrigger asChild>
                                <Button type="button" variant="ghost" size="sm" className="text-slate-600">
                                    <ImageIcon className="h-4 w-4" />
                                </Button>
                            </DialogTrigger>
                            <DialogContent>
                                <DialogHeader>
                                    <DialogTitle>Insert Image</DialogTitle>
                                    <DialogDescription>
                                        Add an image by URL or upload a file
                                    </DialogDescription>
                                </DialogHeader>
                                <div className="space-y-4">
                                    <div>
                                        <Label>Image URL</Label>
                                        <Input
                                            placeholder="https://example.com/image.jpg"
                                            value={imageUrl}
                                            onChange={(e) => setImageUrl(e.target.value)}
                                            onKeyDown={(e) => e.key === 'Enter' && addImage()}
                                        />
                                    </div>
                                    <div className="text-center text-sm text-slate-500">OR</div>
                                    <div>
                                        <Label>Upload Image</Label>
                                        <UploadButton
                                            endpoint="courseThumbnail"
                                            onClientUploadComplete={(res) => {
                                                setImageUrl(res[0].url);
                                                toast.success("Image uploaded");
                                            }}
                                            onUploadError={(error: Error) => {
                                                toast.error(`Upload failed: ${error.message}`);
                                            }}
                                        />
                                    </div>
                                </div>
                                <DialogFooter>
                                    <Button type="button" onClick={addImage}>Insert Image</Button>
                                </DialogFooter>
                            </DialogContent>
                        </Dialog>

                        {/* Link Dialog */}
                        <Dialog open={isLinkDialogOpen} onOpenChange={setIsLinkDialogOpen}>
                            <DialogTrigger asChild>
                                <Button type="button" variant="ghost" size="sm" className="text-slate-600">
                                    <Link2 className="h-4 w-4" />
                                </Button>
                            </DialogTrigger>
                            <DialogContent>
                                <DialogHeader>
                                    <DialogTitle>Insert Link</DialogTitle>
                                    <DialogDescription>
                                        Add a hyperlink to your content
                                    </DialogDescription>
                                </DialogHeader>
                                <div className="space-y-4">
                                    <div>
                                        <Label>Link Text (optional)</Label>
                                        <Input
                                            placeholder="Click here"
                                            value={linkText}
                                            onChange={(e) => setLinkText(e.target.value)}
                                        />
                                    </div>
                                    <div>
                                        <Label>URL</Label>
                                        <Input
                                            placeholder="https://example.com"
                                            value={linkUrl}
                                            onChange={(e) => setLinkUrl(e.target.value)}
                                            onKeyDown={(e) => e.key === 'Enter' && addLink()}
                                        />
                                    </div>
                                </div>
                                <DialogFooter>
                                    <Button type="button" onClick={addLink}>Insert Link</Button>
                                </DialogFooter>
                            </DialogContent>
                        </Dialog>

                        {/* YouTube Dialog */}
                        <Dialog open={isYoutubeDialogOpen} onOpenChange={setIsYoutubeDialogOpen}>
                            <DialogTrigger asChild>
                                <Button type="button" variant="ghost" size="sm" className="text-slate-600">
                                    <YoutubeIcon className="h-4 w-4" />
                                </Button>
                            </DialogTrigger>
                            <DialogContent>
                                <DialogHeader>
                                    <DialogTitle>Embed YouTube Video</DialogTitle>
                                    <DialogDescription>
                                        Paste a YouTube video URL
                                    </DialogDescription>
                                </DialogHeader>
                                <div className="space-y-4">
                                    <div>
                                        <Label>YouTube URL</Label>
                                        <Input
                                            placeholder="https://www.youtube.com/watch?v=..."
                                            value={youtubeUrl}
                                            onChange={(e) => setYoutubeUrl(e.target.value)}
                                            onKeyDown={(e) => e.key === 'Enter' && addYoutube()}
                                        />
                                    </div>
                                </div>
                                <DialogFooter>
                                    <Button type="button" onClick={addYoutube}>Embed Video</Button>
                                </DialogFooter>
                            </DialogContent>
                        </Dialog>

                        <div className="w-px h-6 bg-slate-200 mx-1 self-center" />

                        <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => editor.chain().focus().undo().run()}
                            disabled={!editor.can().undo()}
                            className="text-slate-600"
                        >
                            <Undo className="h-4 w-4" />
                        </Button>
                        <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => editor.chain().focus().redo().run()}
                            disabled={!editor.can().redo()}
                            className="text-slate-600"
                        >
                            <Redo className="h-4 w-4" />
                        </Button>
                    </div>

                    {/* Editor Content */}
                    <div className="flex-1 overflow-y-auto bg-white text-slate-900">
                        <EditorContent editor={editor} />
                    </div>

                    {/* Inline CSS styling to guarantee rich text editor content visibility */}
                    <style dangerouslySetInnerHTML={{ __html: `
                        .ProseMirror {
                            color: #0f172a !important;
                            background-color: #ffffff !important;
                            min-height: 500px;
                            outline: none;
                        }
                        .ProseMirror p {
                            color: #0f172a !important;
                            margin-bottom: 1.25rem;
                            line-height: 1.75;
                            font-size: 1.05rem;
                        }
                        .ProseMirror p:first-child:empty::before,
                        .ProseMirror p:first-child:has(br:only-child)::before {
                            content: "${placeholder || 'Write your article content here...'}";
                            color: #94a3b8 !important;
                            pointer-events: none;
                            float: left;
                            height: 0;
                        }
                        .ProseMirror h1, .ProseMirror h2, .ProseMirror h3, .ProseMirror h4, .ProseMirror h5, .ProseMirror h6 {
                            color: #0f172a !important;
                            font-weight: 700;
                            margin-top: 1.75rem;
                            margin-bottom: 0.75rem;
                            line-height: 1.3;
                        }
                        .ProseMirror h1 { font-size: 2.25rem; }
                        .ProseMirror h2 { font-size: 1.75rem; }
                        .ProseMirror h3 { font-size: 1.35rem; }
                        .ProseMirror ul {
                            list-style-type: disc !important;
                            padding-left: 1.5rem !important;
                            margin-bottom: 1.25rem !important;
                            color: #0f172a !important;
                        }
                        .ProseMirror ol {
                            list-style-type: decimal !important;
                            padding-left: 1.5rem !important;
                            margin-bottom: 1.25rem !important;
                            color: #0f172a !important;
                        }
                        .ProseMirror li {
                            margin-bottom: 0.375rem !important;
                            color: #0f172a !important;
                        }
                        .ProseMirror blockquote {
                            border-left: 4px solid #6366f1 !important;
                            padding-left: 1rem !important;
                            font-style: italic;
                            color: #334155 !important;
                            margin: 1.25rem 0 !important;
                        }
                        .ProseMirror pre {
                            background-color: #0f172a !important;
                            color: #f8fafc !important;
                            padding: 1.25rem !important;
                            border-radius: 0.75rem !important;
                            overflow-x: auto;
                            font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
                            margin-bottom: 1.25rem !important;
                        }
                        .ProseMirror code {
                            background-color: #f1f5f9 !important;
                            color: #0f172a !important;
                            padding: 0.2rem 0.4rem !important;
                            border-radius: 0.25rem !important;
                            font-size: 0.875em !important;
                            font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
                        }
                        .ProseMirror pre code {
                            background-color: transparent !important;
                            color: #f8fafc !important;
                            padding: 0 !important;
                        }
                        .ProseMirror a {
                            color: #4f46e5 !important;
                            text-decoration: underline !important;
                            font-weight: 500;
                        }
                        .ProseMirror hr {
                            border: none !important;
                            border-top: 2px solid #e2e8f0 !important;
                            margin: 2rem 0 !important;
                        }
                    ` }} />
                </>
            )}

            {viewMode === 'code' && (
                <div className="flex-1 flex flex-col p-0">
                    <Textarea
                        value={rawHtml}
                        onChange={handleRawHtmlChange}
                        className="flex-1 min-h-[500px] font-mono text-sm border-none shadow-none focus-visible:ring-0 p-6 bg-slate-900 text-slate-200 leading-relaxed resize-none"
                        spellCheck={false}
                        placeholder="Paste your HTML here..."
                    />
                    <div className="bg-slate-800 border-t border-slate-700 px-4 py-2 flex items-center justify-between text-[10px] text-slate-400 font-mono">
                        <div>HTML Mode (Direct Injection Supported)</div>
                        <div className="flex gap-4">
                            <span>Chars: {rawHtml.length}</span>
                            <span>Lines: {rawHtml.split('\n').length}</span>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
