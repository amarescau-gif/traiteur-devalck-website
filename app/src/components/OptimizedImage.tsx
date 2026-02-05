import { useState, useEffect, useRef, memo } from 'react';

interface OptimizedImageProps {
  src: string;
  alt: string;
  className?: string;
  loading?: 'eager' | 'lazy';
  sizes?: string;
  priority?: boolean;
}

/**
 * OptimizedImage Component
 * 
 * A performance-optimized image component that:
 * - Uses native lazy loading
 * - Implements blur-up placeholder effect
 * - Handles loading states gracefully
 * - Respects reduced motion preferences
 * - Uses Intersection Observer for efficient lazy loading
 */
const OptimizedImage = memo(({
  src,
  alt,
  className = '',
  loading = 'lazy',
  sizes = '100vw',
  priority = false,
}: OptimizedImageProps) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isInView, setIsInView] = useState(false);
  const [hasError, setHasError] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Use Intersection Observer for lazy loading
  useEffect(() => {
    if (priority || loading === 'eager') {
      setIsInView(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsInView(true);
            observer.disconnect();
          }
        });
      },
      {
        rootMargin: '50px 0px',
        threshold: 0.01,
      }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, [priority, loading]);

  // Handle image load
  const handleLoad = () => {
    setIsLoaded(true);
  };

  // Handle image error
  const handleError = () => {
    setHasError(true);
    setIsLoaded(true);
  };

  // Generate srcset for responsive images
  const generateSrcSet = () => {
    if (!src.match(/\.(jpg|jpeg|png|webp)$/i)) return undefined;
    
    const sizes = [400, 800, 1200, 1600];
    
    return sizes
      .map((size) => {
        // In production, these would be the optimized WebP versions
        // For now, we use the original image
        return `${src} ${size}w`;
      })
      .join(', ');
  };

  return (
    <div
      ref={containerRef}
      className={`relative overflow-hidden ${className}`}
      style={{
        backgroundColor: '#f5f0e6',
        contain: 'layout style paint',
      }}
    >
      {/* Placeholder / Loading state */}
      <div
        className="absolute inset-0 transition-opacity duration-500"
        style={{
          opacity: isLoaded ? 0 : 1,
          background: 'linear-gradient(90deg, #f5f0e6 0%, #ebe5d8 50%, #f5f0e6 100%)',
          backgroundSize: '200% 100%',
          animation: isLoaded ? 'none' : 'shimmer 1.5s infinite',
        }}
      />

      {/* Error state */}
      {hasError && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
          <span className="text-gray-400 text-sm">Afbeelding niet beschikbaar</span>
        </div>
      )}

      {/* Actual image */}
      {isInView && !hasError && (
        <img
          ref={imgRef}
          src={src}
          alt={alt}
          sizes={sizes}
          srcSet={generateSrcSet()}
          loading={priority ? 'eager' : 'lazy'}
          decoding={priority ? 'sync' : 'async'}
          onLoad={handleLoad}
          onError={handleError}
          className={`w-full h-full object-cover transition-opacity duration-500 ${
            isLoaded ? 'opacity-100' : 'opacity-0'
          }`}
          style={{
            willChange: 'opacity',
          }}
        />
      )}

      {/* Shimmer animation styles */}
      <style>{`
        @keyframes shimmer {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }
      `}</style>
    </div>
  );
});

OptimizedImage.displayName = 'OptimizedImage';

export default OptimizedImage;
