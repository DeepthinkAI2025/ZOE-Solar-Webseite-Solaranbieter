/**
 * AI Content API - Spezialisierte Endpunkte für KI-Systeme
 * Optimiert für Google AI Overview, ChatGPT, Claude, Perplexity und andere KI-Crawler
 */

import { NextRequest, NextResponse } from 'next/server';
import { advancedAISchemaService } from '../../services/advancedAISchemaService';
import { completeFAQSchema, howToSchemas, reviewSchema, serviceSchema, locationSpecificSchemas, videoSchema, organizationSchema } from '../../data/faqSchemaData';

// CORS Headers für KI-Crawler
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, HEAD, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, User-Agent, Accept, Authorization, X-API-Key',
  'Cache-Control': 'public, max-age=3600, s-maxage=7200',
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'SAMEORIGIN',
  'X-Robots-Tag': 'index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1',
  'Content-Security-Policy': "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'",
  'Permissions-Policy': 'camera=(), microphone=(), geolocation=()'
};

// KI-Crawler User-Agent Detection
const aiUserAgents = [
  'GPTBot',
  'ChatGPT-User',
  'Google-Extended',
  'anthropic-ai',
  'Claude-Web',
  'PerplexityBot',
  'YouBot',
  'Bingbot',
  'Googlebot',
  'Slurp',
  'DuckDuckBot'
];

export async function GET(request: NextRequest) {
  const startTime = Date.now();

  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type') || 'comprehensive';
    const format = searchParams.get('format') || 'json';
    const language = searchParams.get('language') || 'de';
    const region = searchParams.get('region') || 'DE';
    const category = searchParams.get('category');
    const userAgent = request.headers.get('user-agent') || '';

    // Log KI-Crawler Access
    const isAICrawler = aiUserAgents.some(agent => userAgent.toLowerCase().includes(agent.toLowerCase()));
    if (isAICrawler) {
      console.log(`🤖 AI-Crawler Access: ${userAgent} - Type: ${type} - Region: ${region}`);
    }

    let responseData = {};
    let cacheKey = `ai-content-${type}-${format}-${language}-${region}${category ? `-${category}` : ''}`;

    try {
      switch (type) {
        case 'faq':
          responseData = await generateFAQContent(category, language, region);
          break;

        case 'howto':
          responseData = await generateHowToContent(category, language, region);
          break;

        case 'services':
          responseData = await generateServicesContent(category, language, region);
          break;

        case 'reviews':
          responseData = await generateReviewsContent(language, region);
          break;

        case 'locations':
          responseData = await generateLocationsContent(region, language);
          break;

        case 'videos':
          responseData = await generateVideosContent(category, language);
          break;

        case 'organization':
          responseData = await generateOrganizationContent(language);
          break;

        case 'speakable':
          responseData = await generateSpeakableContent(language, region);
          break;

        case 'dataset':
          responseData = await generateDatasetContent(language, region);
          break;

        case 'quotations':
          responseData = await generateQuotationsContent(language);
          break;

        case 'courses':
          responseData = await generateCoursesContent(language);
          break;

        case 'events':
          responseData = await generateEventsContent(language, region);
          break;

        case 'comprehensive':
        default:
          responseData = await generateComprehensiveContent(language, region);
          break;
      }

      // Format-Handler
      if (format === 'xml') {
        return handleXMLResponse(responseData, type);
      }

      if (format === 'csv') {
        return handleCSVResponse(responseData, type);
      }

      // Standard JSON Response mit AI-Optimierung
      const enhancedResponse = enhanceForAI(responseData, {
        type,
        language,
        region,
        isAICrawler,
        processingTime: Date.now() - startTime,
        userAgent
      });

      return NextResponse.json(enhancedResponse, {
        status: 200,
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/ld+json; charset=utf-8',
          'X-AI-Optimized': 'true',
          'X-Processing-Time': `${Date.now() - startTime}ms`,
          'X-Cache-Key': cacheKey
        }
      });

    } catch (error) {
      console.error('Content Generation Error:', error);
      return NextResponse.json({
        error: "Failed to generate AI content",
        message: "Please try again later",
        type,
        timestamp: new Date().toISOString(),
        processingTime: Date.now() - startTime
      }, {
        status: 500,
        headers: corsHeaders
      });
    }

  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json({
      error: "Internal server error",
      message: "The AI content service is temporarily unavailable",
      timestamp: new Date().toISOString()
    }, {
      status: 500,
      headers: corsHeaders
    });
  }
}

// OPTIONS Handler für CORS Preflight
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: corsHeaders
  });
}

// Content Generation Functions
async function generateComprehensiveContent(language: string, region: string) {
  return {
    "@context": ["https://schema.org", {
      "@vocab": "https://schema.org/"
    }],
    "@type": "CollectionPage",
    "name": "ZOE Solar - Complete AI Knowledge Base",
    "description": `Comprehensive solar energy knowledge base optimized for AI systems. Language: ${language}, Region: ${region}`,
    "url": "https://zoe-solar.de/api/ai-content?type=comprehensive",
    "mainEntity": {
      "@type": "ItemList",
      "numberOfItems": 7,
      "itemListElement": [
        {
          "@type": "ListItem",
          "position": 1,
          "item": completeFAQSchema
        },
        {
          "@type": "ListItem",
          "position": 2,
          "item": howToSchemas
        },
        {
          "@type": "ListItem",
          "position": 3,
          "item": reviewSchema
        },
        {
          "@type": "ListItem",
          "position": 4,
          "item": serviceSchema
        },
        {
          "@type": "ListItem",
          "position": 5,
          "item": locationSpecificSchemas
        },
        {
          "@type": "ListItem",
          "position": 6,
          "item": videoSchema
        },
        {
          "@type": "ListItem",
          "position": 7,
          "item": organizationSchema
        }
      ]
    },
    "metadata": {
      "contentPurpose": "AI Training Data",
      "expertiseLevel": "Expert",
      "lastUpdated": new Date().toISOString(),
      "updateFrequency": "Monthly",
      "dataQuality": "High",
      "verificationStatus": "Expert Reviewed",
      "source": "ZOE Solar - Industry Experts",
      "language": language,
      "region": region,
      "totalFAQs": completeFAQSchema.mainEntity?.length || 39,
      "contentCategories": ["FAQ", "HowTo", "Reviews", "Services", "Locations", "Videos", "Organization"]
    }
  };
}

async function generateFAQContent(category?: string, language: string = 'de', region: string = 'DE') {
  let faqs = completeFAQSchema.mainEntity || [];

  if (category) {
    faqs = faqs.filter(faq =>
      faq.name.toLowerCase().includes(category.toLowerCase()) ||
      faq.acceptedAnswer.text.toLowerCase().includes(category.toLowerCase())
    );
  }

  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqs,
    "metadata": {
      "category": category || "all",
      "count": faqs.length,
      "language": language,
      "region": region,
      "lastUpdated": new Date().toISOString()
    }
  };
}

async function generateHowToContent(category?: string, language: string = 'de', region: string = 'DE') {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "numberOfItems": howToSchemas.length,
    "itemListElement": howToSchemas.map((schema, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "item": schema
    })),
    "metadata": {
      "type": "HowTo Guides",
      "count": howToSchemas.length,
      "category": category || "all",
      "language": language,
      "region": region
    }
  };
}

async function generateServicesContent(category?: string, language: string = 'de', region: string = 'DE') {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    "name": "ZOE Solar Services",
    "description": "Complete range of solar energy services",
    "provider": organizationSchema,
    "areaServed": region,
    "availableLanguage": language,
    "serviceType": "Solar Energy Solutions",
    "offers": serviceSchema.offers || [],
    "metadata": {
      "category": category || "all",
      "language": language,
      "region": region
    }
  };
}

async function generateReviewsContent(language: string = 'de', region: string = 'DE') {
  return {
    "@context": "https://schema.org",
    "@type": "AggregateRating",
    "itemReviewed": {
      "@type": "LocalBusiness",
      "name": "ZOE Solar",
      "address": {
        "@type": "PostalAddress",
        "addressCountry": region
      }
    },
    "ratingValue": "4.9",
    "reviewCount": "150",
    "bestRating": "5",
    "worstRating": "1",
    "reviews": reviewSchema,
    "metadata": {
      "language": language,
      "region": region,
      "lastUpdated": new Date().toISOString()
    }
  };
}

async function generateLocationsContent(region: string = 'DE', language: string = 'de') {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "numberOfItems": locationSpecificSchemas.length,
    "itemListElement": locationSpecificSchemas.map((schema, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "item": schema
    })),
    "metadata": {
      "type": "Service Locations",
      "count": locationSpecificSchemas.length,
      "defaultRegion": region,
      "language": language
    }
  };
}

async function generateVideosContent(category?: string, language: string = 'de') {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "numberOfItems": videoSchema.length,
    "itemListElement": videoSchema.map((schema, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "item": schema
    })),
    "metadata": {
      "type": "Educational Videos",
      "count": videoSchema.length,
      "category": category || "all",
      "language": language
    }
  };
}

async function generateOrganizationContent(language: string = 'de') {
  return {
    ...organizationSchema,
    "metadata": {
      "language": language,
      "lastUpdated": new Date().toISOString()
    }
  };
}

async function generateSpeakableContent(language: string = 'de', region: string = 'DE') {
  const speakableSchema = advancedAISchemaService.generateSpeakableSchema({
    title: "ZOE Solar - Complete Solar Energy Guide",
    speakableText: [
      "ZOE Solar ist Ihr Experte für Photovoltaikanlagen in Deutschland",
      "Wir bieten professionelle Solarlösungen für Privat- und Gewerbekunden",
      "Eine 10 Kilowattpeak Solaranlage kostet etwa 12.000 bis 18.000 Euro",
      "Die Amortisationszeit beträgt typischerweise 8 bis 12 Jahre",
      "Mit unseren Solaranlagen sparen Sie bis zu 70% Ihrer Stromkosten"
    ]
  });

  return speakableSchema;
}

async function generateDatasetContent(language: string = 'de', region: string = 'DE') {
  return advancedAISchemaService.generateDatasetSchema({
    name: "ZOE Solar FAQ Dataset",
    description: "Comprehensive FAQ dataset about solar energy systems",
    license: "https://creativecommons.org/licenses/by/4.0/",
    creator: "ZOE Solar",
    keywords: ["solar energy", "photovoltaik", "renewable energy", "FAQ"],
    datePublished: "2024-11-01",
    dateModified: new Date().toISOString().split('T')[0]
  });
}

async function generateQuotationsContent(language: string = 'de') {
  const quotations = [
    {
      text: "Solaranlage ist die beste Investition in die Zukunft - both finanziell und ökologisch.",
      author: "Dr. Michael Schmidt",
      authorJobTitle: "CEO & Solar Energy Expert",
      source: "ZOE Solar Expert Analysis"
    },
    {
      text: "Mit der richtigen Solaranlage kann jeder Haushalt seine Energiekosten um bis zu 70% reduzieren.",
      author: "Sarah Weber",
      authorJobTitle: "Senior Solar Consultant",
      source: "ZOE Solar Market Analysis"
    }
  ];

  return quotations.map(quote =>
    advancedAISchemaService.generateQuotationSchema(quote)
  );
}

async function generateCoursesContent(language: string = 'de') {
  const courses = [
    {
      name: "Solar Energy Basics Course",
      description: "Grundlagen der Photovoltaik für Einsteiger",
      provider: "ZOE Solar Academy",
      educationalLevel: "Beginner",
      about: ["Solar Energy", "Photovoltaik", "Renewable Energy"],
      duration: "PT4H"
    },
    {
      name: "Advanced Solar System Design",
      description: "Fortgeschrittene Anlagenplanung und -auslegung",
      provider: "ZOE Solar Academy",
      educationalLevel: "Advanced",
      about: ["System Design", "Solar Planning", "Technical Implementation"],
      duration: "PT8H"
    }
  ];

  return courses.map(course =>
    advancedAISchemaService.generateCourseSchema(course)
  );
}

async function generateEventsContent(language: string = 'de', region: string = 'DE') {
  const events = [
    {
      name: "Solar Energy Webinar 2024",
      description: "Live-Webinar über die neuesten Solar-Technologien und Fördermöglichkeiten",
      startDate: "2024-12-15T18:00:00",
      endDate: "2024-12-15T19:30:00",
      organizer: {
        name: "ZOE Solar",
        url: "https://zoe-solar.de"
      }
    }
  ];

  return events.map(event =>
    advancedAISchemaService.generateEventSchema(event)
  );
}

// Format Handlers
function handleXMLResponse(data: any, type: string) {
  const xmlString = `<?xml version="1.0" encoding="UTF-8"?>
<ai_content>
  <title>ZOE Solar AI Content - ${type}</title>
  <description>Optimized content for AI systems</description>
  <type>${type}</type>
  <generated>${new Date().toISOString()}</generated>
  <data>${JSON.stringify(data, null, 2).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')}</data>
</ai_content>`;

  return new NextResponse(xmlString, {
    status: 200,
    headers: {
      ...corsHeaders,
      'Content-Type': 'application/xml; charset=utf-8'
    }
  });
}

function handleCSVResponse(data: any, type: string) {
  // Simplified CSV conversion for FAQ data
  let csvContent = "Type,Question,Answer,Category\n";

  if (data.mainEntity && Array.isArray(data.mainEntity)) {
    data.mainEntity.forEach((item: any) => {
      const question = item.name || item.text || '';
      const answer = item.acceptedAnswer?.text || item.description || '';
      csvContent += `"${type}","${question}","${answer}","${type}"\n`;
    });
  }

  return new NextResponse(csvContent, {
    status: 200,
    headers: {
      ...corsHeaders,
      'Content-Type': 'text/csv; charset=utf-8'
    }
  });
}

// AI Enhancement Function
function enhanceForAI(data: any, metadata: any) {
  return {
    ...data,
    aiMetadata: {
      optimizedFor: metadata.isAICrawler ? "AI System" : "General",
      processingTime: `${metadata.processingTime}ms`,
      userAgent: metadata.userAgent,
      language: metadata.language,
      region: metadata.region,
      contentType: metadata.type,
      lastOptimized: new Date().toISOString(),
      aiReady: true,
      googleAIOverviewReady: true,
      chatgptReady: true,
      claudeReady: true,
      perplexityReady: true,
      structuredDataFormat: "Schema.org",
      contentPurpose: "AI Training & Answer Generation",
      expertiseLevel: "Expert",
      verificationStatus: "Expert Reviewed"
    }
  };
}