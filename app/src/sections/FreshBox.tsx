import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Clock, CreditCard, Leaf, MapPin, ArrowRight } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const FreshBox = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const imageStackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const isMobile = window.matchMedia('(max-width: 1023px)').matches;

    if (prefersReducedMotion || isMobile) {
      // Skip animations on mobile and for reduced motion
      gsap.set(['.freshbox-header', '.freshbox-text', '.feature-item', '.freshbox-image'], { opacity: 1, y: 0, x: 0, scale: 1 });
      return;
    }

    const ctx = gsap.context(() => {
      // Header animation
      gsap.fromTo(
        '.freshbox-header',
        { y: 50, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 1,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: '.freshbox-header',
            start: 'top 85%',
            toggleActions: 'play none none reverse',
          },
        }
      );

      // Image stack fan out animation
      gsap.fromTo(
        '.stack-image',
        { rotate: 0, y: 0 },
        {
          rotate: (i) => [-8, 0, 8][i],
          y: (i) => [0, -20, 0][i],
          duration: 1.2,
          stagger: 0.15,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: imageStackRef.current,
            start: 'top 75%',
            toggleActions: 'play none none reverse',
          },
        }
      );

      // Text content animation
      gsap.fromTo(
        '.freshbox-text',
        { x: -50, opacity: 0 },
        {
          x: 0,
          opacity: 1,
          duration: 1,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: '.freshbox-text',
            start: 'top 80%',
            toggleActions: 'play none none reverse',
          },
        }
      );

      // Features stagger animation
      gsap.fromTo(
        '.feature-item',
        { scale: 0, opacity: 0 },
        {
          scale: 1,
          opacity: 1,
          duration: 0.6,
          stagger: 0.15,
          ease: 'back.out(1.7)',
          scrollTrigger: {
            trigger: '.features-grid',
            start: 'top 85%',
            toggleActions: 'play none none reverse',
          },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const features = [
    {
      icon: Clock,
      title: 'Dagverse Maaltijden',
      description: 'Elke dag vers bereid zonder bewaarmiddelen',
    },
    {
      icon: CreditCard,
      title: 'Contactloos Betalen',
      description: 'BC, Visa, Master, Apple Pay en meer',
    },
    {
      icon: Leaf,
      title: 'Lokaal Bereid',
      description: 'Met verse ingrediënten uit de regio',
    },
    {
      icon: MapPin,
      title: '24/7 Beschikbaar',
      description: 'Wilgenlaan, ter hoogte van Falko-hotel',
    },
  ];

  return (
    <section
      id="freshbox"
      ref={sectionRef}
      className="w-full py-24 lg:py-32 bg-brand-background overflow-hidden"
    >
      <div className="w-full px-6 lg:px-12 xl:px-24">
        {/* Header */}
        <div className="freshbox-header text-center mb-16">
          <span className="inline-flex items-center gap-2 px-4 py-2 bg-brand-primary/10 rounded-full text-brand-primary font-medium text-sm mb-4">
            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            Innovatie
          </span>
          <h2 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-brand-text mt-4 mb-6">
            De Fresh-Box
          </h2>
          <p className="text-lg text-brand-text/70 max-w-2xl mx-auto">
            24/7 versheid, altijd beschikbaar. Onze revolutionaire
            maaltijdautomaat brengt dagverse maaltijden naar jouw buurt.
          </p>
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Left: Text Content */}
          <div className="freshbox-text order-2 lg:order-1">
            <h3 className="font-display text-2xl md:text-3xl font-bold text-brand-text mb-6">
              Maaltijdautomaat
            </h3>
            <p className="text-lg text-brand-text/80 leading-relaxed mb-8">
              Haal uw maaltijden en soepen elke dag en 24/7 uit onze
              maaltijdautomaat. De maaltijden zijn dagvers, lokaal bereid zonder
              bewaarmiddelen en met verse ingrediënten.
            </p>

            {/* Features Grid */}
            <div className="features-grid grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
              {features.map((feature, index) => (
                <div
                  key={index}
                  className="feature-item flex items-start gap-4 p-4 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className="w-10 h-10 rounded-lg bg-brand-primary/10 flex items-center justify-center flex-shrink-0">
                    <feature.icon className="w-5 h-5 text-brand-primary" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-brand-text text-sm mb-1">
                      {feature.title}
                    </h4>
                    <p className="text-brand-text/60 text-xs">
                      {feature.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Meattime Info */}
            <div className="bg-brand-secondary rounded-2xl p-6 mb-8">
              <h4 className="font-display text-xl font-bold text-brand-text mb-3">
                Meattime Versbox +
              </h4>
              <p className="text-brand-text/70 text-sm leading-relaxed mb-4">
                Een koelkast waar u uw bestelling kan afhalen wanneer het u het
                beste past. U bestelt via onze webshop, betaalt en kiest of u de
                bestelling afhaalt in de winkel of ophaalt in de versbox.
              </p>
              <p className="text-brand-text/70 text-sm leading-relaxed">
                U ontvangt een code via e-mail of SMS die u toegang verleent tot
                de versbox.
              </p>
            </div>

            {/* CTA */}
            <a
              href="https://webshop.traiteur-devalck.be/nl/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-8 py-4 bg-brand-primary text-white rounded-full font-medium hover:bg-brand-primary/90 transition-all hover:scale-105 hover:shadow-lg"
            >
              Bestel via Meattime
              <ArrowRight className="w-5 h-5" />
            </a>
          </div>

          {/* Right: Image Stack */}
          <div className="order-1 lg:order-2">
            <div
              ref={imageStackRef}
              className="relative h-[400px] lg:h-[500px]"
            >
              {/* Background decoration */}
              <div className="absolute inset-0 bg-gradient-to-br from-brand-accent/20 to-brand-primary/10 rounded-3xl" />

              {/* Stacked Images */}
              <div className="stack-image absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[280px] lg:w-[320px] rounded-2xl overflow-hidden shadow-2xl transition-transform duration-500 hover:scale-105">
                <img
                  src="/images/bbq-skewers.jpg"
                  alt="BBQ gerechten"
                  className="w-full h-[200px] lg:h-[240px] object-cover"
                />
              </div>

              <div className="stack-image absolute top-[45%] left-[55%] -translate-x-1/2 -translate-y-1/2 w-[260px] lg:w-[300px] rounded-2xl overflow-hidden shadow-2xl z-10 transition-transform duration-500 hover:scale-105">
                <img
                  src="/images/ribeye-steak.jpg"
                  alt="Premium steak"
                  className="w-full h-[180px] lg:h-[220px] object-cover"
                />
              </div>

              <div className="stack-image absolute top-[55%] left-[45%] -translate-x-1/2 -translate-y-1/2 w-[240px] lg:w-[280px] rounded-2xl overflow-hidden shadow-2xl z-20 transition-transform duration-500 hover:scale-105">
                <img
                  src="/images/fresh-salad.jpg"
                  alt="Verse salade"
                  className="w-full h-[160px] lg:h-[200px] object-cover"
                />
              </div>

              {/* Floating badge */}
              <div className="absolute bottom-8 right-8 bg-white rounded-xl shadow-lg p-4 z-30">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                    <Clock className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <div className="font-bold text-brand-text">24/7</div>
                    <div className="text-xs text-brand-text/60">Beschikbaar</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FreshBox;
