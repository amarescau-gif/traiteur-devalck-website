import { useState, useEffect, memo } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * ScrollProgress Component
 * 
 * Shows a progress bar at the top of the page indicating scroll progress
 * Improves user experience by showing reading progress.
 * Hidden on vacature page since progress is shown in BackToTop button there.
 */
const ScrollProgress = memo(() => {
  const [progress, setProgress] = useState(0);
  const location = useLocation();
  const isVacaturePage = location.pathname === '/vacature';

  useEffect(() => {
    // Don't show on vacature page - progress is shown in BackToTop button
    if (isVacaturePage) return;
    
    let rafId: number;
    let lastScrollY = window.scrollY;

    const updateProgress = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrollPercent = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
      setProgress(scrollPercent);
    };

    const handleScroll = () => {
      // Use requestAnimationFrame for smooth updates
      if (rafId) return;
      
      rafId = requestAnimationFrame(() => {
        if (Math.abs(window.scrollY - lastScrollY) > 5) {
          updateProgress();
          lastScrollY = window.scrollY;
        }
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

  // Don't render on vacature page
  if (isVacaturePage) return null;

  return (
    <div 
      className="fixed top-0 left-0 right-0 h-1 z-[60] bg-transparent"
      role="progressbar"
      aria-valuenow={Math.round(progress)}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label="Scroll voortgang"
    >
      <div 
        className="h-full bg-brand-accent transition-all duration-150 ease-out"
        style={{ width: `${progress}%` }}
      />
    </div>
  );
});

ScrollProgress.displayName = 'ScrollProgress';

export default ScrollProgress;
