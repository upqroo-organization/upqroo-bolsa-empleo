import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    // Check if user is authenticated and has @upqroo.edu.mx email
    const hasAccess = session?.user?.email?.endsWith('@upqroo.edu.mx') || false;

    return NextResponse.json({
      isDevelopment: hasAccess,
      hasAccess
    });
  } catch (error) {
    console.error('Error checking docs access:', error);
    return NextResponse.json({
      isDevelopment: false,
      hasAccess: false
    });
  }
}