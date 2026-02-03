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
    Youtube as YoutubeIcon,
    Code,
    Minus,
    Music,
    FileCode,
    Type
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

// Helper function to process inline formatting
function processInlineFormatting(text: string): string {
    return text
        .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
        .replace(/\*(.+?)\*/g, '<em>$1</em>')
        .replace(/`(.+?)`/g, '<code>$1</code>')
        .replace(/\[(.+?)\]\((.+?)\)/g, '<a href="$2">$1</a>');
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
                class: 'prose prose-lg prose-indigo max-w-none focus:outline-none min-h-[500px] px-6 py-8',
            },
            handlePaste: (view, event) => {
                const text = event.clipboardData?.getData('text/plain');
                const html = event.clipboardData?.getData('text/html');

                // If it looks like raw HTML being pasted, let it through as text or content
                if (html && !text?.includes('**') && !text?.includes('# ') && !text?.includes('```')) {
                    return false;
                }

                if (text && (text.includes('# ') || text.includes('**') || text.includes('* ') || text.includes('```') || text.includes('> '))) {
                    event.preventDefault();

                    // Simple Markdown to HTML converter
                    const lines = text.split('\n');
                    let htmlOutput = '';
                    let inList = false;
                    let listItems: string[] = [];
                    let inCodeBlock = false;
                    let codeContent = '';

                    for (let i = 0; i < lines.length; i++) {
                        let line = lines[i];

                        // Code Blocks
                        if (line.trim().startsWith('```')) {
                            if (inCodeBlock) {
                                htmlOutput += `<pre><code>${codeContent}</code></pre>`;
                                codeContent = '';
                                inCodeBlock = false;
                            } else {
                                inCodeBlock = true;
                            }
                            continue;
                        }

                        if (inCodeBlock) {
                            codeContent += line + '\n';
                            continue;
                        }

                        // Blockquotes
                        if (line.trim().startsWith('> ')) {
                            htmlOutput += `<blockquote>${processInlineFormatting(line.trim().substring(2))}</blockquote>`;
                            continue;
                        }

                        // Horizontal Rules
                        if (line.trim() === '---' || line.trim() === '***' || line.trim() === '___') {
                            htmlOutput += '<hr>';
                            continue;
                        }

                        // Headings
                        const headingMatch = line.match(/^(#{1,6})\s+(.+)$/);
                        if (headingMatch) {
                            const level = headingMatch[1].length;
                            const contentText = headingMatch[2].trim();
                            htmlOutput += `<h${level}>${processInlineFormatting(contentText)}</h${level}>`;
                            continue;
                        }

                        // Lists
                        if (line.trim().startsWith('* ') || line.trim().startsWith('- ') || line.trim().startsWith('+ ')) {
                            const contentText = line.trim().substring(2);
                            listItems.push(processInlineFormatting(contentText));
                            inList = true;
                            continue;
                        }

                        // Close list
                        if (inList && (!line.trim() || !/^[*-+]\s+/.test(line.trim()))) {
                            htmlOutput += `<ul>${listItems.map(item => `<li>${item}</li>`).join('')}</ul>`;
                            listItems = [];
                            inList = false;
                        }

                        // Paragraphs
                        if (line.trim()) {
                            htmlOutput += `<p>${processInlineFormatting(line)}</p>`;
                        } else {
                            htmlOutput += '<br>';
                        }
                    }

                    if (inList) {
                        htmlOutput += `<ul>${listItems.map(item => `<li>${item}</li>`).join('')}</ul>`;
                    }

                    editor?.commands.insertContent(htmlOutput);
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
                <div className="text-xs text-slate-400 font-medium hidden sm:block">
                    {viewMode === 'visual' ? 'Rich Text Mode' : 'HTML Source Mode'}
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
                    <div className="flex-1 overflow-y-auto">
                        <EditorContent editor={editor} />
                    </div>
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
