import { useEffect, useRef, memo } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Briefcase, Clock, Calendar, Users, MapPin, ArrowRight, Heart, ArrowLeft } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const Careers = memo(() => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const triggersRef = useRef<ScrollTrigger[]>([]);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const isMobile = window.matchMedia('(max-width: 1023px)').matches;
    
    if (prefersReducedMotion || isMobile) {
      // Skip animations on mobile and for reduced motion
      gsap.set(['.careers-header', '.careers-card', '.benefit-item'], { opacity: 1, y: 0 });
      return;
    }

    const ctx = gsap.context(() => {
      // Header animation - once only
      const headerTrigger = ScrollTrigger.create({
        trigger: '.careers-header',
        start: 'top 85%',
        once: true,
        onEnter: () => {
          gsap.fromTo(
            '.careers-header',
            { y: 40, opacity: 0 },
            { y: 0, opacity: 1, duration: 0.8, ease: 'power2.out' }
          );
        },
      });
      triggersRef.current.push(headerTrigger);

      // Card animation - once only
      const cardTrigger = ScrollTrigger.create({
        trigger: '.careers-card',
        start: 'top 85%',
        once: true,
        onEnter: () => {
          gsap.fromTo(
            '.careers-card',
            { y: 40, opacity: 0 },
            { y: 0, opacity: 1, duration: 0.8, ease: 'power2.out' }
          );
        },
      });
      triggersRef.current.push(cardTrigger);

      // Benefits animation - once only
      const benefitsTrigger = ScrollTrigger.create({
        trigger: '.benefits-grid',
        start: 'top 85%',
        once: true,
        onEnter: () => {
          gsap.fromTo(
            '.benefit-item',
            { y: 30, opacity: 0 },
            { y: 0, opacity: 1, duration: 0.6, stagger: 0.15, ease: 'power2.out' }
          );
        },
      });
      triggersRef.current.push(benefitsTrigger);
    }, sectionRef);

    return () => {
      triggersRef.current.forEach(trigger => trigger.kill());
      triggersRef.current = [];
      ctx.revert();
    };
  }, []);

  const handleGoBack = () => {
    window.location.href = '/';
  };

  const benefits = [
    {
      icon: Clock,
      title: '4 dagen/week',
      description: 'Werk 4 dagen per week in een fijne werkomgeving',
    },
    {
      icon: Calendar,
      title: '1/2 Zaterdag',
      description: 'Tweewekelijks een halve zaterdag werken',
    },
    {
      icon: Users,
      title: 'Gezellig Team',
      description: 'Werk in een warm, familiaal bedrijf',
    },
    {
      icon: Heart,
      title: 'Passie voor Vlees',
      description: 'Leer alles over ambachtelijk vlees',
    },
  ];

  return (
    <section
      id="careers"
      ref={sectionRef}
      className="w-full py-24 lg:py-32 bg-brand-primary text-white min-h-screen"
    >
      <div className="w-full px-6 lg:px-12 xl:px-24">
        {/* Back Button */}
        <button
          onClick={handleGoBack}
          className="inline-flex items-center gap-2 mb-8 text-white/70 hover:text-white transition-colors group"
        >
          <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
          <span>Terug naar home</span>
        </button>

        {/* Header */}
        <div className="careers-header text-center mb-16" style={{ opacity: 0 }}>
          <span className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 rounded-full text-brand-accent font-medium text-sm mb-4">
            <Briefcase className="w-4 h-4" />
            Vacature
          </span>
          <h2 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold mt-4 mb-6">
            Word Ons Nieuwe Teamlid
          </h2>
          <p className="text-lg text-white/70 max-w-2xl mx-auto">
            We zoeken een enthousiaste verkoper/verkoopster voor het bedienen en 
            aanvullen van onze winkel. Ben jij gepassioneerd door vers vlees en 
            klantcontact?
          </p>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left: Job Card */}
          <div className="careers-card bg-white/10 backdrop-blur-sm rounded-3xl p-8 lg:p-10" style={{ opacity: 0 }}>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-xl bg-brand-accent/20 flex items-center justify-center">
                <Briefcase className="w-6 h-6 text-brand-accent" />
              </div>
              <div>
                <h3 className="font-display text-2xl font-bold">Verkoper/Verkoopster</h3>
                <p className="text-white/60 text-sm">Slager-Traiteur De Valck</p>
              </div>
            </div>

            <div className="space-y-4 mb-8">
              <div className="flex items-start gap-3">
                <Clock className="w-5 h-5 text-brand-accent flex-shrink-0 mt-0.5" />
                <div>
                  <span className="font-medium">4 dagen per week</span>
                  <p className="text-white/60 text-sm">Flexibele werktijden</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Calendar className="w-5 h-5 text-brand-accent flex-shrink-0 mt-0.5" />
                <div>
                  <span className="font-medium">1/2 Zaterdag</span>
                  <p className="text-white/60 text-sm">Tweewekelijks een halve zaterdag</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-brand-accent flex-shrink-0 mt-0.5" />
                <div>
                  <span className="font-medium">Wolvertem (Meise)</span>
                  <p className="text-white/60 text-sm">Gemeenteplein 8, 1861 Wolvertem</p>
                </div>
              </div>
            </div>

            <div className="space-y-3 mb-8">
              <h4 className="font-semibold text-lg mb-3">Wat ga je doen?</h4>
              <ul className="space-y-2 text-white/80">
                <li className="flex items-start gap-2">
                  <span className="text-brand-accent">•</span>
                  <span>Klanten vriendelijk bedienen aan de toonbank</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-brand-accent">•</span>
                  <span>Winkel aanvullen en netjes houden</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-brand-accent">•</span>
                  <span>Producten wegen en verpakken</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-brand-accent">•</span>
                  <span>Advies geven over onze producten</span>
                </li>
              </ul>
            </div>

            <div className="space-y-3 mb-8">
              <h4 className="font-semibold text-lg mb-3">Wat bieden we?</h4>
              <ul className="space-y-2 text-white/80">
                <li className="flex items-start gap-2">
                  <span className="text-brand-accent">•</span>
                  <span>Een warme, familiale werksfeer</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-brand-accent">•</span>
                  <span>Opleiding en begeleiding op maat</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-brand-accent">•</span>
                  <span>Marktconform loon met extra voordelen</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-brand-accent">•</span>
                  <span>Korting op onze heerlijke producten</span>
                </li>
              </ul>
            </div>

            <a
              href="mailto:info@traiteur-devalck.be?subject=Sollicitatie Verkoper/Verkoopster"
              className="inline-flex items-center gap-2 w-full justify-center px-8 py-4 bg-brand-accent text-brand-text rounded-full font-medium text-lg hover:bg-white transition-all hover:scale-105"
            >
              Solliciteer Nu
              <ArrowRight className="w-5 h-5" />
            </a>
          </div>

          {/* Right: Benefits */}
          <div>
            <h3 className="font-display text-3xl font-bold mb-8">
              Waarom bij ons werken?
            </h3>
            <div className="benefits-grid grid grid-cols-1 sm:grid-cols-2 gap-6">
              {benefits.map((benefit, index) => (
                <div
                  key={index}
                  className="benefit-item bg-white/5 backdrop-blur-sm rounded-2xl p-6 hover:bg-white/10 transition-colors"
                  style={{ opacity: 0 }}
                >
                  <div className="w-12 h-12 rounded-xl bg-brand-accent/20 flex items-center justify-center mb-4">
                    <benefit.icon className="w-6 h-6 text-brand-accent" />
                  </div>
                  <h4 className="font-display text-xl font-bold mb-2">
                    {benefit.title}
                  </h4>
                  <p className="text-white/60 text-sm">
                    {benefit.description}
                  </p>
                </div>
              ))}
            </div>

            {/* Quote */}
            <div className="mt-12 p-8 bg-white/5 rounded-2xl">
              <blockquote className="text-xl italic text-white/90 leading-relaxed mb-4">
                "Werken bij De Valck voelt als thuiskomen. Het is niet zomaar een job, 
                het is een passie die we delen met het hele team."
              </blockquote>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-brand-accent/20 flex items-center justify-center">
                  <span className="text-brand-accent font-bold">DV</span>
                </div>
                <div>
                  <div className="font-medium">Het De Valck Team</div>
                  <div className="text-white/60 text-sm">3 generaties ervaring</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
});

Careers.displayName = 'Careers';

export default Careers;
