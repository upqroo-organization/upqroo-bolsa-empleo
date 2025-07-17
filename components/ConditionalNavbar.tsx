'use client';

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { usePathname } from "next/navigation";
import Navbar from "./Navbar";

export default function ConditionalNavbar() {
  const { data: session, status } = useSession();
  const pathname = usePathname();
  const [showNavbar, setShowNavbar] = useState(true);

  useEffect(() => {
    const checkCompanyApproval = async () => {
      // Always hide navbar on waiting-approval page
      if (pathname?.includes('/waiting-approval')) {
        setShowNavbar(false);
        return;
      }

      if (status === 'authenticated' && session?.user?.role === 'company') {
        try {
          const response = await fetch('/api/company/me');
          const data = await response.json();
          
          if (data.success) {
            // Hide navbar if company is not approved
            setShowNavbar(data.data.isApprove);
          }
        } catch (error) {
          console.error('Error checking company approval:', error);
          // Default to showing navbar on error
          setShowNavbar(true);
        }
      } else {
        // Show navbar for non-company users
        setShowNavbar(true);
      }
    };

    checkCompanyApproval();
  }, [status, session, pathname]);

  return showNavbar ? <Navbar /> : null;
}
