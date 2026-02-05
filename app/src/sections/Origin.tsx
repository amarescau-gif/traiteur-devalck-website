import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { MapPin, Check, ArrowRight } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

interface Supplier {
  id: string;
  name: string;
  location: string;
  description: string;
  products: string[];
  image: string;
}

const suppliers: Supplier[] = [
  {
    id: 'rund',
    name: 'Wit Blauw Ras',
    location: 'Lokaal gekweekt',
    description:
      'Het wereldbefaamde wit blauwe ras, natuurlijk vrouwelijk en 2 tot 3 maal gekalfd waardoor deze dieren al 5 jaar zijn en op hun beste zijn qua smaak en textuur.',
    products: ['Volledige karkassen', 'Vers ontbeend', 'Dagverse levering'],
    image: '/images/flanders-beef.jpg',
  },
  {
    id: 'varken',
    name: 'Familie Winckelmans',
    location: 'Brasvar & Certus',
    description:
      'Wij hebben 2 soorten varkens: het Brasvar varken en het Certus-varken. Beide worden van kop tot staart verwerkt in al onze verse en charcuterie bereidingen.',
    products: ['Brasvar varken', 'Certus varken', 'Volledige verwerking'],
    image: '/images/hero-meat.jpg',
  },
  {
    id: 'lam',
    name: 'Isla-meat Lennik',
    location: 'Texel lammeren',
    description:
      'Wekelijkse aanvoer van volledige karkassen texel lammeren. De beste lammeren worden zorgvuldig geselecteerd voor optimale kwaliteit.',
    products: ['Texel lammeren', 'Volledige karkassen', 'Wekelijkse aanvoer'],
    image: '/images/tomahawk-steak.jpg',
  },
  {
    id: 'kalf',
    name: 'Familie Verhaeren',
    location: 'De rustige Kempen',
    description:
      'De kalveren worden door familie Verhaeren gekweekt in de rustige Kempen. Deze worden ook steeds in volledig karkas aangeleverd.',
    products: ['Kalfsvlees', 'Volledige karkassen', 'Kempense kwaliteit'],
    image: '/images/ribeye-steak.jpg',
  },
];

const Origin = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [activeSupplier, setActiveSupplier] = useState<string>('rund');

  useEffect(() => {
    const isMobile = window.matchMedia('(max-width: 1023px)').matches;

    if (isMobile) {
      // Skip animations on mobile
      gsap.set(['.origin-header', '.map-container', '.info-panel'], { opacity: 1, y: 0, x: 0, scale: 1 });
      return;
    }

    const ctx = gsap.context(() => {
      // Header animation
      gsap.fromTo(
        '.origin-header',
        { y: 50, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 1,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: '.origin-header',
            start: 'top 85%',
            toggleActions: 'play none none reverse',
          },
        }
      );

      // Map draw animation
      gsap.fromTo(
        '.map-container',
        { opacity: 0, scale: 0.9 },
        {
          opacity: 1,
          scale: 1,
          duration: 1,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: '.map-container',
            start: 'top 80%',
            toggleActions: 'play none none reverse',
          },
        }
      );

      // Hotspots stagger animation - smoother stagger like FreshBox
      gsap.fromTo(
        '.hotspot',
        { scale: 0.95, opacity: 0, y: 20 },
        {
          scale: 1,
          opacity: 1,
          y: 0,
          duration: 0.8,
          stagger: 0.1,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: '.map-container',
            start: 'top 70%',
            toggleActions: 'play none none reverse',
          },
        }
      );

      // Info panel animation
      gsap.fromTo(
        '.info-panel',
        { x: 50, opacity: 0 },
        {
          x: 0,
          opacity: 1,
          duration: 1,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: '.info-panel',
            start: 'top 80%',
            toggleActions: 'play none none reverse',
          },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const currentSupplier = suppliers.find((s) => s.id === activeSupplier);

  return (
    <section
      id="origin"
      ref={sectionRef}
      className="w-full py-24 lg:py-32 bg-brand-background"
    >
      <div className="w-full px-6 lg:px-12 xl:px-24">
        {/* Header */}
        <div className="origin-header text-center mb-16">
          <span className="text-brand-accent font-medium tracking-wider uppercase text-sm">
            Kwaliteit & Herkomst
          </span>
          <h2 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-brand-text mt-4 mb-6">
            Van Boer tot Bord
          </h2>
          <p className="text-lg text-brand-text/70 max-w-3xl mx-auto">
            Wij geloven in transparantie over onze keten. De oorsprong van ons
            vlees is uiterst belangrijk. Kwaliteit uit eigen land primeert.
          </p>
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
          {/* Left: Interactive Map */}
          <div className="map-container relative">
            <div className="bg-brand-secondary rounded-3xl p-8 lg:p-12">
              <h3 className="font-display text-2xl font-bold text-brand-text mb-8">
                Onze Leveranciers
              </h3>

              {/* Supplier List */}
              <div className="space-y-4">
                {suppliers.map((supplier) => (
                  <button
                    key={supplier.id}
                    onClick={() => setActiveSupplier(supplier.id)}
                    className={`hotspot w-full text-left p-4 rounded-xl transition-all duration-300 ${
                      activeSupplier === supplier.id
                        ? 'bg-brand-primary text-white shadow-lg'
                        : 'bg-white hover:bg-white/80 text-brand-text'
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                          activeSupplier === supplier.id
                            ? 'bg-white/20'
                            : 'bg-brand-primary/10'
                        }`}
                      >
                        <MapPin
                          className={`w-5 h-5 ${
                            activeSupplier === supplier.id
                              ? 'text-white'
                              : 'text-brand-primary'
                          }`}
                        />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold">{supplier.name}</h4>
                        <p
                          className={`text-sm ${
                            activeSupplier === supplier.id
                              ? 'text-white/70'
                              : 'text-brand-text/60'
                          }`}
                        >
                          {supplier.location}
                        </p>
                      </div>
                      <ArrowRight
                        className={`w-5 h-5 transition-transform ${
                          activeSupplier === supplier.id
                            ? 'translate-x-1'
                            : ''
                        } ${
                          activeSupplier === supplier.id
                            ? 'text-white'
                            : 'text-brand-text/40'
                        }`}
                      />
                    </div>
                  </button>
                ))}
              </div>

              {/* Quote */}
              <div className="mt-8 p-6 bg-white rounded-xl">
                <p className="text-brand-text/80 italic text-sm leading-relaxed">
                  "Onnodig lange transporten van rund, kalf, varken of lam worden
                  steeds vermeden. Doordat we de karkassen zo volledig mogelijk
                  aankopen, zelf ontbenen en versnijden kunnen we de kwaliteit
                  steeds garanderen."
                </p>
              </div>
            </div>
          </div>

          {/* Right: Info Panel */}
          <div className="info-panel">
            {currentSupplier && (
              <div className="bg-white rounded-3xl overflow-hidden shadow-xl">
                {/* Image */}
                <div className="relative h-64">
                  <img
                    src={currentSupplier.image}
                    alt={currentSupplier.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <div className="absolute bottom-6 left-6 right-6">
                    <span className="inline-block px-3 py-1 bg-brand-accent text-brand-text text-xs font-medium rounded-full mb-2">
                      {currentSupplier.location}
                    </span>
                    <h3 className="font-display text-3xl font-bold text-white">
                      {currentSupplier.name}
                    </h3>
                  </div>
                </div>

                {/* Content */}
                <div className="p-8">
                  <p className="text-brand-text/80 leading-relaxed mb-6">
                    {currentSupplier.description}
                  </p>

                  <h4 className="font-semibold text-brand-text mb-4">
                    Producten
                  </h4>
                  <ul className="space-y-3">
                    {currentSupplier.products.map((product, idx) => (
                      <li key={idx} className="flex items-center gap-3">
                        <div className="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                          <Check className="w-3 h-3 text-green-600" />
                        </div>
                        <span className="text-brand-text/70">{product}</span>
                      </li>
                    ))}
                  </ul>

                  {/* Additional Info */}
                  <div className="mt-8 pt-6 border-t border-brand-primary/10">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="text-center p-4 bg-brand-secondary rounded-xl">
                        <div className="font-display text-2xl font-bold text-brand-primary mb-1">
                          100%
                        </div>
                        <div className="text-xs text-brand-text/60">
                          Belgisch
                        </div>
                      </div>
                      <div className="text-center p-4 bg-brand-secondary rounded-xl">
                        <div className="font-display text-2xl font-bold text-brand-primary mb-1">
                          Vers
                        </div>
                        <div className="text-xs text-brand-text/60">
                          Dagelijkse aanvoer
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* History Section */}
        <div className="mt-20">
          <div className="bg-brand-primary rounded-3xl p-8 lg:p-12 text-white">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
              <div>
                <h3 className="font-display text-3xl lg:text-4xl font-bold mb-4">
                  Geschiedenis van de Zaak
                </h3>
                <p className="text-white/80 leading-relaxed mb-6">
                  Slagerij De Valck is opgericht door de gebroeders Frans en Edwig
                  De Valck op de Merchtemsesteenweg te Wolvertem. Zij leerden de
                  stiel in Brussel. Edwig startte zijn eigen zaak en later
                  versterkte hun moeder de beenhouwerij.
                </p>
                <p className="text-white/80 leading-relaxed">
                  De winkel verhuisde naar een splinternieuw pand op het
                  gemeenteplein van Wolvertem. Filiep en Lena studeerden aan
                  COOVI-CERIA. Onze eerste professionele stappen zetten ook wij in
                  enkele bekende Brusselse zaken. In 2010 namen Lena en ik het
                  roer ook officieel over.
                </p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 text-center">
                  <div className="font-display text-4xl lg:text-5xl font-bold text-brand-accent mb-2">
                    1968
                  </div>
                  <div className="text-white/70 text-sm">Oprichting</div>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 text-center">
                  <div className="font-display text-4xl lg:text-5xl font-bold text-brand-accent mb-2">
                    2010
                  </div>
                  <div className="text-white/70 text-sm">2e Generatie</div>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 text-center">
                  <div className="font-display text-4xl lg:text-5xl font-bold text-brand-accent mb-2">
                    3e
                  </div>
                  <div className="text-white/70 text-sm">Generatie</div>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 text-center">
                  <div className="font-display text-4xl lg:text-5xl font-bold text-brand-accent mb-2">
                    ∞
                  </div>
                  <div className="text-white/70 text-sm">Toekomst</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Origin;
