import { useEffect, useRef, useState, memo } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Award, Users, Clock, Heart } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const stats = [
  { icon: Clock, value: '55+', label: 'Jaar Ervaring' },
  { icon: Users, value: '3', label: 'Generaties' },
  { icon: Award, value: '70%', label: 'Huisgemaakt' },
  { icon: Heart, value: '100%', label: 'Passie' },
];

const About = memo(() => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const image1Ref = useRef<HTMLDivElement>(null);
  const image2Ref = useRef<HTMLDivElement>(null);
  const image2ContainerRef = useRef<HTMLDivElement>(null);
  const text1Ref = useRef<HTMLDivElement>(null);
  const text2Ref = useRef<HTMLDivElement>(null);
  const quoteRef = useRef<HTMLDivElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);

  // Check if on mobile - on mobile, skip all animations
  const isMobile = window.matchMedia('(max-width: 1023px)').matches;

  // Track visibility states for re-triggering animations - initialize to true on mobile
  const [isImage1Visible, setIsImage1Visible] = useState(isMobile);
  const [isText1Visible, setIsText1Visible] = useState(isMobile);
  const [isText2Visible, setIsText2Visible] = useState(isMobile);
  const [isQuoteVisible, setIsQuoteVisible] = useState(isMobile);
  const [isStatsVisible, setIsStatsVisible] = useState(isMobile);

  useEffect(() => {
    // On mobile, skip all GSAP animations
    if (isMobile) {
      // Set all elements to visible state immediately
      gsap.set([image1Ref.current, text1Ref.current, text2Ref.current, quoteRef.current], {
        opacity: 1,
        x: 0,
        y: 0,
        clipPath: 'inset(0% 0 0 0)'
      });
      gsap.set('.stat-item', { opacity: 1, y: 0, x: 0 });
      return;
    }

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (prefersReducedMotion) {
      gsap.set([image1Ref.current, image2Ref.current, text1Ref.current, text2Ref.current, quoteRef.current], {
        opacity: 1,
        x: 0,
        y: 0,
        scale: 1,
        clipPath: 'inset(0% 0 0 0)'
      });
      return;
    }

    // Intersection Observer for visibility tracking (re-trigger animations)
    const observerOptions = {
      root: null,
      rootMargin: '0px',
      threshold: 0.2,
    };

    const createVisibilityObserver = (setter: (visible: boolean) => void) => {
      return new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          setter(entry.isIntersecting);
        });
      }, observerOptions);
    };

    const image1Observer = createVisibilityObserver(setIsImage1Visible);
    const text1Observer = createVisibilityObserver(setIsText1Visible);
    const text2Observer = createVisibilityObserver(setIsText2Visible);
    const quoteObserver = createVisibilityObserver(setIsQuoteVisible);
    const statsObserver = createVisibilityObserver(setIsStatsVisible);

    if (image1Ref.current) image1Observer.observe(image1Ref.current);
    if (text1Ref.current) text1Observer.observe(text1Ref.current);
    if (text2Ref.current) text2Observer.observe(text2Ref.current);
    if (quoteRef.current) quoteObserver.observe(quoteRef.current);
    if (statsRef.current) statsObserver.observe(statsRef.current);

    // Parallax effect for image 2 (butcher image)
    let rafId: number;
    const onScroll = () => {
      if (rafId) return;
      rafId = requestAnimationFrame(handleParallax);
    };

    const handleParallax = () => {
      if (!image2Ref.current || !image2ContainerRef.current) return;

      const rect = image2ContainerRef.current.getBoundingClientRect();
      const windowHeight = window.innerHeight;

      if (rect.top < windowHeight && rect.bottom > 0) {
        const scrolled = window.scrollY;
        const elementTop = rect.top + scrolled;
        const relativeScroll = scrolled - elementTop + windowHeight;

        const parallaxY = relativeScroll * 0.08;
        image2Ref.current.style.transform = `translateY(${parallaxY}px)`;
      }

      rafId = 0;
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    handleParallax();

    return () => {
      image1Observer.disconnect();
      text1Observer.disconnect();
      text2Observer.disconnect();
      quoteObserver.disconnect();
      statsObserver.disconnect();
      window.removeEventListener('scroll', onScroll);
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, [isMobile]);

  // Image 1 animation (re-triggerable)
  useEffect(() => {
    if (isImage1Visible) {
      gsap.fromTo(
        image1Ref.current,
        { clipPath: 'inset(100% 0 0 0)', opacity: 0 },
        { clipPath: 'inset(0% 0 0 0)', opacity: 1, duration: 1, ease: 'power2.out' }
      );
    } else {
      gsap.set(image1Ref.current, { clipPath: 'inset(100% 0 0 0)', opacity: 0 });
    }
  }, [isImage1Visible]);

  // Text 1 animation (re-triggerable)
  useEffect(() => {
    if (isText1Visible) {
      gsap.fromTo(
        text1Ref.current,
        { x: 30, opacity: 0 },
        { x: 0, opacity: 1, duration: 0.8, ease: 'power2.out' }
      );
    } else {
      gsap.set(text1Ref.current, { x: 30, opacity: 0 });
    }
  }, [isText1Visible]);

  // Text 2 animation (re-triggerable)
  useEffect(() => {
    if (isText2Visible) {
      gsap.fromTo(
        text2Ref.current,
        { x: -30, opacity: 0 },
        { x: 0, opacity: 1, duration: 0.8, ease: 'power2.out' }
      );
    } else {
      gsap.set(text2Ref.current, { x: -30, opacity: 0 });
    }
  }, [isText2Visible]);

  // Quote animation (re-triggerable)
  useEffect(() => {
    if (isQuoteVisible) {
      gsap.fromTo(
        quoteRef.current,
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, ease: 'power2.out' }
      );
    } else {
      gsap.set(quoteRef.current, { y: 30, opacity: 0 });
    }
  }, [isQuoteVisible]);

  // Stats animation (re-triggerable)
  useEffect(() => {
    if (isStatsVisible) {
      gsap.fromTo(
        '.stat-item',
        { y: 60, x: -40, opacity: 0 },
        { y: 0, x: 0, opacity: 1, duration: 0.8, stagger: 0.25, ease: 'power2.out' }
      );
    } else {
      gsap.set('.stat-item', { y: 60, x: -40, opacity: 0 });
    }
  }, [isStatsVisible]);

  return (
    <section
      id="about"
      ref={sectionRef}
      className="w-full py-24 lg:py-32 bg-brand-background"
    >
      <div className="w-full px-6 lg:px-12 xl:px-24">
        {/* Header */}
        <div className="text-center mb-16">
          <span className="text-brand-accent font-medium tracking-wider uppercase text-sm">
            Onze Geschiedenis
          </span>
          <h2 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-brand-text mt-4">
            Een Familiezaak met Karakter
          </h2>
        </div>

        {/* Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center mb-20">
          {/* Image 1 */}
          <div className="lg:col-span-6">
            <div
              ref={image1Ref}
              className="relative overflow-hidden rounded-2xl shadow-xl"
              style={{ 
                willChange: 'clip-path, opacity',
                opacity: 0,
              }}
            >
              <img
                src="/images/storefront.jpg"
                alt="De Valck beenhouwerij winkelgevel"
                className="w-full h-[400px] lg:h-[500px] object-cover"
                loading="lazy"
                decoding="async"
              />
            </div>
          </div>

          {/* Text Block 1 */}
          <div className="lg:col-span-6" ref={text1Ref} style={{ opacity: 0 }}>
            <div className="lg:pl-8">
              <p className="text-lg lg:text-xl text-brand-text/80 leading-relaxed mb-6">
                Sinds de start in 1968 staat Slager-traiteur De Valck bekend om
                zijn vers vlees, gevogelte en wild. Wat begon als een
                bescheiden slagerij op de Merchtemsesteenweg is uitgegroeid tot
                een gerespecteerd begrip in de regio.
              </p>
              <p className="text-lg lg:text-xl text-brand-text/80 leading-relaxed">
                Vandaag zijn we trendsetter in salades op basis van yoghurt en
                vinaigrettes. Ontdek ook ons uitgebreid assortiment
                feestgerechten, gourmets, fondues, kaasschotels en wok.
              </p>
            </div>
          </div>
        </div>

        {/* Quote Section */}
        <div 
          ref={quoteRef}
          className="about-quote max-w-4xl mx-auto text-center py-12 px-8 rounded-2xl mb-20 bg-[#f5f0e6]"
          style={{ opacity: 0 }}
        >
          <blockquote className="font-display text-2xl md:text-3xl lg:text-4xl italic text-brand-primary leading-relaxed">
            "Kwaliteit is geen toeval, het is een keuze die we elke dag opnieuw
            maken."
          </blockquote>
          <div className="mt-6 flex items-center justify-center gap-2">
            <div className="w-12 h-0.5 bg-brand-accent" />
            <span className="text-brand-text/60 font-medium">Filiep & Lena De Valck</span>
            <div className="w-12 h-0.5 bg-brand-accent" />
          </div>
        </div>

        {/* Second Row */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Text Block 2 - Handmade in Belgium */}
          <div className="lg:col-span-5 order-2 lg:order-1" ref={text2Ref} style={{ opacity: 0 }}>
            <div className="lg:pr-8">
              <h3 className="font-display text-2xl md:text-3xl font-bold text-brand-text mb-4">
                Handmade in Belgium
              </h3>
              <p className="text-lg text-brand-text/80 leading-relaxed mb-6">
                Als gepassioneerde, trotse leveranciers van échte kwaliteit mag
                Slager-traiteur De Valck het prestigieuze label{" "}
                <strong>Handmade In Belgium</strong> dragen. Dit label staat
                garant voor ambachtelijke bereidingen met respect voor
                traditie.
              </p>
              <p className="text-lg text-brand-text/80 leading-relaxed">
                In 2010 namen Filiep en Lena het roer officieel over, samen met
                hun toegewijde team zetten zij de familietraditie voort met
                dezelfde passie en toewijding als de oprichters.
              </p>
            </div>
          </div>

          {/* Image 2 - Butcher with Parallax */}
          <div className="lg:col-span-7 order-1 lg:order-2 overflow-hidden rounded-2xl" ref={image2ContainerRef}>
            <div
              ref={image2Ref}
              className="relative overflow-hidden rounded-2xl shadow-xl"
              style={{
                willChange: 'transform',
                transform: 'translateY(0)',
              }}
            >
              <img
                src="/images/butcher-cutting.jpg"
                alt="Slager aan het werk"
                className="w-full h-[350px] lg:h-[450px] object-cover"
                loading="lazy"
                decoding="async"
              />
            </div>
          </div>
        </div>

        {/* Stats */}
        <div 
          ref={statsRef}
          className="stats-container grid grid-cols-2 md:grid-cols-4 gap-8 mt-20 pt-12 border-t border-brand-primary/10"
        >
          {stats.map((stat, index) => (
            <div
              key={index}
              className="stat-item text-center"
              style={{ opacity: 0 }}
            >
              <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-brand-primary/10 mb-4">
                <stat.icon className="w-7 h-7 text-brand-primary" />
              </div>
              <div className="font-display text-3xl md:text-4xl font-bold text-brand-primary mb-1">
                {stat.value}
              </div>
              <div className="text-sm text-brand-text/60 font-medium">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
});

About.displayName = 'About';

export default About;
