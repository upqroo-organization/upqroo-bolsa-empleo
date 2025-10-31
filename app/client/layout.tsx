'use client';
import Navbar from "@/components/Navbar";
import StableSessionProvider from "@/components/StableSessionProvider";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <StableSessionProvider>
      <main>
        <Navbar />
        {children}
      </main>
    </StableSessionProvider>
  );
}