# Quick Start Guide - Animated Heroes

## Installation Complete! ✅

You now have two animation components available:

1. **AnimatedHero** - Remotion-based (professional video-quality animations)
2. **SimpleHeroSlideshow** - Framer Motion-based (lightweight, faster)

## Which One Should I Use?

### Use **AnimatedHero** when:
- You want professional, video-quality animations
- You need precise control over animation timing
- You're creating a landing page or marketing site
- Performance is not a critical concern

### Use **SimpleHeroSlideshow** when:
- You want quick, lightweight animations
- You need better performance
- You're building internal pages or dashboards
- You want easier customization with Tailwind CSS

## Quick Start Examples

### Option 1: Simple Hero (Recommended for most cases)

```tsx
import { SimpleHeroSlideshow } from '@/components/animations';

const slides = [
  {
    title: 'Welcome to Our Platform',
    subtitle: 'Transform Your Business',
    description: 'Discover powerful tools and resources',
    backgroundColor: '#1a1a2e',
    ctaText: 'Get Started',
    ctaLink: '/signup',
  },
  {
    title: 'Learn & Grow',
    subtitle: 'Expert-Led Courses',
    backgroundColor: '#16213e',
    ctaText: 'Browse Courses',
    ctaLink: '/courses',
  },
];

export default function Page() {
  return (
    <div>
      <SimpleHeroSlideshow slides={slides} />
      {/* Rest of your content */}
    </div>
  );
}
```

### Option 2: Remotion Hero (Professional animations)

```tsx
import { AnimatedHero } from '@/components/animations';

const slides = [
  {
    title: 'Premium Experience',
    subtitle: 'Elevate Your Brand',
    description: 'Create stunning presentations',
    backgroundImage: '/images/hero-1.jpg',
    ctaText: 'Start Free Trial',
    ctaLink: '/trial',
  },
];

export default function Page() {
  return <AnimatedHero slides={slides} />;
}
```

## Adding Background Images

1. Place your images in `public/images/`
2. Reference them in your slides:

```tsx
const slides = [
  {
    title: 'Beautiful Backgrounds',
    backgroundImage: '/images/hero-bg.jpg',
    // ...
  },
];
```

## Customization Tips

### Change Slide Duration (SimpleHeroSlideshow)

```tsx
<SimpleHeroSlideshow 
  slides={slides} 
  interval={7000}  // 7 seconds per slide
/>
```

### Disable Autoplay

```tsx
<SimpleHeroSlideshow 
  slides={slides} 
  autoplay={false}
/>
```

### Add Custom Styling

```tsx
<SimpleHeroSlideshow 
  slides={slides} 
  className="rounded-lg shadow-2xl max-w-7xl mx-auto"
/>
```

## Common Use Cases

### 1. Landing Page Hero

```tsx
const landingSlides = [
  {
    title: 'Transform Your Business',
    subtitle: 'All-in-One Platform',
    description: 'Everything you need to succeed',
    backgroundImage: '/images/landing-hero.jpg',
    ctaText: 'Start Free Trial',
    ctaLink: '/signup',
  },
];
```

### 2. Product Showcase

```tsx
const productSlides = [
  {
    title: 'Feature 1',
    subtitle: 'Powerful Analytics',
    backgroundImage: '/images/feature-1.jpg',
  },
  {
    title: 'Feature 2',
    subtitle: 'Real-time Collaboration',
    backgroundImage: '/images/feature-2.jpg',
  },
  {
    title: 'Feature 3',
    subtitle: 'Advanced Security',
    backgroundImage: '/images/feature-3.jpg',
  },
];
```

### 3. Course/Book Promotion

```tsx
const courseSlides = [
  {
    title: 'Master Web Development',
    subtitle: 'From Zero to Hero',
    description: 'Learn HTML, CSS, JavaScript, React, and more',
    backgroundColor: '#2563eb',
    ctaText: 'Enroll Now',
    ctaLink: '/courses/web-dev',
  },
];
```

## Next Steps

1. ✅ Components are installed and ready
2. 📝 Create your slide content
3. 🎨 Add background images (optional)
4. 🚀 Import and use in your pages

## Need Help?

- See `README.md` for full documentation
- Check `AnimatedHero.example.tsx` for more examples
- Both components are fully typed with TypeScript

## Performance Tips

- Optimize images (use WebP format)
- Keep slide count reasonable (3-5 slides)
- Use `SimpleHeroSlideshow` for better performance
- Lazy load hero components on slower pages

Happy animating! 🎉
