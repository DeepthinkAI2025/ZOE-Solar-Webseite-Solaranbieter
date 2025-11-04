/**
 * Admin Image Management API
 * Manages image uploads, edits, and organization
 */

import { NextRequest, NextResponse } from 'next/server';
import { verifyAdminToken } from '../../utils/auth.js';
import { promises as fs } from 'fs';
import { join } from 'path';
import { randomBytes } from 'crypto';

// Mock image database
let imageDatabase = [
  {
    id: 'img-001',
    filename: 'solar-panel-hero.jpg',
    originalName: 'solar-panel-hero.jpg',
    path: '/images/solar-panel-hero.jpg',
    url: 'https://zoe-solar.de/images/solar-panel-hero.jpg',
    size: 245760,
    width: 1920,
    height: 1080,
    type: 'image/jpeg',
    uploadedAt: '2025-11-01T10:00:00Z',
    tags: ['hero', 'solar', 'panels'],
    usedIn: ['/', '/photovoltaik-anlagen'],
    alt: 'Moderne Photovoltaik-Anlage auf Einfamilienhaus',
    description: 'Hero-Bild für Hauptseiten'
  },
  {
    id: 'img-002',
    filename: 'team-photo-2025.jpg',
    originalName: 'team-photo-2025.jpg',
    path: '/images/team-photo-2025.jpg',
    url: 'https://zoe-solar.de/images/team-photo-2025.jpg',
    size: 312580,
    width: 1200,
    height: 800,
    type: 'image/jpeg',
    uploadedAt: '2025-10-28T14:30:00Z',
    tags: ['team', 'company', 'staff'],
    usedIn: ['/ueber-uns'],
    alt: 'ZOE Solar Team 2025',
    description: 'Teamfoto für Über-uns Seite'
  }
];

// Image upload directory (in production, this would be cloud storage)
const UPLOAD_DIR = './public/uploads/admin';

// Ensure upload directory exists
async function ensureUploadDirectory() {
  try {
    await fs.access(UPLOAD_DIR);
  } catch {
    await fs.mkdir(UPLOAD_DIR, { recursive: true });
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

    const { searchParams } = new URL(request.url);
    const tag = searchParams.get('tag');
    const type = searchParams.get('type');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');

    let filteredImages = [...imageDatabase];

    // Filter by tag
    if (tag) {
      filteredImages = filteredImages.filter(img => 
        img.tags.includes(tag.toLowerCase())
      );
    }

    // Filter by type
    if (type) {
      filteredImages = filteredImages.filter(img => 
        img.type.includes(type.toLowerCase())
      );
    }

    // Pagination
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedImages = filteredImages.slice(startIndex, endIndex);

    // Generate statistics
    const stats = {
      total: filteredImages.length,
      byType: imageDatabase.reduce((acc, img) => {
        const typeCategory = img.type.split('/')[0];
        acc[typeCategory] = (acc[typeCategory] || 0) + 1;
        return acc;
      }, {}),
      totalSize: filteredImages.reduce((sum, img) => sum + img.size, 0),
      averageSize: filteredImages.length > 0 ? 
        Math.round(filteredImages.reduce((sum, img) => sum + img.size, 0) / filteredImages.length) : 0
    };

    return NextResponse.json({
      data: paginatedImages,
      pagination: {
        page,
        limit,
        total: filteredImages.length,
        pages: Math.ceil(filteredImages.length / limit)
      },
      stats,
      timestamp: new Date().toISOString()
    }, {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'public, max-age=120'
      }
    });

  } catch (error) {
    console.error('Image retrieval error:', error);
    return NextResponse.json({
      error: 'Internal server error',
      message: 'Failed to retrieve images'
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

    const formData = await request.formData();
    const file = formData.get('file');
    const tags = formData.get('tags')?.toString().split(',') || [];
    const alt = formData.get('alt')?.toString() || '';
    const description = formData.get('description')?.toString() || '';

    if (!file) {
      return NextResponse.json({
        error: 'No file provided',
        message: 'Image file is required'
      }, { status: 400 });
    }

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json({
        error: 'Invalid file type',
        message: 'Only JPEG, PNG, WebP, and GIF images are allowed'
      }, { status: 400 });
    }

    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      return NextResponse.json({
        error: 'File too large',
        message: 'Image size must not exceed 10MB'
      }, { status: 400 });
    }

    // Ensure upload directory exists
    await ensureUploadDirectory();

    // Generate unique filename
    const fileExtension = file.name.split('.').pop();
    const uniqueId = randomBytes(16).toString('hex');
    const filename = `img-${uniqueId}.${fileExtension}`;
    const filepath = join(UPLOAD_DIR, filename);

    // Save file
    const bytes = await file.arrayBuffer();
    await fs.writeFile(filepath, new Uint8Array(bytes));

    // Create image record
    const imageRecord = {
      id: `img-${Date.now()}-${uniqueId}`,
      filename,
      originalName: file.name,
      path: `/uploads/admin/${filename}`,
      url: `https://zoe-solar.de/uploads/admin/${filename}`,
      size: file.size,
      width: null, // Would be calculated in production
      height: null,
      type: file.type,
      uploadedAt: new Date().toISOString(),
      tags: tags.filter(tag => tag.trim() !== ''),
      usedIn: [],
      alt: alt,
      description: description
    };

    // Add to database
    imageDatabase.push(imageRecord);

    return NextResponse.json({
      success: true,
      data: imageRecord,
      message: 'Image uploaded successfully'
    }, { status: 201 });

  } catch (error) {
    console.error('Image upload error:', error);
    return NextResponse.json({
      error: 'Internal server error',
      message: 'Failed to upload image'
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
    const imageId = searchParams.get('id');

    if (!imageId) {
      return NextResponse.json({
        error: 'Missing image ID',
        message: 'Image ID is required for updates'
      }, { status: 400 });
    }

    const updateData = await request.json();
    
    // Find and update image
    const imageIndex = imageDatabase.findIndex(img => img.id === imageId);
    
    if (imageIndex === -1) {
      return NextResponse.json({
        error: 'Image not found',
        message: 'Image does not exist'
      }, { status: 404 });
    }

    // Update image data
    imageDatabase[imageIndex] = {
      ...imageDatabase[imageIndex],
      ...updateData,
      // Prevent updating system fields
      id: imageDatabase[imageIndex].id,
      filename: imageDatabase[imageIndex].filename,
      path: imageDatabase[imageIndex].path,
      url: imageDatabase[imageIndex].url,
      size: imageDatabase[imageIndex].size,
      uploadedAt: imageDatabase[imageIndex].uploadedAt
    };

    return NextResponse.json({
      success: true,
      data: imageDatabase[imageIndex],
      message: 'Image updated successfully'
    }, { status: 200 });

  } catch (error) {
    console.error('Image update error:', error);
    return NextResponse.json({
      error: 'Internal server error',
      message: 'Failed to update image'
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
    const imageId = searchParams.get('id');

    if (!imageId) {
      return NextResponse.json({
        error: 'Missing image ID',
        message: 'Image ID is required for deletion'
      }, { status: 400 });
    }

    // Find and remove image
    const imageIndex = imageDatabase.findIndex(img => img.id === imageId);
    
    if (imageIndex === -1) {
      return NextResponse.json({
        error: 'Image not found',
        message: 'Image does not exist'
      }, { status: 404 });
    }

    const imageToDelete = imageDatabase[imageIndex];
    
    // Delete file from filesystem
    try {
      const filepath = join(UPLOAD_DIR, imageToDelete.filename);
      await fs.unlink(filepath);
    } catch (fileError) {
      console.warn('Could not delete file from filesystem:', fileError);
      // Continue with database deletion even if file deletion fails
    }

    // Remove from database
    imageDatabase.splice(imageIndex, 1);

    return NextResponse.json({
      success: true,
      message: 'Image deleted successfully'
    }, { status: 200 });

  } catch (error) {
    console.error('Image deletion error:', error);
    return NextResponse.json({
      error: 'Internal server error',
      message: 'Failed to delete image'
    }, { status: 500 });
  }
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