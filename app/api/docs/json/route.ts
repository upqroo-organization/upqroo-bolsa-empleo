import { swaggerSpec } from '@/lib/swagger';

export async function GET() {
  if (process.env.NODE_ENV === 'production') {
    return new Response('Not Found', { status: 404 });
  }

  return new Response(JSON.stringify(swaggerSpec), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
}
