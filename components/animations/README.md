# Animated Hero Component

A beautiful, animated hero slideshow component built with Remotion for creating stunning hero sections with smooth transitions and spring animations.

## Features

- ✨ **Smooth Animations**: Spring-based animations for natural, fluid motion
- 🎬 **Multiple Slides**: Support for unlimited slides with auto-rotation
- 🎨 **Customizable**: Full control over colors, images, and content
- 📱 **Responsive**: Automatically adapts to different screen sizes
- 🔄 **Auto-play & Loop**: Configurable autoplay and looping
- 🎯 **Call-to-Action**: Built-in CTA buttons with hover effects
- 🖼️ **Background Images**: Support for background images with zoom effects
- 🌈 **Gradient Overlays**: Automatic darkening for better text readability

## Installation

The component uses Remotion, which has already been installed:

```bash
npm install remotion @remotion/player
```

## Basic Usage

```tsx
import { AnimatedHero, Slide } from '@/components/animations/AnimatedHero';

const slides: Slide[] = [
  {
    title: 'Welcome',
    subtitle: 'Your Subtitle',
    description: 'Your description here',
    backgroundColor: '#1a1a2e',
    ctaText: 'Get Started',
    ctaLink: '/signup',
  },
];

export default function Page() {
  return <AnimatedHero slides={slides} />;
}
```

## Props

### AnimatedHeroProps

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `slides` | `Slide[]` | **required** | Array of slide configurations |
| `autoplay` | `boolean` | `true` | Whether to auto-play the slideshow |
| `loop` | `boolean` | `true` | Whether to loop the slideshow |
| `className` | `string` | `''` | Additional CSS classes |

### Slide

| Property | Type | Required | Description |
|----------|------|----------|-------------|
| `title` | `string` | ✅ | Main heading text |
| `subtitle` | `string` | ❌ | Secondary heading text |
| `description` | `string` | ❌ | Descriptive paragraph |
| `backgroundImage` | `string` | ❌ | URL to background image |
| `backgroundColor` | `string` | ❌ | Fallback background color |
| `ctaText` | `string` | ❌ | Call-to-action button text |
| `ctaLink` | `string` | ❌ | Call-to-action button link |

## Examples

### Simple Hero

```tsx
const slides: Slide[] = [
  {
    title: 'Simple Hero',
    backgroundColor: '#2563eb',
  },
];

<AnimatedHero slides={slides} />
```

### With Background Images

```tsx
const slides: Slide[] = [
  {
    title: 'Beautiful Backgrounds',
    subtitle: 'Stunning Visuals',
    backgroundImage: '/images/hero-bg.jpg',
    ctaText: 'Explore',
    ctaLink: '/explore',
  },
];

<AnimatedHero slides={slides} />
```

### Multiple Slides

```tsx
const slides: Slide[] = [
  {
    title: 'Slide 1',
    subtitle: 'First Slide',
    backgroundColor: '#1a1a2e',
  },
  {
    title: 'Slide 2',
    subtitle: 'Second Slide',
    backgroundColor: '#16213e',
  },
  {
    title: 'Slide 3',
    subtitle: 'Third Slide',
    backgroundColor: '#0f3460',
  },
];

<AnimatedHero slides={slides} autoplay loop />
```

## Animation Details

Each slide features:

1. **Title Animation**: Fades in and slides up with spring physics
2. **Subtitle Animation**: Follows title with slight delay
3. **Description Animation**: Appears after subtitle
4. **CTA Animation**: Button animates last for emphasis
5. **Background Zoom**: Subtle zoom effect on background images
6. **Fade Transition**: Smooth fade out before next slide

Each slide displays for **5 seconds** by default (configurable in the component).

## Customization

### Changing Slide Duration

Edit the `slideDuration` constant in `AnimatedHero.tsx`:

```tsx
const slideDuration = 5; // Change to desired seconds
```

### Custom Styling

Add custom classes via the `className` prop:

```tsx
<AnimatedHero 
  slides={slides} 
  className="rounded-lg shadow-2xl max-w-6xl mx-auto"
/>
```

### Adjusting Animation Speed

Modify the spring config in `AnimatedHero.tsx`:

```tsx
const titleSpring = spring({
  frame: localFrame,
  fps,
  config: {
    damping: 100, // Lower = more bouncy, Higher = more stiff
  },
});
```

## Performance Notes

- The component uses Remotion's Player for smooth 60fps animations
- Background images are optimized with CSS transforms
- Spring animations use GPU acceleration
- Each slide is only rendered when active

## Browser Compatibility

Works in all modern browsers that support:
- CSS transforms
- CSS animations
- ES6+ JavaScript

## Tips

1. **Image Optimization**: Use optimized images (WebP format recommended)
2. **Contrast**: Ensure text has good contrast against backgrounds
3. **Mobile**: Test on mobile devices for responsive behavior
4. **Content Length**: Keep titles concise for better visual impact
5. **CTA Placement**: Use CTAs strategically on key slides

## See Also

- [Remotion Documentation](https://www.remotion.dev/)
- [Remotion Player API](https://www.remotion.dev/docs/player)
- Example usage: `AnimatedHero.example.tsx`
