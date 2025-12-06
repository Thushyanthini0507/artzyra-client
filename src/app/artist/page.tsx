"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function ArtistPage() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to dashboard
    router.replace("/artist/dashboard");
  }, [router]);

  return null;
}
