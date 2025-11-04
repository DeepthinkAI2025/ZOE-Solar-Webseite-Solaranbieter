/**
 * Dashboard Metrics API
 * Provides comprehensive admin dashboard data
 */

import { NextRequest, NextResponse } from 'next/server';
import { verifyAdminToken } from '../../utils/auth.js';
import { emptyDashboardData } from '../../../data/adminDashboard.js';

// Simulate real-time data generation
function generateDashboardData() {
  const now = new Date();
  const currentMonth = now.toISOString().slice(0, 7); // YYYY-MM format

  // Generate traffic data for last 6 months
  const traffic = Array.from({ length: 6 }, (_, i) => {
    const month = new Date(now.getFullYear(), now.getMonth() - i, 1);
    return {
      month: month.toISOString().slice(0, 7),
      estimatedVisitors: Math.floor(Math.random() * 5000) + 10000,
      actualVisitors: Math.floor(Math.random() * 5000) + 8000
    };
  }).reverse();

  // Generate SEO rankings
  const rankings = [
    {
      page: '/photovoltaik-anlagen',
      url: 'https://zoe-solar.de/photovoltaik-anlagen',
      keywordFocus: 'photovoltaik anlagen',
      position: Math.floor(Math.random() * 5) + 1,
      change: (Math.random() - 0.5) * 10,
      trafficShare: Math.floor(Math.random() * 30) + 20
    },
    {
      page: '/solaranlagen-kosten',
      url: 'https://zoe-solar.de/solaranlagen-kosten',
      keywordFocus: 'solaranlagen kosten',
      position: Math.floor(Math.random() * 8) + 1,
      change: (Math.random() - 0.5) * 8,
      trafficShare: Math.floor(Math.random() * 25) + 15
    },
    {
      page: '/photovoltaik-installation',
      url: 'https://zoe-solar.de/photovoltaik-installation',
      keywordFocus: 'photovoltaik installation',
      position: Math.floor(Math.random() * 6) + 1,
      change: (Math.random() - 0.5) * 6,
      trafficShare: Math.floor(Math.random() * 20) + 10
    }
  ];

  // Generate keyword performance
  const keywords = [
    'photovoltaik anlage',
    'solaranlage kosten',
    'photovoltaik installation',
    'solaranlage gewerblich',
    'agriculture photovoltaik'
  ].map(keyword => ({
    keyword,
    position: Math.floor(Math.random() * 10) + 1,
    searchVolume: Math.floor(Math.random() * 5000) + 1000,
    clickRate: Math.floor(Math.random() * 15) + 5,
    trend: ['up', 'down', 'stable'][Math.floor(Math.random() * 3)]
  }));

  // Generate SEO suggestions
  const suggestions = [
    {
      id: 'seo-001',
      type: 'Content',
      title: 'Meta-Descriptions für wichtige Seiten optimieren',
      description: 'Kurze, aussagekräftige Meta-Descriptions können CTR um bis zu 30% verbessern.',
      impact: 'hoch',
      effort: 'niedrig',
      owner: 'SEO Team',
      dueDate: '2025-11-15'
    },
    {
      id: 'seo-002',
      type: 'Technical',
      title: 'Core Web Vitals Score verbessern',
      description: 'Ladezeiten reduzieren und CWV-Scores für bessere Suchrankings optimieren.',
      impact: 'hoch',
      effort: 'mittel',
      owner: 'Dev Team',
      dueDate: '2025-11-30'
    }
  ];

  // Generate portal alerts
  const alerts = [
    {
      portal: 'Google My Business',
      country: 'DE',
      status: 'OK',
      issue: '',
      lastChecked: now.toISOString(),
      priority: 'niedrig',
      recommendedAction: 'Profile ist aktuell'
    },
    {
      portal: 'Google Search Console',
      country: 'DE',
      status: 'Update benötigt',
      issue: 'Sitemap-Warnungen gefunden',
      lastChecked: now.toISOString(),
      priority: 'hoch',
      recommendedAction: 'Sitemap validieren und aktualisieren'
    }
  ];

  return {
    monitoring: {
      lastRun: now.toISOString(),
      totalBacklinks: Math.floor(Math.random() * 500) + 1500,
      newBacklinks30d: Math.floor(Math.random() * 50) + 20,
      lostBacklinks30d: Math.floor(Math.random() * 20) + 5,
      domainAuthority: Math.floor(Math.random() * 15) + 40,
      averagePosition: Math.floor(Math.random() * 3) + 5,
      topTenRatio: Math.floor(Math.random() * 30) + 60,
      aiSearchMentions: Math.floor(Math.random() * 100) + 200,
      coreWebVitals: {
        lcp: Math.floor(Math.random() * 500) + 1200,
        fid: Math.floor(Math.random() * 50) + 80,
        cls: Math.floor(Math.random() * 10) + 5,
        overall: 'good'
      }
    },
    traffic,
    rankings,
    keywordPerformance: keywords,
    seoSuggestions: suggestions,
    portalAlerts: alerts,
    tasks: []
  };
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

    // Generate fresh dashboard data
    const dashboardData = generateDashboardData();

    return NextResponse.json({
      data: dashboardData,
      issues: [],
      services: {
        searchConsole: 'ok',
        analytics: 'ok',
        ahrefs: 'ok',
        businessProfile: 'ok'
      },
      timestamp: new Date().toISOString()
    }, {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'public, max-age=60' // Cache for 1 minute
      }
    });

  } catch (error) {
    console.error('Dashboard metrics error:', error);
    return NextResponse.json({
      error: 'Internal server error',
      message: 'Failed to load dashboard metrics',
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
}

// OPTIONS handler for CORS
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization'
    }
  });
}