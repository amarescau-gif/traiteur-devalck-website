import { useEffect, useRef, useState, memo, useCallback } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Beef, Salad, Flame, UtensilsCrossed, Drumstick, Rabbit, ArrowRight } from 'lucide-react';
import Modal from '../components/Modal';

gsap.registerPlugin(ScrollTrigger);

interface Specialty {
  icon: React.ElementType;
  title: string;
  description: string;
  details: string[];
  image: string;
}

const specialties: Specialty[] = [
  {
    icon: Beef,
    title: 'Vers Vlees & Gevogelte',
    description: 'Premium kwaliteit vlees, dagvers geleverd door lokale boeren.',
    details: [
      'Rundvlees: Wit Blauw ras, vrouwelijk en 2-3 maal gekalfd',
      'Varkensvlees: Brasvar en Certus van familie Winckelmans',
      'Lamsvlees: Texel lammeren van Isla-meat Lennik',
      'Kalfsvlees: Gekweekt in de rustige Kempen',
      'Gevogelte: Mechelse koekoek, verse konijnen, vrije uitloop kippen',
    ],
    image: '/images/flanders-beef.jpg',
  },
  {
    icon: Salad,
    title: 'Huisgemaakte Salades',
    description: 'Trendsetter in salades op basis van yoghurt en vinaigrettes.',
    details: [
      'Verse dagelijkse bereidingen',
      'Op basis van natuurlijke yoghurt',
      'Huisgemaakte vinaigrettes',
      'Seizoensgebonden ingrediënten',
      'Perfect voor een snelle, gezonde maaltijd',
    ],
    image: '/images/fresh-salad.jpg',
  },
  {
    icon: Flame,
    title: 'BBQ & Feestformules',
    description: 'Van intieme gezelschappen tot 100 personen.',
    details: [
      'Complete BBQ formules aan huis',
      'Van aperitief tot dessert',
      'Gemarineerde vleespecialiteiten',
      'Professionele service mogelijk',
      'Perfect voor elk feest of event',
    ],
    image: '/images/bbq-flames.jpg',
  },
  {
    icon: UtensilsCrossed,
    title: 'Gourmets & Fondues',
    description: 'Gezellig tafelen met familie en vrienden.',
    details: [
      'Uitgebreide gourmet schotels',
      'Traditionele vleesfondue',
      'Kaasschotels met regionale kazen',
      'Verschillende formules beschikbaar',
      'Ideaal voor feestdagen',
    ],
    image: '/images/catering-buffet.jpg',
  },
  {
    icon: Drumstick,
    title: 'Charcuterie',
    description: 'Ambachtelijk bereid met respect voor traditie.',
    details: [
      'Huisgemaakte patés en terrines',
      'Gekookte en gerookte hammen',
      'Verschillende worstsoorten',
      'Seizoensgeboden specialiteiten',
      '70% van onze bereidingen zijn huisgemaakt',
    ],
    image: '/images/charcuterie-board.jpg',
  },
  {
    icon: Rabbit,
    title: 'Wild Seizoen',
    description: 'Tijdens het seizoen: vers wild van topkwaliteit.',
    details: [
      'Vers wild in het seizoen',
      'Verschillende wildsoorten',
      'Professioneel bereid',
      'Wildschotels op bestelling',
      'Wildweekends en speciale events',
    ],
    image: '/images/tomahawk-steak.jpg',
  },
];

interface SpecialtiesProps {
  onModalChange?: (isOpen: boolean) => void;
}

const Specialties = memo(({ onModalChange }: SpecialtiesProps) => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [selectedSpecialty, setSelectedSpecialty] = useState<Specialty | null>(null);
  const triggersRef = useRef<ScrollTrigger[]>([]);

  const handleCloseModal = useCallback(() => {
    setSelectedSpecialty(null);
    onModalChange?.(false);
  }, [onModalChange]);

  const handleOpenModal = useCallback((specialty: Specialty) => {
    setSelectedSpecialty(specialty);
    onModalChange?.(true);
  }, [onModalChange]);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const isMobile = window.matchMedia('(max-width: 1023px)').matches;

    if (prefersReducedMotion || isMobile) {
      // Skip animations on mobile and for reduced motion
      gsap.set(['.specialties-header', '.specialty-card'], { opacity: 1, y: 0, scale: 1 });
      return;
    }

    const ctx = gsap.context(() => {
      // Header animation - once only
      const headerTrigger = ScrollTrigger.create({
        trigger: '.specialties-header',
        start: 'top 85%',
        once: true,
        onEnter: () => {
          gsap.fromTo(
            '.specialties-header',
            { y: 40, opacity: 0 },
            { y: 0, opacity: 1, duration: 0.8, ease: 'power2.out' }
          );
        },
      });
      triggersRef.current.push(headerTrigger);

      // Cards stagger animation - once only
      const cardsTrigger = ScrollTrigger.create({
        trigger: '.specialties-grid',
        start: 'top 85%',
        once: true,
        onEnter: () => {
          gsap.fromTo(
            '.specialty-card',
            { y: 40, opacity: 0 },
            { y: 0, opacity: 1, duration: 0.7, stagger: 0.12, ease: 'power2.out' }
          );
        },
      });
      triggersRef.current.push(cardsTrigger);
    }, sectionRef);

    return () => {
      triggersRef.current.forEach(trigger => trigger.kill());
      triggersRef.current = [];
      ctx.revert();
    };
  }, []);

  // Lock body scroll when modal is open
  useEffect(() => {
    if (selectedSpecialty) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [selectedSpecialty]);

  return (
    <section
      id="specialties"
      ref={sectionRef}
      className="w-full py-24 lg:py-32 bg-brand-secondary"
    >
      <div className="w-full px-6 lg:px-12 xl:px-24">
        {/* Header */}
        <div className="specialties-header text-center mb-16" style={{ opacity: 0 }}>
          <span className="text-brand-accent font-medium tracking-wider uppercase text-sm">
            Ons Assortiment
          </span>
          <h2 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-brand-text mt-4 mb-6">
            Onze Specialiteiten
          </h2>
          <p className="text-lg text-brand-text/70 max-w-2xl mx-auto">
            Van ambachtelijk vlees tot gastronomische traiteur. Ontdek ons
            uitgebreide aanbod van kwaliteitsproducten.
          </p>
        </div>

        {/* Grid */}
        <div className="specialties-grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {specialties.map((specialty, index) => (
            <div
              key={index}
              className="specialty-card group relative bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 cursor-pointer"
              onClick={() => handleOpenModal(specialty)}
              style={{ opacity: 0 }}
            >
              {/* Image */}
              <div className="relative h-48 overflow-hidden">
                <img
                  src={specialty.image}
                  alt={specialty.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  loading="lazy"
                  decoding="async"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                
                {/* Icon Badge */}
                <div className="absolute top-4 left-4 w-12 h-12 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center shadow-lg">
                  <specialty.icon className="w-6 h-6 text-brand-primary" />
                </div>
              </div>

              {/* Content */}
              <div className="p-6">
                <h3 className="font-display text-xl font-bold text-brand-text mb-2 group-hover:text-brand-primary transition-colors">
                  {specialty.title}
                </h3>
                <p className="text-brand-text/70 text-sm leading-relaxed mb-4">
                  {specialty.description}
                </p>
                <div className="flex items-center text-brand-accent font-medium text-sm">
                  <span>Meer info</span>
                  <ArrowRight className="w-4 h-4 ml-1 transition-transform group-hover:translate-x-1" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modal */}
      <Modal 
        isOpen={!!selectedSpecialty} 
        onClose={handleCloseModal}
        title={selectedSpecialty?.title}
      >
        {selectedSpecialty && (
          <>
            {/* Image */}
            <div className="relative h-64">
              <img
                src={selectedSpecialty.image}
                alt={selectedSpecialty.title}
                className="w-full h-full object-cover"
                loading="eager"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              <div className="absolute bottom-6 left-6 right-6">
                <div className="w-14 h-14 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center shadow-lg mb-4">
                  <selectedSpecialty.icon className="w-7 h-7 text-brand-primary" />
                </div>
                <h3 className="font-display text-3xl font-bold text-white" id="modal-title">
                  {selectedSpecialty.title}
                </h3>
              </div>
            </div>

            {/* Content */}
            <div className="p-8">
              <p className="text-lg text-brand-text/80 mb-6">
                {selectedSpecialty.description}
              </p>
              <h4 className="font-display text-xl font-bold text-brand-text mb-4">
                Wat bieden we aan?
              </h4>
              <ul className="space-y-3">
                {selectedSpecialty.details.map((detail, idx) => (
                  <li key={idx} className="flex items-start gap-3">
                    <div className="w-2 h-2 rounded-full bg-brand-accent mt-2 flex-shrink-0" />
                    <span className="text-brand-text/70">{detail}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-8 pt-6 border-t border-brand-primary/10">
                <a
                  href="https://webshop.traiteur-devalck.be/nl/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-brand-primary text-white rounded-full font-medium hover:bg-brand-primary/90 transition-colors"
                >
                  Bekijk in webshop
                  <ArrowRight className="w-4 h-4" />
                </a>
              </div>
            </div>
          </>
        )}
      </Modal>
    </section>
  );
});

Specialties.displayName = 'Specialties';

export default Specialties;
