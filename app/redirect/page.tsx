'use client';
// pages/auth/redirect.tsx
import { useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function Page() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "loading") return;

    const role = "admin"; // Default role, replace with actual logic to get user role from session or database

    if (role === "admin") {
      router.replace("/admin");
    } else if (role === "student") {
      router.replace("/student");
    } else {
      router.replace("/");
    }
  }, [session, status, router]);

  return <p>Redirecting...</p>;
}
