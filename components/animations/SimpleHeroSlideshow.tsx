'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface SimpleSlide {
    title: string;
    subtitle?: string;
    description?: string;
    backgroundImage?: string;
    backgroundColor?: string;
    ctaText?: string;
    ctaLink?: string;
}

interface SimpleHeroSlideshowProps {
    slides: SimpleSlide[];
    autoplay?: boolean;
    interval?: number; // milliseconds
    className?: string;
}

export const SimpleHeroSlideshow: React.FC<SimpleHeroSlideshowProps> = ({
    slides,
    autoplay = true,
    interval = 5000,
    className = '',
}) => {
    const [currentSlide, setCurrentSlide] = useState(0);

    useEffect(() => {
        if (!autoplay || slides.length <= 1) return;

        const timer = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % slides.length);
        }, interval);

        return () => clearInterval(timer);
    }, [autoplay, interval, slides.length]);

    const slide = slides[currentSlide];

    return (
        <div className={`relative w-full overflow-hidden ${className}`}>
            <AnimatePresence mode="wait">
                <motion.div
                    key={currentSlide}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.5 }}
                    className="relative w-full h-full"
                    style={{
                        backgroundColor: slide.backgroundColor || '#000',
                    }}
                >
                    {/* Background Image with Zoom */}
                    {slide.backgroundImage && (
                        <motion.div
                            initial={{ scale: 1 }}
                            animate={{ scale: 1.1 }}
                            transition={{ duration: interval / 1000, ease: 'linear' }}
                            className="absolute inset-0 w-full h-full"
                            style={{
                                backgroundImage: `url(${slide.backgroundImage})`,
                                backgroundSize: 'cover',
                                backgroundPosition: 'center',
                                filter: 'brightness(0.6)',
                            }}
                        />
                    )}

                    {/* Content */}
                    <div className="relative z-10 flex flex-col items-center justify-center h-full px-4 py-16 text-center min-h-[500px]">
                        {/* Title */}
                        <motion.h1
                            initial={{ y: 50, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.2, duration: 0.6, type: 'spring', damping: 20 }}
                            className="text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-4"
                            style={{ textShadow: '0 4px 6px rgba(0, 0, 0, 0.3)' }}
                        >
                            {slide.title}
                        </motion.h1>

                        {/* Subtitle */}
                        {slide.subtitle && (
                            <motion.h2
                                initial={{ y: 50, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ delay: 0.4, duration: 0.6, type: 'spring', damping: 20 }}
                                className="text-2xl md:text-3xl lg:text-4xl font-semibold text-white/90 mb-6"
                                style={{ textShadow: '0 2px 4px rgba(0, 0, 0, 0.3)' }}
                            >
                                {slide.subtitle}
                            </motion.h2>
                        )}

                        {/* Description */}
                        {slide.description && (
                            <motion.p
                                initial={{ y: 50, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ delay: 0.6, duration: 0.6, type: 'spring', damping: 20 }}
                                className="text-lg md:text-xl text-white/80 max-w-3xl mb-8"
                                style={{ textShadow: '0 2px 4px rgba(0, 0, 0, 0.3)' }}
                            >
                                {slide.description}
                            </motion.p>
                        )}

                        {/* CTA Button */}
                        {slide.ctaText && (
                            <motion.a
                                href={slide.ctaLink || '#'}
                                initial={{ y: 50, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ delay: 0.8, duration: 0.6, type: 'spring', damping: 20 }}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className="px-8 py-4 text-lg font-semibold text-white bg-blue-600 rounded-lg shadow-lg hover:bg-blue-700 transition-colors"
                            >
                                {slide.ctaText}
                            </motion.a>
                        )}
                    </div>

                    {/* Slide Indicators */}
                    {slides.length > 1 && (
                        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex gap-2 z-20">
                            {slides.map((_, index) => (
                                <button
                                    key={index}
                                    onClick={() => setCurrentSlide(index)}
                                    className={`w-3 h-3 rounded-full transition-all ${index === currentSlide
                                            ? 'bg-white w-8'
                                            : 'bg-white/50 hover:bg-white/75'
                                        }`}
                                    aria-label={`Go to slide ${index + 1}`}
                                />
                            ))}
                        </div>
                    )}
                </motion.div>
            </AnimatePresence>
        </div>
    );
};

export type { SimpleSlide, SimpleHeroSlideshowProps };
