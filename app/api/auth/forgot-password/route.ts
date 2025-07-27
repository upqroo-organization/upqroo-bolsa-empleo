import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { createResetToken } from '@/lib/password-reset';
import { sendEmailDirect } from '@/lib/emailService';

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();

    // Validate email format
    if (!email || typeof email !== 'string') {
      return NextResponse.json(
        { success: false, message: 'Correo electrónico requerido' },
        { status: 400 }
      );
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { success: false, message: 'Formato de correo electrónico inválido' },
        { status: 400 }
      );
    }

    // Check if email exists in company database
    const company = await prisma.company.findUnique({
      where: { email: email.toLowerCase() }
    });

    // Always return success to prevent email enumeration
    // But only send email if company exists
    if (company) {
      try {
        // Generate reset token
        const token = await createResetToken(email.toLowerCase());
        
        // Create reset URL
        const resetUrl = `${process.env.NEXTAUTH_URL}/auth/reset-password?token=${token}`;
        
        // Send password reset email
        const emailResult = await sendEmailDirect({
          to: email,
          template: 'passwordReset',
          templateData: {
            userName: company.name,
            resetUrl: resetUrl
          }
        });

        if (!emailResult.success) {
          console.error('Failed to send password reset email:', emailResult.error);
          // Don't expose email sending errors to prevent information leakage
        }
      } catch (error) {
        console.error('Error in password reset process:', error);
        // Don't expose internal errors
      }
    }

    // Always return success message for security
    return NextResponse.json({
      success: true,
      message: 'Si el correo electrónico está registrado, recibirás un enlace para restablecer tu contraseña.'
    });

  } catch (error) {
    console.error('Forgot password API error:', error);
    return NextResponse.json(
      { success: false, message: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}