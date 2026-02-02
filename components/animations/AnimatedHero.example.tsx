import { AnimatedHero, Slide } from '@/components/animations/AnimatedHero';

// Example usage of the AnimatedHero component

// Define your slides
const heroSlides: Slide[] = [
    {
        title: 'Welcome to Our Platform',
        subtitle: 'Transform Your Business',
        description: 'Discover powerful tools and resources to grow your business',
        backgroundColor: '#1a1a2e',
        backgroundImage: '/images/hero-1.jpg', // Optional: Add your image path
        ctaText: 'Get Started',
        ctaLink: '/signup',
    },
    {
        title: 'Learn & Grow',
        subtitle: 'Expert-Led Courses',
        description: 'Access hundreds of courses taught by industry professionals',
        backgroundColor: '#16213e',
        backgroundImage: '/images/hero-2.jpg',
        ctaText: 'Browse Courses',
        ctaLink: '/courses',
    },
    {
        title: 'Join Our Community',
        subtitle: 'Connect & Collaborate',
        description: 'Network with thousands of like-minded professionals',
        backgroundColor: '#0f3460',
        backgroundImage: '/images/hero-3.jpg',
        ctaText: 'Join Now',
        ctaLink: '/community',
    },
];

// Use in your page component
export default function HomePage() {
    return (
        <div>
            <AnimatedHero
                slides={heroSlides}
                autoplay={true}
                loop={true}
                className="mb-8"
            />

            {/* Rest of your page content */}
            <div className="container mx-auto px-4">
                <h2>Your Content Here</h2>
            </div>
        </div>
    );
}

// Alternative: Simple usage with minimal configuration
export function SimpleHeroExample() {
    const simpleSlides: Slide[] = [
        {
            title: 'Simple Hero',
            subtitle: 'Clean & Minimal',
            backgroundColor: '#2563eb',
            ctaText: 'Learn More',
            ctaLink: '#',
        },
        {
            title: 'Another Slide',
            subtitle: 'Beautiful Animations',
            backgroundColor: '#7c3aed',
            ctaText: 'Explore',
            ctaLink: '#',
        },
    ];

    return <AnimatedHero slides={simpleSlides} />;
}

// Advanced: Custom styling and configuration
export function AdvancedHeroExample() {
    const advancedSlides: Slide[] = [
        {
            title: 'Premium Experience',
            subtitle: 'Elevate Your Brand',
            description: 'Create stunning presentations with smooth animations',
            backgroundImage: 'https://images.unsplash.com/photo-1557804506-669a67965ba0',
            ctaText: 'Start Free Trial',
            ctaLink: '/trial',
        },
        {
            title: 'Powerful Features',
            subtitle: 'Everything You Need',
            description: 'Built with Remotion for smooth, professional animations',
            backgroundImage: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c',
            ctaText: 'View Features',
            ctaLink: '/features',
        },
    ];

    return (
        <AnimatedHero
            slides={advancedSlides}
            autoplay={true}
            loop={true}
            className="rounded-lg overflow-hidden shadow-2xl"
        />
    );
}
