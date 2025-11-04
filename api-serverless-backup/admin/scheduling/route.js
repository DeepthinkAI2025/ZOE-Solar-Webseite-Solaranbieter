/**
 * Admin Content Scheduling API
 * Manages blog post scheduling and publishing
 */

import { NextRequest, NextResponse } from 'next/server';
import { verifyAdminToken } from '../../utils/auth.js';

// Mock scheduling database
let scheduledPosts = [
  {
    id: 'sched-001',
    title: 'Photovoltaik Trends 2025: Die neuesten Entwicklungen',
    slug: 'photovoltaik-trends-2025',
    excerpt: 'Entdecken Sie die wichtigsten Trends in der Photovoltaik-Branche für 2025.',
    content: 'Vollständiger Blog-Artikel-Inhalt hier...',
    category: 'Trends',
    tags: ['photovoltaik', 'trends', '2025'],
    author: 'Admin',
    featuredImage: '/images/blog/trends-2025.jpg',
    status: 'scheduled',
    publishDate: '2025-11-05T10:00:00Z',
    createdAt: '2025-11-01T12:00:00Z',
    updatedAt: '2025-11-01T12:00:00Z'
  },
  {
    id: 'sched-002',
    title: 'Förderprogramme 2025: Das müssen Sie wissen',
    slug: 'foerderprogramme-2025',
    excerpt: 'Alle wichtigen Informationen zu den aktuellen Förderprogrammen.',
    content: 'Detaillierte Informationen zu Förderprogrammen...',
    category: 'Förderung',
    tags: ['förderung', 'photovoltaik', '2025'],
    author: 'Admin',
    featuredImage: '/images/blog/foerderung-2025.jpg',
    status: 'draft',
    publishDate: null,
    createdAt: '2025-11-01T13:00:00Z',
    updatedAt: '2025-11-01T13:00:00Z'
  }
];

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

    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const category = searchParams.get('category');

    let filteredPosts = [...scheduledPosts];

    // Filter by status
    if (status) {
      filteredPosts = filteredPosts.filter(post => post.status === status);
    }

    // Filter by category
    if (category) {
      filteredPosts = filteredPosts.filter(post => 
        post.category.toLowerCase().includes(category.toLowerCase())
      );
    }

    // Sort by publish date or creation date
    filteredPosts.sort((a, b) => {
      const dateA = new Date(a.publishDate || a.createdAt);
      const dateB = new Date(b.publishDate || b.createdAt);
      return dateB - dateA;
    });

    return NextResponse.json({
      data: filteredPosts,
      total: filteredPosts.length,
      timestamp: new Date().toISOString()
    }, {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'public, max-age=60'
      }
    });

  } catch (error) {
    console.error('Scheduling retrieval error:', error);
    return NextResponse.json({
      error: 'Internal server error',
      message: 'Failed to retrieve scheduled content'
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

    const postData = await request.json();

    // Validate required fields
    if (!postData.title || !postData.content) {
      return NextResponse.json({
        error: 'Missing required fields',
        message: 'Title and content are required'
      }, { status: 400 });
    }

    // Create new scheduled post
    const newPost = {
      id: `sched-${Date.now()}`,
      title: postData.title,
      slug: postData.slug || generateSlug(postData.title),
      excerpt: postData.excerpt || '',
      content: postData.content,
      category: postData.category || 'Allgemein',
      tags: postData.tags || [],
      author: postData.author || 'Admin',
      featuredImage: postData.featuredImage || '',
      status: 'draft',
      publishDate: postData.publishDate || null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    // Add to mock database
    scheduledPosts.push(newPost);

    return NextResponse.json({
      success: true,
      data: newPost,
      message: 'Content scheduled successfully'
    }, { status: 201 });

  } catch (error) {
    console.error('Scheduling creation error:', error);
    return NextResponse.json({
      error: 'Internal server error',
      message: 'Failed to schedule content'
    }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    // Verify authentication
    const authResult = await verifyAdminToken(request);
    if (!authResult.valid) {
      return NextResponse.json({
        error: 'Unauthorized',
        message: 'Valid authentication token required'
      }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const postId = searchParams.get('id');

    if (!postId) {
      return NextResponse.json({
        error: 'Missing post ID',
        message: 'Post ID is required for updates'
      }, { status: 400 });
    }

    const updateData = await request.json();
    
    // Find and update post
    const postIndex = scheduledPosts.findIndex(post => post.id === postId);
    
    if (postIndex === -1) {
      return NextResponse.json({
        error: 'Post not found',
        message: 'Scheduled post does not exist'
      }, { status: 404 });
    }

    // Update post data
    scheduledPosts[postIndex] = {
      ...scheduledPosts[postIndex],
      ...updateData,
      updatedAt: new Date().toISOString()
    };

    return NextResponse.json({
      success: true,
      data: scheduledPosts[postIndex],
      message: 'Content updated successfully'
    }, { status: 200 });

  } catch (error) {
    console.error('Scheduling update error:', error);
    return NextResponse.json({
      error: 'Internal server error',
      message: 'Failed to update scheduled content'
    }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    // Verify authentication
    const authResult = await verifyAdminToken(request);
    if (!authResult.valid) {
      return NextResponse.json({
        error: 'Unauthorized',
        message: 'Valid authentication token required'
      }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const postId = searchParams.get('id');

    if (!postId) {
      return NextResponse.json({
        error: 'Missing post ID',
        message: 'Post ID is required for deletion'
      }, { status: 400 });
    }

    // Find and remove post
    const postIndex = scheduledPosts.findIndex(post => post.id === postId);
    
    if (postIndex === -1) {
      return NextResponse.json({
        error: 'Post not found',
        message: 'Scheduled post does not exist'
      }, { status: 404 });
    }

    scheduledPosts.splice(postIndex, 1);

    return NextResponse.json({
      success: true,
      message: 'Content deleted successfully'
    }, { status: 200 });

  } catch (error) {
    console.error('Scheduling deletion error:', error);
    return NextResponse.json({
      error: 'Internal server error',
      message: 'Failed to delete scheduled content'
    }, { status: 500 });
  }
}

// Helper function to generate URL-friendly slugs
function generateSlug(title) {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim('-');
}

// OPTIONS handler for CORS
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization'
    }
  });
}