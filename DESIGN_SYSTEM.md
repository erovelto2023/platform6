# Design System Quick Reference

## 🎨 Color Palette

### Primary Brand Colors
```css
Purple: #9333ea (purple-600)
Pink:   #ec4899 (pink-600)
```

### Background Colors
```css
Darkest:  #020617 (slate-950) - Main background
Dark:     #0f172a (slate-900) - Section backgrounds
Medium:   #1e293b (slate-800) - Card backgrounds
```

### Text Colors
```css
Primary:   #ffffff (white)       - Headings
Secondary: #cbd5e1 (slate-300)   - Body text
Tertiary:  #94a3b8 (slate-400)   - Muted text
Muted:     #64748b (slate-500)   - Footer, captions
```

### Border Colors
```css
Default: #334155 (slate-700)
Hover:   Various with /50 opacity
```

### Feature Colors
```css
Courses:    #3b82f6 (blue-600)
Niche:      #a855f7 (purple-600)
Tools:      #f97316 (orange-600)
Knowledge:  #14b8a6 (teal-600)
Resources:  #ec4899 (pink-600)
Success:    #10b981 (emerald-500)
```

---

## 🎭 Gradient Recipes

### Background Gradients
```tsx
// Purple to Pink (Primary)
className="bg-gradient-to-br from-purple-600 to-pink-600"

// Purple to Pink (Dark)
className="bg-gradient-to-br from-purple-900 via-slate-900 to-pink-900"

// Slate to Slate (Subtle)
className="bg-gradient-to-br from-slate-800 to-slate-900"

// Multi-stop (Complex)
className="bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900"
```

### Text Gradients
```tsx
className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent"
```

### Button Gradients
```tsx
className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
```

---

## ✨ Shadow & Glow Effects

### Standard Shadows
```tsx
className="shadow-lg"           // Large shadow
className="shadow-xl"           // Extra large
className="shadow-2xl"          // 2X large
```

### Colored Glows
```tsx
className="shadow-lg shadow-purple-500/50"   // Purple glow
className="shadow-lg shadow-pink-500/50"     // Pink glow
className="shadow-lg shadow-blue-500/50"     // Blue glow
className="shadow-2xl shadow-purple-500/20"  // Subtle purple glow
```

### Hover Glows
```tsx
className="hover:shadow-2xl hover:shadow-purple-500/20"
```

---

## 🪟 Glassmorphism

### Basic Glass
```tsx
className="bg-slate-800/50 backdrop-blur-sm"
```

### Glass with Border
```tsx
className="bg-slate-800/50 backdrop-blur-sm border border-slate-700"
```

### Navbar Glass
```tsx
className="bg-slate-900/95 backdrop-blur-sm"
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
  hidden: { opacity: 0, scale: 0.8 },
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
className="hover:scale-110 transition-transform"
```

---

## 🎯 Component Patterns

### Card Pattern
```tsx
<div className="bg-gradient-to-br from-slate-800 to-slate-900 p-8 rounded-2xl border border-slate-700 hover:border-purple-500/50 transition-all hover:shadow-2xl hover:shadow-purple-500/20 group">
  {/* Content */}
</div>
```

### Icon Container
```tsx
<div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center shadow-lg shadow-purple-500/50 group-hover:scale-110 transition-transform">
  <Icon className="h-7 w-7 text-white" />
</div>
```

### Button Primary
```tsx
<Button className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 shadow-lg shadow-purple-500/30">
  Click Me
</Button>
```

### Button Secondary
```tsx
<Button variant="outline" className="border-slate-700 hover:bg-slate-800 hover:text-white text-white">
  Click Me
</Button>
```

### Heading with Gradient
```tsx
<h2 className="text-4xl md:text-5xl font-bold text-center mb-4 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
  Heading
</h2>
```

---

## 🌟 Background Decorations

### Gradient Orb
```tsx
<div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl" />
```

### Grid Pattern
```tsx
<div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10" />
```

### Layered Background
```tsx
<section className="relative overflow-hidden">
  <div className="absolute inset-0 bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 opacity-50" />
  <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl" />
  <div className="container relative z-10">
    {/* Content */}
  </div>
</section>
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
className="max-w-2xl mx-auto"   // Narrow content
```

---

## 🎨 Typography Scale

### Headings
```tsx
className="text-4xl md:text-5xl font-bold"  // H1
className="text-3xl md:text-4xl font-bold"  // H2
className="text-2xl font-bold"              // H3
className="text-xl font-semibold"           // H4
```

### Body Text
```tsx
className="text-lg"      // Large body
className="text-base"    // Normal body
className="text-sm"      // Small text
className="text-xs"      // Tiny text
```

---

## 🔧 Utility Combos

### Responsive Grid
```tsx
className="grid gap-8 lg:grid-cols-2"
className="grid sm:grid-cols-2 md:grid-cols-3 gap-6"
```

### Flex Center
```tsx
className="flex items-center justify-center"
className="flex flex-col items-center gap-4"
```

### Transition All
```tsx
className="transition-all duration-300"
className="transition-colors duration-200"
className="transition-transform duration-300"
```

---

## 🎯 Quick Copy-Paste

### Feature Card
```tsx
<div className="bg-gradient-to-br from-slate-800 to-slate-900 p-8 rounded-2xl border border-slate-700 hover:border-purple-500/50 transition-all hover:shadow-2xl hover:shadow-purple-500/20 group">
  <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center mb-6 shadow-lg shadow-purple-500/50 group-hover:scale-110 transition-transform">
    <Icon className="h-7 w-7 text-white" />
  </div>
  <h3 className="text-2xl font-bold mb-4 text-white">Title</h3>
  <p className="text-slate-400">Description</p>
</div>
```

### Animated Section
```tsx
<motion.div
  initial={{ opacity: 0, y: 30 }}
  whileInView={{ opacity: 1, y: 0 }}
  viewport={{ once: true }}
  transition={{ duration: 0.6 }}
>
  {/* Content */}
</motion.div>
```

### CTA Button
```tsx
<Button className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 shadow-2xl shadow-purple-500/50 group">
  Get Started
  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
</Button>
```

---

## 📱 Responsive Breakpoints

```tsx
sm:   640px   // Small devices
md:   768px   // Medium devices
lg:   1024px  // Large devices
xl:   1280px  // Extra large devices
2xl:  1536px  // 2X large devices
```

---

## 🎉 Pro Tips

1. **Always use gradients** for primary elements
2. **Add hover effects** to interactive elements
3. **Use colored shadows** for depth
4. **Animate on scroll** for engagement
5. **Layer backgrounds** for richness
6. **Group hover** for coordinated effects
7. **Viewport once** to prevent re-animation
8. **Stagger children** for list animations

---

This design system creates a **cohesive, premium, modern** look! 🚀
