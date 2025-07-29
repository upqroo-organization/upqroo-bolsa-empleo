// Additional middleware for upload security
// This can be imported and used in your main middleware.ts

import { NextRequest, NextResponse } from 'next/server';

export function uploadSecurityHeaders(response: NextResponse) {
  // Add security headers for file uploads
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('X-XSS-Protection', '1; mode=block');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  
  return response;
}

export function validateFileAccess(request: NextRequest, allowedExtensions: string[]) {
  const url = new URL(request.url);
  const pathname = url.pathname;
  
  // Extract filename from path
  const filename = pathname.split('/').pop() || '';
  const extension = filename.split('.').pop()?.toLowerCase() || '';
  
  // Check if extension is allowed
  if (!allowedExtensions.includes(extension)) {
    return false;
  }
  
  // Additional security checks
  if (filename.includes('..') || filename.includes('/') || filename.includes('\\')) {
    return false;
  }
  
  return true;
}