# Image Upload & Global Theming - Implementation Guide

## ✅ Features Implemented

### 1. 🖼️ Image Upload System

#### **Upload Methods**
- **Direct Upload**: Drag & drop or click to upload images
- **URL Input**: Paste image URL from external sources
- **Preview**: Live preview of selected images
- **Remove**: Easy image removal

#### **Technical Details**
- Uses **Uploadthing** for file hosting
- Max file size: 4MB per image
- Supports: JPG, JPEG, PNG, GIF, WEBP, SVG
- Automatic CDN delivery
- Secure authenticated uploads

#### **How It Works**
1. Content editor detects image fields automatically
2. Shows image picker instead of text input
3. Upload tab for direct uploads
4. URL tab for external images
5. Preview with remove button

#### **Auto-Detection**
Image fields are detected if:
- Field name contains: "image", "logo", "avatar", "thumbnail"
- Value contains: "placeholder.svg"
- Value ends with: .jpg, .jpeg, .png, .gif, .webp, .svg

---

### 2. 🎨 Global Theming System

#### **Theme Structure**
```typescript
{
  colors: {
    primary: "#4f46e5",
    secondary: "#10b981",
    accent: "#f59e0b",
    background: "#ffffff",
    text: "#1f2937",
    muted: "#6b7280"
  },
  typography: {
    fontFamily: "Inter, sans-serif",
    headingFont: "Optional heading font",
    fontSize: {
      base: "16px",
      h1: "3rem",
      h2: "2.25rem",
      h3: "1.875rem"
    }
  },
  spacing: {
    sectionPadding: "5rem 1.5rem",
    containerMaxWidth: "1200px"
  }
}
```

#### **Features**
- **Default Theme**: Auto-created on first use
- **Apply to Section**: One-click theme application
- **Visual Preview**: See all theme colors and settings
- **Brand Consistency**: Ensure consistent styling across pages

#### **How to Use**
1. Select a section in the builder
2. Go to "Style" tab
3. Click "Apply Theme" button
4. Review theme settings
5. Click "Apply Theme to Section"
6. Section inherits global colors, spacing, and typography

---

## 📦 New Components

### ImagePicker
**Location**: `app/admin/page-builder/[id]/_components/image-picker.tsx`

**Props**:
- `value`: Current image URL
- `onChange`: Callback when image changes
- `label`: Field label

**Features**:
- Upload tab with Uploadthing integration
- URL tab for external images
- Live preview
- Remove button

### ThemeEditor
**Location**: `app/admin/page-builder/[id]/_components/theme-editor.tsx`

**Props**:
- `onApplyTheme`: Callback when theme is applied

**Features**:
- Dialog interface
- Loads default theme
- Shows colors, typography, spacing
- Apply button

---

## 🗄️ Database Models

### PageTheme
**Location**: `lib/db/models/PageTheme.ts`

**Fields**:
- `name`: Theme name
- `colors`: Color palette object
- `typography`: Font settings
- `spacing`: Layout spacing
- `isDefault`: Default theme flag

---

## 🔧 Server Actions

### page-theme.actions.ts
**Location**: `lib/actions/page-theme.actions.ts`

**Functions**:
- `getThemes()` - Get all themes
- `getDefaultTheme()` - Get/create default theme
- `createTheme(data)` - Create new theme
- `updateTheme(id, data)` - Update theme
- `setDefaultTheme(id)` - Set as default
- `deleteTheme(id)` - Delete theme (except default)

---

## 🚀 Usage Examples

### Uploading an Image
```typescript
// Automatically shown for image fields
<ImagePicker
  label="Hero Image"
  value={content.imageUrl}
  onChange={(url) => updateContent("imageUrl", url)}
/>
```

### Applying Theme
```typescript
const applyTheme = (theme) => {
  onStyleChange({
    ...style,
    backgroundColor: theme.colors.background,
    textColor: theme.colors.text,
    padding: theme.spacing.sectionPadding,
    maxWidth: theme.spacing.containerMaxWidth,
  });
};
```

---

## 🎯 Benefits

### Image Upload
✅ No more placeholder images
✅ Professional image management
✅ CDN-hosted for fast loading
✅ Secure authenticated uploads
✅ Easy to use interface

### Global Theming
✅ Brand consistency across all pages
✅ One-click theme application
✅ Centralized style management
✅ Easy to maintain
✅ Professional appearance

---

## 🔮 Future Enhancements

### Image System
- [ ] Image library/gallery
- [ ] Image cropping/editing
- [ ] Bulk upload
- [ ] Image optimization
- [ ] Alt text management

### Theming
- [ ] Multiple themes
- [ ] Theme switcher
- [ ] Custom theme creator
- [ ] Theme import/export
- [ ] Dark mode support
- [ ] Per-page theme override

---

## 📝 Notes

### Uploadthing Setup
Requires environment variables:
```env
UPLOADTHING_SECRET=your_secret
UPLOADTHING_APP_ID=your_app_id
```

### Default Theme
- Auto-created on first access
- Cannot be deleted
- Can be modified
- Used as fallback

### Image Detection
Smart detection automatically shows image picker for:
- Any field with "image" in name
- Placeholder SVG URLs
- Image file extensions
