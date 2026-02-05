/**
 * SkipLink Component
 * 
 * Accessibility feature that allows keyboard users to skip to main content
 * This is essential for WCAG compliance and improves keyboard navigation
 */

const SkipLink = () => {
  return (
    <a
      href="#main-content"
      className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[100] 
                 focus:px-6 focus:py-3 focus:bg-brand-primary focus:text-white 
                 focus:rounded-lg focus:font-medium focus:shadow-lg
                 focus:outline-none focus:ring-2 focus:ring-brand-accent focus:ring-offset-2"
    >
      Ga naar hoofdinhoud
    </a>
  );
};

export default SkipLink;
