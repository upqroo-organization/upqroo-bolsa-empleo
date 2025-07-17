'use client';
// pages/auth/redirect.tsx
import { useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function Page() {
  const { data: session, status } = useSession();
  const router = useRouter();

  console.log(session?.user.role)
  useEffect(() => {
    if (status === "loading") return;
    switch (session?.user.role) {
      case "admin":
        router.replace("/admin");
        break;
      case "student":
        router.replace("/client");
        break;
      case "company":
        router.replace("/empresa");
        break;
      case "coordinator":
        router.replace("/coordinador");
        break;
      default:
        router.replace("/");
        break;
    }
  }, [session, status, router]);

  return <p>Redirecting...</p>;
}
