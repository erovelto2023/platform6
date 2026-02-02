'use client';

import { SimpleHeroSlideshow } from '@/components/animations';

// Demo slides for the hero slideshow
const demoSlides = [
    {
        title: '🎬 Animations Installed!',
        subtitle: 'Remotion & Framer Motion Ready',
        description: 'Create stunning hero sections with smooth, professional animations',
        backgroundColor: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        ctaText: 'View Documentation',
        ctaLink: '#docs',
    },
    {
        title: '✨ Two Components Available',
        subtitle: 'Choose Your Style',
        description: 'AnimatedHero for video-quality or SimpleHeroSlideshow for lightweight animations',
        backgroundColor: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
        ctaText: 'See Examples',
        ctaLink: '#examples',
    },
    {
        title: '🚀 Ready to Use',
        subtitle: 'Start Building Now',
        description: 'Import, configure, and deploy beautiful hero sections in minutes',
        backgroundColor: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
        ctaText: 'Get Started',
        ctaLink: '#start',
    },
];

export default function AnimationDemoPage() {
    return (
        <div className="min-h-screen bg-gray-50">
            {/* Hero Slideshow */}
            <SimpleHeroSlideshow
                slides={demoSlides}
                autoplay={true}
                interval={5000}
            />

            {/* Documentation Section */}
            <div id="docs" className="container mx-auto px-4 py-16">
                <h2 className="text-4xl font-bold text-center mb-12">Installation Complete! 🎉</h2>

                <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
                    {/* AnimatedHero Card */}
                    <div className="bg-white rounded-lg shadow-lg p-8">
                        <h3 className="text-2xl font-bold mb-4 text-purple-600">AnimatedHero</h3>
                        <p className="text-gray-600 mb-4">
                            Professional video-quality animations powered by Remotion
                        </p>
                        <ul className="space-y-2 mb-6">
                            <li className="flex items-start">
                                <span className="text-green-500 mr-2">✓</span>
                                <span>Video-quality animations at 60fps</span>
                            </li>
                            <li className="flex items-start">
                                <span className="text-green-500 mr-2">✓</span>
                                <span>Precise timing control</span>
                            </li>
                            <li className="flex items-start">
                                <span className="text-green-500 mr-2">✓</span>
                                <span>Spring-based physics</span>
                            </li>
                            <li className="flex items-start">
                                <span className="text-green-500 mr-2">✓</span>
                                <span>Best for landing pages</span>
                            </li>
                        </ul>
                        <div className="bg-gray-900 text-green-400 p-4 rounded font-mono text-sm overflow-x-auto">
                            <code>{`import { AnimatedHero } from '@/components/animations';

<AnimatedHero slides={slides} />`}</code>
                        </div>
                    </div>

                    {/* SimpleHeroSlideshow Card */}
                    <div className="bg-white rounded-lg shadow-lg p-8">
                        <h3 className="text-2xl font-bold mb-4 text-blue-600">SimpleHeroSlideshow</h3>
                        <p className="text-gray-600 mb-4">
                            Lightweight animations powered by Framer Motion
                        </p>
                        <ul className="space-y-2 mb-6">
                            <li className="flex items-start">
                                <span className="text-green-500 mr-2">✓</span>
                                <span>Lightweight & fast</span>
                            </li>
                            <li className="flex items-start">
                                <span className="text-green-500 mr-2">✓</span>
                                <span>Easy Tailwind integration</span>
                            </li>
                            <li className="flex items-start">
                                <span className="text-green-500 mr-2">✓</span>
                                <span>Smooth transitions</span>
                            </li>
                            <li className="flex items-start">
                                <span className="text-green-500 mr-2">✓</span>
                                <span>Best for all pages</span>
                            </li>
                        </ul>
                        <div className="bg-gray-900 text-green-400 p-4 rounded font-mono text-sm overflow-x-auto">
                            <code>{`import { SimpleHeroSlideshow } from '@/components/animations';

<SimpleHeroSlideshow slides={slides} />`}</code>
                        </div>
                    </div>
                </div>
            </div>

            {/* Quick Start Section */}
            <div id="start" className="bg-gradient-to-r from-purple-600 to-blue-600 text-white py-16">
                <div className="container mx-auto px-4 text-center">
                    <h2 className="text-4xl font-bold mb-6">Quick Start</h2>
                    <p className="text-xl mb-8 max-w-2xl mx-auto">
                        Both components are installed and ready to use. Check out the documentation to get started!
                    </p>
                    <div className="flex flex-wrap justify-center gap-4">
                        <a
                            href="/components/animations/QUICKSTART.md"
                            className="px-8 py-4 bg-white text-purple-600 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
                        >
                            📖 Quick Start Guide
                        </a>
                        <a
                            href="/components/animations/README.md"
                            className="px-8 py-4 bg-purple-800 text-white rounded-lg font-semibold hover:bg-purple-900 transition-colors"
                        >
                            📚 Full Documentation
                        </a>
                    </div>
                </div>
            </div>

            {/* Features Grid */}
            <div id="examples" className="container mx-auto px-4 py-16">
                <h2 className="text-4xl font-bold text-center mb-12">Features</h2>

                <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
                    <div className="text-center">
                        <div className="text-5xl mb-4">🎨</div>
                        <h3 className="text-xl font-bold mb-2">Customizable</h3>
                        <p className="text-gray-600">
                            Full control over colors, images, and content
                        </p>
                    </div>

                    <div className="text-center">
                        <div className="text-5xl mb-4">📱</div>
                        <h3 className="text-xl font-bold mb-2">Responsive</h3>
                        <p className="text-gray-600">
                            Looks great on all screen sizes
                        </p>
                    </div>

                    <div className="text-center">
                        <div className="text-5xl mb-4">⚡</div>
                        <h3 className="text-xl font-bold mb-2">Performant</h3>
                        <p className="text-gray-600">
                            Optimized for smooth animations
                        </p>
                    </div>

                    <div className="text-center">
                        <div className="text-5xl mb-4">🔄</div>
                        <h3 className="text-xl font-bold mb-2">Auto-play</h3>
                        <p className="text-gray-600">
                            Configurable autoplay and looping
                        </p>
                    </div>

                    <div className="text-center">
                        <div className="text-5xl mb-4">🖼️</div>
                        <h3 className="text-xl font-bold mb-2">Images</h3>
                        <p className="text-gray-600">
                            Support for background images with zoom
                        </p>
                    </div>

                    <div className="text-center">
                        <div className="text-5xl mb-4">🎯</div>
                        <h3 className="text-xl font-bold mb-2">CTAs</h3>
                        <p className="text-gray-600">
                            Built-in call-to-action buttons
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
