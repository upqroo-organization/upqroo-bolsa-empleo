import { prisma } from '@/lib/prisma';
import crypto from 'crypto';

export interface PasswordResetToken {
  id: string;
  token: string;
  email: string;
  expiresAt: Date;
  used: boolean;
  createdAt: Date;
}

/**
 * Generate a cryptographically secure random token
 */
export function generateResetToken(): string {
  return crypto.randomBytes(32).toString('hex');
}

/**
 * Create a new password reset token for an email
 * Invalidates any existing tokens for the same email
 */
export async function createResetToken(email: string): Promise<string> {
  const token = generateResetToken();
  const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1 hour from now

  // Invalidate any existing tokens for this email
  await prisma.passwordResetToken.updateMany({
    where: {
      email,
      used: false,
      expiresAt: {
        gt: new Date()
      }
    },
    data: {
      used: true
    }
  });

  // Create new token
  await prisma.passwordResetToken.create({
    data: {
      token,
      email,
      expiresAt,
      used: false
    }
  });

  return token;
}

/**
 * Validate a password reset token
 */
export async function validateResetToken(token: string): Promise<{
  valid: boolean;
  expired?: boolean;
  used?: boolean;
  email?: string;
  message: string;
}> {
  try {
    const resetToken = await prisma.passwordResetToken.findUnique({
      where: { token }
    });

    if (!resetToken) {
      return {
        valid: false,
        message: 'Token no válido'
      };
    }

    if (resetToken.used) {
      return {
        valid: false,
        used: true,
        message: 'Este enlace ya ha sido utilizado'
      };
    }

    if (resetToken.expiresAt < new Date()) {
      return {
        valid: false,
        expired: true,
        message: 'El enlace de recuperación ha expirado'
      };
    }

    return {
      valid: true,
      email: resetToken.email,
      message: 'Token válido'
    };
  } catch (error) {
    console.error('Error validating reset token:', error);
    return {
      valid: false,
      message: 'Error al validar el token'
    };
  }
}

/**
 * Mark a reset token as used
 */
export async function markTokenAsUsed(token: string): Promise<boolean> {
  try {
    await prisma.passwordResetToken.update({
      where: { token },
      data: { used: true }
    });
    return true;
  } catch (error) {
    console.error('Error marking token as used:', error);
    return false;
  }
}

/**
 * Clean up expired tokens (can be run as a background job)
 */
export async function cleanupExpiredTokens(): Promise<number> {
  try {
    const result = await prisma.passwordResetToken.deleteMany({
      where: {
        OR: [
          { expiresAt: { lt: new Date() } },
          { used: true }
        ]
      }
    });
    return result.count;
  } catch (error) {
    console.error('Error cleaning up expired tokens:', error);
    return 0;
  }
}