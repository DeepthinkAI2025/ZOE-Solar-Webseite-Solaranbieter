import { json } from 'react-router-dom';
import { completeFAQSchema, howToSchemas, reviewSchema, serviceSchema, locationSpecificSchemas, videoSchema, organizationSchema } from '../data/faqSchemaData';

// API endpoint for AI crawlers and search engines
// This provides machine-readable access to FAQ data for GEO/AEO optimization

export async function loader({ request }: { request: Request }) {
  const url = new URL(request.url);
  const format = url.searchParams.get('format') || 'json';
  const type = url.searchParams.get('type') || 'all';

  // CORS headers for AI crawlers
  const headers = {
    'Content-Type': 'application/ld+json; charset=utf-8',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, HEAD, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, User-Agent, Accept',
    'Cache-Control': 'public, max-age=3600', // Cache for 1 hour
    'X-Content-Type-Options': 'nosniff',
    'X-Frame-Options': 'SAMEORIGIN',
    'X-Robots-Tag': 'index, follow',
  };

  try {
    let responseData: any = {};

    // Route to specific schema types
    switch (type) {
      case 'faq':
        responseData = completeFAQSchema;
        break;
      case 'howto':
        responseData = howToSchemas;
        break;
      case 'reviews':
        responseData = reviewSchema;
        break;
      case 'services':
        responseData = serviceSchema;
        break;
      case 'locations':
        responseData = locationSpecificSchemas;
        break;
      case 'videos':
        responseData = videoSchema;
        break;
      case 'organization':
        responseData = organizationSchema;
        break;
      case 'all':
      default:
        responseData = {
          "@context": "https://schema.org",
          "@type": "CollectionPage",
          "name": "ZOE Solar FAQ - Complete Structured Data",
          "description": "Comprehensive FAQ and service information for ZOE Solar - optimized for AI systems and search engines",
          "url": "https://zoe-solar.de/api/faq-data",
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
          "additionalProperty": [
            {
              "@type": "PropertyValue",
              "name": "Total FAQs",
              "value": completeFAQSchema.mainEntity?.length || 39
            },
            {
              "@type": "PropertyValue",
              "name": "Last Updated",
              "value": new Date().toISOString()
            },
            {
              "@type": "PropertyValue",
              "name": "Content Type",
              "value": "Solar Energy FAQ"
            },
            {
              "@type": "PropertyValue",
              "name": "Target Audience",
              "value": ["Private Customers", "Business Customers", "Agriculture", "Electricians"]
            },
            {
              "@type": "PropertyValue",
              "name": "Language",
              "value": "de-DE"
            },
            {
              "@type": "PropertyValue",
              "name": "Expertise Level",
              "value": "Expert"
            }
          ]
        };
        break;
    }

    // Add AI-specific metadata
    const aiMetadata = {
      "ai_optimized": true,
      "google_ai_overview_ready": true,
      "chatgpt_ready": true,
      "bing_chat_ready": true,
      "claude_ready": true,
      "structured_data_format": "Schema.org",
      "content_purpose": "FAQ - Solar Energy Expert Knowledge",
      "verification_status": "Expert Reviewed",
      "update_frequency": "Monthly",
      "data_quality": "High",
      "completeness": "Comprehensive",
      "accuracy": "Fact Checked",
      "source_authority": "Industry Expert"
    };

    // Merge with AI metadata
    if (typeof responseData === 'object' && responseData !== null) {
      responseData = {
        ...responseData,
        ...aiMetadata
      };
    }

    // Handle different response formats
    if (format === 'xml') {
      // Simple XML conversion for basic compatibility
      const xmlString = `<?xml version="1.0" encoding="UTF-8"?>
<faq_data>
  <title>ZOE Solar FAQ Data</title>
  <description>Comprehensive FAQ data for solar energy systems</description>
  <total_faqs>${completeFAQSchema.mainEntity?.length || 39}</total_faqs>
  <last_updated>${new Date().toISOString()}</last_updated>
  <ai_optimized>true</ai_optimized>
</faq_data>`;

      return new Response(xmlString, {
        headers: {
          ...headers,
          'Content-Type': 'application/xml; charset=utf-8'
        }
      });
    }

    // Default JSON response
    return new Response(JSON.stringify(responseData, null, 2), {
      headers
    });

  } catch (error) {
    console.error('FAQ API Error:', error);

    return json({
      error: "Failed to load FAQ data",
      message: "Please try again later",
      timestamp: new Date().toISOString()
    }, {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    });
  }
}

// Handle OPTIONS requests for CORS preflight
export async function action({ request }: { request: Request }) {
  if (request.method === 'OPTIONS') {
    return new Response(null, {
      status: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, HEAD, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, User-Agent, Accept',
      }
    });
  }

  return json({ error: "Method not allowed" }, { status: 405 });
}