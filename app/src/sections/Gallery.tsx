import { useEffect, useRef, useState, useCallback, memo } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { X, ZoomIn, ChevronLeft, ChevronRight } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

interface GalleryImage {
  src: string;
  alt: string;
  category: string;
}

const galleryImages: GalleryImage[] = [
  { src: '/images/hero-meat.jpg', alt: 'Premium T-bone steak', category: 'Vlees' },
  { src: '/images/bbq-flames.jpg', alt: 'BBQ met vlammen', category: 'BBQ' },
  { src: '/images/charcuterie-board.jpg', alt: 'Charcuterie plank', category: 'Charcuterie' },
  { src: '/images/fresh-salad.jpg', alt: 'Verse salade', category: 'Salades' },
  { src: '/images/meat-display.jpg', alt: 'Vlees display', category: 'Winkel' },
  { src: '/images/butcher-cutting.jpg', alt: 'Slager aan het werk', category: 'Ambacht' },
  { src: '/images/catering-buffet.jpg', alt: 'Catering buffet', category: 'Feesten' },
  { src: '/images/ribeye-steak.jpg', alt: 'Ribeye steak', category: 'Vlees' },
  { src: '/images/bbq-catering.jpg', alt: 'BBQ catering', category: 'BBQ' },
  { src: '/images/flanders-beef.jpg', alt: 'Vlaams rundvlees', category: 'Vlees' },
  { src: '/images/wedding-catering.jpg', alt: 'Trouwfeest catering', category: 'Feesten' },
  { src: '/images/tomahawk-steak.jpg', alt: 'Tomahawk steak', category: 'Vlees' },
];

const categories = ['Alle', ...Array.from(new Set(galleryImages.map((img) => img.category)))];

const Gallery = memo(() => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [selectedImage, setSelectedImage] = useState<number | null>(null);
  const [activeCategory, setActiveCategory] = useState('Alle');
  const triggersRef = useRef<ScrollTrigger[]>([]);

  const filteredImages =
    activeCategory === 'Alle'
      ? galleryImages
      : galleryImages.filter((img) => img.category === activeCategory);

  const openLightbox = useCallback((index: number) => {
    setSelectedImage(index);
    document.body.style.overflow = 'hidden';
  }, []);

  const closeLightbox = useCallback(() => {
    setSelectedImage(null);
    document.body.style.overflow = '';
  }, []);

  const nextImage = useCallback(() => {
    if (selectedImage !== null) {
      setSelectedImage((selectedImage + 1) % filteredImages.length);
    }
  }, [selectedImage, filteredImages.length]);

  const prevImage = useCallback(() => {
    if (selectedImage !== null) {
      setSelectedImage((selectedImage - 1 + filteredImages.length) % filteredImages.length);
    }
  }, [selectedImage, filteredImages.length]);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const isMobile = window.matchMedia('(max-width: 1023px)').matches;
    
    if (prefersReducedMotion || isMobile) {
      // Skip animations on mobile and for reduced motion
      gsap.set(['.gallery-header', '.filter-btn', '.gallery-item'], { opacity: 1, y: 0, scale: 1 });
      return;
    }

    const ctx = gsap.context(() => {
      // Header animation - once only
      const headerTrigger = ScrollTrigger.create({
        trigger: '.gallery-header',
        start: 'top 85%',
        once: true,
        onEnter: () => {
          gsap.fromTo(
            '.gallery-header',
            { y: 40, opacity: 0 },
            { y: 0, opacity: 1, duration: 0.8, ease: 'power2.out' }
          );
        },
      });
      triggersRef.current.push(headerTrigger);

      // Filter buttons animation - once only
      const filterTrigger = ScrollTrigger.create({
        trigger: '.filter-container',
        start: 'top 90%',
        once: true,
        onEnter: () => {
          gsap.fromTo(
            '.filter-btn',
            { y: 15, opacity: 0 },
            { y: 0, opacity: 1, duration: 0.5, stagger: 0.08, ease: 'power2.out' }
          );
        },
      });
      triggersRef.current.push(filterTrigger);

      // Gallery items animation - once only
      const galleryTrigger = ScrollTrigger.create({
        trigger: '.gallery-grid',
        start: 'top 90%',
        once: true,
        onEnter: () => {
          gsap.fromTo(
            '.gallery-item',
            { y: 30, opacity: 0 },
            { y: 0, opacity: 1, duration: 0.6, stagger: 0.1, ease: 'power2.out' }
          );
        },
      });
      triggersRef.current.push(galleryTrigger);
    }, sectionRef);

    return () => {
      triggersRef.current.forEach(trigger => trigger.kill());
      triggersRef.current = [];
      ctx.revert();
    };
  }, []);

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (selectedImage === null) return;
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowRight') nextImage();
      if (e.key === 'ArrowLeft') prevImage();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedImage, closeLightbox, nextImage, prevImage]);

  // Reset scroll on unmount
  useEffect(() => {
    return () => {
      document.body.style.overflow = '';
    };
  }, []);

  return (
    <section
      id="gallery"
      ref={sectionRef}
      className="w-full py-24 lg:py-32 bg-brand-secondary"
    >
      <div className="w-full px-6 lg:px-12 xl:px-24">
        {/* Header */}
        <div className="gallery-header text-center mb-12" style={{ opacity: 0 }}>
          <span className="text-brand-accent font-medium tracking-wider uppercase text-sm">
            Impressies
          </span>
          <h2 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-brand-text mt-4 mb-6">
            Galerij
          </h2>
          <p className="text-lg text-brand-text/70 max-w-2xl mx-auto">
            Graag bieden wij u een blik achter de schermen van onze winkel.
            Vandaag worden 70% van onze bereidingen in huis gemaakt.
          </p>
        </div>

        {/* Filter Buttons */}
        <div className="filter-container flex flex-wrap justify-center gap-3 mb-12">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={`filter-btn px-5 py-2 rounded-full font-medium text-sm transition-all duration-300 ${
                activeCategory === category
                  ? 'bg-brand-primary text-white'
                  : 'bg-white text-brand-text hover:bg-brand-primary/10'
              }`}
              style={{ opacity: 0 }}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Gallery Grid */}
        <div className="gallery-grid grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filteredImages.map((image, index) => (
            <div
              key={`${image.src}-${index}`}
              className="gallery-item group relative aspect-square overflow-hidden rounded-xl cursor-pointer"
              onClick={() => openLightbox(index)}
              style={{ opacity: 0 }}
            >
              <img
                src={image.src}
                alt={image.alt}
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                loading="lazy"
                decoding="async"
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors duration-300" />
              
              {/* Hover Overlay */}
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="w-12 h-12 rounded-full bg-white/90 flex items-center justify-center">
                  <ZoomIn className="w-6 h-6 text-brand-text" />
                </div>
              </div>

              {/* Category Badge */}
              <div className="absolute bottom-3 left-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <span className="px-3 py-1 bg-white/90 backdrop-blur-sm rounded-full text-xs font-medium text-brand-text">
                  {image.category}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="text-center mt-12">
          <a
            href="https://webshop.traiteur-devalck.be/nl/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-8 py-4 bg-brand-primary text-white rounded-full font-medium hover:bg-brand-primary/90 transition-all hover:scale-105"
          >
            Bekijk alle producten
            <ChevronRight className="w-5 h-5" />
          </a>
        </div>
      </div>

      {/* Lightbox */}
      {selectedImage !== null && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center"
          onClick={closeLightbox}
        >
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/95 backdrop-blur-sm" />

          {/* Close Button */}
          <button
            onClick={closeLightbox}
            className="absolute top-6 right-6 z-10 w-12 h-12 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-white/20 transition-colors"
            aria-label="Close lightbox"
          >
            <X className="w-6 h-6" />
          </button>

          {/* Navigation */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              prevImage();
            }}
            className="absolute left-6 top-1/2 -translate-y-1/2 z-10 w-12 h-12 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-white/20 transition-colors"
            aria-label="Previous image"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              nextImage();
            }}
            className="absolute right-6 top-1/2 -translate-y-1/2 z-10 w-12 h-12 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-white/20 transition-colors"
            aria-label="Next image"
          >
            <ChevronRight className="w-6 h-6" />
          </button>

          {/* Image */}
          <div
            className="relative z-10 max-w-5xl max-h-[80vh] mx-4"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={filteredImages[selectedImage].src}
              alt={filteredImages[selectedImage].alt}
              className="max-w-full max-h-[80vh] object-contain rounded-lg"
            />
            <div className="absolute -bottom-12 left-0 right-0 text-center">
              <p className="text-white/80 text-lg">
                {filteredImages[selectedImage].alt}
              </p>
              <p className="text-white/50 text-sm mt-1">
                {selectedImage + 1} / {filteredImages.length}
              </p>
            </div>
          </div>
        </div>
      )}
    </section>
  );
});

Gallery.displayName = 'Gallery';

export default Gallery;
