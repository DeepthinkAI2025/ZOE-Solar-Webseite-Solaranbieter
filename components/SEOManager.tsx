import React from 'react';
import { Helmet } from 'react-helmet';
import { ResolvedSEO, AdditionalMetaTag, AlternateHref } from '../data/seoConfig';

interface SEOManagerProps {
  metadata: ResolvedSEO;
}

const renderAlternateLinks = (alternates: AlternateHref[]) =>
  alternates.map((alternate) => (
    <link key={`${alternate.hrefLang}-${alternate.href}`} rel="alternate" hrefLang={alternate.hrefLang} href={alternate.href} />
  ));

const renderAdditionalMeta = (metaTags: AdditionalMetaTag[]) =>
  metaTags.map((meta) => {
    if (meta.name) {
      return <meta key={`name-${meta.name}`} name={meta.name} content={meta.content} />;
    }
    if (meta.property) {
      return <meta key={`prop-${meta.property}`} property={meta.property} content={meta.content} />;
    }
    return null;
  });

const renderStructuredData = (structuredData: object[]) =>
  structuredData.map((schema, index) => (
    <script key={`ld-json-${index}`} type="application/ld+json">{JSON.stringify(schema)}</script>
  ));

const SEOManager: React.FC<SEOManagerProps> = ({ metadata }) => {
  return (
    <Helmet prioritizeSeoTags>
      <html lang="de" />
      <title>{metadata.title}</title>
      <meta name="description" content={metadata.description} />
      {metadata.keywords.length > 0 && <meta name="keywords" content={metadata.keywords.join(', ')} />}
      {metadata.robots && <meta name="robots" content={metadata.robots} />}

      {/* Geo Meta Tags */}
      {metadata.geo.region && <meta name="geo.region" content={metadata.geo.region} />}
      {metadata.geo.placename && <meta name="geo.placename" content={metadata.geo.placename} />}
      {metadata.geo.position && <meta name="geo.position" content={metadata.geo.position} />}
      {metadata.geo.latitude && metadata.geo.longitude && (
        <meta name="ICBM" content={`${metadata.geo.latitude}, ${metadata.geo.longitude}`} />
      )}

      <link rel="canonical" href={metadata.canonical} />
      {renderAlternateLinks(metadata.alternates)}

      {/* Open Graph */}
      {metadata.og.type && <meta property="og:type" content={metadata.og.type} />}
      {metadata.og.title && <meta property="og:title" content={metadata.og.title} />}
      {metadata.og.description && <meta property="og:description" content={metadata.og.description} />}
      {metadata.og.url && <meta property="og:url" content={metadata.og.url} />}
      {metadata.og.image && <meta property="og:image" content={metadata.og.image} />}
      {metadata.og.imageAlt && <meta property="og:image:alt" content={metadata.og.imageAlt} />}
  {metadata.og.imageWidth && <meta property="og:image:width" content={metadata.og.imageWidth.toString()} />}
  {metadata.og.imageHeight && <meta property="og:image:height" content={metadata.og.imageHeight.toString()} />}
  {metadata.og.imageType && <meta property="og:image:type" content={metadata.og.imageType} />}
      {metadata.og.siteName && <meta property="og:site_name" content={metadata.og.siteName} />}
      {metadata.og.locale && <meta property="og:locale" content={metadata.og.locale} />}

      {/* Twitter */}
      {metadata.twitter.card && <meta name="twitter:card" content={metadata.twitter.card} />}
      {metadata.twitter.title && <meta name="twitter:title" content={metadata.twitter.title} />}
      {metadata.twitter.description && <meta name="twitter:description" content={metadata.twitter.description} />}
      {metadata.twitter.image && <meta name="twitter:image" content={metadata.twitter.image} />}
      {metadata.twitter.site && <meta name="twitter:site" content={metadata.twitter.site} />}
  {metadata.twitter.imageAlt && <meta name="twitter:image:alt" content={metadata.twitter.imageAlt} />}
      {metadata.twitter.creator && <meta name="twitter:creator" content={metadata.twitter.creator} />}

      {renderAdditionalMeta(metadata.additionalMeta)}
      {renderStructuredData(metadata.structuredData)}
    </Helmet>
  );
};

export default SEOManager;
