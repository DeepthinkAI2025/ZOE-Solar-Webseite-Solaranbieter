/**
 * SEO Head Component für ZOE Solar
 *
 * Optimiert alle Meta-Tags und strukturierten Daten für deutsche SEO
 */

import Head from 'next/head';
import { useRouter } from 'next/router';

interface SEOHeadProps {
  title?: string;
  description?: string;
  keywords?: string;
  canonical?: string;
  ogImage?: string;
  article?: boolean;
  publishedTime?: string;
  modifiedTime?: string;
  author?: string;
  section?: string;
  tags?: string[];
  noIndex?: boolean;
  jsonLd?: any;
}

const SEOHead: React.FC<SEOHeadProps> = ({
  title,
  description,
  keywords,
  canonical,
  ogImage = 'https://zoe-solar.de/images/og-default.jpg',
  article = false,
  publishedTime,
  modifiedTime,
  author = 'ZOE Solar GmbH',
  section,
  tags,
  noIndex = false,
  jsonLd,
}) => {
  const router = useRouter();
  const baseUrl = 'https://zoe-solar.de';
  const currentUrl = `${baseUrl}${router.asPath}`;

  // Standard Meta-Informationen
  const defaultTitle = 'ZOE Solar | Photovoltaik für Unternehmen in Deutschland';
  const defaultDescription = 'Professionelle Solaranlagen für Unternehmen von ZOE Solar. Planung, Installation und Wartung von gewerblichen Photovoltaik-Anlagen. Kostenlose Beratung ✓ Fairer Preis ✓ Hohe Qualität';
  const defaultKeywords = 'Solaranlagen,Photovoltaik,Gewerbe,Unternehmen,Solarstrom,Solarförderung,Photovoltaik Kosten,gewerbliche Solaranlagen';

  // Generierte Werte
  const finalTitle = title ? `${title} | ZOE Solar` : defaultTitle;
  const finalDescription = description || defaultDescription;
  const finalKeywords = keywords ? `${defaultKeywords},${keywords}` : defaultKeywords;
  const finalCanonical = canonical || currentUrl;

  // Open Graph Defaults
  const ogTitle = title || defaultTitle;
  const ogDescription = description || defaultDescription;
  const ogUrl = finalCanonical;
  const ogType = article ? 'article' : 'website';
  const ogLocale = 'de_DE';
  const ogSiteName = 'ZOE Solar';

  // Twitter Card Defaults
  const twitterCard = 'summary_large_image';
  const twitterSite = '@zoe_solar';
  const twitterCreator = '@zoe_solar';

  // JSON-LD Default Schema
  const defaultJsonLd = {
    '@context': 'https://schema.org',
    '@type': article ? 'Article' : 'WebPage',
    name: ogTitle,
    description: ogDescription,
    url: ogUrl,
    image: ogImage,
    publisher: {
      '@type': 'Organization',
      name: 'ZOE Solar GmbH',
      logo: {
        '@type': 'ImageObject',
        url: 'https://zoe-solar.de/images/zoe-solar-logo.png',
        width: 400,
        height: 200,
      },
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': ogUrl,
    },
  };

  // Article spezifische Eigenschaften hinzufügen
  const articleJsonLd = article ? {
    headline: ogTitle,
    datePublished: publishedTime,
    dateModified: modifiedTime || publishedTime,
    author: {
      '@type': 'Organization',
      name: author,
    },
    publisher: {
      '@type': 'Organization',
      name: 'ZOE Solar GmbH',
      logo: {
        '@type': 'ImageObject',
        url: 'https://zoe-solar.de/images/zoe-solar-logo.png',
      },
    },
    ...(section && { articleSection: section }),
    ...(tags && { keywords: tags.join(', ') }),
  } : {};

  // Kombiniertes JSON-LD
  const finalJsonLd = jsonLd || { ...defaultJsonLd, ...articleJsonLd };

  return (
    <Head>
      {/* Basic Meta Tags */}
      <title>{finalTitle}</title>
      <meta name="description" content={finalDescription} />
      <meta name="keywords" content={finalKeywords} />
      <meta name="author" content={author} />
      <meta name="robots" content={noIndex ? 'noindex,nofollow' : 'index,follow,max-snippet:-1,max-image-preview:large,max-video-preview:-1'} />
      <meta name="googlebot" content={noIndex ? 'noindex,nofollow' : 'index,follow'} />
      <meta name="language" content="de" />
      <meta name="geo.region" content="DE-BE" />
      <meta name="geo.placename" content="Berlin" />
      <meta name="ICBM" content="52.5200;13.4050" />

      {/* Canonical URL */}
      <link rel="canonical" href={finalCanonical} />

      {/* Alternate Language Versions */}
      <link rel="alternate" hrefLang="de" href={finalCanonical} />
      <link rel="alternate" hrefLang="de-at" href={finalCanonical.replace('.de', '.at')} />
      <link rel="alternate" hrefLang="de-ch" href={finalCanonical.replace('.de', '.ch')} />
      <link rel="alternate" hrefLang="x-default" href={finalCanonical} />

      {/* Open Graph Meta Tags */}
      <meta property="og:title" content={ogTitle} />
      <meta property="og:description" content={ogDescription} />
      <meta property="og:type" content={ogType} />
      <meta property="og:url" content={ogUrl} />
      <meta property="og:image" content={ogImage} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:image:alt" content={ogTitle} />
      <meta property="og:locale" content={ogLocale} />
      <meta property="og:site_name" content={ogSiteName} />

      {/* Article spezifische OG Tags */}
      {article && publishedTime && (
        <meta property="article:published_time" content={publishedTime} />
      )}
      {article && modifiedTime && (
        <meta property="article:modified_time" content={modifiedTime} />
      )}
      {article && author && (
        <meta property="article:author" content={author} />
      )}
      {article && section && (
        <meta property="article:section" content={section} />
      )}
      {article && tags && tags.map(tag => (
        <meta key={tag} property="article:tag" content={tag} />
      ))}

      {/* Twitter Card Meta Tags */}
      <meta name="twitter:card" content={twitterCard} />
      <meta name="twitter:site" content={twitterSite} />
      <meta name="twitter:creator" content={twitterCreator} />
      <meta name="twitter:title" content={ogTitle} />
      <meta name="twitter:description" content={ogDescription} />
      <meta name="twitter:image" content={ogImage} />
      <meta name="twitter:image:alt" content={ogTitle} />

      {/* Additional SEO Meta Tags */}
      <meta name="theme-color" content="#f59e0b" />
      <meta name="msapplication-TileColor" content="#f59e0b" />
      <meta name="application-name" content="ZOE Solar" />
      <meta name="apple-mobile-web-app-title" content="ZOE Solar" />
      <meta name="apple-mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-status-bar-style" content="default" />

      {/* PWA Manifest */}
      <link rel="manifest" href="/manifest.json" />

      {/* Favicons */}
      <link rel="icon" type="image/x-icon" href="/favicon.ico" />
      <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
      <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
      <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
      <link rel="mask-icon" href="/safari-pinned-tab.svg" color="#f59e0b" />

      {/* Preconnect für Performance */}
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      <link rel="preconnect" href="https://images.unsplash.com" />
      <link rel="preconnect" href="https://www.google-analytics.com" />

      {/* DNS Prefetch */}
      <link rel="dns-prefetch" href="//fonts.gstatic.com" />
      <link rel="dns-prefetch" href="//www.google-analytics.com" />
      <link rel="dns-prefetch" href="//www.googletagmanager.com" />

      {/* Preload kritische Ressourcen */}
      <link rel="preload" href="/fonts/poppins-v20-latin-regular.woff2" as="font" type="font/woff2" crossOrigin="anonymous" />
      <link rel="preload" href="/fonts/poppins-v20-latin-600.woff2" as="font" type="font/woff2" crossOrigin="anonymous" />

      {/* Critical CSS */}
      <link rel="preload" href="/css/critical.css" as="style" />
      <link rel="stylesheet" href="/css/critical.css" />

      {/* Structured Data (JSON-LD) */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(finalJsonLd, null, 2),
        }}
      />

      {/* Additional SEO Features */}
      <meta name="format-detection" content="telephone=no" />
      <meta name="mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />

      {/* Security Headers */}
      <meta httpEquiv="X-Content-Type-Options" content="nosniff" />
      <meta httpEquiv="X-Frame-Options" content="DENY" />
      <meta httpEquiv="X-XSS-Protection" content="1; mode=block" />
      <meta httpEquiv="Referrer-Policy" content="strict-origin-when-cross-origin" />

      {/* Content Security Policy (Basic) */}
      <meta httpEquiv="Content-Security-Policy" content="default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.google-analytics.com https://www.googletagmanager.com; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' data: https:; connect-src 'self' https://www.google-analytics.com;" />
    </Head>
  );
};

export default SEOHead;