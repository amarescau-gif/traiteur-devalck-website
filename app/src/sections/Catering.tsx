import { useEffect, useRef, useState, useCallback, memo } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ChevronLeft, ChevronRight, Users, Calendar, ChefHat, ArrowRight } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

interface Slide {
  image: string;
  title: string;
  subtitle: string;
  description: string;
  features: string[];
}

const slides: Slide[] = [
  {
    image: '/images/bbq-flames.jpg',
    title: 'BBQ aan Huis',
    subtitle: 'Van intieme gezelschappen tot 100 personen',
    description:
      'Reeds jaren zijn wij gekend om onze barbecue-bereidingen. Wij verzorgen zowel kleine als middelgrote BBQ-feesten, startend met een aperitief tot en met het dessert.',
    features: [
      'Complete formules voor elk gezelschap',
      'Gemarineerde vleespecialiteiten',
      'Professionele service mogelijk',
      'Aperitief, hoofdgerecht en dessert',
    ],
  },
  {
    image: '/images/catering-buffet.jpg',
    title: 'Feestformules',
    subtitle: 'Perfect voor elke gelegenheid',
    description:
      'Of het nu gaat om een verjaardag, jubileum of bedrijfsfeest, wij regelen alles van A tot Z. Geniet van onze uitgebreide feestformules met de beste kwaliteit.',
    features: [
      'Verjaardagsfeesten en jubilea',
      'Bedrijfsevents en recepties',
      'Kerst- en eindejaarsfeesten',
      'Volledige catering service',
    ],
  },
  {
    image: '/images/wedding-catering.jpg',
    title: 'Gourmet & Fondue',
    subtitle: 'Gezellig tafelen met familie en vrienden',
    description:
      'Maak van elke maaltijd een feest met onze gourmet en fondue schotels. Ideaal voor gezellige avonden met familie en vrienden tijdens de feestdagen.',
    features: [
      'Uitgebreide gourmet schotels',
      'Traditionele vleesfondue',
      'Kaasschotels met regionale kazen',
      'Feestelijke arrangementen',
    ],
  },
];

const Catering = memo(() => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [currentSlide, setCurrentSlide] = useState(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const triggersRef = useRef<ScrollTrigger[]>([]);

  const nextSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  }, []);

  const prevSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  }, []);

  const goToSlide = useCallback((index: number) => {
    setCurrentSlide(index);
  }, []);

  // Auto-advance slides with proper cleanup
  useEffect(() => {
    const startInterval = () => {
      intervalRef.current = setInterval(nextSlide, 5000);
    };

    const stopInterval = () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };

    // Start interval
    startInterval();

    // Pause on visibility change
    const handleVisibilityChange = () => {
      if (document.hidden) {
        stopInterval();
      } else {
        startInterval();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      stopInterval();
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [nextSlide]);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const isMobile = window.matchMedia('(max-width: 1023px)').matches;
    
    if (prefersReducedMotion || isMobile) {
      // Skip animations on mobile and for reduced motion
      gsap.set(['.catering-header', '.catering-slider'], { opacity: 1, y: 0 });
      return;
    }

    const ctx = gsap.context(() => {
      // Header animation - once only
      const headerTrigger = ScrollTrigger.create({
        trigger: '.catering-header',
        start: 'top 85%',
        once: true,
        onEnter: () => {
          gsap.fromTo(
            '.catering-header',
            { y: 40, opacity: 0 },
            { y: 0, opacity: 1, duration: 0.8, ease: 'power2.out' }
          );
        },
      });
      triggersRef.current.push(headerTrigger);

      // Slider animation - once only
      const sliderTrigger = ScrollTrigger.create({
        trigger: '.catering-slider',
        start: 'top 85%',
        once: true,
        onEnter: () => {
          gsap.fromTo(
            '.catering-slider',
            { opacity: 0, y: 20 },
            { opacity: 1, y: 0, duration: 0.8, ease: 'power2.out' }
          );
        },
      });
      triggersRef.current.push(sliderTrigger);
    }, sectionRef);

    return () => {
      triggersRef.current.forEach(trigger => trigger.kill());
      triggersRef.current = [];
      ctx.revert();
    };
  }, []);

  return (
    <section
      id="catering"
      ref={sectionRef}
      className="w-full py-24 lg:py-32 bg-brand-secondary"
    >
      <div className="w-full px-6 lg:px-12 xl:px-24">
        {/* Header */}
        <div className="catering-header text-center mb-16">
          <span className="text-brand-accent font-medium tracking-wider uppercase text-sm">
            Catering
          </span>
          <h2 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-brand-text mt-4 mb-6">
            BBQ & Feesten
          </h2>
          <p className="text-lg text-brand-text/70 max-w-2xl mx-auto">
            Laat uw feest of event tot een culinair hoogtepunt brengen. Wij
            verzorgen alles van aperitief tot dessert.
          </p>
        </div>

        {/* Slider */}
        <div className="catering-slider relative">
          <div className="relative h-[500px] md:h-[550px] lg:h-[600px] rounded-3xl overflow-hidden shadow-xl">
            {/* Slides - using translateX for smoother performance */}
            <div 
              className="flex h-full transition-transform duration-500 ease-out"
              style={{ transform: `translateX(-${currentSlide * 100}%)` }}
            >
              {slides.map((slide, index) => (
                <div
                  key={index}
                  className="min-w-full h-full relative"
                >
                  {/* Background Image */}
                  <img
                    src={slide.image}
                    alt={slide.title}
                    className="w-full h-full object-cover"
                    loading={index === 0 ? 'eager' : 'lazy'}
                    decoding="async"
                  />

                  {/* Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-transparent" />

                  {/* Content */}
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full px-6 md:px-8 lg:px-16">
                      <div className="max-w-md md:max-w-xl">
                        <span className="inline-block px-3 py-1 bg-brand-accent/90 text-brand-text text-xs md:text-sm font-medium rounded-full mb-3 md:mb-4">
                          {slide.subtitle}
                        </span>
                        <h3 className="font-display text-2xl md:text-3xl lg:text-5xl font-bold text-white mb-2 md:mb-4">
                          {slide.title}
                        </h3>
                        <p className="text-white/80 text-sm md:text-lg mb-4 md:mb-6 line-clamp-3 md:line-clamp-none">
                          {slide.description}
                        </p>

                        {/* Features - hidden on mobile */}
                        <ul className="hidden md:space-y-2 mb-6">
                          {slide.features.map((feature, idx) => (
                            <li
                              key={idx}
                              className="flex items-center gap-3 text-white/90"
                            >
                              <div className="w-1.5 h-1.5 rounded-full bg-brand-accent" />
                              <span className="text-sm">{feature}</span>
                            </li>
                          ))}
                        </ul>

                        {/* CTA */}
                        <a
                          href="#contact"
                          className="inline-flex items-center gap-2 px-5 py-2.5 bg-brand-accent text-brand-text rounded-full font-medium hover:bg-white transition-colors"
                        >
                          Vraag offerte aan
                          <ArrowRight className="w-4 h-4" />
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Navigation Arrows */}
            <button
              onClick={prevSlide}
              className="absolute left-2 md:left-4 top-1/2 -translate-y-1/2 w-10 h-10 md:w-12 md:h-12 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center text-white hover:bg-white/20 transition-colors z-10"
              aria-label="Previous slide"
            >
              <ChevronLeft className="w-5 h-5 md:w-6 md:h-6" />
            </button>
            <button
              onClick={nextSlide}
              className="absolute right-2 md:right-4 top-1/2 -translate-y-1/2 w-10 h-10 md:w-12 md:h-12 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center text-white hover:bg-white/20 transition-colors z-10"
              aria-label="Next slide"
            >
              <ChevronRight className="w-5 h-5 md:w-6 md:h-6" />
            </button>

            {/* Progress Indicators */}
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 z-10">
              {slides.map((_, index) => (
                <button
                  key={index}
                  onClick={() => goToSlide(index)}
                  className={`h-2 rounded-full transition-all duration-300 ${
                    index === currentSlide
                      ? 'w-8 bg-brand-accent'
                      : 'w-2 bg-white/50 hover:bg-white/70'
                  }`}
                  aria-label={`Go to slide ${index + 1}`}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Info Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
          <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow">
            <div className="w-12 h-12 rounded-xl bg-brand-primary/10 flex items-center justify-center mb-4">
              <Users className="w-6 h-6 text-brand-primary" />
            </div>
            <h4 className="font-display text-xl font-bold text-brand-text mb-2">
              Groepen tot 100p
            </h4>
              <p className="text-brand-text/70 text-sm">
              Van intieme diners tot grote feesten, wij regelen het allemaal.
            </p>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow">
            <div className="w-12 h-12 rounded-xl bg-brand-primary/10 flex items-center justify-center mb-4">
              <Calendar className="w-6 h-6 text-brand-primary" />
            </div>
            <h4 className="font-display text-xl font-bold text-brand-text mb-2">
              Het hele jaar door
            </h4>
            <p className="text-brand-text/70 text-sm">
              Beschikbaar voor elk seizoen en elke gelegenheid.
            </p>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow">
            <div className="w-12 h-12 rounded-xl bg-brand-primary/10 flex items-center justify-center mb-4">
              <ChefHat className="w-6 h-6 text-brand-primary" />
            </div>
            <h4 className="font-display text-xl font-bold text-brand-text mb-2">
              Volledige Service
            </h4>
            <p className="text-brand-text/70 text-sm">
              Van planning tot uitvoering, wij nemen alles uit handen.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
});

Catering.displayName = 'Catering';

export default Catering;
