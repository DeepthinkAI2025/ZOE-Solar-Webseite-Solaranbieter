import React, { useEffect, useState } from 'react';
import { ServiceRegion } from '../data/seoConfig';
import { localSchemaService } from '../services/localSchemaService';
import { gmbOptimizationService } from '../services/gmbOptimizationService';
import { napConsistencyService } from '../services/napConsistencyService';
import { localContentService } from '../services/localContentService';
import { localSEOAnalyticsService } from '../services/localSEOAnalyticsService';

interface EnhancedLocationPageProps {
  region: ServiceRegion;
  path?: string;
}

const EnhancedLocationPage: React.FC<EnhancedLocationPageProps> = ({ region, path }) => {
  const [schemaData, setSchemaData] = useState<any>(null);
  const [gmbData, setGmbData] = useState<any>(null);
  const [napData, setNapData] = useState<any>(null);
  const [localContent, setLocalContent] = useState<any[]>([]);
  const [seoMetrics, setSeoMetrics] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadLocationData();
  }, [region]);

  const loadLocationData = async () => {
    try {
      setLoading(true);
      
      // Schema Markup laden
      const schemas = localSchemaService.getAllSchemasForRegion(region);
      setSchemaData(schemas);

      // GMB Daten laden
      const gmbProfile = gmbOptimizationService.getProfileForLocation(region.city.toLowerCase());
      const gmbPosts = gmbOptimizationService.getPostsForLocation(region.city.toLowerCase());
      const gmbFaqs = gmbOptimizationService.generateLocalFAQs(region.city.toLowerCase());
      setGmbData({ profile: gmbProfile, posts: gmbPosts, faqs: gmbFaqs });

      // NAP Daten laden
      const napProfile = napConsistencyService.getMasterNAPData(region.city.toLowerCase());
      const napReport = napConsistencyService.performNAPAudit(region.city.toLowerCase());
      setNapData({ profile: napProfile, report: napReport });

      // Content laden
      const content = localContentService.getContentForLocation(region.city.toLowerCase());
      setLocalContent(content);

      // SEO Metriken laden
      const metrics = localSEOAnalyticsService.generateLocalSEOReport(region.city.toLowerCase());
      setSeoMetrics(metrics);

    } catch (error) {
      console.error('Fehler beim Laden der Standort-Daten:', error);
    } finally {
      setLoading(false);
    }
  };

  // Schema Markup in Head einfügen
  useEffect(() => {
    if (schemaData) {
      const script = document.createElement('script');
      script.type = 'application/ld+json';
      script.text = JSON.stringify(schemaData.localBusiness);
      document.head.appendChild(script);

      return () => {
        document.head.removeChild(script);
      };
    }
  }, [schemaData]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="enhanced-location-page">
      {/* SEO Head Meta Tags */}
      <div style={{ display: 'none' }}>
        <title>ZOE Solar {region.city} - Photovoltaik & Solaranlagen | Kostenlose Beratung</title>
        <meta name="description" content={`Photovoltaik-Experte in ${region.city}, ${region.state}. ✓ Kostenlose Beratung ✓ 25 Jahre Garantie ✓ Über 500 Projekte. Jetzt Solaranlage anfragen!`} />
        <meta name="keywords" content={`solaranlage ${region.city}, photovoltaik ${region.city}, solar ${region.city}, pv anlage ${region.city}`} />
        <meta name="geo.region" content={`DE-${region.state}`} />
        <meta name="geo.placename" content={region.city} />
        <meta name="geo.position" content={`${region.latitude};${region.longitude}`} />
        <meta name="ICBM" content={`${region.latitude}, ${region.longitude}`} />
        <link rel="canonical" href={`https://www.zoe-solar.de/standort/${region.city.toLowerCase()}`} />
      </div>

      {/* Hero Section mit lokalen Elementen */}
      <section className="hero-section relative bg-gradient-to-r from-blue-600 to-blue-800 text-white py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Solaranlagen in {region.city}
              <span className="block text-2xl md:text-3xl font-normal mt-2 text-blue-200">
                Ihr regionaler Photovoltaik-Spezialist in {region.state}
              </span>
            </h1>
            
            <p className="text-xl md:text-2xl mb-8 text-blue-100">
              Über 500 erfolgreiche Projekte in {region.city} und Umgebung. 
              Service-Radius: {region.radiusKm} km.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="bg-green-500 hover:bg-green-600 text-white px-8 py-4 rounded-lg text-lg font-semibold transition-colors">
                ☎️ Kostenlose Beratung {region.city}
              </button>
              <button className="bg-white hover:bg-gray-100 text-blue-600 px-8 py-4 rounded-lg text-lg font-semibold transition-colors">
                📊 Kosten-Rechner
              </button>
            </div>
          </div>
        </div>

        {/* Lokale Trust Signals */}
        <div className="absolute bottom-4 left-4 bg-white/10 backdrop-blur-sm rounded-lg p-3 text-sm">
          <p className="font-semibold">📍 Service für {region.city}</p>
          <p>GPS: {region.latitude.toFixed(4)}, {region.longitude.toFixed(4)}</p>
        </div>

        {/* Live GMB Daten */}
        {gmbData?.profile && (
          <div className="absolute bottom-4 right-4 bg-white/10 backdrop-blur-sm rounded-lg p-3 text-sm">
            <p className="font-semibold">⭐ {gmbData.profile.reviews?.length || 0} Bewertungen</p>
            <p>📞 {gmbData.profile.phone}</p>
          </div>
        )}
      </section>

      {/* Lokale Service-Übersicht */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">
            Photovoltaik-Services in {region.city}
          </h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-lg">
              <div className="text-4xl mb-4">🏠</div>
              <h3 className="text-xl font-semibold mb-3">Eigenheime in {region.city}</h3>
              <p className="text-gray-600 mb-4">
                Maßgeschneiderte Solaranlagen für Einfamilienhäuser in {region.city} und {region.state}.
                Inklusive Batteriespeicher und E-Ladestation.
              </p>
              <ul className="text-sm text-gray-700 space-y-1">
                <li>✓ Kostenlose Vor-Ort-Beratung in {region.city}</li>
                <li>✓ 3D-Planung und Ertragsprognose</li>
                <li>✓ Installation an 1-2 Tagen</li>
                <li>✓ 25 Jahre Vollgarantie</li>
              </ul>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-lg">
              <div className="text-4xl mb-4">🏢</div>
              <h3 className="text-xl font-semibold mb-3">Gewerbe {region.city}</h3>
              <p className="text-gray-600 mb-4">
                Professionelle Photovoltaiklösungen für Unternehmen in {region.city}.
                ROI bereits nach 5-7 Jahren.
              </p>
              <ul className="text-sm text-gray-700 space-y-1">
                <li>✓ Individuelle Wirtschaftlichkeitsberechnung</li>
                <li>✓ Steueroptimierte Finanzierung</li>
                <li>✓ Minimale Betriebsunterbrechung</li>
                <li>✓ 24/7 Monitoring und Service</li>
              </ul>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-lg">
              <div className="text-4xl mb-4">🌾</div>
              <h3 className="text-xl font-semibold mb-3">Agri-PV {region.state}</h3>
              <p className="text-gray-600 mb-4">
                Innovative Agri-Photovoltaik in {region.state}. 
                Doppelnutzung Ihrer landwirtschaftlichen Flächen.
              </p>
              <ul className="text-sm text-gray-700 space-y-1">
                <li>✓ Zusätzliche Einnahmen pro Hektar</li>
                <li>✓ Schutz der Kulturen vor Wetterextremen</li>
                <li>✓ Bis zu 20% Wassereinsparung</li>
                <li>✓ EEG-Förderung möglich</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* NAP-konsistente Kontaktdaten */}
      {napData?.profile && (
        <section className="py-12 bg-blue-600 text-white">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="text-2xl font-bold mb-6">
                ZOE Solar {region.city} - Ihr lokaler Ansprechpartner
              </h2>
              
              <div className="grid md:grid-cols-3 gap-8 text-center">
                <div>
                  <div className="text-3xl mb-2">📍</div>
                  <h3 className="font-semibold mb-2">Adresse</h3>
                  <p className="text-blue-100">
                    {napData.profile.address.street}<br/>
                    {napData.profile.address.postalCode} {napData.profile.address.city}<br/>
                    {napData.profile.address.state}, {napData.profile.address.country}
                  </p>
                </div>
                
                <div>
                  <div className="text-3xl mb-2">📞</div>
                  <h3 className="font-semibold mb-2">Telefon</h3>
                  <a href={`tel:${napData.profile.phone}`} className="text-blue-100 hover:text-white">
                    {napData.profile.phone}
                  </a>
                  <p className="text-sm text-blue-200 mt-1">Mo-Fr: 08:00-17:00 Uhr</p>
                </div>
                
                <div>
                  <div className="text-3xl mb-2">✉️</div>
                  <h3 className="font-semibold mb-2">E-Mail</h3>
                  <a href={`mailto:${napData.profile.email}`} className="text-blue-100 hover:text-white">
                    {napData.profile.email}
                  </a>
                  <p className="text-sm text-blue-200 mt-1">Schnelle Antwort garantiert</p>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Lokale FAQ-Sektion */}
      {gmbData?.faqs && (
        <section className="py-16">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12">
              Häufige Fragen zu Solaranlagen in {region.city}
            </h2>
            
            <div className="max-w-4xl mx-auto space-y-6">
              {gmbData.faqs.map((faq: any, index: number) => (
                <div key={index} className="bg-white border border-gray-200 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">
                    {faq.question}
                  </h3>
                  <p className="text-gray-700 leading-relaxed">
                    {faq.answer}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Lokaler Content */}
      {localContent.length > 0 && (
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12">
              Ratgeber & Wissen für {region.city}
            </h2>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {localContent.slice(0, 6).map((content: any, index: number) => (
                <article key={index} className="bg-white rounded-lg shadow-lg overflow-hidden">
                  {content.images?.[0] && (
                    <img 
                      src={content.images[0].src} 
                      alt={content.images[0].alt}
                      className="w-full h-48 object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjIwMCIgdmlld0JveD0iMCAwIDQwMCAyMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSI0MDAiIGhlaWdodD0iMjAwIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0yMDAgMTAwQzE4NiAxMDAgMTg2IDg2IDIwMCA4NlMyMTQgMTAwIDIwMCAxMDBaIiBzdHJva2U9IiM5Q0EzQUYiIHN0cm9rZS13aWR0aD0iMiIvPgo8L3N2Zz4K';
                      }}
                    />
                  )}
                  <div className="p-6">
                    <h3 className="text-lg font-semibold mb-2 text-gray-900">
                      {content.title}
                    </h3>
                    <p className="text-gray-600 text-sm mb-4">
                      {content.metaDescription.substring(0, 120)}...
                    </p>
                    <div className="flex justify-between items-center text-sm text-gray-500">
                      <span>{content.type}</span>
                      <span>{new Date(content.publishDate).toLocaleDateString('de-DE')}</span>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* SEO Performance Insights (nur für Admin/SEO) */}
      {seoMetrics && process.env.NODE_ENV === 'development' && (
        <section className="py-8 bg-gray-900 text-white">
          <div className="container mx-auto px-4">
            <h3 className="text-xl font-bold mb-4">🔍 SEO-Insights {region.city}</h3>
            <div className="grid md:grid-cols-4 gap-4 text-sm">
              <div>
                <p className="text-gray-400">Overall Score:</p>
                <p className="text-2xl font-bold text-green-400">{seoMetrics.overallScore}/100</p>
              </div>
              <div>
                <p className="text-gray-400">Organischer Traffic:</p>
                <p className="text-lg font-semibold">{seoMetrics.metrics.organicTraffic.sessions}</p>
              </div>
              <div>
                <p className="text-gray-400">NAP Score:</p>
                <p className="text-lg font-semibold">{seoMetrics.metrics.citationMetrics.napScore}%</p>
              </div>
              <div>
                <p className="text-gray-400">GMB Views:</p>
                <p className="text-lg font-semibold">{seoMetrics.metrics.gmbMetrics.views.total}</p>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* CTA Section */}
      <section className="py-16 bg-green-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">
            Bereit für Ihre Solaranlage in {region.city}?
          </h2>
          <p className="text-xl mb-8 text-green-100">
            Kostenlose Beratung und unverbindliches Angebot in {region.state}
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-white hover:bg-gray-100 text-green-600 px-8 py-4 rounded-lg text-lg font-semibold transition-colors">
              📞 {napData?.profile?.phone || '+49-30-123-456-78'}
            </button>
            <button className="bg-green-500 hover:bg-green-400 text-white px-8 py-4 rounded-lg text-lg font-semibold transition-colors">
              💬 WhatsApp Beratung
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default EnhancedLocationPage;