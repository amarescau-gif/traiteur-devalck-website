import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { MapPin, Phone, Mail, Clock, ExternalLink, Copy, Check } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const Contact = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [copiedField, setCopiedField] = useState<string | null>(null);

  useEffect(() => {
    const isMobile = window.matchMedia('(max-width: 1023px)').matches;

    if (isMobile) {
      // Skip animations on mobile
      gsap.set(['.contact-header', '.contact-info', '.hours-card'], { opacity: 1, y: 0 });
      return;
    }

    const ctx = gsap.context(() => {
      // Header animation
      gsap.fromTo(
        '.contact-header',
        { y: 50, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 1,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: '.contact-header',
            start: 'top 85%',
            toggleActions: 'play none none reverse',
          },
        }
      );

      // Info cards animation
      gsap.fromTo(
        '.contact-info',
        { y: 30, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          stagger: 0.15,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: '.contact-grid',
            start: 'top 80%',
            toggleActions: 'play none none reverse',
          },
        }
      );

      // Hours animation
      gsap.fromTo(
        '.hours-card',
        { x: 50, opacity: 0 },
        {
          x: 0,
          opacity: 1,
          duration: 1,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: '.hours-card',
            start: 'top 80%',
            toggleActions: 'play none none reverse',
          },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const copyToClipboard = (text: string, field: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const contactInfo = [
    {
      icon: MapPin,
      title: 'Adres',
      content: 'Gemeenteplein 8\n1861 Wolvertem (Meise)',
      action: {
        label: 'Route plannen',
        href: 'https://www.google.com/maps/dir/?api=1&destination=Gemeenteplein+8,+1861+Wolvertem,+België',
      },
    },
    {
      icon: Phone,
      title: 'Telefoon',
      content: '02/269.13.05',
      copyValue: '022691305',
    },
    {
      icon: Mail,
      title: 'E-mail',
      content: 'info@traiteur-devalck.be',
      copyValue: 'info@traiteur-devalck.be',
    },
  ];

  const openingHours = [
    { day: 'Maandag', hours: '8u - 18u', open: true },
    { day: 'Dinsdag', hours: '8u - 18u', open: true },
    { day: 'Woensdag', hours: '8u - 18u', open: true },
    { day: 'Donderdag', hours: 'Gesloten', open: false },
    { day: 'Vrijdag', hours: '8u - 18u', open: true },
    { day: 'Zaterdag', hours: '7u30 - 17u', open: true },
    { day: 'Zondag', hours: 'Gesloten', open: false },
  ];

  // Get current day
  const currentDay = new Date().getDay();
  const dayNames = ['Zondag', 'Maandag', 'Dinsdag', 'Woensdag', 'Donderdag', 'Vrijdag', 'Zaterdag'];
  const todayName = dayNames[currentDay];

  return (
    <section
      id="contact"
      ref={sectionRef}
      className="w-full py-24 lg:py-32 bg-brand-primary text-white"
    >
      <div className="w-full px-6 lg:px-12 xl:px-24">
        {/* Header */}
        <div className="contact-header text-center mb-16">
          <span className="text-brand-accent font-medium tracking-wider uppercase text-sm">
            Contact
          </span>
          <h2 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold mt-4 mb-6">
            Kom Proeven
          </h2>
          <p className="text-lg text-white/70 max-w-2xl mx-auto">
            Bezoek onze winkel en ervaar zelf de kwaliteit en passie die wij in
            elk product stoppen.
          </p>
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
          {/* Left: Contact Info */}
          <div className="contact-grid space-y-6">
            {contactInfo.map((info, index) => (
              <div
                key={index}
                className="contact-info bg-white/10 backdrop-blur-sm rounded-2xl p-6 hover:bg-white/15 transition-colors"
              >
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-brand-accent/20 flex items-center justify-center flex-shrink-0">
                    <info.icon className="w-6 h-6 text-brand-accent" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-display text-xl font-semibold mb-2">
                      {info.title}
                    </h3>
                    <p className="text-white/80 whitespace-pre-line mb-4">
                      {info.content}
                    </p>
                    {info.action && (
                      <a
                        href={info.action.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 text-brand-accent hover:text-white transition-colors"
                      >
                        {info.action.label}
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    )}
                    {info.copyValue && (
                      <button
                        onClick={() => copyToClipboard(info.copyValue!, info.title)}
                        className="inline-flex items-center gap-2 text-brand-accent hover:text-white transition-colors"
                      >
                        {copiedField === info.title ? (
                          <>
                            Gekopieerd
                            <Check className="w-4 h-4" />
                          </>
                        ) : (
                          <>
                            Kopiëren
                            <Copy className="w-4 h-4" />
                          </>
                        )}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}

            {/* Webshop CTA */}
            <div className="contact-info bg-brand-accent rounded-2xl p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-brand-primary/20 flex items-center justify-center flex-shrink-0">
                  <ExternalLink className="w-6 h-6 text-brand-primary" />
                </div>
                <div className="flex-1">
                  <h3 className="font-display text-xl font-semibold text-brand-primary mb-1">
                    Online Bestellen
                  </h3>
                  <p className="text-brand-primary/70 text-sm mb-3">
                    Bestel gemakkelijk via onze webshop
                  </p>
                  <a
                    href="https://webshop.traiteur-devalck.be/nl/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2 bg-brand-primary text-white rounded-full text-sm font-medium hover:bg-brand-primary/90 transition-colors"
                  >
                    Naar webshop
                    <ExternalLink className="w-4 h-4" />
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Right: Opening Hours */}
          <div className="hours-card bg-white/10 backdrop-blur-sm rounded-2xl p-8">
            <div className="flex items-center gap-4 mb-8">
              <div className="w-12 h-12 rounded-xl bg-brand-accent/20 flex items-center justify-center">
                <Clock className="w-6 h-6 text-brand-accent" />
              </div>
              <div>
                <h3 className="font-display text-2xl font-semibold">
                  Openingsuren
                </h3>
                <p className="text-white/60 text-sm">
                  Maandag tot vrijdag van 8u tot 18u
                </p>
              </div>
            </div>

            <div className="space-y-3">
              {openingHours.map((item, index) => (
                <div
                  key={index}
                  className={`flex items-center justify-between p-3 rounded-xl transition-colors ${
                    item.day === todayName
                      ? 'bg-brand-accent/20'
                      : 'hover:bg-white/5'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-2 h-2 rounded-full ${
                        item.open ? 'bg-green-400' : 'bg-red-400'
                      }`}
                    />
                    <span
                      className={`${
                        item.day === todayName
                          ? 'font-semibold text-white'
                          : 'text-white/80'
                      }`}
                    >
                      {item.day}
                    </span>
                    {item.day === todayName && (
                      <span className="px-2 py-0.5 bg-brand-accent text-brand-primary text-xs font-medium rounded-full">
                        Vandaag
                      </span>
                    )}
                  </div>
                  <span
                    className={`${
                      item.open ? 'text-white/80' : 'text-white/50'
                    }`}
                  >
                    {item.hours}
                  </span>
                </div>
              ))}
            </div>

            {/* Note */}
            <div className="mt-6 p-4 bg-white/5 rounded-xl">
              <p className="text-white/60 text-sm">
                <strong className="text-white">Let op:</strong> Bestellingen
                dienen steeds te gebeuren via de webshop voor de beste service.
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Info */}
        <div className="mt-16 pt-8 border-t border-white/10">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="font-display text-3xl font-bold text-brand-accent mb-2">
                BTW
              </div>
              <div className="text-white/60 text-sm">BE0876915533</div>
            </div>
            <div>
              <div className="font-display text-3xl font-bold text-brand-accent mb-2">
                Fax
              </div>
              <div className="text-white/60 text-sm">02/270.23.84</div>
            </div>
            <div>
              <div className="font-display text-3xl font-bold text-brand-accent mb-2">
                Sinds
              </div>
              <div className="text-white/60 text-sm">1968</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
