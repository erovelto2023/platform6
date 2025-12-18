# Rich Text Editor Features

## Overview
The blog post editor now includes a powerful rich text editor with media embedding capabilities using TipTap.

## Features

### Text Formatting
- **Bold** - Make text bold
- **Italic** - Italicize text
- **Heading 2** - Add section headings
- **Bullet List** - Create unordered lists
- **Numbered List** - Create ordered lists
- **Blockquote** - Add quoted text
- **Code Block** - Insert code snippets
- **Horizontal Rule** - Add dividing lines

### Media Insertion

#### Images
- Click the **Image** icon in the toolbar
- Option 1: Paste an image URL
- Option 2: Upload an image file directly
- Images are automatically styled with rounded corners and proper spacing

#### Links
- Click the **Link** icon in the toolbar
- Enter link text (optional) - if provided, creates new linked text
- Enter the URL
- Links are styled in indigo with underline

#### YouTube Videos
- Click the **YouTube** icon in the toolbar
- Paste any YouTube video URL
- Video will be embedded with controls
- Automatically styled with rounded corners

#### Audio Files
- Click the **Music** icon in the toolbar
- Option 1: Paste an audio file URL
- Option 2: Upload an audio file directly
- Creates an HTML5 audio player with controls

### Undo/Redo
- **Undo** - Revert last change
- **Redo** - Restore undone change

## Usage Tips

1. **Inline Media**: All media (images, videos, audio) can be inserted anywhere in your content
2. **Keyboard Shortcuts**: Press Enter in URL fields to quickly insert media
3. **File Upload**: Use the upload buttons for images and audio to avoid hosting issues
4. **Preview**: Use the Preview button to see how your post will look to readers

## Technical Details

- Built with TipTap editor
- Supports HTML output
- Integrates with UploadThing for file uploads
- Fully responsive design
- Accessible with proper ARIA labels
