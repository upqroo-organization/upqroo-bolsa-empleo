import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { validateResetToken, markTokenAsUsed } from '@/lib/password-reset';
import bcrypt from 'bcryptjs';

// GET - Validate reset token
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const token = searchParams.get('token');

    if (!token) {
      return NextResponse.json(
        { valid: false, message: 'Token requerido' },
        { status: 400 }
      );
    }

    const validation = await validateResetToken(token);
    
    return NextResponse.json(validation);

  } catch (error) {
    console.error('Reset password validation error:', error);
    return NextResponse.json(
      { valid: false, message: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}

// POST - Reset password
export async function POST(request: NextRequest) {
  try {
    const { token, password } = await request.json();

    // Validate input
    if (!token || !password) {
      return NextResponse.json(
        { success: false, message: 'Token y contraseña requeridos' },
        { status: 400 }
      );
    }

    // Validate password strength
    if (password.length < 8) {
      return NextResponse.json(
        { success: false, message: 'La contraseña debe tener al menos 8 caracteres' },
        { status: 400 }
      );
    }

    // Validate token
    const validation = await validateResetToken(token);
    
    if (!validation.valid) {
      let statusCode = 400;
      if (validation.expired) statusCode = 410; // Gone
      if (validation.used) statusCode = 409; // Conflict
      
      return NextResponse.json(
        { success: false, message: validation.message },
        { status: statusCode }
      );
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Update company password
    await prisma.company.update({
      where: { email: validation.email },
      data: { password: hashedPassword }
    });

    // Mark token as used
    await markTokenAsUsed(token);

    return NextResponse.json({
      success: true,
      message: 'Contraseña actualizada exitosamente'
    });

  } catch (error) {
    console.error('Reset password error:', error);
    return NextResponse.json(
      { success: false, message: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}