/**
 * Admin API Keys Management
 * Manages API keys for various services (SEO, Analytics, etc.)
 */

import { NextRequest, NextResponse } from 'next/server';
import { verifyAdminToken } from '../../utils/auth.js';

// Mock API service keys and their configurations
const API_SERVICES = {
  gemini: {
    name: 'Google Gemini AI',
    description: 'AI-powered content optimization and analysis',
    type: 'ai-service',
    documentation: 'https://ai.google.dev/docs'
  },
  googleMaps: {
    name: 'Google Maps Platform',
    description: 'Location services and mapping functionality',
    type: 'maps-service',
    documentation: 'https://developers.google.com/maps'
  },
  googleServiceAccount: {
    name: 'Google Service Account',
    description: 'Google Cloud service authentication',
    type: 'auth-service',
    documentation: 'https://cloud.google.com/docs/authentication'
  },
  ahrefs: {
    name: 'Ahrefs SEO Tools',
    description: 'SEO analysis and backlink tracking',
    type: 'seo-service',
    documentation: 'https://ahrefs.com/api'
  },
  businessProfile: {
    name: 'Google Business Profile',
    description: 'Local business management and optimization',
    type: 'business-service',
    documentation: 'https://developers.google.com/my-business'
  }
};

// Generate mock configuration for each service
function generateServiceConfig(serviceKey) {
  const isConfigured = Math.random() > 0.3; // 70% chance of being configured
  
  if (!isConfigured) {
    return {
      configured: false,
      lastUpdated: null
    };
  }

  const baseConfig = {
    configured: true,
    lastUpdated: new Date().toISOString()
  };

  switch (serviceKey) {
    case 'gemini':
      return {
        ...baseConfig,
        mask: 'AI-***-SEVICE',
        model: 'gemini-pro',
        description: API_SERVICES[serviceKey].description
      };
    
    case 'googleMaps':
      return {
        ...baseConfig,
        clientEmail: 'service@zoe-solar-project.iam.gserviceaccount.com',
        projectId: 'zoe-solar-project',
        mask: 'maps-***-key'
      };
    
    case 'googleServiceAccount':
      return {
        ...baseConfig,
        clientEmail: 'admin@zoe-solar-project.iam.gserviceaccount.com',
        projectId: 'zoe-solar-project'
      };
    
    case 'ahrefs':
      return {
        ...baseConfig,
        propertyUrl: 'https://zoe-solar.de',
        target: 'zoe-solar',
        accountName: 'ZOE Solar SEO Account'
      };
    
    case 'businessProfile':
      return {
        ...baseConfig,
        locationId: 'ChIJN1t_tDeuEmsRUsoyG83frY4',
        accountName: 'ZOE Solar GmbH',
        propertyUrl: 'https://zoe-solar.de'
      };
    
    default:
      return baseConfig;
  }
}

export async function GET(request: NextRequest) {
  try {
    // Verify authentication
    const authResult = await verifyAdminToken(request);
    if (!authResult.valid) {
      return NextResponse.json({
        error: 'Unauthorized',
        message: 'Valid authentication token required'
      }, { status: 401 });
    }

    // Generate service summary
    const serviceSummary = {};
    const serviceKeys = Object.keys(API_SERVICES);
    
    serviceKeys.forEach(key => {
      serviceSummary[key] = generateServiceConfig(key);
    });

    // Get default operational tasks
    const { defaultOperationalTasks } = await import('../../../data/adminDashboard.js');

    return NextResponse.json({
      services: serviceSummary,
      tasks: defaultOperationalTasks,
      timestamp: new Date().toISOString(),
      totalServices: serviceKeys.length,
      configuredServices: Object.values(serviceSummary).filter(s => s.configured).length
    }, {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'public, max-age=300' // Cache for 5 minutes
      }
    });

  } catch (error) {
    console.error('API keys management error:', error);
    return NextResponse.json({
      error: 'Internal server error',
      message: 'Failed to load API service configurations'
    }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    // Verify authentication
    const authResult = await verifyAdminToken(request);
    if (!authResult.valid) {
      return NextResponse.json({
        error: 'Unauthorized',
        message: 'Valid authentication token required'
      }, { status: 401 });
    }

    const { action, serviceKey, data } = await request.json();

    // Update service configuration
    if (action === 'update' && serviceKey) {
      // In a real implementation, this would save to database
      console.log(`Updating ${serviceKey} configuration:`, data);
      
      return NextResponse.json({
        success: true,
        message: `Configuration updated for ${API_SERVICES[serviceKey]?.name || serviceKey}`,
        timestamp: new Date().toISOString()
      }, { status: 200 });
    }

    // Test service connection
    if (action === 'test' && serviceKey) {
      // Simulate service test
      const testResult = {
        success: Math.random() > 0.2, // 80% success rate
        message: Math.random() > 0.2 ? 
          'Connection successful' : 
          'Connection failed - please check credentials',
        responseTime: Math.floor(Math.random() * 200) + 50 // 50-250ms
      };

      return NextResponse.json(testResult, { 
        status: testResult.success ? 200 : 400 
      });
    }

    return NextResponse.json({
      error: 'Invalid action',
      message: 'Supported actions: update, test'
    }, { status: 400 });

  } catch (error) {
    console.error('API keys update error:', error);
    return NextResponse.json({
      error: 'Internal server error',
      message: 'Failed to update API service configuration'
    }, { status: 500 });
  }
}

// OPTIONS handler for CORS
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization'
    }
  });
}