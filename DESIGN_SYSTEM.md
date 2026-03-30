# Design System Quick Reference

## 🎨 Color Palette

### Primary Brand Colors
```css
Ocean Blue: #0284c7 (sky-600)
Deep Indigo: #4f46e5 (indigo-600)
```

### Background Colors
```css
Lightest: #ffffff (white) - Main background
Light:    #f8fafc (slate-50) - Section backgrounds
Medium:   #e2e8f0 (slate-200) - Borders / Modals
Dark Mode: #0f172a (slate-900) - Soft navy background
```

### Text Colors
```css
Primary:   #0f172a (slate-900)   - Headings (Dark in Light Mode)
Secondary: #334155 (slate-700)   - Body text
Tertiary:  #64748b (slate-500)   - Muted text
Muted:     #94a3b8 (slate-400)   - Footer, captions
```

### Border Colors
```css
Default: #e2e8f0 (slate-200)
Hover:   Various with /50 opacity
```

### Feature Colors
```css
Courses:    #0284c7 (sky-600)
Niche:      #4f46e5 (indigo-600)
Tools:      #ea580c (orange-600)
Knowledge:  #0d9488 (teal-600)
Resources:  #6366f1 (indigo-500)
Success:    #10b981 (emerald-500)
```

---

## 🎭 Gradient Recipes

### Background Gradients
```tsx
// Sky to Indigo (Primary)
className="bg-gradient-to-br from-sky-600 to-indigo-600"

// Light Subtle Gradient
className="bg-gradient-to-br from-slate-50 to-white"

// Multi-stop (Complex)
className="bg-gradient-to-br from-white via-sky-50 to-white"
```

### Text Gradients
```tsx
className="bg-gradient-to-r from-sky-600 to-indigo-600 bg-clip-text text-transparent"
```

### Button Gradients
```tsx
className="bg-gradient-to-r from-sky-600 to-indigo-600 hover:from-sky-700 hover:to-indigo-700"
```

---

## ✨ Shadow & Glow Effects

### Standard Shadows
```tsx
className="shadow-sm"           // Subtle card shadow
className="shadow-md"           // Elevated element
className="shadow-lg"           // Dropdowns / Modals
```

### Colored Glows
```tsx
className="shadow-lg shadow-sky-500/20"      // Sky glow
className="shadow-lg shadow-indigo-500/20"   // Indigo glow
```

### Hover Glows
```tsx
className="hover:shadow-xl hover:shadow-sky-500/10 transition-shadow"
```

---

## 🪟 Glassmorphism

### Basic Glass
```tsx
className="bg-white/80 backdrop-blur-sm"
```

### Glass with Border
```tsx
className="bg-white/80 backdrop-blur-md border border-slate-200"
```

### Navbar Glass
```tsx
className="bg-white/95 backdrop-blur-sm border-b border-slate-200"
```

---

## 🎬 Animation Variants

### Fade In Up
```tsx
const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0 }
};

<motion.div
  initial="hidden"
  whileInView="visible"
  viewport={{ once: true }}
  variants={fadeInUp}
  transition={{ duration: 0.6 }}
>
```

### Scale In
```tsx
const scaleIn = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: { opacity: 1, scale: 1 }
};

<motion.div
  variants={scaleIn}
  transition={{ duration: 0.5 }}
>
```

### Stagger Container
```tsx
const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

<motion.div variants={staggerContainer}>
  {items.map(item => (
    <motion.div variants={fadeInUp} />
  ))}
</motion.div>
```

### Hover Scale
```tsx
className="hover:-translate-y-1 transition-transform"
```

---

## 🎯 Component Patterns

### Card Pattern
```tsx
<div className="bg-white p-8 rounded-2xl border border-slate-200 hover:border-sky-300 transition-all hover:shadow-xl group">
  {/* Content */}
</div>
```

### Icon Container
```tsx
<div className="w-14 h-14 bg-sky-50 rounded-xl flex items-center justify-center text-sky-600 group-hover:bg-sky-100 transition-colors">
  <Icon className="h-7 w-7" />
</div>
```

### Button Primary
```tsx
<Button className="bg-sky-600 hover:bg-sky-700 text-white shadow-sm">
  Click Me
</Button>
```

### Button Secondary
```tsx
<Button variant="outline" className="border-slate-200 hover:bg-slate-50 text-slate-700">
  Click Me
</Button>
```

### Heading with Gradient
```tsx
<h2 className="text-4xl md:text-5xl font-bold text-center mb-4 text-slate-900">
  Heading
</h2>
```

---

## 🌟 Background Decorations

### Gradient Orb
```tsx
<div className="absolute top-0 left-1/4 w-96 h-96 bg-sky-500/10 rounded-full blur-3xl pointer-events-none" />
```

### Grid Pattern
```tsx
<div className="absolute inset-0 bg-[url('/grid.svg')] opacity-5 pointer-events-none" />
```

---

## 📐 Spacing System

### Section Padding
```tsx
className="py-20"        // Standard section
className="py-16"        // Compact section
className="py-24"        // Large section
```

### Container
```tsx
className="container px-4 md:px-6 mx-auto"
```

### Max Width
```tsx
className="max-w-4xl mx-auto"   // Standard content
className="max-w-5xl mx-auto"   // Wide content
```

---

## 🎨 Typography Scale

### Headings (Inter / Headline font)
```tsx
className="text-4xl md:text-5xl font-extrabold text-slate-900"  // H1
className="text-3xl md:text-4xl font-bold text-slate-900"       // H2
className="text-2xl font-bold text-slate-800"                   // H3
className="text-xl font-semibold text-slate-800"                // H4
```

### Body Text (Inter)
```tsx
className="text-lg text-slate-700"      // Large body
className="text-base text-slate-600"    // Normal body
className="text-sm text-slate-500"      // Small text
```

---

This design system establishes a **clean, robust, and calming educational** aesthetic! 🚀
