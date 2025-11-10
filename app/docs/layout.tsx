import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Documentation - UPQROO Bolsa de Trabajo',
  description: 'Project documentation for the UPQROO job board platform',
};

export default function DocsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-background">
      {children}
    </div>
  );
}