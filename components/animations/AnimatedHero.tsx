'use client';

import { Player } from '@remotion/player';
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { useMemo } from 'react';

interface Slide {
  title: string;
  subtitle?: string;
  description?: string;
  backgroundImage?: string;
  backgroundColor?: string;
  ctaText?: string;
  ctaLink?: string;
}

interface AnimatedHeroProps {
  slides: Slide[];
  autoplay?: boolean;
  loop?: boolean;
  className?: string;
}

// Individual slide composition
const SlideComposition: React.FC<{ slide: Slide; index: number; totalSlides: number }> = ({ 
  slide, 
  index, 
  totalSlides 
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  
  // Duration per slide in frames (5 seconds per slide)
  const slideDuration = 5 * fps;
  const slideStartFrame = index * slideDuration;
  const slideEndFrame = (index + 1) * slideDuration;
  
  // Only animate when this slide is active
  const isActive = frame >= slideStartFrame && frame < slideEndFrame;
  const localFrame = frame - slideStartFrame;
  
  // Entrance animations
  const titleSpring = spring({
    frame: localFrame,
    fps,
    config: {
      damping: 100,
    },
  });
  
  const subtitleSpring = spring({
    frame: localFrame - 10,
    fps,
    config: {
      damping: 100,
    },
  });
  
  const descriptionSpring = spring({
    frame: localFrame - 20,
    fps,
    config: {
      damping: 100,
    },
  });
  
  const ctaSpring = spring({
    frame: localFrame - 30,
    fps,
    config: {
      damping: 100,
    },
  });
  
  // Fade out animation near the end
  const fadeOut = interpolate(
    localFrame,
    [slideDuration - 30, slideDuration],
    [1, 0],
    {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
    }
  );
  
  // Background zoom effect
  const scale = interpolate(
    localFrame,
    [0, slideDuration],
    [1, 1.1],
    {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
    }
  );
  
  if (!isActive) return null;
  
  return (
    <AbsoluteFill
      style={{
        backgroundColor: slide.backgroundColor || '#000',
        opacity: fadeOut,
      }}
    >
      {/* Background Image */}
      {slide.backgroundImage && (
        <div
          style={{
            position: 'absolute',
            width: '100%',
            height: '100%',
            backgroundImage: `url(${slide.backgroundImage})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            transform: `scale(${scale})`,
            filter: 'brightness(0.6)',
          }}
        />
      )}
      
      {/* Content */}
      <AbsoluteFill
        style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          padding: '2rem',
          textAlign: 'center',
          zIndex: 1,
        }}
      >
        {/* Title */}
        <h1
          style={{
            fontSize: '4rem',
            fontWeight: 'bold',
            color: 'white',
            marginBottom: '1rem',
            opacity: titleSpring,
            transform: `translateY(${(1 - titleSpring) * 50}px)`,
            textShadow: '0 4px 6px rgba(0, 0, 0, 0.3)',
          }}
        >
          {slide.title}
        </h1>
        
        {/* Subtitle */}
        {slide.subtitle && (
          <h2
            style={{
              fontSize: '2rem',
              fontWeight: '600',
              color: 'rgba(255, 255, 255, 0.9)',
              marginBottom: '1.5rem',
              opacity: subtitleSpring,
              transform: `translateY(${(1 - subtitleSpring) * 50}px)`,
              textShadow: '0 2px 4px rgba(0, 0, 0, 0.3)',
            }}
          >
            {slide.subtitle}
          </h2>
        )}
        
        {/* Description */}
        {slide.description && (
          <p
            style={{
              fontSize: '1.25rem',
              color: 'rgba(255, 255, 255, 0.8)',
              maxWidth: '800px',
              marginBottom: '2rem',
              opacity: descriptionSpring,
              transform: `translateY(${(1 - descriptionSpring) * 50}px)`,
              textShadow: '0 2px 4px rgba(0, 0, 0, 0.3)',
            }}
          >
            {slide.description}
          </p>
        )}
        
        {/* CTA Button */}
        {slide.ctaText && (
          <a
            href={slide.ctaLink || '#'}
            style={{
              padding: '1rem 2rem',
              fontSize: '1.125rem',
              fontWeight: '600',
              color: 'white',
              backgroundColor: 'rgba(59, 130, 246, 0.9)',
              borderRadius: '0.5rem',
              textDecoration: 'none',
              opacity: ctaSpring,
              transform: `translateY(${(1 - ctaSpring) * 50}px)`,
              boxShadow: '0 4px 6px rgba(0, 0, 0, 0.3)',
              transition: 'all 0.3s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = 'rgba(59, 130, 246, 1)';
              e.currentTarget.style.transform = 'scale(1.05)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'rgba(59, 130, 246, 0.9)';
              e.currentTarget.style.transform = 'scale(1)';
            }}
          >
            {slide.ctaText}
          </a>
        )}
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// Main slideshow composition
const SlideshowComposition: React.FC<{ slides: Slide[] }> = ({ slides }) => {
  return (
    <AbsoluteFill>
      {slides.map((slide, index) => (
        <SlideComposition
          key={index}
          slide={slide}
          index={index}
          totalSlides={slides.length}
        />
      ))}
    </AbsoluteFill>
  );
};

// Player wrapper component
export const AnimatedHero: React.FC<AnimatedHeroProps> = ({ 
  slides, 
  autoplay = true, 
  loop = true,
  className = '' 
}) => {
  const fps = 30;
  const slideDuration = 5; // seconds per slide
  const durationInFrames = slides.length * slideDuration * fps;
  
  const compositionProps = useMemo(() => ({ slides }), [slides]);
  
  return (
    <div className={`w-full ${className}`}>
      <Player
        component={SlideshowComposition}
        inputProps={compositionProps}
        durationInFrames={durationInFrames}
        compositionWidth={1920}
        compositionHeight={1080}
        fps={fps}
        style={{
          width: '100%',
          aspectRatio: '16/9',
        }}
        controls={false}
        autoPlay={autoplay}
        loop={loop}
      />
    </div>
  );
};

export type { Slide, AnimatedHeroProps };
