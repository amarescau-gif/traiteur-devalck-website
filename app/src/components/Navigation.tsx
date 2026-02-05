import { useState, useEffect, useCallback, memo } from 'react';
import { Menu, X, ShoppingBag, Phone, MapPin, Clock, Briefcase, ExternalLink } from 'lucide-react';
import { gsap } from 'gsap';
import { Link, useLocation } from 'react-router-dom';

interface NavigationProps {
  isModalOpen?: boolean;
}

// Navigation items with icons for mobile
const navItems = [
  { label: 'Home', href: '#hero' },
  { label: 'Over Ons', href: '#about' },
  { label: 'Specialiteiten', href: '#specialties' },
  { label: 'Fresh-Box', href: '#freshbox' },
  { label: 'BBQ & Feesten', href: '#catering' },
  { label: 'Herkomst', href: '#origin' },
  { label: 'Galerij', href: '#gallery' },
  { label: 'Contact', href: '#contact' },
];

// Address for navigation
const ADDRESS = 'Gemeenteplein 8, 1861 Wolvertem, België';
const ENCODED_ADDRESS = encodeURIComponent(ADDRESS);

// Map options
const mapApps = [
  {
    name: 'Google Maps',
    url: `https://www.google.com/maps/dir/?api=1&destination=${ENCODED_ADDRESS}`,
    color: '#4285F4',
  },
  {
    name: 'Waze',
    url: `https://waze.com/ul?q=${ENCODED_ADDRESS}`,
    color: '#00A6FF',
  },
  {
    name: 'Apple Kaarten',
    url: `maps://maps.apple.com/?daddr=${ENCODED_ADDRESS}`,
    color: '#555555',
  },
];

const Navigation = memo(({ isModalOpen = false }: NavigationProps) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMapModalOpen, setIsMapModalOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('#hero');
  const location = useLocation();
  const isHomePage = location.pathname === '/';

  // Handle scroll with passive listener
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 100);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Track active section using Intersection Observer (only on home page)
  useEffect(() => {
    if (!isHomePage) return;
    
    const observerOptions = {
      rootMargin: '-50% 0px -50% 0px',
      threshold: 0,
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActiveSection(`#${entry.target.id}`);
        }
      });
    }, observerOptions);

    // Observe all sections
    navItems.forEach((item) => {
      const section = document.querySelector(item.href);
      if (section) observer.observe(section);
    });

    return () => observer.disconnect();
  }, [isHomePage]);

  // Animate nav items on load
  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    gsap.fromTo(
      '.nav-item',
      { y: -20, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.6, stagger: 0.15, ease: 'power2.out', delay: 0.8 }
    );
    gsap.fromTo(
      '.nav-vacature-btn',
      { y: -20, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.6, ease: 'power2.out', delay: 2.2 }
    );
    gsap.fromTo(
      '.nav-webshop-btn',
      { y: -20, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.6, ease: 'power2.out', delay: 2.5 }
    );
  }, []);

  // Smooth scroll to section or navigate
  const scrollToSection = useCallback((href: string) => {
    if (!isHomePage) {
      // Navigate to home page with hash
      window.location.href = '/' + href;
      return;
    }
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    setIsMobileMenuOpen(false);
  }, [isHomePage]);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isMobileMenuOpen]);

  // Handle route button click
  const handleRouteClick = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsMapModalOpen(true);
  };

  // Close map modal
  const closeMapModal = () => {
    setIsMapModalOpen(false);
  };

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ease-custom-expo ${
          isModalOpen
            ? 'opacity-20 pointer-events-none'
            : isScrolled
            ? 'bg-brand-background/95 backdrop-blur-md shadow-lg py-3'
            : 'bg-transparent py-6'
        }`}
        role="navigation"
        aria-label="Hoofdnavigatie"
      >
        <div className="w-full px-6 lg:px-12">
          <div className="flex items-center justify-between lg:justify-start lg:gap-12">
            {/* Logo - Centered on mobile, left on desktop */}
            <Link
              to="/"
              onClick={(e) => {
                if (isHomePage) {
                  e.preventDefault();
                  scrollToSection('#hero');
                }
              }}
              className="flex items-center gap-3 group lg:static absolute lg:relative left-1/2 lg:left-auto -translate-x-1/2 lg:translate-x-0"
              aria-label="De Valck - Ga naar home"
            >
              <img
                src="/logo-de-valck.png"
                alt="De Valck - Beenhouwerij & Traiteur"
                className="hidden lg:block h-16 w-auto transition-all duration-300 object-contain"
                style={{
                  filter: isScrolled ? 'none' : 'brightness(0) invert(1)',
                }}
              />
              <img
                src="/images/logo-mobiel.png"
                alt="De Valck - Beenhouwerij & Traiteur"
                className="lg:hidden h-12 w-auto transition-all duration-300 object-contain"
                style={{
                  filter: isScrolled ? 'none' : 'brightness(0) invert(1)',
                }}
              />
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center gap-8 ml-auto pr-4">
              {navItems.map((item) => (
                <a
                  key={item.href}
                  href={isHomePage ? item.href : '/' + item.href}
                  onClick={(e) => {
                    if (isHomePage) {
                      e.preventDefault();
                      scrollToSection(item.href);
                    }
                  }}
                  className={`nav-item text-sm font-medium transition-all duration-300 hover:text-brand-accent relative group ${
                    isScrolled ? 'text-brand-text' : 'text-white'
                  } ${activeSection === item.href ? 'text-brand-accent' : ''}`}
                  aria-current={activeSection === item.href ? 'page' : undefined}
                >
                  {item.label}
                  <span 
                    className={`absolute -bottom-1 left-0 h-0.5 bg-brand-accent transition-all duration-300 ${
                      activeSection === item.href ? 'w-full' : 'w-0 group-hover:w-full'
                    }`} 
                  />
                </a>
              ))}
            </div>

            {/* CTA Buttons */}
            <div className="flex items-center gap-4">
              <Link
                to="/vacature"
                className="nav-vacature-btn hidden sm:flex items-center gap-2 px-5 py-2.5 rounded-full font-medium text-sm transition-all duration-300 bg-brand-accent text-brand-text hover:bg-white hover:scale-105 shadow-lg hover:shadow-xl w-32 justify-center"
                aria-label="Bekijk onze vacature"
              >
                <Briefcase className="w-4 h-4" aria-hidden="true" />
                Vacature
              </Link>
              <a
                href="https://webshop.traiteur-devalck.be/nl/"
                target="_blank"
                rel="noopener noreferrer"
                className="nav-webshop-btn hidden sm:flex items-center gap-2 px-5 py-2.5 rounded-full font-medium text-sm transition-all duration-300 bg-brand-primary text-white hover:bg-brand-primary/90 hover:scale-105 shadow-lg hover:shadow-xl w-32 justify-center"
                aria-label="Open webshop (opent in nieuw tabblad)"
              >
                <ShoppingBag className="w-4 h-4" aria-hidden="true" />
                Webshop
              </a>

              {/* Mobile Menu Button - Pushed to right on mobile */}
              <button
                onClick={() => setIsMobileMenuOpen((prev) => !prev)}
                className={`lg:hidden p-2 rounded-lg transition-colors ml-auto ${
                  isScrolled ? 'text-brand-text' : 'text-white'
                }`}
                aria-label={isMobileMenuOpen ? 'Sluit menu' : 'Open menu'}
                aria-expanded={isMobileMenuOpen}
                aria-controls="mobile-menu"
              >
                {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      <div
        id="mobile-menu"
        className={`fixed inset-0 z-40 lg:hidden ${
          isMobileMenuOpen 
            ? 'opacity-100 pointer-events-auto' 
            : 'opacity-0 pointer-events-none'
        }`}
        aria-hidden={!isMobileMenuOpen}
      >
        <div className={`absolute inset-0 backdrop-blur-lg transition-colors duration-300 ${
          isScrolled ? 'bg-white/98' : 'bg-brand-primary/98'
        }`} />
        <div className={`relative h-full flex flex-col transition-colors duration-300 ${
          isScrolled ? 'bg-white' : 'bg-brand-primary'
        }`}>
          {/* Mobile Menu Header - Empty, just spacing */}
          <div className={`flex items-center px-6 py-6 border-b transition-colors duration-300 ${
            isScrolled ? 'border-gray-200' : 'border-white/10'
          }`}>
          </div>

          {/* Mobile Menu Items */}
          <nav className="flex-1 overflow-y-auto py-8 px-6" aria-label="Mobiele navigatie">
            <ul className="space-y-1">
              {navItems.map((item, index) => (
                <li key={item.href}>
                  <a
                    href={isHomePage ? item.href : '/' + item.href}
                    onClick={(e: React.MouseEvent<HTMLAnchorElement>) => {
                      if (isHomePage) {
                        e.preventDefault();
                        scrollToSection(item.href);
                      }
                    }}
                    className={`block py-4 px-4 font-display text-xl rounded-xl transition-all duration-300 ${
                      isScrolled 
                        ? activeSection === item.href
                          ? 'bg-brand-accent/10 text-brand-text'
                          : 'hover:bg-gray-100 text-brand-text'
                        : activeSection === item.href
                          ? 'bg-white/10 text-brand-accent'
                          : 'hover:bg-white/5 text-white'
                    }`}
                    style={{
                      animationDelay: `${index * 80}ms`,
                    }}
                    aria-current={activeSection === item.href ? 'page' : undefined}
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          {/* Mobile Menu Footer - Quick Actions */}
          <div className={`border-t p-6 space-y-4 transition-colors duration-300 ${
            isScrolled ? 'border-gray-200 bg-white' : 'border-white/10 bg-brand-primary'
          }`}>
            {/* Quick Contact */}
            <div className="flex gap-3">
              <a
                href="tel:022691305"
                className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl transition-colors ${
                  isScrolled 
                    ? 'bg-gray-100 text-brand-text hover:bg-gray-200' 
                    : 'bg-white/10 text-white hover:bg-white/20'
                }`}
              >
                <Phone className="w-5 h-5" aria-hidden="true" />
                <span className="text-sm font-medium">02/269.13.05</span>
              </a>
              <button
                onClick={handleRouteClick}
                className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl transition-colors ${
                  isScrolled 
                    ? 'bg-gray-100 text-brand-text hover:bg-gray-200' 
                    : 'bg-white/10 text-white hover:bg-white/20'
                }`}
              >
                <MapPin className="w-5 h-5" aria-hidden="true" />
                <span className="text-sm font-medium">Route</span>
              </button>
            </div>

            {/* Webshop CTA */}
            <a
              href="https://webshop.traiteur-devalck.be/nl/"
              target="_blank"
              rel="noopener noreferrer"
              className={`flex items-center justify-center gap-2 w-full px-6 py-4 rounded-xl font-medium text-lg transition-colors shadow-lg ${
                isScrolled 
                  ? 'bg-brand-primary text-white hover:bg-brand-primary/90' 
                  : 'bg-brand-primary text-white hover:bg-brand-primary/90'
              }`}
            >
              <ShoppingBag className="w-5 h-5" aria-hidden="true" />
              Bestel Online
            </a>

            {/* Vacature CTA */}
            <Link
              to="/vacature"
              className={`flex items-center justify-center gap-2 w-full px-6 py-4 rounded-xl font-medium text-lg transition-colors shadow-lg ${
                isScrolled 
                  ? 'bg-brand-accent text-brand-text hover:bg-white' 
                  : 'bg-brand-accent text-brand-text hover:bg-white'
              }`}
            >
              <Briefcase className="w-5 h-5" aria-hidden="true" />
              Vacature
            </Link>

            {/* Opening Hours */}
            <div className={`flex items-center justify-center gap-2 text-sm ${
              isScrolled ? 'text-gray-500' : 'text-white/60'
            }`}>
              <Clock className="w-4 h-4" aria-hidden="true" />
              <span>Ma-Vr: 8u-18u | Za: 7u30-17u</span>
            </div>
          </div>
        </div>
      </div>

      {/* Map Selection Modal */}
      {isMapModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
          onClick={closeMapModal}
        >
          <div
            className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-display text-xl font-bold text-brand-text">
                Open route in
              </h3>
              <button
                onClick={closeMapModal}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                aria-label="Sluiten"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>
            <p className="text-sm text-gray-500 mb-4">{ADDRESS}</p>
            <div className="space-y-3">
              {mapApps.map((app) => (
                <a
                  key={app.name}
                  href={app.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-4 p-4 rounded-xl border border-gray-200 hover:shadow-md transition-all hover:scale-[1.02]"
                >
                  <span className="text-xl font-bold" style={{ color: app.color }}>{app.name.charAt(0)}</span>
                  <div className="flex-1">
                    <span className="font-medium text-brand-text">{app.name}</span>
                  </div>
                  <ExternalLink className="w-4 h-4 text-gray-400" />
                </a>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
});

Navigation.displayName = 'Navigation';

export default Navigation;
