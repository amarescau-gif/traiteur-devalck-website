import { useEffect, useRef, memo } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ChevronDown } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

// Pre-defined heading words to avoid re-renders
const headingWords = ['Smaak', 'die', 'Generaties', 'Verbindt'];

const Hero = memo(() => {
  const heroRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const triggersRef = useRef<ScrollTrigger[]>([]);

  useEffect(() => {
    // Check for reduced motion preference
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    
    if (prefersReducedMotion) {
      // Skip animations for users who prefer reduced motion
      gsap.set('.hero-word', { y: 0, opacity: 1 });
      gsap.set('.hero-subheading', { y: 0, opacity: 1 });
      gsap.set('.hero-cta', { scale: 1, opacity: 1 });
      gsap.set(imageRef.current, { scale: 1, filter: 'blur(0px)' });
      return;
    }

    const ctx = gsap.context(() => {
      // Initial entrance animation - optimized
      const tl = gsap.timeline({ 
        defaults: { ease: 'power2.out' },
        force3D: true // Force GPU acceleration
      });

      // Image zoom and blur animation - shorter duration
      tl.fromTo(
        imageRef.current,
        { scale: 1.15, filter: 'blur(8px)' },
        { scale: 1, filter: 'blur(0px)', duration: 1.2 }
      );

      // Heading reveal - optimized stagger
      tl.fromTo(
        '.hero-word',
        { y: 60, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, stagger: 0.12 },
        '-=0.6'
      );

      // Subheading fade up
      tl.fromTo(
        '.hero-subheading',
        { y: 15, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8 },
        '-=0.4'
      );

      // CTA button pop
      tl.fromTo(
        '.hero-cta',
        { scale: 0.8, opacity: 0 },
        { scale: 1, opacity: 1, duration: 0.6, ease: 'back.out(1.4)' },
        '-=0.3'
      );

      // Scroll parallax effect - disabled on mobile for native scrolling
      const isDesktop = window.matchMedia('(min-width: 1024px)').matches;
      
      if (isDesktop) {
        const imgTrigger = ScrollTrigger.create({
          trigger: heroRef.current,
          start: 'top top',
          end: 'bottom top',
          scrub: 0.5,
          animation: gsap.to(imageRef.current, {
            y: '20%',
            ease: 'none',
          }),
        });
        triggersRef.current.push(imgTrigger);

        const contentTrigger = ScrollTrigger.create({
          trigger: heroRef.current,
          start: 'top top',
          end: 'bottom top',
          scrub: 0.5,
          animation: gsap.to(contentRef.current, {
            y: '-15%',
            ease: 'none',
          }),
        });
        triggersRef.current.push(contentTrigger);

        const overlayTrigger = ScrollTrigger.create({
          trigger: heroRef.current,
          start: 'top top',
          end: '60% top',
          scrub: 0.5,
          animation: gsap.to('.hero-overlay', {
            opacity: 0.75,
            ease: 'none',
          }),
        });
        triggersRef.current.push(overlayTrigger);
      }
    }, heroRef);

    return () => {
      // Clean up only our triggers
      triggersRef.current.forEach(trigger => trigger.kill());
      triggersRef.current = [];
      ctx.revert();
    };
  }, []);

  const scrollToAbout = () => {
    const aboutSection = document.querySelector('#about');
    if (aboutSection) {
      aboutSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section
      id="hero"
      ref={heroRef}
      className="relative w-full h-screen overflow-hidden"
    >
      {/* Background Image - optimized with decoding async */}
      <div
        ref={imageRef}
        className="absolute inset-0 w-full h-full"
        style={{ 
          willChange: 'transform',
          transform: 'translateZ(0)', // Force GPU layer
        }}
      >
        <img
          src="/images/hero-meat.jpg"
          alt="Premium vlees bij Traiteur De Valck"
          className="w-full h-full object-cover"
          decoding="async"
          loading="eager"
        />
      </div>

      {/* Dark Overlay - darker at top and bottom for better text visibility */}
      <div 
        className="hero-overlay absolute inset-0 pointer-events-none"
        style={{
          background: 'linear-gradient(to bottom, rgba(0,0,0,0.5) 0%, rgba(0,0,0,0.25) 30%, rgba(0,0,0,0.4) 100%)',
          opacity: 0.85,
        }}
      />

      {/* Content */}
      <div
        ref={contentRef}
        className="relative z-10 h-full flex flex-col items-center justify-center px-6 text-center"
        style={{ 
          willChange: 'transform',
          transform: 'translateZ(0)',
        }}
      >
        <div className="max-w-4xl">
          {/* Badge */}
          <div className="hero-subheading mb-6 inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full">
            <span className="w-2 h-2 bg-brand-accent rounded-full" />
            <span className="text-white/90 text-sm font-medium tracking-wide">
              Ambachtelijk sinds 1968
            </span>
          </div>

          {/* Main Heading */}
          <h1 className="font-display text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold text-white mb-6 text-shadow-hero overflow-hidden">
            {headingWords.map((word, index) => (
              <span key={index} className="hero-word inline-block mr-4">
                {word}
              </span>
            ))}
          </h1>

          {/* Subheading */}
          <p className="hero-subheading text-lg sm:text-xl md:text-2xl text-white/90 mb-10 font-light max-w-2xl mx-auto">
            Slager-traiteur met passie voor kwaliteit. Van vers vlees tot
            gastronomische feestformules.
          </p>

          {/* CTA Buttons */}
          <div className="hero-cta flex flex-col sm:flex-row gap-4 justify-center items-center">
            <button
              onClick={scrollToAbout}
              className="group px-8 py-4 bg-brand-accent text-brand-text rounded-full font-medium text-lg transition-all duration-300 hover:bg-white hover:scale-105 hover:shadow-xl"
            >
              Ontdek Ons Verhaal
              <ChevronDown className="inline-block ml-2 w-5 h-5 transition-transform group-hover:translate-y-1" />
            </button>
            <a
              href="https://webshop.traiteur-devalck.be/nl/"
              target="_blank"
              rel="noopener noreferrer"
              className="px-8 py-4 bg-white/10 backdrop-blur-sm text-white border border-white/30 rounded-full font-medium text-lg transition-all duration-300 hover:bg-white/20 hover:border-white/50"
            >
              Online Bestellen
            </a>
          </div>
        </div>
      </div>

      {/* Scroll Indicator - simplified animation */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10">
        <div className="flex flex-col items-center gap-2 text-white/60">
          <span className="text-xs tracking-widest uppercase">Scroll</span>
          <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center pt-2">
            <div 
              className="w-1.5 h-3 bg-white/60 rounded-full scroll-indicator"
            />
          </div>
        </div>
      </div>
    </section>
  );
});

Hero.displayName = 'Hero';

export default Hero;
