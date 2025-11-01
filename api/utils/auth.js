/**
 * Admin Authentication Utilities
 * Token verification and permission checking
 */

import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'zoe-solar-admin-secret-2025';

export async function verifyAdminToken(request) {
  try {
    const authHeader = request.headers.get('authorization');
    
    if (!authHeader) {
      return { valid: false, error: 'No authorization header' };
    }

    const token = authHeader.replace('Bearer ', '');
    
    if (!token) {
      return { valid: false, error: 'No token provided' };
    }

    // Verify JWT token
    const decoded = jwt.verify(token, JWT_SECRET);
    
    // Check if user has admin role
    if (decoded.role !== 'admin') {
      return { valid: false, error: 'Insufficient permissions' };
    }

    return {
      valid: true,
      user: decoded,
      permissions: decoded.permissions || []
    };

  } catch (error) {
    console.error('Token verification error:', error);
    return { valid: false, error: 'Invalid or expired token' };
  }
}

export function requirePermissions(permissions) {
  return async (request) => {
    const authResult = await verifyAdminToken(request);
    
    if (!authResult.valid) {
      return {
        authorized: false,
        response: {
          error: 'Unauthorized',
          message: authResult.error
        }
      };
    }

    // Check if user has required permissions
    const userPermissions = authResult.permissions;
    const missingPermissions = permissions.filter(perm => !userPermissions.includes(perm));
    
    if (missingPermissions.length > 0) {
      return {
        authorized: false,
        response: {
          error: 'Forbidden',
          message: `Missing permissions: ${missingPermissions.join(', ')}`
        }
      };
    }

    return {
      authorized: true,
      user: authResult.user,
      permissions: userPermissions
    };
  };
}

// Middleware function for API routes
export function withAuth(handler, requiredPermissions = []) {
  return async (request) => {
    const authCheck = await requirePermissions(requiredPermissions)(request);
    
    if (!authCheck.authorized) {
      return new Response(JSON.stringify(authCheck.response), {
        status: authCheck.response.error === 'Unauthorized' ? 401 : 403,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        }
      });
    }

    return handler(request, authCheck);
  };
}