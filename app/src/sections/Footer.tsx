import { Facebook, Instagram, MapPin, Phone, Mail, ExternalLink } from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const quickLinks = [
    { label: 'Home', href: '#hero' },
    { label: 'Over Ons', href: '#about' },
    { label: 'Specialiteiten', href: '#specialties' },
    { label: 'Fresh-Box', href: '#freshbox' },
    { label: 'BBQ & Feesten', href: '#catering' },
    { label: 'Herkomst', href: '#origin' },
    { label: 'Galerij', href: '#gallery' },
    { label: 'Contact', href: '#contact' },
  ];

  const scrollToSection = (href: string) => {
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <footer className="w-full bg-brand-text text-white">
      {/* Main Footer */}
      <div className="w-full px-6 lg:px-12 xl:px-24 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-14 h-14 rounded-full bg-brand-primary flex items-center justify-center">
                <span className="text-brand-secondary font-display text-xl font-bold">
                  DV
                </span>
              </div>
              <div>
                <span className="font-display text-2xl font-semibold">
                  De Valck
                </span>
                <span className="block text-xs text-white/60">
                  Slager-Traiteur
                </span>
              </div>
            </div>
            <p className="text-white/70 text-sm leading-relaxed mb-6">
              Sinds 1968 staat Slager-traiteur De Valck bekend om zijn vers
              vlees, gevogelte en wild. Ambachtelijke kwaliteit met passie.
            </p>
            <div className="flex items-center gap-4">
              <a
                href="https://www.facebook.com/traiteurdevalck"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-brand-accent hover:text-brand-text transition-all"
                aria-label="Facebook"
              >
                <Facebook className="w-5 h-5" />
              </a>
              <a
                href="https://www.instagram.com/traiteurdevalck"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-brand-accent hover:text-brand-text transition-all"
                aria-label="Instagram"
              >
                <Instagram className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-display text-lg font-semibold mb-6">
              Snelle Links
            </h4>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    onClick={(e) => {
                      e.preventDefault();
                      scrollToSection(link.href);
                    }}
                    className="text-white/70 hover:text-brand-accent transition-colors text-sm"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="font-display text-lg font-semibold mb-6">
              Contact
            </h4>
            <ul className="space-y-4">
              <li>
                <a
                  href="https://www.google.com/maps/dir/?api=1&destination=Gemeenteplein+8,+1861+Wolvertem,+België"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-start gap-3 text-white/70 hover:text-brand-accent transition-colors text-sm"
                >
                  <MapPin className="w-5 h-5 flex-shrink-0 mt-0.5" />
                  <span>
                    Gemeenteplein 8
                    <br />
                    1861 Wolvertem (Meise)
                  </span>
                </a>
              </li>
              <li>
                <a
                  href="tel:022691305"
                  className="flex items-center gap-3 text-white/70 hover:text-brand-accent transition-colors text-sm"
                >
                  <Phone className="w-5 h-5 flex-shrink-0" />
                  <span>02/269.13.05</span>
                </a>
              </li>
              <li>
                <a
                  href="mailto:info@traiteur-devalck.be"
                  className="flex items-center gap-3 text-white/70 hover:text-brand-accent transition-colors text-sm"
                >
                  <Mail className="w-5 h-5 flex-shrink-0" />
                  <span>info@traiteur-devalck.be</span>
                </a>
              </li>
            </ul>
          </div>

          {/* Opening Hours */}
          <div>
            <h4 className="font-display text-lg font-semibold mb-6">
              Openingsuren
            </h4>
            <ul className="space-y-2 text-sm">
              <li className="flex justify-between text-white/70">
                <span>Ma - Wo - Vr</span>
                <span>8u - 18u</span>
              </li>
              <li className="flex justify-between text-white/70">
                <span>Di</span>
                <span>8u - 18u</span>
              </li>
              <li className="flex justify-between text-white/50">
                <span>Do</span>
                <span>Gesloten</span>
              </li>
              <li className="flex justify-between text-white/70">
                <span>Za</span>
                <span>7u30 - 17u</span>
              </li>
              <li className="flex justify-between text-white/50">
                <span>Zo</span>
                <span>Gesloten</span>
              </li>
            </ul>
            <a
              href="https://webshop.traiteur-devalck.be/nl/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 mt-6 px-5 py-2.5 bg-brand-accent text-brand-text rounded-full font-medium text-sm hover:bg-white transition-colors"
            >
              Online Bestellen
              <ExternalLink className="w-4 h-4" />
            </a>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="w-full px-6 lg:px-12 xl:px-24 py-6 border-t border-white/10">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-white/50 text-sm text-center md:text-left">
            &copy; {currentYear} Slager-Traiteur De Valck. Alle rechten
            voorbehouden.
          </p>
          <div className="flex items-center gap-6 text-sm">
            <span className="text-white/50">BTW: BE0876915533</span>
            <span className="text-white/50">|</span>
            <span className="text-white/50">Handmade in Belgium</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
