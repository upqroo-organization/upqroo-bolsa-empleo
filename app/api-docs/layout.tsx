import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'API Documentation - UPQROO Bolsa de Trabajo',
  description: 'Complete API documentation for the UPQROO University Job Board Platform',
};

export default function ApiDocsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gray-50">
      {children}
    </div>
  );
}