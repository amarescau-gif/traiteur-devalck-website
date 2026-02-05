/**
 * SEO Component
 * 
 * Handles all SEO-related meta tags, structured data, and accessibility improvements
 * Improves search engine visibility and social sharing
 */
import { useEffect } from 'react';

interface SEOProps {
  title?: string;
  description?: string;
  image?: string;
  url?: string;
}

const SEO = ({
  title = 'Slager-Traiteur De Valck | Ambachtelijk sinds 1968',
  description = 'Sinds 1968 staat Slager-traiteur De Valck bekend om vers vlees, gevogelte en wild. Trendsetter in salades, BBQ & feestformules. Wolvertem, Meise.',
  image = '/images/hero-meat.jpg',
  url = 'https://www.traiteur-devalck.be',
}: SEOProps) => {
  useEffect(() => {
    // Update document title
    document.title = title;

    // Helper function to update or create meta tag
    const setMetaTag = (name: string, content: string, property = false) => {
      const selector = property ? `meta[property="${name}"]` : `meta[name="${name}"]`;
      let meta = document.querySelector(selector) as HTMLMetaElement;
      if (!meta) {
        meta = document.createElement('meta');
        if (property) {
          meta.setAttribute('property', name);
        } else {
          meta.setAttribute('name', name);
        }
        document.head.appendChild(meta);
      }
      meta.content = content;
    };

    // Basic Meta Tags
    setMetaTag('description', description);
    setMetaTag('keywords', 'slager, traiteur, vlees, BBQ, catering, Wolvertem, Meise, vers vlees, beenhouwerij, feestformules');
    setMetaTag('author', 'Slager-Traiteur De Valck');
    setMetaTag('robots', 'index, follow');
    setMetaTag('viewport', 'width=device-width, initial-scale=1.0');

    // Open Graph / Facebook
    setMetaTag('og:type', 'website', true);
    setMetaTag('og:url', url, true);
    setMetaTag('og:title', title, true);
    setMetaTag('og:description', description, true);
    setMetaTag('og:image', `${url}${image}`, true);
    setMetaTag('og:locale', 'nl_BE', true);
    setMetaTag('og:site_name', 'Slager-Traiteur De Valck', true);

    // Twitter
    setMetaTag('twitter:card', 'summary_large_image');
    setMetaTag('twitter:url', url);
    setMetaTag('twitter:title', title);
    setMetaTag('twitter:description', description);
    setMetaTag('twitter:image', `${url}${image}`);

    // Theme Color for mobile browsers
    let themeColor = document.querySelector('meta[name="theme-color"]') as HTMLMetaElement;
    if (!themeColor) {
      themeColor = document.createElement('meta');
      themeColor.setAttribute('name', 'theme-color');
      document.head.appendChild(themeColor);
    }
    themeColor.content = '#4a1c1c';

    // Canonical URL
    let canonical = document.querySelector('link[rel="canonical"]') as HTMLLinkElement;
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.setAttribute('rel', 'canonical');
      document.head.appendChild(canonical);
    }
    canonical.href = url;

    // Cleanup function
    return () => {
      // Meta tags are typically not removed as they persist across route changes
    };
  }, [title, description, image, url]);

  // Structured Data (JSON-LD)
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name: 'Slager-Traiteur De Valck',
    description: description,
    url: url,
    telephone: '+32-2-269-13-05',
    email: 'info@traiteur-devalck.be',
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'Gemeenteplein 8',
      addressLocality: 'Wolvertem',
      addressRegion: 'Vlaams-Brabant',
      postalCode: '1861',
      addressCountry: 'BE',
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: '50.9667',
      longitude: '4.3167',
    },
    openingHoursSpecification: [
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Friday'],
        opens: '08:00',
        closes: '18:00',
      },
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: 'Thursday',
        opens: '00:00',
        closes: '00:00',
      },
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: 'Saturday',
        opens: '07:30',
        closes: '17:00',
      },
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: 'Sunday',
        opens: '00:00',
        closes: '00:00',
      },
    ],
    priceRange: '€€',
    image: `${url}${image}`,
    sameAs: [
      'https://www.facebook.com/traiteurdevalck',
      'https://www.instagram.com/traiteurdevalck',
    ],
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: 'Slagerij & Traiteur Diensten',
      itemListElement: [
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: 'Vers Vlees & Gevogelte',
          },
        },
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: 'BBQ & Feestformules',
          },
        },
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: 'Huisgemaakte Salades',
          },
        },
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: 'Catering',
          },
        },
      ],
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  );
};

export default SEO;
