# Page Builder System

## Overview
A modern visual page builder system for creating custom pages with drag-and-drop functionality, inspired by the visual-web-page-creator demo but enhanced with modern UI and database persistence.

## Features Implemented

### 1. Database Models
- **WebPage** (`lib/db/models/WebPage.ts`)
  - Stores page name, slug, sections, publish status
  - Includes meta title and description for SEO
  - Sections stored as subdocuments with content, style, and order

- **PageBuilderTemplate** (`lib/db/models/PageBuilderTemplate.ts`)
  - Template definitions for reusable sections
  - Supports custom code for advanced users
  - System templates vs user templates

### 2. Server Actions
- **page-builder.actions.ts**
  - `getPages()` - List all pages
  - `getPage(id)` - Get single page
  - `getPageBySlug(slug)` - Get published page by slug
  - `createPage(data)` - Create new page
  - `updatePage(id, data)` - Update page and sections
  - `deletePage(id)` - Delete page
  - `publishPage(id, publish)` - Toggle publish status

### 3. Admin Pages

#### Pages List (`/admin/page-builder`)
- Card-based grid layout
- Shows page name, slug, section count, publish status
- Quick edit and view actions
- Empty state with call-to-action

#### Create Page (`/admin/page-builder/create`)
- Simple form for page name and slug
- Auto-generates slug from name
- Redirects to builder after creation

#### Visual Builder (`/admin/page-builder/[id]`)
- **Three-panel layout:**
  - Left: Template library with categorized sections
  - Center: Live canvas with section preview
  - Right: Content/Style editor (when section selected)

- **Header toolbar:**
  - Back button
  - Page name editor
  - Publish/Unpublish toggle
  - Preview button (when published)
  - Save button

- **Canvas features:**
  - Click to select sections
  - Visual selection indicator (ring)
  - Section toolbar with move up/down/delete
  - Template name on hover
  - Empty state

- **Template Library:**
  - Organized by category (hero, features, content, etc.)
  - Click to add to page
  - 10 default templates included

- **Property Editors:**
  - Content tab: Edit all text fields
  - Style tab: Colors, spacing, typography, borders

### 4. Public Page Viewer (`/p/[slug]`)
- Renders published pages
- SEO metadata support
- Clean, distraction-free view
- Uses same section renderer as builder

### 5. Default Templates
10 essential templates included:
- Hero Centered
- Hero Split
- Features Grid
- Content Two Column
- Text Block
- Call to Action
- Testimonials Slider
- Pricing Table
- FAQ Accordion
- Contact Form

### 6. Section Renderer
Simplified but functional rendering for:
- Hero sections (centered, split)
- Feature grids
- Content blocks
- CTAs
- Testimonials
- Pricing tables
- FAQs
- Contact forms

## Usage

### Creating a Page
1. Go to `/admin/page-builder`
2. Click "Create Page"
3. Enter name and slug
4. Click "Create Page"

### Building a Page
1. Select templates from left sidebar
2. Click to add to canvas
3. Click section to select
4. Edit content/style in right panel
5. Use toolbar to reorder or delete
6. Click "Save" to persist changes

### Publishing
1. Click "Publish" in header
2. Page becomes available at `/p/[slug]`
3. Click "Preview" to view
4. Click "Unpublish" to take offline

## Technical Details

### Styling System
Each section has customizable:
- Background color
- Text color
- Padding
- Margin
- Font size
- Font weight
- Text alignment
- Border radius
- Max width

### Content System
- Dynamic fields based on template
- Supports strings and JSON arrays
- Text inputs for short content
- Textareas for long content

### State Management
- React state for builder UI
- Server actions for persistence
- Optimistic UI updates
- Toast notifications for feedback

## Future Enhancements
- Drag-and-drop section reordering
- Duplicate section
- Section templates library
- Custom template creation
- Image upload integration
- Responsive preview modes
- Undo/redo functionality
- Auto-save
- Version history
- More section types
- Advanced styling options
- Custom CSS editor
- Component library expansion
