# Troubleshooting Guide

## Common Issues and Solutions

### 1. "Cannot find module '@/components/animations'"

**Problem**: Import error when trying to use the components.

**Solution**:
```tsx
// Make sure you're using the correct import path
import { SimpleHeroSlideshow } from '@/components/animations';
// OR
import { AnimatedHero } from '@/components/animations';

// If that doesn't work, try the full path:
import { SimpleHeroSlideshow } from '@/components/animations/SimpleHeroSlideshow';
```

---

### 2. "Player is not defined" (AnimatedHero)

**Problem**: Remotion Player not loading correctly.

**Solution**:
```tsx
// Make sure the component is client-side only
'use client';

import { AnimatedHero } from '@/components/animations';
```

---

### 3. Background Images Not Showing

**Problem**: Background images appear as broken links.

**Solution**:
```tsx
// Images must be in the public folder
// ✅ Correct:
backgroundImage: '/images/hero.jpg'  // File at: public/images/hero.jpg

// ❌ Wrong:
backgroundImage: 'images/hero.jpg'   // Missing leading slash
backgroundImage: '../public/images/hero.jpg'  // Don't reference public directly
```

---

### 4. Animations Not Smooth

**Problem**: Choppy or laggy animations.

**Solutions**:

#### For SimpleHeroSlideshow:
```tsx
// Reduce the number of slides
const slides = [...]; // Keep to 3-5 slides max

// Optimize images
// - Use WebP format
// - Compress images
// - Use appropriate sizes (1920x1080 max)
```

#### For AnimatedHero:
```tsx
// Use SimpleHeroSlideshow instead for better performance
// OR reduce the FPS in AnimatedHero.tsx:
const fps = 30; // Change from 60 to 30
```

---

### 5. "Module not found: Can't resolve 'remotion'"

**Problem**: Remotion not installed properly.

**Solution**:
```bash
# Reinstall the packages
npm install remotion @remotion/player
```

---

### 6. "Module not found: Can't resolve 'framer-motion'"

**Problem**: Framer Motion not installed properly.

**Solution**:
```bash
# Reinstall the package
npm install framer-motion
```

---

### 7. Slides Not Auto-Playing

**Problem**: Slideshow doesn't advance automatically.

**Solution**:
```tsx
// Make sure autoplay is enabled
<SimpleHeroSlideshow 
  slides={slides}
  autoplay={true}  // ✅ Explicitly set to true
/>

// Check that you have multiple slides
const slides = [
  { title: 'Slide 1' },
  { title: 'Slide 2' },  // ✅ Need at least 2 slides
];
```

---

### 8. Build Errors with Remotion

**Problem**: Build fails with Remotion-related errors.

**Solution**:
```tsx
// Make sure AnimatedHero is only used in client components
'use client';  // ✅ Add this at the top of your page

// If still having issues, use SimpleHeroSlideshow instead
import { SimpleHeroSlideshow } from '@/components/animations';
```

---

### 9. TypeScript Errors

**Problem**: TypeScript complains about slide properties.

**Solution**:
```tsx
// Import the types
import { SimpleSlide } from '@/components/animations';

// Use the type
const slides: SimpleSlide[] = [
  {
    title: 'Welcome',  // ✅ Required
    subtitle: 'Optional',  // ❌ Optional
    // ... other optional fields
  },
];
```

---

### 10. Gradient Backgrounds Not Working

**Problem**: CSS gradients not displaying in backgroundColor.

**Solution**:
```tsx
// For SimpleHeroSlideshow, gradients work in backgroundColor:
{
  backgroundColor: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
}

// For AnimatedHero, use backgroundImage instead:
{
  backgroundImage: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
}
```

---

### 11. Slow Page Load Times

**Problem**: Page loads slowly with AnimatedHero.

**Solutions**:

1. **Use SimpleHeroSlideshow instead** (recommended)
```tsx
import { SimpleHeroSlideshow } from '@/components/animations';
```

2. **Lazy load AnimatedHero**
```tsx
import dynamic from 'next/dynamic';

const AnimatedHero = dynamic(
  () => import('@/components/animations').then(mod => mod.AnimatedHero),
  { ssr: false }
);
```

3. **Optimize images**
- Use WebP format
- Compress images
- Use next/image for optimization

---

### 12. CTA Buttons Not Clickable

**Problem**: Call-to-action buttons don't work.

**Solution**:
```tsx
// Make sure you're providing a valid link
{
  ctaText: 'Get Started',
  ctaLink: '/signup',  // ✅ Valid internal link
}

// For external links:
{
  ctaLink: 'https://example.com',  // ✅ Full URL
}
```

---

### 13. Responsive Issues on Mobile

**Problem**: Hero looks bad on mobile devices.

**Solution**:
```tsx
// Add responsive classes
<SimpleHeroSlideshow 
  slides={slides}
  className="min-h-[400px] md:min-h-[600px]"
/>

// Adjust text in slides for mobile
{
  title: 'Short Title',  // ✅ Keep titles concise
  description: 'Brief description',  // ✅ Keep descriptions short
}
```

---

### 14. Slide Indicators Not Showing

**Problem**: Dots at the bottom don't appear.

**Solution**:
```tsx
// Make sure you have multiple slides
const slides = [
  { title: 'Slide 1' },
  { title: 'Slide 2' },  // ✅ Need 2+ slides for indicators
];

// Indicators only show in SimpleHeroSlideshow
// AnimatedHero doesn't have indicators by default
```

---

### 15. Custom Styling Not Applied

**Problem**: className prop doesn't work.

**Solution**:
```tsx
// Make sure Tailwind classes are not being purged
<SimpleHeroSlideshow 
  slides={slides}
  className="rounded-lg shadow-2xl"  // ✅ Use standard Tailwind classes
/>

// For custom CSS, use a wrapper:
<div className="my-custom-wrapper">
  <SimpleHeroSlideshow slides={slides} />
</div>
```

---

## Performance Optimization Tips

### 1. Image Optimization
```bash
# Use WebP format
# Compress images to < 200KB
# Use appropriate dimensions (1920x1080 for hero images)
```

### 2. Reduce Slide Count
```tsx
// Keep to 3-5 slides maximum
const slides = [
  // ... max 5 slides
];
```

### 3. Adjust Animation Duration
```tsx
// SimpleHeroSlideshow
<SimpleHeroSlideshow 
  interval={7000}  // Longer intervals = less frequent animations
/>
```

### 4. Use SimpleHeroSlideshow for Most Pages
```tsx
// Better performance, smaller bundle
import { SimpleHeroSlideshow } from '@/components/animations';
```

---

## Still Having Issues?

1. Check the console for error messages
2. Verify all imports are correct
3. Make sure images exist in the public folder
4. Try using SimpleHeroSlideshow instead of AnimatedHero
5. Check that you have 'use client' at the top of your component
6. Verify your Next.js version is compatible (16.0.8+)

---

## Getting Help

- Review `QUICKSTART.md` for basic usage
- Check `README.md` for detailed documentation
- See `COMPARISON.md` to choose the right component
- Look at `AnimatedHero.example.tsx` for working examples
- Visit `/animation-demo` for a live demo
