import { useEffect, lazy, Suspense, useState, useCallback } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Navigation from './components/Navigation';
import SkipLink from './components/SkipLink';
import BackToTop from './components/BackToTop';
import SEO from './components/SEO';
import Hero from './sections/Hero';

// Lazy load sections below the fold for better initial load performance
const About = lazy(() => import('./sections/About'));
const Specialties = lazy(() => import('./sections/Specialties'));
const FreshBox = lazy(() => import('./sections/FreshBox'));
const Catering = lazy(() => import('./sections/Catering'));
const Origin = lazy(() => import('./sections/Origin'));
const Gallery = lazy(() => import('./sections/Gallery'));
const Careers = lazy(() => import('./sections/Careers'));
const Contact = lazy(() => import('./sections/Contact'));
const Footer = lazy(() => import('./sections/Footer'));

// Simple loading fallback
const SectionFallback = () => (
  <div className="w-full py-24 bg-brand-background">
    <div className="w-full px-6 lg:px-12 xl:px-24">
      <div className="animate-pulse">
        <div className="h-8 bg-brand-primary/10 rounded w-1/3 mb-4" />
        <div className="h-12 bg-brand-primary/10 rounded w-2/3 mb-8" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="h-64 bg-brand-primary/10 rounded-2xl" />
          <div className="h-64 bg-brand-primary/10 rounded-2xl" />
        </div>
      </div>
    </div>
  </div>
);

gsap.registerPlugin(ScrollTrigger);

// Home page component
function HomePage() {
  const [isSpecialtyModalOpen, setIsSpecialtyModalOpen] = useState(false);

  const handleSpecialtyModalChange = useCallback((isOpen: boolean) => {
    setIsSpecialtyModalOpen(isOpen);
  }, []);

  // Restore scroll position when returning from another page
  useEffect(() => {
    const savedScroll = sessionStorage.getItem('homepage-scroll');
    if (savedScroll) {
      // Small delay to ensure DOM is fully rendered
      setTimeout(() => {
        window.scrollTo({
          top: parseInt(savedScroll, 10),
          behavior: 'smooth'
        });
        // Clear the saved scroll position after restoring
        sessionStorage.removeItem('homepage-scroll');
      }, 100);
    }
  }, []);

  // Save scroll position before leaving the page
  useEffect(() => {
    const handleBeforeUnload = () => {
      sessionStorage.setItem('homepage-scroll', window.scrollY.toString());
    };
    
    // Also save on route change (using popstate event for back/forward navigation)
    const handleRouteChange = () => {
      sessionStorage.setItem('homepage-scroll', window.scrollY.toString());
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    window.addEventListener('popstate', handleRouteChange);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      window.removeEventListener('popstate', handleRouteChange);
    };
  }, []);

  return (
    <>
      <SEO />
      <SkipLink />
      <Navigation isModalOpen={isSpecialtyModalOpen} />
      <main id="main-content">
        <Hero />
        <Suspense fallback={<SectionFallback />}>
          <About />
        </Suspense>
        <Suspense fallback={<SectionFallback />}>
          <Specialties onModalChange={handleSpecialtyModalChange} />
        </Suspense>
        <Suspense fallback={<SectionFallback />}>
          <FreshBox />
        </Suspense>
        <Suspense fallback={<SectionFallback />}>
          <Catering />
        </Suspense>
        <Suspense fallback={<SectionFallback />}>
          <Origin />
        </Suspense>
        <Suspense fallback={<SectionFallback />}>
          <Gallery />
        </Suspense>
        <Suspense fallback={<SectionFallback />}>
          <Contact />
        </Suspense>
        <Suspense fallback={<SectionFallback />}>
          <Footer />
        </Suspense>
      </main>
      <BackToTop />
    </>
  );
}

// Vacature page component
function VacaturePage() {
  return (
    <>
      <SEO 
        title="Vacature - Slager-Traiteur De Valck"
        description="Kom werken bij Slager-Traiteur De Valck. We zoeken een gemotiveerde medewerker voor onze slagerij in Wolvertem."
      />
      <main id="main-content">
        <Suspense fallback={<SectionFallback />}>
          <Careers />
        </Suspense>
      </main>
    </>
  );
}

function App() {
  useEffect(() => {
    // Check if on mobile and disable all GSAP scroll effects
    const isMobile = window.matchMedia('(max-width: 1023px)').matches;

    if (isMobile) {
      // On mobile, kill all ScrollTriggers immediately and prevent new ones
      ScrollTrigger.config({
        ignoreMobileResize: true,
      });

      // Kill all existing triggers
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());

      // Force a refresh to ensure triggers are removed
      setTimeout(() => {
        ScrollTrigger.getAll().forEach(trigger => trigger.kill());
      }, 100);
    } else {
      // Configure ScrollTrigger for better performance on desktop
      ScrollTrigger.defaults({
        markers: false,
      });
    }

    // Use passive listeners for scroll events
    const handleResize = () => {
      if (!isMobile) {
        ScrollTrigger.refresh();
      }
    };

    window.addEventListener('resize', handleResize, { passive: true });

    // Only add scroll listener on desktop
    if (!isMobile) {
      let refreshTimeout: ReturnType<typeof setTimeout>;
      const throttledRefresh = () => {
        clearTimeout(refreshTimeout);
        refreshTimeout = setTimeout(() => {
          ScrollTrigger.refresh();
        }, 100);
      };
      window.addEventListener('scroll', throttledRefresh, { passive: true });

      return () => {
        window.removeEventListener('resize', handleResize);
        window.removeEventListener('scroll', throttledRefresh);
        clearTimeout(refreshTimeout);
        ScrollTrigger.getAll().forEach((trigger) => {
          if (trigger.vars.id !== 'persistent') {
            trigger.kill();
          }
        });
      };
    }

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <div className="min-h-screen bg-brand-background">
      <Router>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/vacature" element={<VacaturePage />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
