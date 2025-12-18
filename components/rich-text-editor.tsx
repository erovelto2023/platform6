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
    Music
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useState } from 'react';
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

interface RichTextEditorProps {
    content: string;
    onChange: (content: string) => void;
    placeholder?: string;
}

// Helper function to process inline formatting
function processInlineFormatting(text: string): string {
    return text
        .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
        .replace(/\*(.+?)\*/g, '<em>$1</em>');
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

    const editor = useEditor({
        immediatelyRender: false,
        extensions: [
            StarterKit,
            Image.configure({
                HTMLAttributes: {
                    class: 'rounded-lg max-w-full h-auto my-4',
                },
            }),
            Link.configure({
                openOnClick: false,
                HTMLAttributes: {
                    class: 'text-indigo-600 underline hover:text-indigo-800',
                },
            }),
            Youtube.configure({
                controls: true,
                nocookie: true,
                HTMLAttributes: {
                    class: 'rounded-lg my-4',
                },
            }),
        ],
        content: content,
        onUpdate: ({ editor }) => {
            onChange(editor.getHTML());
        },
        editorProps: {
            attributes: {
                class: 'prose prose-lg prose-indigo max-w-none focus:outline-none min-h-[400px] px-4 py-3',
            },
            handlePaste: (view, event) => {
                const text = event.clipboardData?.getData('text/plain');
                const html = event.clipboardData?.getData('text/html');

                if (html && !text?.includes('**') && !text?.includes('# ')) {
                    // If HTML is available and it's not markdown, let TipTap handle it
                    return false;
                }

                if (text) {
                    event.preventDefault();

                    // Split into lines for processing
                    const lines = text.split('\n');
                    let htmlOutput = '';
                    let inList = false;
                    let listItems: string[] = [];

                    for (let i = 0; i < lines.length; i++) {
                        let line = lines[i];

                        // Skip horizontal rules
                        if (line.trim() === '---') {
                            if (inList) {
                                htmlOutput += `<ul>${listItems.map(item => `<li>${item}</li>`).join('')}</ul>`;
                                listItems = [];
                                inList = false;
                            }
                            htmlOutput += '<hr>';
                            continue;
                        }

                        // Handle headings
                        if (line.startsWith('# ')) {
                            if (inList) {
                                htmlOutput += `<ul>${listItems.map(item => `<li>${item}</li>`).join('')}</ul>`;
                                listItems = [];
                                inList = false;
                            }
                            const contentText = line.substring(2).trim();
                            htmlOutput += `<h1>${processInlineFormatting(contentText)}</h1>`;
                            continue;
                        }

                        if (line.startsWith('## ')) {
                            if (inList) {
                                htmlOutput += `<ul>${listItems.map(item => `<li>${item}</li>`).join('')}</ul>`;
                                listItems = [];
                                inList = false;
                            }
                            const contentText = line.substring(3).trim();
                            htmlOutput += `<h2>${processInlineFormatting(contentText)}</h2>`;
                            continue;
                        }

                        if (line.startsWith('### ')) {
                            if (inList) {
                                htmlOutput += `<ul>${listItems.map(item => `<li>${item}</li>`).join('')}</ul>`;
                                listItems = [];
                                inList = false;
                            }
                            const contentText = line.substring(4).trim();
                            htmlOutput += `<h3>${processInlineFormatting(contentText)}</h3>`;
                            continue;
                        }

                        // Handle bullet points
                        if (line.trim().startsWith('* ')) {
                            const contentText = line.trim().substring(2);
                            listItems.push(processInlineFormatting(contentText));
                            inList = true;
                            continue;
                        }

                        // Close list if we're in one and hit non-list content
                        if (inList && line.trim() && !line.trim().startsWith('* ')) {
                            htmlOutput += `<ul>${listItems.map(item => `<li>${item}</li>`).join('')}</ul>`;
                            listItems = [];
                            inList = false;
                        }

                        // Handle regular paragraphs
                        if (line.trim()) {
                            htmlOutput += `<p>${processInlineFormatting(line)}</p>`;
                        }
                    }

                    // Close any remaining list
                    if (inList) {
                        htmlOutput += `<ul>${listItems.map(item => `<li>${item}</li>`).join('')}</ul>`;
                    }

                    // Insert the converted HTML
                    editor?.commands.insertContent(htmlOutput);
                    return true;
                }

                return false;
            },
        },
    });

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
        <div className="border rounded-lg bg-white">
            {/* Toolbar */}
            <div className="border-b bg-slate-50 p-2 flex flex-wrap gap-1">
                <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => editor.chain().focus().toggleBold().run()}
                    className={editor.isActive('bold') ? 'bg-slate-200' : ''}
                >
                    <Bold className="h-4 w-4" />
                </Button>
                <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => editor.chain().focus().toggleItalic().run()}
                    className={editor.isActive('italic') ? 'bg-slate-200' : ''}
                >
                    <Italic className="h-4 w-4" />
                </Button>
                <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
                    className={editor.isActive('heading', { level: 2 }) ? 'bg-slate-200' : ''}
                >
                    <Heading2 className="h-4 w-4" />
                </Button>
                <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => editor.chain().focus().toggleBulletList().run()}
                    className={editor.isActive('bulletList') ? 'bg-slate-200' : ''}
                >
                    <List className="h-4 w-4" />
                </Button>
                <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => editor.chain().focus().toggleOrderedList().run()}
                    className={editor.isActive('orderedList') ? 'bg-slate-200' : ''}
                >
                    <ListOrdered className="h-4 w-4" />
                </Button>
                <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => editor.chain().focus().toggleBlockquote().run()}
                    className={editor.isActive('blockquote') ? 'bg-slate-200' : ''}
                >
                    <Quote className="h-4 w-4" />
                </Button>
                <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => editor.chain().focus().toggleCodeBlock().run()}
                    className={editor.isActive('codeBlock') ? 'bg-slate-200' : ''}
                >
                    <Code className="h-4 w-4" />
                </Button>
                <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => editor.chain().focus().setHorizontalRule().run()}
                >
                    <Minus className="h-4 w-4" />
                </Button>

                <div className="w-px h-6 bg-slate-300 mx-1" />

                {/* Image Dialog */}
                <Dialog open={isImageDialogOpen} onOpenChange={setIsImageDialogOpen}>
                    <DialogTrigger asChild>
                        <Button type="button" variant="ghost" size="sm">
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
                        <Button type="button" variant="ghost" size="sm">
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
                        <Button type="button" variant="ghost" size="sm">
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

                {/* Audio Dialog */}
                <Dialog open={isAudioDialogOpen} onOpenChange={setIsAudioDialogOpen}>
                    <DialogTrigger asChild>
                        <Button type="button" variant="ghost" size="sm">
                            <Music className="h-4 w-4" />
                        </Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Insert Audio</DialogTitle>
                            <DialogDescription>
                                Add an audio file by URL or upload
                            </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4">
                            <div>
                                <Label>Audio URL</Label>
                                <Input
                                    placeholder="https://example.com/audio.mp3"
                                    value={audioUrl}
                                    onChange={(e) => setAudioUrl(e.target.value)}
                                    onKeyDown={(e) => e.key === 'Enter' && addAudio()}
                                />
                            </div>
                            <div className="text-center text-sm text-slate-500">OR</div>
                            <div>
                                <Label>Upload Audio</Label>
                                <UploadButton
                                    endpoint="courseAttachment"
                                    onClientUploadComplete={(res) => {
                                        setAudioUrl(res[0].url);
                                        toast.success("Audio uploaded");
                                    }}
                                    onUploadError={(error: Error) => {
                                        toast.error(`Upload failed: ${error.message}`);
                                    }}
                                />
                            </div>
                        </div>
                        <DialogFooter>
                            <Button type="button" onClick={addAudio}>Insert Audio</Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>

                <div className="w-px h-6 bg-slate-300 mx-1" />

                <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => editor.chain().focus().undo().run()}
                    disabled={!editor.can().undo()}
                >
                    <Undo className="h-4 w-4" />
                </Button>
                <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => editor.chain().focus().redo().run()}
                    disabled={!editor.can().redo()}
                >
                    <Redo className="h-4 w-4" />
                </Button>
            </div>

            {/* Editor Content */}
            <EditorContent editor={editor} />
        </div>
    );
};
