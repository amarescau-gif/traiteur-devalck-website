import { useState, useEffect, memo } from 'react';
import { ArrowUp } from 'lucide-react';
import { useLocation, Link } from 'react-router-dom';
import { Briefcase } from 'lucide-react';

/**
 * BackToTop Component with Circular Progress
 * 
 * Shows a button to scroll back to top with a circular progress indicator
 * On mobile, shows a Vacature button with notification badge instead
 * Hidden on vacature page for a clean single-page experience
 */
const BackToTop = memo(() => {
  const [isVisible, setIsVisible] = useState(false);
  const [progress, setProgress] = useState(0);
  const location = useLocation();
  const isVacaturePage = location.pathname === '/vacature';

  useEffect(() => {
    // Don't show on vacature page
    if (isVacaturePage) return;
    
    let rafId: number;

    const updateProgress = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrollPercent = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
      setProgress(scrollPercent);
      
      // Show button when user scrolls past 500px
      setIsVisible(scrollTop > 500);
    };

    const handleScroll = () => {
      if (rafId) return;
      rafId = requestAnimationFrame(() => {
        updateProgress();
        rafId = 0;
      });
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    updateProgress();

    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, [isVacaturePage]);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  // Don't render on vacature page
  if (isVacaturePage) return null;

  // Calculate SVG circle properties
  const radius = 24;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  return (
    <div className="fixed bottom-8 right-8 z-50 flex flex-col items-center gap-3">
      {/* Vacature Button - Mobile Only - Small circular with badge */}
      <Link
        to="/vacature"
        className={`lg:hidden relative w-14 h-14 rounded-full bg-brand-primary text-white shadow-lg hover:bg-brand-primary/90 hover:scale-110 transition-all duration-300 flex items-center justify-center ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10 pointer-events-none'
        }`}
        aria-label="Bekijk onze vacature"
      >
        <Briefcase className="w-6 h-6" />
        {/* Red notification badge */}
        <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center text-xs font-bold text-white shadow-md">
          1
        </span>
      </Link>

      {/* Back to Top Button with Circular Progress - Desktop Only */}
      <button
        onClick={scrollToTop}
        className={`hidden lg:flex relative w-16 h-16 rounded-full bg-brand-primary text-white shadow-lg transition-all duration-300 hover:bg-brand-primary/90 hover:scale-110 hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-brand-accent focus:ring-offset-2 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10 pointer-events-none'
        }`}
        aria-label="Terug naar boven"
        aria-hidden={!isVisible}
      >
        {/* Circular Progress SVG */}
        <svg
          className="absolute inset-0 w-full h-full -rotate-90"
          viewBox="0 0 56 56"
          aria-hidden="true"
        >
          {/* Background circle */}
          <circle
            cx="28"
            cy="28"
            r={radius}
            fill="none"
            stroke="rgba(255,255,255,0.2)"
            strokeWidth="3"
          />
          {/* Progress circle */}
          <circle
            cx="28"
            cy="28"
            r={radius}
            fill="none"
            stroke="#d4a574"
            strokeWidth="3"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            style={{
              transition: 'stroke-dashoffset 0.1s ease-out',
            }}
          />
        </svg>
        
        {/* Arrow Icon */}
        <div className="absolute inset-0 flex items-center justify-center">
          <ArrowUp className="w-6 h-6" />
        </div>
      </button>
    </div>
  );
});

BackToTop.displayName = 'BackToTop';

export default BackToTop;
