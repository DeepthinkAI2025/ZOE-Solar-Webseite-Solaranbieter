/**
 * Admin Authentication API
 * Verifies admin credentials and creates secure sessions
 */

import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

const ADMIN_CREDENTIALS = {
  username: 'admin',
  password: 'admin'
};

const JWT_SECRET = process.env.JWT_SECRET || 'zoe-solar-admin-secret-2025';

export async function POST(request: NextRequest) {
  try {
    const { username, password } = await request.json();

    // Input validation
    if (!username || !password) {
      return NextResponse.json({
        error: 'Missing credentials',
        message: 'Username and password are required'
      }, { status: 400 });
    }

    // Authenticate
    if (username === ADMIN_CREDENTIALS.username && password === ADMIN_CREDENTIALS.password) {
      // Create JWT token
      const token = jwt.sign(
        { 
          userId: 'admin-001', 
          username: 'admin', 
          role: 'admin',
          iat: Math.floor(Date.now() / 1000)
        },
        JWT_SECRET,
        { expiresIn: '24h' }
      );

      // Create session data
      const session = {
        userId: 'admin-001',
        username: 'admin',
        role: 'admin',
        loginTime: new Date().toISOString(),
        permissions: [
          'dashboard.read',
          'dashboard.write',
          'content.read',
          'content.write',
          'customers.read',
          'customers.write',
          'analytics.read',
          'images.read',
          'images.write'
        ]
      };

      return NextResponse.json({
        success: true,
        data: {
          session,
          token
        },
        message: 'Authentication successful'
      }, { status: 200 });

    } else {
      return NextResponse.json({
        error: 'Invalid credentials',
        message: 'Username or password is incorrect'
      }, { status: 401 });
    }

  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json({
      error: 'Authentication failed',
      message: 'An error occurred during login'
    }, { status: 500 });
  }
}

// OPTIONS handler for CORS
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization'
    }
  });
}