// Utility functions for upload security and access control

import { prisma } from '@/lib/prisma';

export interface AccessControlOptions {
  userId: string;
  userRole: string;
  fileOwnerId: string;
  fileType: 'cv' | 'photo' | 'fiscal-document' | 'job-image';
}

export async function checkFileAccess(options: AccessControlOptions): Promise<boolean> {
  const { userId, userRole, fileOwnerId, fileType } = options;

  // User can always access their own files
  if (userId === fileOwnerId) {
    return true;
  }

  // Coordinators can access any file
  if (userRole === 'coordinator') {
    return true;
  }

  // Role-specific access rules
  switch (fileType) {
    case 'cv':
      // Companies can access CVs of users who applied to their jobs
      if (userRole === 'company') {
        const hasApplication = await prisma.application.findFirst({
          where: {
            userId: fileOwnerId,
            vacante: {
              companyId: userId
            }
          }
        });
        return !!hasApplication;
      }
      break;

    case 'fiscal-document':
      // Only coordinators can access other companies' fiscal documents
      // Companies can only access their own (handled by userId === fileOwnerId check above)
      return userRole === 'coordinator';

    case 'photo':
      // Only coordinators and the user itself can access photos
      return userRole === 'coordinator';

    case 'job-image':
      // Job images are public - anyone can view them
      return true;
  }

  return false;
}

export function validateFilename(filename: string, expectedPrefix: string): boolean {
  // Security check: prevent directory traversal
  if (filename.includes('..') || filename.includes('/') || filename.includes('\\')) {
    return false;
  }

  // Check filename format
  const filenameParts = filename.split('_');
  if (filenameParts.length < 3 || filenameParts[0] !== expectedPrefix) {
    return false;
  }

  return true;
}

export function getContentType(filename: string): string {
  const extension = filename.split('.').pop()?.toLowerCase();

  switch (extension) {
    case 'pdf':
      return 'application/pdf';
    case 'png':
      return 'image/png';
    case 'webp':
      return 'image/webp';
    case 'jpg':
    case 'jpeg':
      return 'image/jpeg';
    case 'svg':
      return 'image/svg+xml';
    default:
      return 'application/octet-stream';
  }
}

export function getSecurityHeaders(fileType: 'cv' | 'photo' | 'fiscal-document' | 'job-image') {
  const baseHeaders = {
    'X-Content-Type-Options': 'nosniff',
    'X-Frame-Options': 'DENY',
    'X-XSS-Protection': '1; mode=block',
    'Referrer-Policy': 'strict-origin-when-cross-origin',
  };

  switch (fileType) {
    case 'cv':
    case 'fiscal-document':
      return {
        ...baseHeaders,
        'Cache-Control': 'private, no-cache, no-store, must-revalidate',
        'Content-Disposition': 'inline',
      };
    case 'photo':
      return {
        ...baseHeaders,
        'Cache-Control': 'private, max-age=3600',
      };
    case 'job-image':
      return {
        ...baseHeaders,
        'Cache-Control': 'public, max-age=86400', // 24 hours cache for job images
      };
    default:
      return baseHeaders;
  }
}